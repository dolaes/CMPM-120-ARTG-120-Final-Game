class Menu extends Phaser.Scene {
   constructor() {
      super("menuScene");
   }
   preload() {
      (this.load.path = "assets/");
      this.load.image('altar', 'altar.png');
      this.load.image('door', 'door.png');
      this.load.image('book', 'book.png');
      //load in particle effects
      this.load.image('door_particle', 'door_particle.png');
      this.load.image('gary_death', 'blood.png');
      this.load.image('gary_page', 'page_part.png');
      //load sprite atlas's
      this.load.atlas('gary_atlas', 'garysheet.png', 'garymap.json');
      this.load.atlas('bigEnemy_atlas', 'bigEnemySheet.png', 'bigEnemyMap.json');
      //load spritesheets
      this.load.spritesheet('fog', 'fog_ani.png', {
         frameWidth: 700,
         frameHeight: 700,
         startFrame: 0,
         endFrame: 9
      });

      this.load.spritesheet('enemy_left', 'enemysheet_left.png', {
         frameWidth: 26,
         frameHeight: 32,
         startFrame: 0,
         endFrame: 1
      });

      this.load.spritesheet('enemy_right', 'enemysheet_right.png', {
         frameWidth: 26,
         frameHeight: 32,
         startFrame: 0,
         endFrame: 1
      });

      this.load.spritesheet('page', 'page_animation.png', {
         frameWidth: 32,
         frameHeight: 32,
         startFrame: 0,
         endFrame: 4
      });
      this.load.spritesheet('menu', 'menusheet.png', {
         frameWidth: 700,
         frameHeight: 700,
         startFrame: 0,
         endFrame: 10
      });

      // load bitmap font
      this.load.bitmapFont('gem_font', 'gem.png', 'gem.xml');

      //load in the audio
      this.load.path = "assets/sounds/"
      this.load.audio('creaks', 'Ambient_Creaks.wav');
      this.load.audio('collect', 'Place_Page.wav');
      this.load.audio('menu_select', 'Select.wav')
      this.load.audio('whispers', 'Enemy_Sound.wav');
      this.load.audio('largeEnemyNoise', 'Large_Enemy_Sound.wav');
      this.load.audio('mainMenu', 'Main_Menu.wav');
      this.load.audio('shine', 'Shine.wav');
      this.load.audio('hurt', 'Hurt.wav');
      this.load.audio('door', 'Door_Sound.wav');
      this.load.audio('music', 'End_Screen_Song.wav');


   }


   create() {
      //create the gary animations
      this.anims.create({
         key: 'idle',
         frames: this.anims.generateFrameNames('gary_atlas', {
            prefix: 'Gary_Idle_',
            start: 0,
            end: 5,
            suffix: ''
         }),
         frameRate: 5,
         repeat: -1
      });

      this.anims.create({
         key: 'left',
         frames: this.anims.generateFrameNames('gary_atlas', {
            prefix: 'Gary_Left_',
            start: 0,
            end: 3,
            suffix: ''
         }),
         frameRate: 15,
         repeat: -1
      });

      this.anims.create({
         key: 'right',
         frames: this.anims.generateFrameNames('gary_atlas', {
            prefix: 'Gary_Right_',
            start: 0,
            end: 3,
            suffix: ''
         }),
         frameRate: 15,
         repeat: -1
      });

      this.anims.create({
         key: 'up',
         frames: this.anims.generateFrameNames('gary_atlas', {
            prefix: 'Gary_Up_',
            start: 0,
            end: 3,
            suffix: ''
         }),
         frameRate: 15,
         repeat: -1
      });

      this.anims.create({
         key: 'idle_up',
         defaultTextureKey: 'gary_atlas',
         frames: [
            {frame: 'Gary_Up_0'}
         ],
         repeat: -1
      });
      //create the animation for the phantoms
      this.anims.create({
         key: 'phantom_ani',
         frames: this.anims.generateFrameNumbers('enemy_right', {
            start: 0,
            end: 1,
            first: 0,
         }),
         frameRate: 5,
         repeat: -1
      });

      //create animation for large phantoms
      this.anims.create({
         key: 'big_phantom_ani_left',
         frames: this.anims.generateFrameNames('bigEnemy_atlas', {
            prefix: 'Big_Enemy_Left_',
            start: 0,
            end: 1,
            suffix: ''
         }),
         frameRate: 15,
         repeat: -1
      });

      this.anims.create({
         key: 'big_phantom_ani_right',
         frames: this.anims.generateFrameNames('bigEnemy_atlas', {
            prefix: 'Big_Enemy_Right_',
            start: 0,
            end: 1,
            suffix: ''
         }),
         frameRate: 15,
         repeat: -1
      });
      //create an animation for fog
      this.anims.create({
         key: 'fog_ani',
         frames: this.anims.generateFrameNumbers('fog', {
            start: 0,
            end: 9,
            first: 0
         }),
         duration: 1000,
         repeat: 0,
      });

      this.anims.create({
         key: 'page_ani',
         frames: this.anims.generateFrameNumbers('page', {
            start: 0,
            end: 4,
            first: 0
         }),
         frameRate: 7,
         repeat: -1
      });

      this.anims.create({
         key: 'menu_ani',
         frames: this.anims.generateFrameNumbers('menu', {
            start: 0,
            end: 10,
            first: 0
         }),
         frameRate: 5,
         repeat: -1
      });

      this.background = this.add.sprite(0, 0, 'menu', 0).setOrigin(0);
      this.background.anims.play('menu_ani');

      //play the music
      this.scene.mainMenuMusic = this.sound.add('mainMenu', { volume: 0.5 });
      this.scene.mainMenuMusic.setLoop(true);
      this.scene.mainMenuMusic.play();

      //handle input to change scenes
      this.input.keyboard.on('keydown-SPACE', () => {
         this.scene.mainMenuMusic.stop();
         this.scene.start("cutscene");

      });
   }
}