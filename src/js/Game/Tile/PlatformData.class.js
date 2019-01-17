const Area = require('../Util/Area.class');
const Point = require('../Util/Point.class');

module.exports =
class PlatformData {

    constructor() {

        this.dimensions = {
            left: new Area(),
            right: new Area(),
            center: new Area()
        };

        this.origin = new Point();

        this.numberOfTiles = null;

        this.frameKey = "";
    }
};