module.exports =
class Area {

    constructor(width, height) {
        width: (width) ? width : 0;
        height: (height) ? height : 0;
    }

    /**
     * Express the area as a single number (w * h)
     *
     * @returns {number}
     */
    area() {
        return width * height;
    }
};