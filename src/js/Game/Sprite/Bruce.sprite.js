const Textures = require('../Textures.enum');
const Animations = require('../Animations.enum');

module.exports =
class BruceSprite extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, config.textureKey, config.frameKey);
        this.scene = config.scene;
        this.scene.add.existing(this);
    }

    update() {
        const scene = this.scene;

        if (scene.cursors) {
            this.handleLeftRightInput();
            this.handleJumpInput();
        }
    }

    handleJumpInput() {

        const scene = this.scene;
        const onGround = this.body.blocked.down || this.body.touching.down;

        if (onGround && scene.cursors.space.isDown){
            this.body.setVelocityY(-500);
            this.setFrame(Textures.SPRITES.BRUCE + '2.png');
        }

    }

    handleLeftRightInput() {
        const scene = this.scene;
        const playerSpeed = scene.levelData.playerSpeed;
        const onGround = this.body.blocked.down || this.body.touching.down;

        if (scene.cursors.right.isDown) {
            this.body.setVelocityX(playerSpeed);
            this.flipX = true;

            if (onGround && !this.anims.isPlaying) {
                this.anims.play(Animations.BRUCE_RUN);
            } else if (!onGround) {
                this.setFrame(Textures.SPRITES.BRUCE + '2.png');
            }

            console.log('right is down');
        } else if (scene.cursors.left.isDown) {
            this.body.setVelocityX(-1 * playerSpeed);
            this.flipX = false;

            if (onGround && !this.anims.isPlaying) {
                this.anims.play(Animations.BRUCE_RUN);
            } else if (!onGround) {
                this.setFrame(Textures.SPRITES.BRUCE + '2.png');
            }
        }
        else {
            this.flipX = false;
            this.body.setVelocityX(0);
            this.setFrame(Textures.SPRITES.BRUCE + '0.png');
        }
    }

};