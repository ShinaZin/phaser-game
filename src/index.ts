import Phaser from 'phaser';

import { onPageLoad } from './helpers';

import { create } from './create';
import { preload } from './preload';
import { update } from './update';

onPageLoad(() => {
  const config: Phaser.Types.Core.GameConfig = {
    title: 'XMas Fox',
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#aaaaff',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload,
      create,
      update
    },
    scale: {
      autoCenter: Phaser.Scale.Center.CENTER_BOTH,
      mode: Phaser.Scale.ScaleModes.FIT
    }
  };

  new Phaser.Game(config);
});
