const Area = require('../Util/Area.class');
const Point = require('../Util/Point.class');

module.exports =
    class TiledDecorationData {

        constructor() {

            this.dimensions = new Area();

            this.origin = new Point();

            this.tilesWide = null;
            this.tilesHigh = null;

            this.frameKey = "";

            this.scale = 1;
        }
    };