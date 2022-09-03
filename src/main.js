let config = {
   parent: 'phaser-game',
   type: Phaser.CANVAS,
   render: {
      pixelArt: true
   },
   width: 700,
   height: 700,
   physics: {
      default: 'arcade',
      arcade: {
         debug: false
      }
   },
   scene: [Menu, Cutscene, HUD, Tutorial, Hub, Lab, ComputerLab, Library, GameClear, Credits]
}

let game = new Phaser.Game(config);

//object to store the config of the path follower
let enemyConfig = {
   from: 0,
   to: 1,
   delay: 0,
   duration: 0, 
   hold: 500,
   repeat: -1,
   yoyo: true,
   rotateToPath: false,
   repeatDelay: 500
}

// Variables
let page0 = 0;
let page1 = 0;
let page2 = 0;
let page3 = 0;


let tutorialLock = true;

let cursors;

let garyX, garyY;
let phantomSpeed;

let deaths = 0;