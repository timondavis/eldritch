const Textures = require ('../Textures.enum');
const Animations = require ('../Animations.enum');

module.exports =
class SquidSprite extends Phaser.GameObjects.Sprite {

    constructor(config) {
       super(config.scene, config.x, config.y, config.textureKey, config.frameKey);

       console.log('squid ctr');
       console.log(config);

       this.scene = config.scene;
       this.scene.add.existing(this);
    }

    /**
     * Resize and animate the squid on the level.
     *
     * @param squidConfig {} - The configs for the instance
     */
    init(squidConfig) {
        this.scene.monsters.add(this);

        this.setScale(3);
        this.body.allowGravity = false;
        this.setPath({
            x: squidConfig.x2,
            y: squidConfig.y2,
            duration: squidConfig.duration
        });
        this.anims.play(Animations.SQUID);
    }

    /**
     * Set the path along which to send the squid
     * @param pathConfig {}
     */
    setPath(pathConfig) {
        this.scene.tweens.add({
            targets: this,
            x: pathConfig.x,
            y: pathConfig.y,
            duration: pathConfig.duration,
            yoyo: true,
            repeat: -1
        })
    }
};