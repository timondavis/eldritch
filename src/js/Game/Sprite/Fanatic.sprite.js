const Textures = require('../Textures.enum');
const Animations = require('../Animations.enum');
const FireballSprite = require('./Fireball.sprite');

module.exports =
class FanaticSprite extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, config.textureKey, config.frameKey);
        this.x1 = config.x;
        this.x2 = config.x2;
        this.direction = 1;
        this.scene = config.scene;
        this.scene.add.existing(this);

        this.rayIntersect = null;
        this.lineWidth = null;
        this.lineYAdjust = null;

        this.isAttacking = false;
        let scene = this.scene;

        this.fireballTimer = this.scene.time.addEvent({
            delay: 700,
            callbackScope: this,
            loop: true,
            callback: () => {
                let fireball;
                let playerSpeed = this.scene.levelData.playerSpeed;
                if (!this.scene.fireballs.getFirstDead()) {
                    console.log('creating new');
                    fireball = new FireballSprite({
                        scene: this.scene,
                        x: this.x, y: this.y,
                        textureKey: Textures.SPRITE_ATLAS_ID,
                        frameKey: Textures.SPRITES.FIREBALL + '0.png'
                    });
                    this.scene.fireballs.add(fireball);
                    fireball.visible = true;
                } else {
                    fireball = this.scene.fireballs.get(this.x, this.y);
                    fireball.visible = true;
                    fireball.active = true;
                }

                fireball.body.setVelocityX(playerSpeed * 1.2 * this.direction);
                if (this.direction < 0) {
                    fireball.flipX = true;
                } else {
                    fireball.flipX = false;
                }
                fireball.anims.play(Animations.FIREBALL);
                fireball.setScale(3);

                this.scene.time.addEvent({
                    delay: scene.levelData.projectileDuration,
                    callback() {
                        scene.fireballs.killAndHide(fireball);
                    }
                })
            }
        });
    }

    init() {
        this.scene.monsters.add(this);

        this.setScale(3);
        this.depth = 900;
        this.anims.play(Animations.FANATIC_RUN);

        this.lineYAdjust = this.texture.source[0].height / 2;
        this.lineWidth = 200;

        this.rayIntersect = new Phaser.GameObjects.Line(
            this.scene,
            this.x, this.y - this.lineYAdjust,
            this.x, this.y - this.lineYAdjust,
            this.x + this.lineWidth, this.y - this.lineYAdjust);
        this.rayIntersect.setOrigin(0);
        this.scene.add.existing(this.rayIntersect);
        this.scene.physics.add.existing(this.rayIntersect);
        this.rayIntersect.body.allowGravity = false;

        this.scene.physics.add.overlap(this.scene.bruce, this.rayIntersect, () => {
            this.setFrame(Textures.SPRITES.FANATIC + '2.png');
            this.body.setVelocityX(0);
            this.fireballTimer.paused = false;
            this.isAttacking = true;

        });


    }

    update() {

        if (this.isAttacking) {
            this.isAttacking = false;
            return;
        }

        this.fireballTimer.paused = true;
        if (this.direction === 1) {
            this.body.setVelocityX(100);
            this.flipX = false;

            this.rayIntersect.setPosition(this.x, this.y - this.lineYAdjust );

            if ( this.x >= this.x2 ) {
                this.direction = -1;
            }
        }

        if (this.direction === -1) {
            this.body.setVelocityX(-100);
            this.flipX = true;
            this.rayIntersect.setPosition(this.x - this.lineWidth, this.y - this.lineYAdjust );

            if (this.x <= this.x1 ) {
                this.direction = 1;
            }
        }
    }
};