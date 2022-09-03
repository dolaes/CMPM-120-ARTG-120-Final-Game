class Cutscene extends Phaser.Scene {
    constructor() {
        super("cutscene");

        this.DBOX_X = 0;
        this.DBOX_Y = 400;
        this.DBOX_FONT = 'gem_font';	// dialog box font key

        this.TEXT_X = 50;			// text w/in dialog box x-position
        this.TEXT_Y = 450;			// text w/in dialog box y-position
        this.TEXT_SIZE = 24;		// text font size (in pixels)
        this.TEXT_MAX_WIDTH = 625;	// max width of text within box

        this.NEXT_TEXT = '[SPACE]';	// text to display for next prompt
        this.NEXT_X = 675;			// next text prompt x-position
        this.NEXT_Y = 574;			// next text prompt y-position

        this.LETTER_TIMER = 5;

        //dialog variables
        this.dialogLine = 0;			// current line of conversation
        this.dialogSpeaker = null;		// current speaker
        this.dialogLastSpeaker = null;	// last speaker
        this.dialogTyping = false;		// flag to lock player input while text is "typing"
        this.dialogText = null;			// the actual dialog text
        this.nextText = null;			// player prompt text to continue typing

        this.OFFSCREEN_X = -500;
        this.OFFSCREEN_Y = 450;


    }

    preload() {
        this.load.path = "./assets/"
        this.load.image('virgil', 'virgil.png');
        this.load.image('gary_cutscene', 'gary_cutscene.png');
        this.load.image('lantern_virgil', 'lantern_virgil.png');
        this.load.image('lantern_gary', 'lantern_gary.png');
        this.load.json('cutsceneDialog', 'cutsceneDialog.json');
        this.load.image('dialogbox', 'dialogbox.png');
    }

    create() {
        this.dialog = this.cache.json.get('cutsceneDialog');
        this.Virgil = this.add.sprite(this.OFFSCREEN_X, this.OFFSCREEN_Y, 'virgil').setOrigin(0, 1).setScale(10);
        this.Gary = this.add.sprite(this.OFFSCREEN_X, this.OFFSCREEN_Y, 'gary_cutscene').setOrigin(0, 1).setScale(10);

        //ready the character dialog images offscreen
        this.lantern_gary = this.add.sprite(this.OFFSCREEN_X, this.OFFSCREEN_Y, 'lantern_gary').setOrigin(0, 1).setScale(10);
        this.lantern_virgil = this.add.sprite(this.OFFSCREEN_X, this.OFFSCREEN_Y, 'lantern_virgil').setOrigin(0, 1).setScale(10);


        this.dialogBox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dialogbox').setOrigin(0);

        //initialize dialog text objects
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);

        //input
        cursors = this.input.keyboard.createCursorKeys();

        cursors.shift.on('down', () => {
            this.scene.start('tutorialScene');
        });
        this.add.bitmapText(game.config.width - 200, 50, this.DBOX_FONT, '[SHIFT] to skip', this.TEXT_SIZE)
        this.typeText();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.dialogTyping) {
            this.typeText();
        }
    }

    typeText() {
        //lock the player from moving on
        this.dialogTyping = true;

        //clear the text
        this.dialogText.text = '';
        this.nextText.text = '';

        //check to see if the cutscene has ended
        if (this.dialogLine >= this.dialog.length) {
            this.scene.start("tutorialScene");
        } else {
            //introduce the new speaker
            this.dialogSpeaker = this.dialog[this.dialogLine]['speaker'];

            if (this.dialog[this.dialogLine]['newSpeaker']) {
                if (this.dialogLastSpeaker) {
                    this.tweens.add({
                        targets: this[this.dialogLastSpeaker],
                        x: this.OFFSCREEN_X,
                        duration: 500,
                        ease: 'Linear'
                    });
                }
                this.tweens.add({
                    targets: this[this.dialogSpeaker],
                    x: this.DBOX_X + 36,
                    duration: 500,
                    ease: 'Linear'
                });
            }

            this.dialogLines = this.dialog[this.dialogLine]['name'] + ': ' + this.dialog[this.dialogLine]['dialog'];

            let currentChar = 0;
            this.textTimer = this.time.addEvent({
                delay: this.LETTER_TIMER,
                repeat: this.dialogLines.length - 1,
                callback: () => {
                    this.dialogText.text += this.dialogLines[currentChar];

                    currentChar++;

                    if (this.textTimer.getRepeatCount() == 0) {
                        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1);
                        this.dialogTyping = false;
                        this.textTimer.destroy();
                    }
                },
                callbackScope: this
            });

            this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;

            this.dialogLine++;

            this.dialogLastSpeaker = this.dialogSpeaker;
        }
    }
}