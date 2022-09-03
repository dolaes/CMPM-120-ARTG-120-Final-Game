class GameClear extends Phaser.Scene {
    constructor() {
        super("gameClearScene");
    }

    preload() {
        this.load.path = "./assets/"
        this.load.spritesheet('endScreen', 'end_screen_animation.png', {
            frameWidth: 700,
            frameHeight: 700,
            startFrame: 0,
            endFrame: 5
        });

    }
    create() {
        this.scene.stop('tutorialScene');
        this.scene.stop('cutscene');
        this.scene.stop("hubScene");
        this.scene.stop("labScene");
        this.scene.stop("computerLabScene");
        this.scene.stop("libraryScene");
        this.anims.create({
            key: 'end',
            frames: this.anims.generateFrameNumbers('endScreen', {
                start: 0, 
                end: 5,
                first: 0
            }),
            frameRate: 3,
            repeat: -1
        })
        this.backgroundSprite = this.add.sprite(0, 0, 'endscreen', 0).setOrigin(0);
        this.backgroundSprite.anims.play('end');
        this.background = this.sound.add('music', { volume: 0.5 });
        this.background.setLoop(true);
        this.background.play();
        this.add.bitmapText(game.config.width - 300, game.config.height/2, 'gem_font', 'Deaths: ' + deaths, 50);
        this.restartText = this.add.bitmapText(50, game.config.height - 100, 'gem_font', 'Press [SPACE] to return to Menu', 30);
        this.credits = this.add.bitmapText(350, game.config.height - 100, 'gem_font', 'Press [SHIFT] to go to Credits', 30);
        this.restartText.maxWidth = 300;
        this.credits.maxWidth = 300;
        this.input.keyboard.on('keydown-SPACE', () => {
            this.background.stop();
            this.scene.stop("gameClearScene");
            this.scene.start("menuScene");
            page0 = 0;
            page1 = 0;
            page2 = 0;
            page3 = 0;
            deaths = 0;
            tutorialLock = true;
        });
        this.input.keyboard.on('keydown-SHIFT', () => {
            this.background.stop();
            this.scene.stop('gameClearScene');
            this.scene.start('credits');
        })
    }
}