const Textures = require('../Textures.enum');
const Animations = require('../Animations.enum');

module.exports =
class LoadingScene extends Phaser.Scene {

    init() { }

    preload() {
        this.load.multiatlas(Textures.SPRITE_ATLAS_ID, Textures.SPRITE_ATLAS_JSON, Textures.BASE_PATH);
    }

    create() {

        this.anims.create({
            key: Animations.PORTAL,
            frames: this.anims.generateFrameNames(Textures.SPRITE_ATLAS_ID, {
                start:0,
                end: 2,
                zeroPad: 1,
                prefix: Textures.SPRITES.PORTAL,
                suffix: '.png',
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: Animations.BRUCE_RUN,
            frames: this.anims.generateFrameNames(Textures.SPRITE_ATLAS_ID, {
               start:1,
               end: 2,
               zeroPad: 1,
               prefix: Textures.SPRITES.BRUCE,
               suffix: '.png'
            }),
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: Animations.SQUID,
            frames: this.anims.generateFrameNames(Textures.SPRITE_ATLAS_ID, {
                start: 0,
                end: 1,
                zeroPad: 1,
                prefix: Textures.SPRITES.SQUID,
                suffix: '.png'
            }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.start('Platform');
    }

    update() { }
};