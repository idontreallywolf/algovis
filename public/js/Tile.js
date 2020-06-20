class Tile {
    /**
        @param {Number} width
        @param {Number} height
        @param {Number} x
        @param {Number} y
        @param {bool}   isObstacle
    */
    constructor(width, height, isObstacle) {
        this.width = width;
        this.height = height;
        this.isObstacle = isObstacle;
        this.bg = (isObstacle ? "#000":"#fff");
    }

    /**
        @param {bool} bool - True if this node should be an obstacle, otherwise false.
    */
    makeObstacle(bool) {
        this.isObstacle = bool;
        this.setBackground(bool ? "#000":"#fff");
    }

    setBackground(newBg) {
        this.bg = newBg;
    }
}
