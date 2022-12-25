import Phaser from 'phaser';

interface IGlobs {
  platforms: Phaser.Physics.Arcade.StaticGroup;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  stars: Phaser.Physics.Arcade.Group;
  scoreText: Phaser.GameObjects.Text;
  score: number;
}

export const Globs = {
  platforms: {},
  player: {},
  cursors: {},
  stars: {},
  scoreText: {},
  score: 0
} as IGlobs;
