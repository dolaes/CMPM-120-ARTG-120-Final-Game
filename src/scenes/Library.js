class Library extends Phaser.Scene {
    constructor() {
        super("libraryScene");
    }

    preload() {
        this.load.path = "./assets/tilemaps/";
        this.load.image("librarySheet", "librarySheet_extruded.png");
        this.load.tilemapTiledJSON("library_map", "libraryLevel.json ");
    }

    create() {
        this.ROOMWIDTH = 576;
        this.ROOMHEIGHT = 800;
        garyX = 56;
        garyY = this.ROOMHEIGHT - 48;

        phantomSpeed = 48;
        this.sound.stopByKey('whispers');
        let tutorialScene = this.scene.get('tutorialScene');
        //create the tilemap
        const map = this.add.tilemap('library_map');

        //add the tileset to the map
        const tileset = map.addTilesetImage('librarySheet');
        tutorialScene.setup(this, map, tileset, this.ROOMWIDTH, this.ROOMHEIGHT, garyX, garyY);

        this.physics.world.enable(this.page, Phaser.Physics.Arcade.STATIC_BODY);
        //handles when switching to this scene
        this.events.on("wake", () => {
            cursors = this.input.keyboard.createCursorKeys();
            this.scene.restart();
        });
        //check for page collision
        this.physics.add.overlap(this.gary, this.page, (obj1, obj2) => {
            obj2.destroy();
            this.sound.play('collect', { volume: 0.5 });
            this.largeEnemySound.play();
            this.largeEnemySound.setLoop(true);
            page3 = 1;
            this.cameras.main.shake(100, 0.005);
            this.physics.world.disable(this.doors);
            this.particles.emitters.list.forEach((emitter) => {
               emitter.stop();
            });
            this.garyParticle.start();
        });
        //checking for phantom collision
        this.physics.add.overlap(this.gary, this.phantoms, () => {
            page3 = 0;
            clearInterval(this.creaksInter);
            this.whispers.stop();
            this.largeEnemySound.stop();
            this.sound.play('hurt', { volume: 0.15 });
            this.garyDeath.explode(20, this.gary.x, this.gary.y);
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.physics.world.disable(this.gary);
            this.gary.setVisible(false);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.switch("hubScene");
                this.scene.stop('libraryScene');
                this.scene.stop('HUD');
            });
            deaths++;
        });

        //handles changing scenes when on the far right of screen
        this.physics.world.on(
            "worldbounds",
            (body, blockedUp, blockedDown, blockedLeft, blockedRight) => {
                if (blockedLeft) {
                    clearInterval(this.creaksInter);
                    this.whispers.stop();
                    this.largeEnemySound.stop();
                    this.sound.play('door', { volume: 0.10 });
                    this.scene.switch("hubScene");
                    this.scene.stop('HUD');
                    this.gary.x += 20;
                }
            }
        );
    }

    update() {
        this.gary.update();
        if (page3 == 1) {
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