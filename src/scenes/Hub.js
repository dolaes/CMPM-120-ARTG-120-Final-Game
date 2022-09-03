class Hub extends Phaser.Scene {
   constructor() {
      super("hubScene");
   }

   preload() {
      this.load.path = "./assets/tilemaps/";
      this.load.tilemapTiledJSON("hub_map", "hubLevel.json");
      this.load.image("hubSheet", "hub_spritesheet_extruded.png");


   }

   create() {
      //define the variables
      this.ROOMWIDTH = 320;
      this.ROOMHEIGHT = 352;
      this.movement = true;
      
      //create the tilemap
      const map = this.add.tilemap("hub_map");

      //add the tileset to the map
      const tileset = map.addTilesetImage("hub_spritesheet", "hubSheet");

      //create the layers for the map
      const backgroundLayer = map.createLayer("Background", tileset, 0, 0);
      const collisionLayer = map.createLayer("Collision", tileset, 0, 0);

      //set the collision property
      collisionLayer.setCollisionByProperty({
         collides: true
      });

      this.labDoor = map.createFromObjects("Objects", {
         name: 'labDoor',
         key: 'door'
      });
      this.physics.world.enable(this.labDoor, Phaser.Physics.Arcade.STATIC_BODY);
      // this.labDoors = this.physics.add.staticGroup(this.labDoor);
      this.computerDoor = map.createFromObjects("Objects", {
         name: 'computerDoor',
         key: 'door'
      });
      this.physics.world.enable(this.computerDoor, Phaser.Physics.Arcade.STATIC_BODY);
      this.libraryDoor = map.createFromObjects("Objects", {
         name: 'libraryDoor',
         key: 'door'
      });
      this.physics.world.enable(this.libraryDoor, Phaser.Physics.Arcade.STATIC_BODY);
      let doors = [this.labDoor, this.computerDoor, this.libraryDoor];
      //create the altar
      this.altar = this.physics.add.image(160, 192, 'altar');
      this.book = this.add.image(this.altar.x, this.altar.y, 'book');
      this.page0 = this.add.sprite(160, 232, 'page').setScale(.5).setVisible(false); //bottom
      this.page1 = this.add.sprite(120, 192, 'page').setScale(.5).setVisible(false); //left
      this.page2 = this.add.sprite(160, 152, 'page').setScale(.5).setVisible(false); //top
      this.page3 = this.add.sprite(200, 192, 'page').setScale(.5).setVisible(false); //right


      this.doorParticles = this.add.particles('door_particle');
      //create each of the doors and give them particles
      doors.forEach((child) => {
         child.forEach((door) => {
            let deathZone = new Phaser.Geom.Rectangle(door.x - 16, door.y - 16, 32, 32);
            this.doorParticles.createEmitter({
               x: door.x,
               y: door.y,
               speed: { min: 10, max: 500, steps: 5000 },
               scale: 0.25,
               lifespan: 5000,
               quantity: 15,
               deathZone: { type: 'onLeave', source: deathZone }
            });
         });
      });

      //place the door emitters into arrays to group them
      this.labDoorEmitters = [this.doorParticles.emitters.list[0], this.doorParticles.emitters.list[1]];
      this.computerDoorEmitters = [this.doorParticles.emitters.list[2], this.doorParticles.emitters.list[3]];
      this.libraryDoorEmitters = [this.doorParticles.emitters.list[4], this.doorParticles.emitters.list[5]];

      //create the player avatar
      this.gary = new Gary(this, this.ROOMWIDTH - 48, this.ROOMHEIGHT - 48, "gary_atlas", 'Gary_Idle_0');
      //create the tutorial sprites
      this.virgil = this.add.sprite(110, 120, 'virgil').setScale(0.75);
      this.dbox = this.add.image(this.virgil.x + 10, this.virgil.y - 10, 'dialogbox').setScale(0.115).setOrigin(0, 0);
      this.instructions = this.add.bitmapText(this.dbox.x + 3, this.dbox.y + 2, 'gem_font', 'Return the page to the Necronomicon', 8);
      this.instructions.maxWidth = 75;

      //create particle effects for gary
      this.garyParticles = this.add.particles('gary_page');
      this.garyParticle = this.garyParticles.createEmitter({
         follow: this.gary,
         speed: 100,
         lifespan: 300,
         gravity: { x: 0, y: 200 },
         scale: { start: 0.1, end: 1 }
      });

      //create particles used in an explosion at the end of game
      let deathZone = new Phaser.Geom.Rectangle(112, 144, 96, 96);
      this.bookParticle = this.garyParticles.createEmitter({
         x: 160,
         y: 192,
         speed: {min: 10, max: 100, steps: 1000},
         lifespan: 3000,
         quantity: 20,
         frequency: -1,
         deathZone: { type: 'onLeave', source: deathZone}
      });
      //assign keys for movement
      cursors = this.input.keyboard.createCursorKeys();

      //sounds
      this.creaks = this.sound.add('creaks', { volume: 0.5 });
      this.creaksInter = setInterval(() => {
         this.creaks.play();
      }, 10000);

      this.backgroundMusic = this.sound.add('mainMenu', {volume: 0.1});
      this.backgroundMusic.setLoop(true);
      this.backgroundMusic.play();
      //set up the camera  
      this.cameras.main.setBounds(0, 0, this.ROOMWIDTH, this.ROOMHEIGHT);
      this.cameras.main.setZoom(2.3);
      this.cameras.main.startFollow(this.gary);
      this.cameras.main.fadeIn(1000, 0, 0, 0);

      //set the world collision
      this.gary.body.setCollideWorldBounds(true);
      this.gary.body.onWorldBounds = true;
      this.physics.world.setBounds(0, 0, this.ROOMWIDTH, this.ROOMHEIGHT);

      //set the world collision
      this.physics.world.on('worldbounds', (body, blockedUp, blockedDown, blockedLeft, blockedRight) => {
         if (blockedLeft) {
            clearInterval(this.creaksInter);
            this.sound.play('door', { volume: 0.5 });
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.gary.setVisible(false);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
               this.scene.switch("labScene");
            });
            this.backgroundMusic.stop();
            this.movement = false;
            this.gary.x += 50;
         }
         if (blockedUp) {
            clearInterval(this.creaksInter);
            this.sound.play('door', { volume: 0.5 });
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.gary.setVisible(false);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
               this.scene.switch("computerLabScene");
            });
            this.backgroundMusic.stop();
            this.movement = false;
            this.gary.y += 75;
         }
         if (blockedRight) {
            clearInterval(this.creaksInter);
            this.sound.play('door', { volume: 0.5 });
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.gary.setVisible(false);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
               this.scene.switch("libraryScene");
            });
            this.backgroundMusic.stop();
            this.movement = false;
            this.gary.x -= 50;
         }
      });

      //when the player returns to the scene recreate the cursor keys
      this.events.on('wake', () => {
         cursors = this.input.keyboard.createCursorKeys();
         this.sound.stopByKey('whispers');
         this.cameras.main.fadeIn(1000, 0, 0, 0);
         this.gary.setVisible(true);
         this.backgroundMusic.play();
         this.movement = true;
      });

      //add in physics colliders
      this.physics.add.collider(this.gary, collisionLayer);
      this.physics.add.collider(this.gary, this.labDoor);
      this.physics.add.collider(this.gary, this.computerDoor);
      this.physics.add.collider(this.gary, this.libraryDoor);
      this.physics.add.overlap(this.gary, this.altar, () => {
         if (page0 == 1) {
            page0 = 2;
            this.sound.play('collect');
            this.cameras.main.shake(100, 0.005);
            this.physics.world.disable(this.labDoor);
            this.labDoorEmitters.forEach((emitter) => {
               emitter.stop();
            });
            this.page0.setVisible(true);
            this.page0.anims.play('page_ani');
            this.virgil.destroy();
            this.dbox.destroy();
            this.instructions.destroy();
         }
         if (page1 == 1) {
            page1 = 2;
            this.sound.play('collect');
            this.cameras.main.shake(100, 0.005);
            this.physics.world.disable(this.computerDoor);
            this.computerDoorEmitters.forEach((emitter) => {
               emitter.stop();
            });
            this.page1.setVisible(true);
            this.page1.anims.play('page_ani');
         }
         if (page2 == 1) {
            page2 = 2;
            this.sound.play('collect');
            this.cameras.main.shake(100, 0.005);

            this.physics.world.disable(this.libraryDoor);

            this.libraryDoorEmitters.forEach((emitter) => {
               emitter.stop();
            });
            this.page2.setVisible(true);
            this.page2.anims.play('page_ani');
         }
         if (page3 == 1) {
            page3 = 2;
            this.sound.play('collect');
            this.cameras.main.shake(100, 0.005);
            this.page3.setVisible(true);
            this.page3.anims.play('page_ani');
            this.cameras.main.fadeOut(3000, 255, 244, 209);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
               this.scene.start("gameClearScene");
               this.backgroundMusic.stop();
            });
            this.bookParticle.explode(1000);
         }
         this.garyParticle.stop();
      });

   }

   update() {
      //check for when to lock the doors
      if(page1 == 1) {
         this.labDoorEmitters.forEach((emitter) => {
            emitter.start();
         });
         this.physics.world.enable(this.labDoor);
      }
      if(page2 == 1) {
         this.computerDoorEmitters.forEach((emitter) => {
            emitter.start();
         });
         this.physics.world.enable(this.computerDoor);
      }
      if(page3 == 1) {
         this.physics.world.enable(this.libraryDoor);
         this.libraryDoorEmitters.forEach((emitter) => {
            emitter.start();
         });
      }
      if(this.movement) {
         this.gary.update();
      }
   }
}
