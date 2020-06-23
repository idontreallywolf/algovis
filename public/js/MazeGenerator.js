/**
    @Author idontreallywolf
    Standard & Block - maze(s) are generated using DFS Algorithm.
*/
class MazeGenerator {

    /**
        @param nodes - 2D array containing nodes
        @param type - maze type ( MAZE_STANDARD | MAZE_BLOCK .. )
    */
    constructor(nodes, type) {
        this.nodes = nodes;

        switch(type) {
            case MAZE_STANDARD: this.generateStandardMaze(); break;
            case MAZE_BLOCK:    this.generateBlockMaze();    break;

            default: console.log("MAZE ERROR: Unknown type '" + type + "'"); break;
        }
    }

    /**
        STANDARD MAZE GENERATION
    */

    /**
        @param node - the node where the generation should start.
        @return
    */
    generateStandardMaze(node = this.nodes[0][0]) {
        node.setVisited(true);

        let nextNode = this.findUnvisitedNode(node);

        // No available nodes.
        if (nextNode == null) return false;

        // UP
        if(nextNode.y < node.y) {
            node.edges.top = false;
            nextNode.edges.bottom = false;

        // DOWN
        } else if(nextNode.y > node.y) {
            node.edges.bottom = false;
            nextNode.edges.top = false;
        }

        // LEFT
        if(nextNode.x < node.x) {
            node.edges.left = false;
            nextNode.edges.right = false;
        }

        // RIGHT
        else if(nextNode.x > node.x) {
            node.edges.right = false;
            nextNode.edges.left = false;
        }

        if (this.generateStandardMaze(nextNode) == false) {
            return this.generateStandardMaze(nextNode);
        } else {
            return true;
        }
    }

    findUnvisitedNode(node, blockWalls = false) {
        let dy = [-1, 1,  0, 0];
        let dx = [ 0, 0, -1, 1];

        let freeNodes = [];

        for (var i = 0; i < dy.length; i++) {
            // Avoid out of bounds error
            if((node.x + dx[i] < 0 || node.y + dy[i] < 0)
            || (node.x + dx[i] > this.nodes[0].length-1 ||
                node.y + dy[i] > this.nodes.length-1))
                continue;

            let tempNode = this.nodes[node.y + dy[i]][node.x + dx[i]];

            // save available nodes
            if(blockWalls == false) {
                if (tempNode.isVisited() == false)
                    freeNodes.push(tempNode);

                continue;
            }

            if(tempNode.isEmpty() || tempNode.isVisited()) {
                continue;
            }

            if (this.isWallUsed(node, tempNode) == false) {
                freeNodes.push(tempNode);
            }
        }

        if (freeNodes.length == 0)
            return null;

        // return random node from freeNodes array
        let index = Math.floor(Math.random() * freeNodes.length);
        return freeNodes[index];
    }

    /**
        BLOCK MAZE GENERATION
    */

    generateBlockMaze(node = this.nodes[0][0]) {
        node.setVisited(true);
        node.makeEmpty();

        let nextNode = this.findUnvisitedNode(node, true);
        if(nextNode == null) return false;

        // create next path
        nextNode.makeEmpty();

        if(this.generateBlockMaze(nextNode) == false) {
            return this.generateBlockMaze(nextNode);
        } else {
            return true;
        }
    }

    isWallUsed(callerNode, node) {

        let nextX = 0;
        let nextY = 0;
        let xSame = false;
        let ySame = false;

        // check +1 in the direction we're heading
        if(callerNode.x < node.x) {         // going right
            nextX = 1;
        } else if(callerNode.x > node.x) {  // going left
            nextX = -1;
        } else {
            xSame = true;
        }

        if(callerNode.y < node.y) {         // going down
            nextY = 1;
        } else if(callerNode.y > node.y) {  // going up
            nextY = -1;
        } else {
            ySame = true;
        }

        if(xSame) {
            if((nextY > 0 && (node.y + nextY > this.nodes.length-1))
            || (nextY < 0 && (node.y + nextY < 0)))
                nextY = 0;

            if(node.x > 0)
                if(this.nodes[node.y + nextY][node.x - 1].isVisited())
                    return true;

            if(node.x < this.nodes[0].length-1)
                if(this.nodes[node.y + nextY][node.x + 1].isVisited())
                    return true;

        } else if (ySame) {
            if((nextX > 0 && (node.x + nextX > this.nodes[0].length-1))
            || (nextX < 0 && (node.x + nextX < 0)))
                nextX = 0;

            if(node.y > 0)
                if(this.nodes[node.y - 1][node.x + nextX].isVisited())
                    return true

            if(node.y < this.nodes.length-1)
                if(this.nodes[node.y + 1][node.x + nextX].isVisited())
                    return true;
        }

        // if 2nd cell from our point towards current direction is visited
        // then we should not "break" the wall.
        //     <-
        // [ ][#][X]
        if(this.nodes[node.y + nextY][node.x + nextX].isVisited()) {
            return true;
        }

        // if there's no visited cell in the direction
        // scan for edges & corners
        let dy = [-1, 1,  0, 0];
        let dx = [ 0, 0, -1, 1];
        let adjacentPaths = 0;

        for (var i = 0; i < dy.length; i++) {

            // Avoid out of bounds error
            if((node.x + dx[i] < 0 || node.y + dy[i] < 0)
            || (node.x + dx[i] > this.nodes[0].length-1 ||
                node.y + dy[i] > this.nodes.length-1))
                continue;

            let tempNode = this.nodes[node.y + dy[i]][node.x + dx[i]];

            if(tempNode.isVisited())
                adjacentPaths++;
        }

        if(adjacentPaths > 1)
            return true;

        return false;
    }
}
