module.exports =
class Point {

    constructor(x, y) {
       this.x = (x)? x: 0;
       this.y = (y)? y: 0;
    }

    /**
     * Get the distance from the given point to this point (expressed with subtraction (param point - host point)
     *
     * @param point
     * @returns {module.Point}
     */
    relativeTo(point) {
        return new Point(point.x - this.x, point.y - this.y);
    }
};