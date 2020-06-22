class Tile {
    /**
        @param {Number} size
        @param {Number} x
        @param {Number} y
        @param {bool}   isObstacle
    */
    constructor(id, x, y, isObstacle) {
        this.id = id;
        this.width = TILESIZE;
        this.height = TILESIZE;
        this.x = x;
        this.y = y;
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

    makeEmpty() {
        if(this.isDestination)
            this.isDestination = false;

        if(this.isObstacle)
            this.isObstacle = false;

        this.setBackground(NODE_COLOR_EMPTY);
    }

    isEmpty() {
        return !this.isObstacle && !this.isDestination;
    }

    setBackground(newBg) {
        this.bg = newBg;
    }

    equalTo(otherNode) {
        return (this.id == otherNode.id);
    }
}
