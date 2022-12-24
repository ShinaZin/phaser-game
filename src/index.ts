import Phaser from "phaser";
import { onPageLoad } from "./helpers";

function preload(this: Phaser.Scene) {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}

onPageLoad(() => {
  const config: Phaser.Types.Core.GameConfig = {
    title: "XMas Fox",
    width: 400,
    height: 300,
    backgroundColor: "green",
    scene: {
      preload
    },
    scale: {
      autoCenter: Phaser.Scale.Center.CENTER_BOTH,
      mode: Phaser.Scale.ScaleModes.FIT
    }
  };

  new Phaser.Game(config);
});
