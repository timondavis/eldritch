const Textures = require('../Textures.enum');
const Animations = require('../Animations.enum');

module.exports =
class FlametrapSprite extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, config.textureKey, config.frameKey);
        this.scene = config.scene;
        this.scene.add.existing(this);

        this.flames = false;
        this.isProcessingFlames = false;
    }

    init(config) {

        this.timerOn = this.scene.time.addEvent({
            delay: config.onTime,
            loop: true,
            callback: () => {
                this.flamesOn();
            }
        });

        this.timerOff = this.scene.time.addEvent({
            delay: config.offTime,
            paused: true,
            loop: true,
            callback: () => {
                this.flamesOff();
            }
        });

        this.body.updateFromGameObject();
        this.body.height = this.body.halfHeight;
        this.body.y += this.body.height;
    }

    flamesOn() {
        this.anims.play(Animations.FLAMETRAP);
        this.flames = true;
        this.timerOn.paused = true;
        this.timerOff.paused = false;
    }

    flamesOff() {
        this.anims.stop();
        this.setFrame(Textures.SPRITES.FLAMETRAP + '0.png');
        this.flames = false;
        this.timerOn.paused = false;
        this.timerOff.paused = true;
    }
};