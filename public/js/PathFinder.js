class PathFinder {
    constructor(nodes, stack) {
        this.nodes = nodes;
        this.stack = stack;
    }

    depthFirstSearch(node) {
        node.setVisited(true);
        let nextNode = this.findUnvisitedNode(node);

        if(nextNode == null) {
            let n = this.stack.pop();
            n.setBackground(NODE_COLOR_HIGHLIGHT);
            node.setBackground(NODE_COLOR_HIGHLIGHT)
            return false;
        }

        this.stack.push(node);

        if(nextNode.isDestination)
            return this.stack;

        if(this.depthFirstSearch(nextNode) == false) {
            return this.depthFirstSearch(node);
        } else {
            return this.stack;
        }
    }

    findUnvisitedNode(node) {
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

            if(tempNode.isVisited() == false)
                freeNodes.push(tempNode);
        }

        if (freeNodes.length == 0)
            return null;

        let index = Math.floor(Math.random() * freeNodes.length);
        return freeNodes[index];
    }

    testFindUnvisitedNode() {
        let grid = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ]

        let x = 3;
        let y = 3;
        let node = grid[y][x];

        let dy = [-1, 1,  0, 0];
        let dx = [ 0, 0, -1, 1];

        let freeNodes = [];

        for (var i = 0; i < dy.length; i++) {
            if((x + dx[i] < 0 || x + dx[i] > grid[0].length-1)
            || (y + dy[i] < 0 || y + dy[i] > grid.length-1))
                continue;

            if(grid[y+dy[i]][x+dx[i]] == 0)
                freeNodes.push({x: x+dx[i], y: y+dy[i]});
        }

        if (freeNodes.length == 0) {
            return null;
        }

        let index = Math.floor(Math.random() * freeNodes.length);
        return freeNodes[index];
    }

    breadthFirstSearch() {}
    aStarSearch() {}
    dijkstraSearch() {}

}
