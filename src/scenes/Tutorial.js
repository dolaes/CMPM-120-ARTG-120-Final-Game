class Tutorial extends Phaser.Scene {
   constructor() {
      super("tutorialScene");
   }

   preload() {
      this.load.path = "./assets/";

      this.load.tilemapTiledJSON("tutorial_map", "./tilemaps/tutorialLevel.json");
      this.load.image("hubSheet", "./tilemaps/hub_spritesheet_extruded.png");


   }

   create() {
      //define variables
      this.ROOMWIDTH = 448;
      this.ROOMHEIGHT = 320;
      garyX = 288;
      garyY = 96;
      //speed in pixel/sec
      phantomSpeed = 32;

      //create the tilemap
      const map = this.add.tilemap('tutorial_map');

      //add the tileset to the map
      const tileset = map.addTilesetImage('hub_spritesheet', 'hubSheet');
      this.setup(this, map, tileset, this.ROOMWIDTH, this.ROOMHEIGHT, garyX, garyY);

      
      //create the sprite and dialog for instructions
      this.virgil = this.add.sprite(this.gary.x - 35, this.gary.y - 30, 'virgil').setScale(0.75);
      this.dbox = this.add.image(this.virgil.x + 10, this.virgil.y - 10, 'dialogbox').setScale(0.11).setOrigin(0, 0);
      this.instructions = this.add.bitmapText(this.dbox.x + 2, this.dbox.y + 2, 'gem_font', 'Press [SPACE] to shine', 8);
      this.instructions.maxWidth = 75;
      this.virgil2 = this.add.sprite(this.page.x - 35, this.page.y - 30, 'virgil').setScale(0.75);
      this.virgil2.setVisible(false);
      this.dbox2 = this.add.image(this.virgil2.x + 10, this.virgil.y - 10, 'dialogbox').setScale(0.11).setOrigin(0, 0);
      this.dbox2.setVisible(false);
      this.instructions2 = this.add.bitmapText(this.dbox2.x + 2, this.dbox2.y + 2, 'gem_font', 'RUN with [SHIFT]', 8);
      this.instructions2.setVisible(false);
      this.instructions2.maxWidth = 75;

      //add the overlap between the page and player
      this.physics.add.overlap(this.gary, this.page, (obj1, obj2) => {
         obj2.destroy();
         this.sound.play('collect', { volume: 0.5 });
         this.largeEnemySound.play();
         this.largeEnemySound.setLoop(true);
         this.cameras.main.shake(100, 0.005);
         page0 = 1;
         this.physics.world.disable(this.doors);
         this.particles.emitters.list.forEach((emitter) => {
            emitter.stop();
         });
         this.phantoms.getChildren().forEach((phantom) => {
            phantom.destroy();
            this.whispers.stop();
         });
         this.garyParticle.start();
         this.virgil2.setVisible(true);
         this.dbox2.setVisible(true);
         this.instructions2.setVisible(true);
      });

      //checking for phantom collision
      this.physics.add.overlap(this.gary, this.phantoms, () => {
         page0 = 0;
         clearInterval(this.creaksInter);
         this.whispers.stop();
         this.largeEnemySound.stop();
         this.sound.play('hurt', { volume: 0.15 });
         deaths++;
         this.garyDeath.explode(20, this.gary.x, this.gary.y);
         this.cameras.main.fadeOut(1000, 0, 0, 0);
         this.physics.world.disable(this.gary);
         this.gary.setVisible(false);
         this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.restart();
         });
         tutorialLock = true;
      });

      //add worldbound collision to change scenes
      this.physics.world.on('worldbounds', (body, blockedUp, blockedDown, blockedLeft, blockedRight) => {
         if (blockedLeft) {
            clearInterval(this.creaksInter);
            this.whispers.stop();
            this.largeEnemySound.stop();
            this.sound.play('door', { volume: 0.10 });
            this.scene.switch("hubScene");
         }
      });

      //creating the dialog for the tutorial
      this.dialog = this.cache.json.get('dialog');
      cursors.space.on('down', () => {
         this.instructions.text = 'Use the arrow keys to move around.'
         tutorialLock = false;
      });

      cursors.left.on('down', () => {
         if (!tutorialLock) {
            this.virgil.setVisible(false);
            this.dbox.setVisible(false);
            this.instructions.setVisible(false);
         }
      });

   }
   //a function used to setup all the levels
   setup(scene, map, tileset, width, height, garyX, garyY) {
      //create the layers for the map
      const backgroundLayer = map.createLayer("Background", tileset, 0, 0);
      const collisionLayer = map.createLayer("Collision", tileset, 0, 0);

      //set the collision property
      collisionLayer.setCollisionByProperty({
         collides: true
      });

      //add the cursor keys
      cursors = scene.input.keyboard.createCursorKeys();

      //add in gary
      scene.gary = new Gary(scene, garyX, garyY, 'gary_atlas', 'Gary_Idle_0');

      //add fog at gary's position
      scene.fog = scene.add.sprite(scene.gary.x, scene.gary.y, "fog", 0).setDepth(1);

      //set up the camera
      scene.cameras.main.setBounds(0, 0, width, height);
      scene.cameras.main.setZoom(2);
      scene.cameras.main.startFollow(scene.gary);
      scene.cameras.main.fadeIn(1000, 0, 0, 0);

      //set the world collision
      scene.gary.body.setCollideWorldBounds(true);
      scene.gary.body.onWorldBounds = true;
      scene.physics.world.setBounds(0, 0, width, height);

      //set collision with collision layer
      scene.physics.add.collider(scene.gary, collisionLayer);

      //create the phantoms
      let phantomObjects = map.filterObjects("Objects", obj => obj.name === "phantom");
      let phantomPaths = [];
      let phantomTimes = [];
      //iterate through each of the phantom objects
      phantomObjects.forEach((phantom) => {
         let prevPoint = phantom;
         let distance = 0;
         //create a path starting at phantom location
         let path = scene.add.path(phantom.x, phantom.y);
         //iterate through the phantoms properties and get the path points
         phantom.properties.forEach((location) => {
            //add the line to the path
            let point = map.findObject("Objects", obj => obj.id === location.value);
            if (point.x == prevPoint.x) {
               distance += Math.abs(point.y - prevPoint.y);
            } else {
               distance += Math.abs(point.x - prevPoint.x);
            }
            prevPoint = point;
            path.lineTo(point.x, point.y);
         });
         phantomTimes.push(distance / phantomSpeed);
         phantomPaths.push(path); //add the path to the list of paths
      });
      scene.phantoms = scene.physics.add.group();
      let i = 0;
      //iterate throught the phantom objects to create the phantoms
      phantomObjects.map((object) => {
         //create a new phantom class and give it the appropriate path
         enemyConfig.duration = phantomTimes[i] * 1000;
         let phantom = new Phantom(scene, phantomPaths[i++], object.x, object.y, 'enemy_left');
         scene.phantoms.add(phantom);
         phantom.anims.play('phantom_ani');
         phantom.startFollow(enemyConfig);
      });

      //create the big phantom
      let bigPhantomSpawn = map.findObject("Objects", obj => obj.name === 'bigPhantom');
      scene.bigPhantom = scene.physics.add.sprite(bigPhantomSpawn.x, bigPhantomSpawn.y, 'bigEnemy_atlas', 'Big_Enemy_Left_0');
      scene.phantoms.add(scene.bigPhantom);

      //create the page to collect
      scene.pageLocation = map.findObject("Objects", obj => obj.name == 'page');
      scene.page = scene.physics.add.sprite(scene.pageLocation.x, scene.pageLocation.y, 'page', 0);
      scene.page.anims.play('page_ani');
      //create the doors
      scene.doors = map.createFromObjects("Objects", {
         name: 'door',
         key: 'door'
      });
      scene.physics.world.enable(scene.doors, Phaser.Physics.Arcade.STATIC_BODY);
      scene.physics.add.collider(scene.gary, scene.doors);

      scene.particles = scene.add.particles('door_particle');
      //add in a particle effect for the doors
      scene.doors.forEach((door) => {
         let deathZone = new Phaser.Geom.Rectangle(door.x - 16, door.y - 16, 32, 32);
         scene.particles.createEmitter({
            x: door.x,
            y: door.y,
            speed: { min: 10, max: 500, steps: 5000 },
            scale: 0.25,
            lifespan: 4000,
            quantity: 10,
            deathZone: { type: 'onLeave', source: deathZone }
         });
      });
      //create a particle effect for when gary collects the page
      scene.garyPage = scene.add.particles('gary_page')
      scene.garyParticle = scene.garyPage.createEmitter({
         follow: scene.gary,
         speed: 100,
         lifespan: 300,
         gravity: { x: 0, y: 200 },
         scale: { start: 0.1, end: 1 }
      });
      //create particle effect for when gary dies
      scene.deathParticles = scene.add.particles('gary_death');
      scene.garyDeath = scene.deathParticles.createEmitter({
         speed: {min: -100, max: 100},
         lifespan: {min: 10, max: 500, steps: 100},
         frequency: -1
      });
      scene.garyParticle.stop();
      //handling for player input and interacts with hud
      let hud = scene.scene.get('HUD');
      //input for shine
      cursors.space.on("down", () => {
         if (scene.gary.energy == true) {
            this.sound.play('shine', { volume: 0.2 })
            scene.gary.energy = false;
            hud.shineMeter.anims.play('shine_ani');
            scene.fog.anims.play('fog_ani');
            setTimeout(() => {
               scene.fog.anims.playReverse('fog_ani');
               setTimeout(() => {
                  scene.gary.energy = true;
               }, 5000);
            }, 4000)
         }
      });

      //input for sprint
      cursors.shift.on('down', () => {
         if (scene.gary.sprint == false && scene.gary.sprintCooldown == false) {
            scene.gary.sprint = true;
            hud.sprintMeter.anims.play('sprint_ani_forward');
            scene.sprintTimeout = setTimeout(() => {
               scene.gary.sprint = false;
               scene.gary.sprintCooldown = true;
               hud.sprintMeter.anims.play("sprint_ani_reverse");
               setTimeout(() => {
                  scene.gary.sprintCooldown = false;
               }, 5000);
            }, 2000);
         }
      });

      // Add Creaks
      scene.creaks = scene.sound.add('creaks', { volume: 0.5 });
      scene.creaksInter = setInterval(() => {
         scene.creaks.play();
      }, 10000);

      // Add Whispers
      scene.whispers = scene.sound.add('whispers', { volume: 0.05 });
      scene.whispers.setLoop(true);
      scene.whispers.play();

      //add large enemy music
      scene.largeEnemySound = scene.sound.add('largeEnemyNoise', { volume: 0.25 });

      //launch the hud
      scene.scene.launch("HUD");
      scene.scene.bringToTop("HUD");
   }

   update() {
      if (!tutorialLock) {
         this.gary.update();
      }
      //check if page has been collected
      if (page0 == 1) {
         //have the large phantom follow gary
         this.physics.moveToObject(this.bigPhantom, this.gary, phantomSpeed);
         //play the correct animation for the phantom
         if (this.bigPhantom.body.velocity.x < 0) {
            this.bigPhantom.anims.play('big_phantom_ani_left')
         } else {
            this.bigPhantom.anims.play('big_phantom_ani_right');
         }
      }
      //make sure the fog is always centered on gary
      this.fog.x = this.gary.x;
      this.fog.y = this.gary.y;
      this.phantoms.getChildren().forEach((phantom) => {
         phantom.update();
      })
   }
}