import Phaser from 'phaser';
import { Globs } from './globs';
import { asSprite } from './helpers';

export function update(this: Phaser.Scene) {
  if (Globs.cursors.left.isDown) {
    Globs.player.setVelocityX(-160);
    Globs.player.anims.play('left', true);
  } else if (Globs.cursors.right.isDown) {
    Globs.player.setVelocityX(160);
    Globs.player.anims.play('right', true);
  } else {
    Globs.player.setVelocityX(0);
    Globs.player.anims.play('turn');
  }

  if (Globs.cursors.up.isDown && Globs.player.body.touching.down) {
    Globs.player.setVelocityY(-330);
  }

  this.physics.add.overlap(Globs.player, Globs.stars, collectStars, undefined, this);
}

export function collectStars(player: unknown, star: Phaser.GameObjects.GameObject) {
  asSprite(star).disableBody(true, true);
  Globs.score += 10;
  Globs.scoreText.setText('Score: ' + Globs.score);
}
