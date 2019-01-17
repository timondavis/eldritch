const Textures = require('../Textures.enum');
const PlatformData = require('../Tile/PlatformData.class.js');
const PlatformTile = require('../Tile/Platform.tile.js');
const Phaser = require('phaser');

module.exports =
class PlatformScene extends Phaser.Scene {

    init() {

        this.platforms = null;

        // Level data from JSON import
        this.levelData = null;
    }

    preload() {

        this.load.json('levelData', '/assets/json/levels.json');
    }

    create() {
        this.levelData = this.cache.json.get('levelData');
        this.createPlatforms();
    }

    update() {
    }

    createPlatforms() {

        this.platforms = this.physics.add.staticGroup();

        const platformConfigs = this.levelData.platforms;
        const platformScale = this.levelData.platformScale;

        // Introduce every platform from the level config into the physics and sprite engines.
        platformConfigs.forEach((config) => {

            let platformData = PlatformScene.getPlatformData(config);
            let chunk = null;


            if (platformData.numberOfTiles >= 3) {
                for( let i = 0 ; i < platformData.numberOfTiles ; i++ ){

                    switch(i) {
                        // Left Tile
                        case 0: {
                            chunk = new PlatformTile({
                                scene: this,
                                x: platformData.origin.x,
                                y: platformData.origin.y,
                                width: platformData.dimensions.left.width,
                                height: platformData.dimensions.left.height,
                                textureKey: Textures.SPRITE_ATLAS_ID,
                                frameKey: Textures.TILES[platformData.frameKey].LEFT
                            });

                            chunk.setScale(platformScale);
                            this.platforms.add(chunk);
                            chunk.body.updateFromGameObject();
                            chunk.body.setSize(chunk.body.width, chunk.body.height - 4 * platformScale);
                            chunk.body.y += 2 * platformScale;
                            break;
                        }

                        // Right Tile
                        case (platformData.numberOfTiles - 1): {
                            chunk = new PlatformTile({
                                scene: this,
                                x: platformData.origin.x +  platformData.dimensions.right.width * (i * platformScale),
                                y: platformData.origin.y,
                                width: platformData.dimensions.right.width,
                                height: platformData.dimensions.right.height,
                                textureKey: Textures.SPRITE_ATLAS_ID,
                                frameKey: Textures.TILES[platformData.frameKey].RIGHT
                            });

                            chunk.setScale(platformScale);
                            this.platforms.add(chunk);
                            chunk.body.updateFromGameObject();
                            chunk.body.setSize(chunk.body.width, chunk.body.height - 4 * platformScale);
                            chunk.body.y += 2 * platformScale;
                            break;
                        }

                        // Center
                        default: {

                            chunk.setScale(platformScale);
                            chunk = new PlatformTile({
                                scene: this,
                                x: platformData.origin.x +  platformData.dimensions.center.width * (i * platformScale),
                                y: platformData.origin.y,
                                width: platformData.dimensions.center.width,
                                height: platformData.dimensions.center.height,
                                textureKey: Textures.SPRITE_ATLAS_ID,
                                frameKey: Textures.TILES[platformData.frameKey].CENTER
                            });

                            chunk.setScale(platformScale);
                            this.platforms.add(chunk);
                            chunk.body.updateFromGameObject();
                            chunk.body.setSize(chunk.body.width, chunk.body.height - 4 * platformScale);
                            chunk.body.y += 2 * platformScale;
                        }
                    }
                }
            }
        });
    }

    /**
     * Accrue data about a given platform and generate the dimensions object
     *
     * @param platformConfig  object  The config settings for the given platform
     *
     * @return {PlatformData}
     */
    static getPlatformData(platformConfig) {
        let platformData = new PlatformData();

        // Work out the dimensions of the left, center, and right tile platforms (we draw left, center, and middle tiles)
        // (I cheated down here, setting the width explicitly to 16 px.  They should be coming from textures, but because
        // I'm loading the map tiles from a multiatlas, I don't know how to get at the source dimensions in any reasonable way, for now.
        platformData.dimensions.left.width = 16;
        platformData.dimensions.left.height = 16;
        platformData.dimensions.center.width = 16;
        platformData.dimensions.center.height = 16;
        platformData.dimensions.right.width = 16;
        platformData.dimensions.right.height = 16;

        platformData.origin.x = platformConfig.x;
        platformData.origin.y = platformConfig.y;

        platformData.numberOfTiles = platformConfig.numTiles;

        platformData.frameKey = platformConfig.key;

        return platformData;
    }
};
