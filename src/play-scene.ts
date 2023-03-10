import Phaser from 'phaser';
import { Sprite } from './common';
import { asSprite } from './helpers';
import { Snow } from './snow';

export class PlayScene extends Phaser.Scene {
  private gameSpeed = 0;
  private isGameRunning = false;
  private respawnTime = 0;
  private score = 0;
  private jumpSound!: Phaser.Sound.BaseSound;
  private hitSound!: Phaser.Sound.BaseSound;
  private reachSound!: Phaser.Sound.BaseSound;
  private bonusSound!: Phaser.Sound.BaseSound;
  private startTrigger!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ground!: Phaser.GameObjects.TileSprite;
  private dino!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private scoreText!: Phaser.GameObjects.Text;
  private highScoreText!: Phaser.GameObjects.Text;
  private bonusText!: Phaser.GameObjects.Text;

  private environment!: Phaser.GameObjects.Group;
  private obsticles!: Phaser.Physics.Arcade.Group;
  private bonuses!: Phaser.Physics.Arcade.Group;
  private bonusTimer?: Phaser.Time.TimerEvent;
  private snow!: Snow;
  private gameOverScreen!: Phaser.GameObjects.Container;
  private gameOverText!: Phaser.GameObjects.Image;
  private buttonRestart!: Phaser.GameObjects.Image;
  private buttonJump!: Phaser.GameObjects.Rectangle;
  private buttonCrouch!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('PlayScene');
  }

  private getGameSize() {
    const height = Number(this.game.config.height);
    const width = Number(this.game.config.width);
    return { height, width };
  }

  create() {
    const { height, width } = this.getGameSize();

    this.gameSpeed = 10;
    this.isGameRunning = false;
    this.respawnTime = 0;
    this.score = 0;

    this.jumpSound = this.sound.add('jump', { volume: 0.2 });
    this.hitSound = this.sound.add('hit', { volume: 0.2 });
    this.reachSound = this.sound.add('reach', { volume: 0.2 });
    this.bonusSound = this.sound.add('bonus', { volume: 0.2 });

    this.startTrigger = this.physics.add.sprite(0, 40, '').setOrigin(0, 1).setImmovable().setVisible(false);
    this.ground = this.add.tileSprite(0, height, 88, 26, Sprite.Ground).setOrigin(0, 1)
    this.dino = this.physics.add.sprite(0, height, Sprite.DinoIdle)
      .setCollideWorldBounds(true)
      .setGravityY(5000)
      .setBodySize(44, 92)
      .setDepth(1)
      .setOrigin(0, 1);

    const textStyle = { color: '#535353', font: '900 35px Courier', resolution: 5 };
    this.scoreText = this.add.text(width, 0, '00000', textStyle)
      .setOrigin(1, 0)
      .setVisible(false);

    this.highScoreText = this.add.text(0, 0, '00000', textStyle)
      .setOrigin(1, 0)
      .setVisible(false);
    
    this.bonusText = this.add.text(0, 0, '', textStyle)
      .setVisible(false);

    this.environment = this.add.group();
    this.environment.addMultiple([
      this.add.image(width / 2, 170, Sprite.Cloud),
      this.add.image(width - 80, 80, Sprite.Cloud),
      this.add.image((width / 1.3), 100, Sprite.Cloud)
    ]);
    this.environment.setVisible(false);

    this.snow = new Snow(this);

    this.gameOverScreen = this.add.container(width / 2, height / 2 - 50).setVisible(false)
    this.gameOverText = this.add.image(0, 0, Sprite.GameOver);
    this.buttonRestart = this.add.image(0, 80, Sprite.Restart).setInteractive();
    this.gameOverScreen.add([ this.gameOverText, this.buttonRestart ])

    this.obsticles = this.physics.add.group();
    this.bonuses = this.physics.add.group();

    this.initAnims();
    this.initStartTrigger();
    this.initColliders();
    this.handleInputs();
    this.handleScore();
  }

  initColliders() {
    this.physics.add.collider(this.dino, this.obsticles, this.handleGameOver, undefined, this);
    this.physics.add.overlap(this.dino, this.bonuses, this.handleBonusPick, undefined, this);
  }

  initStartTrigger() {
    const { height, width } = this.getGameSize();
    this.physics.add.overlap(this.startTrigger, this.dino, () => {
      if (this.startTrigger.y === 40) {
        this.startTrigger.body.reset(0, height);
        return;
      }

      this.startTrigger.disableBody(true, true);

      const startEvent = this.time.addEvent({
        delay: 1000 / 60,
        loop: true,
        callbackScope: this,
        callback: () => {
          this.dino.setVelocityX(80);
          this.dino.play(Sprite.DinoRun, true);

          if (this.ground.width < width) {
            this.ground.width += 17 * 2;
          }

          if (this.ground.width >= 1000) {
            this.ground.width = width;
            this.isGameRunning = true;
            this.dino.setVelocityX(0);
            this.scoreText.setVisible(true);
            this.environment.setVisible(true);
            startEvent.remove();
          }
        }
      });
    }, undefined, this)
  }

  initAnims() {
    this.anims.create({
      key: Sprite.DinoRun,
      frames: this.anims.generateFrameNumbers(Sprite.Dino, { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'dino-down-anim',
      frames: this.anims.generateFrameNumbers(Sprite.DinoDown, { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'enemy-dino-fly',
      frames: this.anims.generateFrameNumbers('enemy-bird', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1
    })
  }

  handleScore() {
    this.time.addEvent({
      delay: 1000 / 10,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (!this.isGameRunning) { return; }

        this.score++;
        this.gameSpeed += 0.01

        if (this.score % 100 === 0) {
          this.reachSound.play();

          this.tweens.add({
            targets: this.scoreText,
            duration: 100,
            repeat: 3,
            alpha: 0,
            yoyo: true
          })
        }

        const score = Array.from(String(this.score), Number);
        for (let i = 0; i < 5 - String(this.score).length; i++) {
          score.unshift(0);
        }

        this.scoreText.setText(score.join(''));
      }
    })
  }

  handleGameOver() {
    if (this.dino.alpha != 1) {
      return;
    }

    this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

    const highScore = this.highScoreText.text.substr(this.highScoreText.text.length - 5);
    const newScore = Number(this.scoreText.text) > Number(highScore) ? this.scoreText.text : highScore;

    this.highScoreText.setText('HI ' + newScore);
    this.highScoreText.setVisible(true);

    this.physics.pause();
    this.snow.destroy();
    this.isGameRunning = false;
    this.anims.pauseAll();
    this.dino.setTexture(Sprite.DinoHurt);
    this.respawnTime = 0;
    this.gameSpeed = 10;
    this.gameOverScreen.setVisible(true);
    this.buttonCrouch.disableInteractive();
    this.buttonJump.disableInteractive();
    this.score = 0;
    this.hitSound.play();
  }

  handleBonusPick(dino: Phaser.GameObjects.GameObject, bonus: Phaser.GameObjects.GameObject) {
    this.bonusTimer?.remove();
    this.bonusTimer = this.time.addEvent({
      repeat: 9,
      delay: 1000,
      callback: () => {
        const remaining = this.bonusTimer!.getOverallRemainingSeconds();
        if (remaining == 3) {
          this.tweens.add({
            targets: this.bonusText,
            duration: 500,
            repeat: 5,
            alpha: 0.2,
            yoyo: true,
          })
        }
        if (remaining == 0) {
          this.dino.alpha = 1
          this.bonusText.setVisible(false);
        } else {
          this.bonusText.setText(`BONUS: ${remaining}sec`);
        }
      }
    })

    this.dino.alpha = 0.5;
    this.bonusSound.play();
    this.bonusText.setText(`BONUS: ${this.bonusTimer.getOverallRemainingSeconds()}sec`);
    this.bonusText.setVisible(true);
    bonus.destroy();
  }

  handleInputs() {
    // Restart
    this.buttonRestart.on('pointerdown', () => this.actionRestartGame());
    this.input.keyboard.on('keydown-R', () => this.actionRestartGame())
    // Jump
    this.input.keyboard.on('keydown-SPACE', () => this.actionJump())
    // Crouch
    this.input.keyboard.on('keydown-DOWN', () => this.actionCrouch());
    this.input.keyboard.on('keyup-DOWN', () => this.actionUncrouch());

    // Sensor controls
    const { height, width } = this.getGameSize();
    this.buttonJump = this.add.rectangle(0, 0, width / 2, height).setInteractive().setOrigin(0)
      .on('pointerdown', () => this.actionJump());
    this.buttonCrouch = this.add.rectangle(width / 2, 0, width / 2, height).setInteractive().setOrigin(0)
      .on('pointerdown', () => this.actionCrouch())
      .on('pointerup', () => this.actionUncrouch());
  }

  actionRestartGame() {
    this.dino.setVelocityY(0);
    this.dino.body.setSize(44, 92);
    this.dino.body.offset.y = 0;
    this.physics.resume();
    this.obsticles.clear(true, true);
    this.isGameRunning = true;
    this.gameOverScreen.setVisible(false);
    this.anims.resumeAll();
    this.buttonCrouch.setInteractive();
    this.buttonJump.setInteractive();
  }

  actionJump() {
	  if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) {
	    return;
	  }
	  this.jumpSound.play();
	  this.dino.body.setSize(44, 92)
	  this.dino.body.offset.y = 0;
	  this.dino.setVelocityY(-1500);
	  this.dino.setTexture(Sprite.Dino, 0);
}
  
  actionCrouch() {
    if (!this.dino.body.onFloor() || !this.isGameRunning) {
      return;
    }
    this.dino.body.setSize(44, 58)
    this.dino.body.offset.y = 34;
  }

  actionUncrouch() {
    if (this.score !== 0 && !this.isGameRunning) {
      return;
    }
    this.dino.body.setSize(44, 92)
    this.dino.body.offset.y = 0;
  }

  placeObsticle() {
    const { height, width } = this.getGameSize();
    const obsticleNum = Phaser.Math.Between(1, 7);
    const distance = Phaser.Math.Between(600, 900);

    let obsticle: Phaser.Physics.Arcade.Sprite;
    if (obsticleNum > 6) {
      obsticle = this.obsticles
        .create(width + distance, height - Phaser.Utils.Array.GetRandom([20, 50]), Sprite.Enemy)
        .setOrigin(0, 1)
      obsticle.play(Sprite.EnemyFly, true);
      obsticle.body.setSize(undefined, obsticle.body.height / 1.5);
    } else {
      obsticle = this.obsticles.create(width + distance, height, `obsticle-${obsticleNum}`)
        .setOrigin(0, 1);

      obsticle.body.offset.y = +10;
    }

    obsticle.setImmovable();
  }

  placeBonus() {
    const { height, width } = this.getGameSize();
    const distance = Phaser.Math.Between(700, 1200);

    const bonus: Phaser.Physics.Arcade.Sprite = this.bonuses
        .create(width + distance, height - Phaser.Math.Between(180, 250), Sprite.Bonus)
        .setOrigin(0, 1)
    bonus.body.setSize(undefined, bonus.body.height / 2);
  }

  update(time: number, delta: number) {
    if (!this.isGameRunning) { return; }

    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.bonuses.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.environment.getChildren(), -0.5);
    this.snow.update();

    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime >= 1500) {
      this.placeObsticle();
      this.respawnTime = 0;
    }

    if (this.respawnTime % 900 == 0) {
      // 20% chance to spawn bonus
      if (Phaser.Utils.Array.GetRandom([1, 0, 0, 0, 0])) {
        this.placeBonus();
      }
    }

    this.obsticles.getChildren().forEach(obsticle => {
      if (asSprite(obsticle).getBounds().right < 0) {
        this.obsticles.killAndHide(obsticle);
      }
    })

    this.bonuses.getChildren().forEach(bonus => {
      if (asSprite(bonus).getBounds().right < 0) {
        this.bonuses.killAndHide(bonus);
      }
    })

    this.environment.getChildren().forEach(env => {
      if (asSprite(env).getBounds().right < 0) {
        asSprite(env).x = this.getGameSize().width + 30;
      }
    })

    if (this.dino.body.deltaAbsY() > 0) {
      this.dino.anims.stop();
      this.dino.setTexture(Sprite.Dino, 0);
    } else {
      const sprite = this.dino.body.height <= 58 ? Sprite.DinoDownAnim : Sprite.DinoRun;
      this.dino.play(sprite, true)
    }
  }
}