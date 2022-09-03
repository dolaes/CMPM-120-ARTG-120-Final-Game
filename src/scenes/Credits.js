class Credits extends Phaser.Scene {
    constructor() {
        super("credits");
    }

    preload() {
        this.load.image('credits', './assets/credits.png');
    }

    create() {
        this.add.image(0, 0, 'credits').setOrigin(0);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('gameClearScene');
        });
    }
}