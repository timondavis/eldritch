const Textures = require('../Textures.enum');

module.exports =
class LoadingScene extends Phaser.Scene {

    init() { }

    preload() {
        this.load.multiatlas(Textures.SPRITE_ATLAS_ID, Textures.SPRITE_ATLAS_JSON, Textures.BASE_PATH);
    }

    create() {
        this.scene.start('Platform');
    }

    update() { }
};