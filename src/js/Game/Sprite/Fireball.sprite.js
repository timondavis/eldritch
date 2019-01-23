const Textures = require('../Textures.enum');
const Animations = require('../Animations.enum');

module.exports =
class FireballSprite extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, config.textureKey, config.frameKey);
        this.scene = config.scene;
        this.scene.add.existing(this);
    }
};