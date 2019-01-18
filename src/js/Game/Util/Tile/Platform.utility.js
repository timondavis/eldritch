const Textures = require('../../Textures.enum');
const iTileUtility = require('./iTile.utility');
const PlatformTile = require('../../Tile/Platform.tile');

module.exports =
class PlatformUtility extends iTileUtility {

    /**
     * Generate a platform onto the given scene, apply to the given group,
     * and apply the data provided in its creation.
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Group} group
     * @param {PlatformData} data
     */
    static generate(scene, group, data) {

        let x;
        let y;
        let width;
        let height;
        let frame;

        const texture = Textures.SPRITE_ATLAS_ID;
        const frameDefs = Textures.TILES[data.frameKey];
        const platformScale = data.scale;

        if (data.numberOfTiles >= 2) {
            for (let i = 0; i < data.numberOfTiles; i++) {

                switch (i) {
                    // Left Tile
                    case 0: {
                        x = data.origin.x;
                        y = data.origin.y;
                        width = data.dimensions.width;
                        height = data.dimensions.height;
                        frame = frameDefs.LEFT;

                        break;
                    }

                    // Right Tile
                    case (data.numberOfTiles - 1): {
                        x = data.origin.x + data.dimensions.width * (i * platformScale);
                        y = data.origin.y;
                        width = data.dimensions.width;
                        height = data.dimensions.height;
                        frame = frameDefs.RIGHT;

                        break;
                    }

                    // Center.  Case won't be hit in scenarios with two tiles, above will
                    // take precedence before counter is incremented
                    case 1: {
                        x = data.origin.x + data.dimensions.width * (i * platformScale);
                        y = data.origin.y;
                        width = data.dimensions.width * (data.numberOfTiles - 2);
                        height = data.dimensions.height;
                        frame = frameDefs.CENTER;

                        break;
                    }

                    default: break;
                }

                let chunk = new PlatformTile({
                    scene: scene, x: x, y: y, width: width, height: height, textureKey: texture, frameKey: frame
                });

                chunk.depth = 1000;
                chunk.setScale(platformScale);
                chunk.setOrigin(0);
                group.add(chunk);
                chunk.body.updateFromGameObject();
                chunk.body.setSize(chunk.body.width, chunk.body.height - 4 * platformScale);
                chunk.body.y += 2 * platformScale;
            }
        }
    }
};