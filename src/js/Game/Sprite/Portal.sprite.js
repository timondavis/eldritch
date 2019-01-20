const Textures = require('../Textures.enum');
const Animations = require('../Animations.enum');
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

    addGoalPortal() {

        const finishPoint = this.scene.levelData.finish;

        this.scene.goal = new PortalSprite({
            scene: this.scene,
            x: finishPoint.x,
            y: finishPoint.y,
            textureKey: Textures.SPRITE_ATLAS_ID,
            frameKey: Textures.SPRITES.PORTAL + '0.png'
        });

        this.scene.goal.setScale(0.25);
        this.scene.physics.add.existing(this.scene.goal);
        this.scene.goal.body.allowGravity = false;
        this.scene.goal.body.isImmovable = true;
        this.scene.physics.add.overlap(
            this.scene.bruce,
            this.scene.goal,
            this.scene.clearLevel
        );
        this.scene.goal.play(Animations.PORTAL);

        this.scene.tweens.add({
            targets: this.scene.goal,
            scaleX: 3,
            scaleY: 3,
            duration: 2000,
            angle: -720,
            ease: 'Quad.easein',
            onComplete: () => {
            }
        })
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

                this.scene.time.addEvent({
                    delay: 2000,
                    loop: false,
                    callback: this.addGoalPortal,
                    callbackScope: this
                });
            }
        })
    }

};