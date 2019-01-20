const Textures = require('../Textures.enum.js');

module.exports =
class DecorationSprite extends Phaser.GameObjects.Sprite{

   constructor(config) {
       super(config.scene, config.x, config.y, config.textureKey, config.frameKey);
       this.scene = config.scene;
       this.scene.add.existing(this);
   }
};