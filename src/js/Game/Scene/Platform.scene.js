const Textures = require('../Textures.enum');
const Animations = require('../Animations.enum');

const TiledDecorationData = require('../Tile/TiledDecorationData.class');
const PlatformData = require('../Tile/PlatformData.class.js');

const PlatformUtility = require('../Util/Tile/Platform.utility.js');
const TiledDecorationUtility = require('../Util/Tile/TiledDecoration.utility');

const BruceSprite = require('../Sprite/Bruce.sprite');
const PortalSprite = require('../Sprite/Portal.sprite');
const Phaser = require('phaser');

module.exports =
class PlatformScene extends Phaser.Scene {

    init() {

        this.platforms = null;

        // Level data from JSON import
        this.levelData = null;

        // The cursor key inputs
        this.cursors = null;

        // the hero (sprite)
        this.bruce = null
    }

    preload() {

        this.load.json('levelData', '/assets/json/levels.json');
    }

    create() {
        this.levelData = this.cache.json.get('levelData');
        this.createPlatforms();
        this.createTiledDecorations();
        this.createPortals();
        this.createControls();
    }

    update() {

        if (this.bruce) {
            this.bruce.update();
        }
    }

    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    /**
     * Register collision detection for sprites
     */
    createColliders() {
        this.physics.add.collider(this.bruce, [this.platforms]);
    }

    /**
     * Create the opening and closing portals which begin and end the level.
     */
    createPortals() {
        let startPortal =  new PortalSprite({
            scene: this,
            x: this.levelData.start.x,
            y: this.levelData.start.y,
            textureKey: Textures.SPRITE_ATLAS_ID,
            frameKey: Textures.SPRITES.PORTAL + '0.png'
        });

        startPortal.anims.play(Animations.PORTAL);
        startPortal.setScale(0.25);

        startPortal.invokeLevelStartTween(() => {
            this.createBruce();
            this.createColliders();
        });
    }

    /**
     * Create the Bruce sprite (main cahaaracter)  Uses the level start settings.
     */
    createBruce() {

        this.bruce = new BruceSprite({
            scene: this,
            x: this.levelData.start.x,
            y: this.levelData.start.y,
            textureKey: Textures.SPRITE_ATLAS_ID,
            frameKey: Textures.SPRITES.BRUCE + '0.png'
        });

        console.log('Creating Bruce');
        console.log(this);

        this.physics.add.existing(this.bruce);
        this.bruce.setScale(3);
        this.bruce.depth = 1000;
        this.bruce.body.setCollideWorldBounds(true);

    }

    /**
     * Cycle through the platforms from the level configuration file.  Generate and
     * configure the sprites, bodies and add them to a group for platforms.
     */
    createPlatforms() {

        this.platforms = this.physics.add.staticGroup();
        const platformConfigs = this.levelData.platforms;

        // Introduce every platform from the level config into the physics and sprite engines.
        platformConfigs.forEach((config) => {

            let platformData = this.getPlatformData(config);

            PlatformUtility.generate(this, this.platforms, platformData)
        });
    }

    /**
     * Cycle through the decorations from the level configuration file.  Generate
     * and configure the sprites, and add them to a group for decorations.
     */
    createTiledDecorations() {
        this.tiledDecorations = this.add.group();
        const tiledDecorationConfigs = this.levelData.tiledDecoration;

        tiledDecorationConfigs.forEach((config) => {

            let decorationData = this.getTiledDecorationData(config);

            TiledDecorationUtility.generate(this, this.tiledDecorations, decorationData);
            console.log(this.tiledDecorations);
        });
    }

    /**
     * Accrue data about a given platform and generate the data object
     *
     * @param platformConfig  object  The config settings for the given platform
     *
     * @return {PlatformData}
     */
    getPlatformData(platformConfig) {
        let platformData = new PlatformData();

        // Work out the dimensions of the left, center, and right tile platforms (we draw left, center, and middle tiles)
        // @TODO
        // (I cheated down here, setting the width explicitly to 16 px.  They should be coming from textures, but because
        // I'm loading the map tiles from a multiatlas, I don't know how to get at the source dimensions in any reasonable way, for now.
        platformData.dimensions.width = 16;
        platformData.dimensions.height = 16;

        platformData.origin.x = platformConfig.x;
        platformData.origin.y = platformConfig.y;

        platformData.numberOfTiles = platformConfig.numTiles;

        platformData.frameKey = platformConfig.key;

        platformData.scale = this.levelData.platformScale;

        return platformData;
    }

    /**
     * Accrue data about a given tile decoration and generate the data object
     *
     * @param platformConfig  object  The config settings for the given platform
     *
     * @return {TiledDecorationData}
     */
    getTiledDecorationData(decorationConfig) {

         let tiledDecorationData = new TiledDecorationData();

         tiledDecorationData.dimensions.width = 16;
         tiledDecorationData.dimensions.height = 16;

         tiledDecorationData.origin.x = decorationConfig.x;
         tiledDecorationData.origin.y = decorationConfig.y;

         tiledDecorationData.tilesHigh = decorationConfig.numTilesHigh;
         tiledDecorationData.tilesWide = decorationConfig.numTilesWide;

         tiledDecorationData.frameKey = decorationConfig.key;

         tiledDecorationData.scale = this.levelData.platformScale;

         return tiledDecorationData;
    }
};
