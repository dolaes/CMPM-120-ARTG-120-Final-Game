class Gary extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setBodySize(20, 20);
      this.setOffset(3,10);
      this.energy = true;
      this.sprint = false;
      this.sprintCooldown = false;
      this.speed = 75;
      this.sprintSpeed = 130;
   }

   update() {
      if(cursors.left.isDown) {
         if(this.sprint) {
            this.body.setVelocity(-this.sprintSpeed, 0);
         } else {
            this.body.setVelocity(-this.speed, 0);
         }
         this.anims.play('left', true);
         this.resetFlip();

      } else if (cursors.right.isDown) {
         if(this.sprint) {
            this.body.setVelocity(this.sprintSpeed, 0);
         } else {
            this.body.setVelocity(this.speed, 0);
         }
         this.anims.play('right', true);
         this.resetFlip();

      } else if (cursors.up.isDown) {
         if(this.sprint) {
            this.body.setVelocity(0, -this.sprintSpeed)
         } else {
            this.body.setVelocity(0, -this.speed);
         }
         this.anims.play('up', true);

      } else if (cursors.down.isDown) {
         if(this.sprint) {
            this.body.setVelocity(0, this.sprintSpeed)
         } else {
            this.body.setVelocity(0, this.speed);
         }
         this.anims.play('right', true);

      } else if(!cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown){
         this.setVelocity(0, 0);
         if(this.anims.isPlaying && this.anims.currentAnim.key == 'left') {
            this.setFlipX(true);
            this.anims.play('idle', true);
         }
         if(this.anims.isPlaying && this.anims.currentAnim.key == 'right') {
            this.anims.play('idle', true);
         }
         if(this.anims.isPlaying && this.anims.currentAnim.key == 'up') {-
            this.anims.play('idle_up', true);
         } 
      }
   }
}
