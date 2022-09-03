class HUD extends Phaser.Scene {
   constructor() {
      super("HUD");
   }
   preload() {
      this.load.path = "./assets/";
      this.load.spritesheet("shine_meter", "Shine_Meter.png", {
         frameWidth: 64,
         frameHeight: 16,
         startFrame: 0,
         endFrame: 12
      });
      this.load.spritesheet("sprint_meter", "Sprint_Meter.png", {
         frameWidth: 68,
         frameHeight: 16,
         startFrame: 0,
         endFrame: 12
      });
      this.load.spritesheet("sprint_meter_reverse", "Sprint_Meter_Reverse.png", {
         frameWidth: 68,
         frameHeight: 16,
         startFrame: 0,
         endFrame: 12
      });
   }

   create() {
      this.anims.create({
         key: 'shine_ani',
         frames: this.anims.generateFrameNumbers('shine_meter', {
            start: 0,
            end: 12,
            first: 0,
         }),
         duration: 5000,
         repeat: 0,
         yoyo: true
      });
      this.anims.create({
         key: 'sprint_ani_forward',
         frames: this.anims.generateFrameNumbers('sprint_meter', {
            start: 0,
            end: 12,
            first: 0,
         }),
         duration: 2000,
         repeat: 0
      });

      this.anims.create({
         key: 'sprint_ani_reverse',
         frames: this.anims.generateFrameNumbers('sprint_meter_reverse', {
            start: 0,
            end: 12,
            first: 0,
         }),
         duration: 5000,
         repeat: 0
      });
      this.shineMeter = this.add.sprite(game.config.width - 72, 48, "shine_meter", 0).setScale(2);
      this.sprintMeter = this.add.sprite(game.config.width - 200, 48, "sprint_meter", 0).setScale(2);
   }
}