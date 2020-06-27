class Tile {
    /**
        @param {Number} size
        @param {Number} x
        @param {Number} y
        @param {bool}   isObstacle
    */
    constructor(id, x, y, isObstacle, tileSize) {
        // unique id
        this.id = id;

        this.parentNode = null;

        // dimensions
        this.width = tileSize;
        this.height = tileSize;

        // position in _nodes_ array
        this.x = x;
        this.y = y;

        // position on grid
        this.gridPos = {
            x: x * tileSize,
            y: y * tileSize
        };

        this.isObstacle = isObstacle;
        this.isDestination = false;
        this.bg = (isObstacle ? NODE_COLOR_OBSTACLE : NODE_COLOR_EMPTY);

        // all edges will be drawn
        // by default
        this.edges = {
            top: true,
            left: true,
            bottom: true,
            right: true
        }

        this.visited = false;
    }

    /**
        An edgy function, draws edges :<<
        @param ctx - canvas context (2D)
    */
    drawEdges(ctx) {
        ctx.beginPath();

        if(this.edges.left) {
            ctx.moveTo(this.gridPos.x, this.gridPos.y);
            ctx.lineTo(this.gridPos.x, this.gridPos.y + this.height);
        } else if(this.edges.right) {
            ctx.moveTo(this.gridPos.x + this.width, this.gridPos.y);
            ctx.lineTo(this.gridPos.x + this.width, this.gridPos.y + this.height);
        }

        if(this.edges.top) {
            ctx.moveTo(this.gridPos.x, this.gridPos.y);
            ctx.lineTo(this.gridPos.x + this.width, this.gridPos.y);
        } else if(this.edges.bottom) {
            ctx.moveTo(this.gridPos.x, this.gridPos.y + this.height);
            ctx.lineTo(this.gridPos.x + this.width, this.gridPos.y + this.height);
        }

        ctx.strokeStyle = "#000";
        ctx.stroke();
    }

    /**
        @param {bool} bool - True if this node should be an obstacle,
                             otherwise false.
    */
    makeObstacle(bool) {
        this.isObstacle = bool;
        this.setBackground(bool ? NODE_COLOR_OBSTACLE : NODE_COLOR_EMPTY);
    }

    /**
        @param {bool} bool - True if this node should be a target point,
                             otherwise false.
    */
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

    /**
        Converts node from [obstacle | destination] to an empty node.
    */
    makeEmpty() {
        if(this.isDestination)
            this.isDestination = false;

        if(this.isObstacle)
            this.isObstacle = false;

        this.setBackground(NODE_COLOR_EMPTY);
    }

    /**
        @return true, if node is neither obstacle nor destination point.
                Otherwise, false.
    */
    isEmpty() {
        return !this.isObstacle && !this.isDestination;
    }

    /**
        @param {String} newBg - background color to be used ( hex or rgb ).
    */
    setBackground(newBg) {
        this.bg = newBg;
    }

    /**
        Compares current node with given node, by their unique IDs
        @return true, if same id. otherwise false.
    */
    equalTo(otherNode) {
        return (this.id == otherNode.id);
    }

    isVisited() {
        if(this.visited)
            return true;

        return false;
    }

    setVisited(bool) {
        if(bool) {
            this.visited = true;
            return;
        }

        this.visited = false;
    }

    resetEdges() {
        this.edges.top    = true;
        this.edges.left   = true;
        this.edges.bottom = true;
        this.edges.right  = true;
    }

    hasParent() {
        return this.parentNode != null;
    }

    getParent() {
        return this.parentNode;
    }

    setParent(n) {
        this.parentNode = n;
    }
}
