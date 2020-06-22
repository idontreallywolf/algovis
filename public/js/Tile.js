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

        this.gridPos = {
            x: x * TILESIZE,
            y: y * TILESIZE
        };

        this.isObstacle = isObstacle;
        this.isDestination = false;
        this.bg = (isObstacle ? NODE_COLOR_OBSTACLE : NODE_COLOR_EMPTY);
    }

    drawEdges(ctx) {
        ctx.beginPath();

        // left
        ctx.moveTo(this.gridPos.x, this.gridPos.y);
        ctx.lineTo(this.gridPos.x, this.gridPos.y + this.height);

        // right
        ctx.moveTo(this.gridPos.x + this.width, this.gridPos.y);
        ctx.lineTo(this.gridPos.x + this.width, this.gridPos.y + this.height);

        // top
        ctx.moveTo(this.gridPos.x, this.gridPos.y);
        ctx.lineTo(this.gridPos.x + this.width, this.gridPos.y);

        // bottom
        ctx.moveTo(this.gridPos.x, this.gridPos.y + this.height);
        ctx.lineTo(this.gridPos.x + this.width, this.gridPos.y + this.height);

        ctx.strokeStyle = "#ffa801";
        ctx.stroke();
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
