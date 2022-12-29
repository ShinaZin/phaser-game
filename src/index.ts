import Phaser from 'phaser';

import { PlayScene } from './play-scene';
import { PreloadScene } from './preload-scene';

import { onPageLoad } from './helpers';

onPageLoad(() => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 340,
    pixelArt: true,
    transparent: false,
    backgroundColor: '#eeeeee',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scene: [PreloadScene, PlayScene]
  };

  new Phaser.Game(config);
});
