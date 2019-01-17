module.exports =
class PlatformTile extends Phaser.GameObjects.TileSprite {

    constructor(config) {
        super(config.scene, config.x, config.y, config.width, config.height, config.textureKey, config.frameKey);
        this.scene = config.scene;
        this.scene.add.existing(this);
    }
};