import Phaser from 'phaser';

import { PlayScene } from './play-scene';
import { PreloadScene } from './preload-scene';

import { onPageLoad } from './helpers';

onPageLoad(() => {
  const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 340,
    pixelArt: true,
    transparent: true,
    physics: {
      default: 'arcade',
      arcade: {
        debug: true
      }
    },
    scene: [PreloadScene, PlayScene]
  };

  new Phaser.Game(config);
});
