class Flake {
  private object: Phaser.GameObjects.Graphics;
  private width: number;
  private height: number;
  private x = -1;
  private y = -1;
  private drift = 0;
  private fallSpeed = 0;
  
  prevFlake?: Flake;

  constructor(scene: Phaser.Scene, w: number, h: number) {
    this.object = scene.add.graphics()
    this.object.fillStyle(0xffffff, 1);
    this.object.fillRect(0, 0, 7, 7);
    this.width = w;
    this.height = h;
    this.y = Phaser.Math.Between(0, h);
    this.reset();
  }

  reset() {
    this.x = Phaser.Math.Between(0, this.width);
    this.drift = Phaser.Math.Between(-1, 1) * (.05 + Math.random() * .1);
    this.fallSpeed = 1 + Math.random() * 10;
    this.object.scaleX = .1 + Math.random();
    this.object.scaleY = this.object.scaleX;
    this.object.alpha = .1 + Math.random();
    this.object.depth = 5;
  }

  move() {
    this.x += this.drift;
    this.y += this.fallSpeed;
    if (this.y > this.height) {
      this.y = -10;
      this.reset();
    }
    this.object.setPosition(this.x, this.y);
    this.prevFlake?.move();

  }

  destroy() {
    this.object.visible = true;
    this.object.destroy();
    this.prevFlake?.object.destroy();
  }
}

export class Snow {
  private width: number;
  private height: number;
  private lastFlake?: Flake;
  private maxFlakes = 250;

  constructor(scene: Phaser.Scene) {
    this.width = +scene.game.config.width;
    this.height = +scene.game.config.height;
    this.createFlakes(scene);
  }

  createFlakes(scene: Phaser.Scene) {
    for (let i = 0; i < this.maxFlakes; i++) {
      const flake = new Flake(scene, this.width, this.height);
      if (this.lastFlake) {
        flake.prevFlake = this.lastFlake;
      }
      this.lastFlake = flake;
    }
  }

  update() {
    this.lastFlake?.move();
  }

  destroy() {
    this.lastFlake?.destroy();
  }
}