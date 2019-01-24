const Textures = require('../Textures.enum');
const Animations = require('../Animations.enum');

const TiledDecorationData = require('../Tile/TiledDecorationData.class');
const PlatformData = require('../Tile/PlatformData.class.js');

const PlatformUtility = require('../Util/Tile/Platform.utility.js');
const TiledDecorationUtility = require('../Util/Tile/TiledDecoration.utility');

const BruceSprite = require('../Sprite/Bruce.sprite');
const PortalSprite = require('../Sprite/Portal.sprite');
const SquidSprite = require('../Sprite/Squid.sprite');
const DecorationSprite = require('../Sprite/Decoration.sprite.js');
const FanaticSprite = require('../Sprite/Fanatic.sprite');
const FlametrapSprite = require('../Sprite/Flametrap.sprite');

const Phaser = require('phaser');

module.exports =
class PlatformScene extends Phaser.Scene {

    init() {

        // Phyics/Sprite body groups
        this.platforms = null;
        this.monsters = null;
        this.decorations = null;

        // Level data from JSON import
        this.levelData = null;

        // The cursor key inputs
        this.cursors = null;

        // the hero (sprite)
        this.bruce = null;

        // Goal for the level
        this.goal = null;

        // Has the level been cleared?
        this.levelCleared = false;

        // Has Bruce been killed?
        this.bruceKilled = false;

        this.fireballs = this.physics.add.group({
            allowGravity: false
        });

        this.traps = this.physics.add.staticGroup({});

    }

    preload() {

        this.load.json('levelData', '/assets/json/levels.json');
    }

    create() {
        this.levelData = this.cache.json.get('levelData');
        this.createPlatforms();
        this.createTiledDecorations();
        this.createDecorations();
        this.createPortals();
        this.createControls();
    }

    update() {

        if (this.bruce && !this.levelCleared) {
            this.bruce.update();
        }

        if (this.monsters) {
            this.monsters.getChildren().forEach((monster) => {
                monster.update();
            });
        }
    }

    /**
     * Activites to be executed when a level is successfully cleared.
     */
    clearLevel() {
        console.log('level cleared');
        this.levelCleared = true;
    }

    /**
     * Bruce messed up.  Kill him.
     */
    killBruce() {
        console.log('bruce killed');
        this.bruceKilled = true;

        this.cameras.main.shake(250);
        this.cameras.main.on('camerashakecomplete', () => {

            this.cameras.main.fade(500);
            this.cameras.main.on('camerafadeoutcomplete', () => {
                this.scene.restart();
            });
        });
    }

    /**
     * Create the controls which will be bound to inputs
     */
    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    /**
     * Register collision detection for sprites
     */
    createColliders() {
        this.physics.add.collider([this.bruce, this.monsters], [this.platforms]);
    }

    /**
     * Register sprite overlap handlers
     */
    createOverlaps() {
        this.physics.add.overlap(this.bruce, [this.monsters, this.fireballs], () => {
            this.killBruce();
        });
        this.physics.add.overlap(this.bruce, [this.traps], (bruce, trap) => {

           if (trap.flames) {
               this.killBruce();
           }
        });
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
            this.createMonsters();
            this.createTraps();
            this.createColliders();
            this.createOverlaps();
        });
    }

    /**
     * Create traps
     */
    createTraps() {
        let trapConfigs = this.levelData.traps;

        trapConfigs.forEach((trap) => {

            let sprite = new FlametrapSprite({
                scene: this,
                x: trap.x, y: trap.y,
                textureKey: Textures.SPRITE_ATLAS_ID,
                frameKey: Textures.SPRITES.FLAMETRAP + '0.png'
            });
            this.traps.add(sprite);
            sprite.depth = 900;
            sprite.setScale(3);
            sprite.init(trap);

        });
    }

    /**
     * Create the monsters in the level
     */
    createMonsters() {

        this.monsters = this.physics.add.group();

        this.createSquids();
        this.createFanatics();
    }

    createFanatics() {

        let fanatics = this.levelData.monsters.fanatics;

        fanatics.forEach((fanatic) => {
            const sprite = new FanaticSprite({
                scene: this,
                x: fanatic.x1, x2: fanatic.x2, y: fanatic.y,
                textureKey: Textures.SPRITE_ATLAS_ID, frameKey: Textures.SPRITES.FANATIC + '0.png'
            });

            sprite.init();
        });
    }

    /**
     * Create squid monsters.
     */
    createSquids() {

        let squids = this.levelData.monsters.squids;

        squids.forEach((squid) => {
            const sprite = new SquidSprite({ scene: this,
                x: squid.x1, y: squid.y1,
                textureKey: Textures.SPRITE_ATLAS_ID, frameKey: Textures.SPRITES.SQUID + '0.png'
            });

            sprite.init(squid);
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
        });
    }

    /**
     * Cycle through and draw stamp-tile decorations
     */
    createDecorations() {
        this.decorations = this.add.group();
        let configs = this.levelData.decorations;

        configs.forEach((decoration) => {

            let sprite = new DecorationSprite({
              scene: this,
              x: decoration.x,
              y: decoration.y,
              textureKey: Textures.SPRITE_ATLAS_ID,
              frameKey: Textures.STAMPS[decoration.key]
            });

            this.decorations.add(sprite);
            sprite.setScale(3);
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
