class Lab extends Phaser.Scene {
    constructor() {
        super("labScene");
    }
    preload() {
        this.load.path = "./assets/tilemaps/";
        this.load.image("labSheet", "labSheet_extruded.png");
        this.load.tilemapTiledJSON("lab_map", "labLevel.json");


    }
    create() {
        //create variables
        this.ROOMWIDTH = 576;
        this.ROOMHEIGHT = 576;
        garyX = this.ROOMWIDTH - 48;
        garyY = this.ROOMHEIGHT / 2;
        phantomSpeed = 36;

        this.sound.stopByKey('whispers');
        let tutorialScene = this.scene.get('tutorialScene');
        //create the tilemap
        const map = this.add.tilemap('lab_map');

        //add the tileset to the map
        const tileset = map.addTilesetImage('labSheet');
        tutorialScene.setup(this, map, tileset, this.ROOMWIDTH, this.ROOMHEIGHT, garyX, garyY);

        //handle re-entering the room
        this.events.on("wake", () => {
            cursors = this.input.keyboard.createCursorKeys();
            this.scene.restart();
        });

        //checking for page collection
        this.physics.add.overlap(this.gary, this.page, (obj1, obj2) => {
            obj2.destroy();
            this.sound.play('collect', { volume: 0.5 });
            this.largeEnemySound.play();
            this.largeEnemySound.setLoop(true);
            page1 = 1;
            this.cameras.main.shake(100, 0.005);
            this.garyParticle.start();
            this.physics.world.disable(this.doors);
            this.particles.emitters.list.forEach((emitter) => {
               emitter.stop();
            });
        });
        //checking for phantom collision
        this.physics.add.overlap(this.gary, this.phantoms, () => {
            page1 = 0;
            clearInterval(this.creaksInter);
            this.sound.stopByKey('whispers');
            this.largeEnemySound.stop();
            this.sound.play('hurt', { volume: 0.15 });
            deaths++;
            this.garyDeath.explode(20, this.gary.x, this.gary.y);
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.physics.world.disable(this.gary);
            this.gary.setVisible(false);
            this.scene.stop('HUD');
            clearTimeout(this.sprintTimeout);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.switch("hubScene");
                this.scene.stop('labScene');
            });
        });

        //handles changing scenes when on the far right of screen
        this.physics.world.on(
            "worldbounds",
            (body, blockedUp, blockedDown, blockedLeft, blockedRight) => {
                if (blockedRight) {
                    clearInterval(this.creaksInter);
                    this.sound.stopByKey('whispers');
                    this.largeEnemySound.stop();
                    this.sound.play('door', { volume: 0.10 });
                    this.scene.switch("hubScene");
                    this.scene.stop('HUD');
                    this.gary.x -= 20;
                }
            }
        );
    }

    update() {
        this.gary.update();
        if (page1 == 1) {
            this.physics.moveToObject(this.bigPhantom, this.gary, phantomSpeed);
            //play the correct animation for the phantom
            if (this.bigPhantom.body.velocity.x < 0) {
                this.bigPhantom.anims.play('big_phantom_ani_left')
            } else {
                this.bigPhantom.anims.play('big_phantom_ani_right');
            }
        }
        this.phantoms.getChildren().forEach((phantom) => {
            phantom.update();
        });
        this.fog.x = this.gary.x;
        this.fog.y = this.gary.y;
    }
}
