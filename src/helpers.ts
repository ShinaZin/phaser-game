export function onPageLoad(callback: VoidFunction) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

export function asSprite(object: Phaser.GameObjects.GameObject) {
  return object as Phaser.Physics.Arcade.Sprite;
}
