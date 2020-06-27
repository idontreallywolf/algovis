class PathFinder {
    constructor(nodes, stack) {
        this.nodes = nodes;
        this.stack = stack;
    }

    depthFirstSearch(node, mazeType) {
        node.setVisited(true);
        let nextNode = this.findUnvisitedNode(node, mazeType);

        if(nextNode == null) {
            let n = this.stack.pop();
            n.setBackground(NODE_COLOR_HIGHLIGHT);
            node.setBackground(NODE_COLOR_HIGHLIGHT)
            return false;
        }

        this.stack.push(node);

        if(nextNode.isDestination)
            return this.stack;

        if(this.depthFirstSearch(nextNode, mazeType) == false) {
            return this.depthFirstSearch(node, mazeType);
        } else {
            return this.stack;
        }
    }

    findUnvisitedNode(node, mazeType) {
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

            if(tempNode.isVisited() == false) {
                if(mazeType == MAZE_BLOCK) {
                    freeNodes.push(tempNode);
                    continue;
                }

                if(mazeType == MAZE_STANDARD) {
                    if(tempNode.y < node.y) {
                        if(node.edges.top == false && tempNode.edges.bottom == false) {
                            freeNodes.push(tempNode);
                            continue;
                        }
                    // DOWN
                    } else if(tempNode.y > node.y) {
                        if(node.edges.bottom == false && tempNode.edges.top == false){
                            freeNodes.push(tempNode);
                            continue;
                        }
                    }

                    // LEFT
                    if(tempNode.x < node.x) {
                        if(node.edges.left == false && tempNode.edges.right == false) {
                            freeNodes.push(tempNode);
                            continue;
                        }
                    }

                    // RIGHT
                    else if(tempNode.x > node.x) {
                        if(node.edges.right == false && tempNode.edges.left == false) {
                            freeNodes.push(tempNode);
                            continue;
                        }
                    }
                }
            }
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
