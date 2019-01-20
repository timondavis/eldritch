module.exports =
class PortalSprite extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, config.textureKey, config.frameKey);
        this.scene = config.scene;
        this.scene.add.existing(this);
    }

    invokeLevelStartTween(portalOpenCallback) {
        this.scene.tweens.add({
            targets: this,
            scaleX: 10,
            scaleY: 10,
            duration: 2000,
            angle: 720,
            ease: 'Quad.easein',
            onComplete: () => {
                portalOpenCallback();
                this.invokeCloseLevelStartTween();
            }
        });
    }

    invokeCloseLevelStartTween() {
        this.scene.tweens.add({
            targets: this,
            scaleX: .0,
            scaleY: .0,
            duration: 2000,
            delay: 2000,
            angle: -720,
            ease: 'Quad.easein',
            onComplete: () => {
                this.destroy();
            }
        })
    }

};