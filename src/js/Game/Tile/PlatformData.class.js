const Area = require('../Util/Area.class');
const Point = require('../Util/Point.class');

module.exports =
class PlatformData {

    constructor() {

        this.dimensions =  new Point();

        this.origin = new Point();

        this.numberOfTiles = null;

        this.frameKey = "";

        this.scale = 1;
    }
};