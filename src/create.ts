import Phaser from 'phaser';
import { Globs } from './globs';
import { asSprite } from './helpers';

export function create(this: Phaser.Scene) {
  this.add.image(400, 300, 'sky');

  // PLATFORMS
  Globs.platforms = this.physics.add.staticGroup();
  Globs.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  Globs.platforms.create(600, 400, 'ground');
  Globs.platforms.create(50, 250, 'ground');
  Globs.platforms.create(750, 220, 'ground');

  // PLAYER
  Globs.player = this.physics.add.sprite(100, 450, 'dude');
  Globs.player.setBounce(0.2);
  Globs.player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  this.physics.add.collider(Globs.player, Globs.platforms);

  Globs.cursors = this.input.keyboard.createCursorKeys();

  // STARS
  Globs.stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  Globs.stars.children.iterate((child) => {
    asSprite(child).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(Globs.stars, Globs.platforms);

  Globs.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#000' });
}
