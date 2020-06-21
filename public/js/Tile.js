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
        this.isDestination = false;
        this.bg = (isObstacle ? NODE_COLOR_OBSTACLE : NODE_COLOR_EMPTY);
    }

    /**
        @param {bool} bool - True if this node should be an obstacle, otherwise false.
    */
    makeObstacle(bool) {
        this.isObstacle = bool;
        this.setBackground(bool ? NODE_COLOR_OBSTACLE : NODE_COLOR_EMPTY);
    }

    makeDestination(bool) {
        if(!bool) {
            if(this.isDestination)
                this.isDestination = false;

            this.setBackground(NODE_COLOR_EMPTY);
            return;
        }

        if(this.isObstacle)
            this.makeObstacle(false);
            
        this.isDestination = true;
        this.setBackground(NODE_COLOR_DESTINATION);
    }

    setBackground(newBg) {
        this.bg = newBg;
    }
}
