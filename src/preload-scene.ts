
import Phaser from 'phaser';
import { Sprite } from './common';

export class PreloadScene extends Phaser.Scene {

  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.audio('jump', 'assets/jump.m4a');
    this.load.audio('hit', 'assets/hit.m4a');
    this.load.audio('reach', 'assets/reach.m4a');
    this.load.audio('bonus', 'assets/bonus.wav');

    this.load.image(Sprite.Ground, 'assets/ground.png');
    this.load.image(Sprite.DinoIdle, 'assets/dino-idle.png');
    this.load.image(Sprite.DinoHurt, 'assets/dino-hurt.png');
    this.load.image(Sprite.Restart, 'assets/restart.png');
    this.load.image(Sprite.GameOver, 'assets/game-over.png');
    this.load.image(Sprite.Cloud, 'assets/cloud.png');

    this.load.spritesheet(Sprite.Dino, 'assets/dino-run.png', {
      frameWidth: 88,
      frameHeight: 94
    })

    this.load.spritesheet(Sprite.DinoDown, 'assets/dino-down.png', {
      frameWidth: 118,
      frameHeight: 94
    })

    this.load.spritesheet(Sprite.Enemy, 'assets/enemy-bird.png', {
      frameWidth: 92,
      frameHeight: 77
    })

    this.load.image(Sprite.Obsticle1, 'assets/cactuses_small_1.png')
    this.load.image(Sprite.Obsticle2, 'assets/cactuses_small_2.png')
    this.load.image(Sprite.Obsticle3, 'assets/cactuses_small_3.png')
    this.load.image(Sprite.Obsticle4, 'assets/cactuses_big_1.png')
    this.load.image(Sprite.Obsticle5, 'assets/cactuses_big_2.png')
    this.load.image(Sprite.Obsticle6, 'assets/cactuses_big_3.png')

    this.load.image(Sprite.Bonus, 'assets/bonus.png')
  }

  create() {
    this.scene.start('PlayScene');
  }
}