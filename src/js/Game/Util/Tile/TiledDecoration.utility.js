const iTileUtility = require('./iTile.utility');
const Textures = require('../../Textures.enum');
const TiledDecorationTile = require('../../Tile/TiledDecoration.tile');
const Point = require('../Point.class');
const Area = require('../Area.class');
module.exports =
class TiledDecorationUtility extends iTileUtility {

    /**
     * Generate a decoration tileset onto the given scene, apply to the given group,
     * and apply the data provided in its creation.
     *
     * @param {Phaser.Scene} scene
     * @param {Phaser.GameObjects.Group} group
     * @param {TiledDecorationData} data
     */
    static generate(scene, group, data) {

        console.log(data);
        const texture = Textures.SPRITE_ATLAS_ID;
        const frameDefs = Textures.TILES[data.frameKey];
        const scale = data.scale;

        let chunk;

        let topPoint = new Point();
        let bottomPoint = new Point();
        let topArea = new Area();
        let bottomArea = new Area();
        let topFrame;
        let bottomFrame;

        // Loop through each tile and draw it.  We're drawing large rectangles for the
        // left, center, and outside
        for (let w = 0 ; w < data.tilesWide ; w++ ) {
            bottomPoint.x = topPoint.x = data.origin.x + (w * data.dimensions.width);
            topPoint.y = data.origin.y;
            bottomPoint.y =
                data.origin.y + ((data.tilesHigh - 1) * data.dimensions.height * scale),

            bottomArea.width = topArea.width = data.dimensions.width;
            topArea.height = (data.tilesHigh - 1) * data.dimensions.height;
            bottomArea.height = data.dimensions.height;
            topFrame = frameDefs.CENTER;

            switch(w) {

                // Left
                case(0): {
                    topFrame = frameDefs.TOP_LEFT;
                    bottomFrame = frameDefs.BOTTOM_LEFT;
                    bottomPoint.x -= (data.dimensions.width * scale)
                    break;
                }

                // Right
                case(data.tilesWide - 1): {

                    topFrame = frameDefs.TOP_RIGHT;
                    bottomFrame = frameDefs.BOTTOM_RIGHT;
                    bottomPoint.x = topPoint.x = data.origin.x + ((data.tilesWide - 1) * data.dimensions.width * scale);
                    break;
                }

                case(1): {

                    topFrame = bottomFrame = frameDefs.CENTER;
                    topArea.width = (data.tilesWide - 2) * data.dimensions.width;
                    topPoint.x = data.origin.x + (data.dimensions.width * scale);
                    bottomPoint.x = topPoint.x - (data.dimensions.width * scale);
                    bottomArea.width = topArea.width + (data.dimensions.width);
                    break;
                }

                default: continue;
            }

            if (data.tilesHigh > 1) {
                chunk = new TiledDecorationTile({
                    scene: scene,
                    x: topPoint.x, y: topPoint.y,
                    width: topArea.width, height: topArea.height,
                    textureKey: texture, frameKey: topFrame
                });

                chunk.setScale(scale);
                chunk.setOrigin(0);

                chunk.depth = 100;
                group.add(chunk);
            }

            chunk = new TiledDecorationTile({
                scene: scene,
                x: bottomPoint.x, y: bottomPoint.y,
                width: bottomArea.width, height: bottomArea.height,
                textureKey: texture, frameKey: bottomFrame
            });

            chunk.setScale(scale);
            chunk.setOrigin(0);
            chunk.depth = 100;
            group.add(chunk);
        }
    }
};