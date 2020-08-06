class PathFinder {
    constructor(nodes, stack) {
        this.nodes = nodes;
        this.stack = stack;
        this.queue = [];
    }

    depthFirstSearch(node, mazeType) {
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                node.setVisited(true);
                node.setBackground(NODE_COLOR_VISITED);
                let nextNode = this.findUnvisitedNode(node, mazeType, false, false);

                if(nextNode == null) {
                    let n = this.stack.pop();
                    if(n !== undefined)
                    n.setBackground(NODE_COLOR_HIGHLIGHT);
                    node.setBackground(NODE_COLOR_HIGHLIGHT);
                    resolve(false);
                    return;
                }

                this.stack.push(node);

                if(nextNode.isDestination) {
                    resolve(this.stack);
                    return;
                }

                this.depthFirstSearch(nextNode, mazeType).then((res) => {
                    if(res == false) {
                        resolve(this.depthFirstSearch(node, mazeType));
                        return;
                    } else {
                        resolve(this.stack);
                        return;
                    }
                });
            }, 10);
        });

        return promise;
    }

    findUnvisitedNode(node, mazeType = MAZE_BLOCK, returnAll = false, allowDiagonal = false) {
        let dy = [-1, 1,  0, 0];
        let dx = [ 0, 0, -1, 1];

        if(allowDiagonal) {
            dy = dy.concat([-1, -1,  1, 1]);
            dx = dx.concat([-1,  1, -1, 1]);
        }

        let freeNodes = [];

        for (var i = 0; i < dy.length; i++) {
            // Avoid out of bounds error
            if((node.x + dx[i] < 0 || node.y + dy[i] < 0)
            || (node.x + dx[i] > this.nodes[0].length-1 ||
                node.y + dy[i] > this.nodes.length-1))
                continue;

            let tempNode = this.nodes[node.y + dy[i]][node.x + dx[i]];

            if(tempNode.isVisited() == false) {
                if(mazeType != MAZE_STANDARD)
                    freeNodes.push(tempNode);

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

        if(returnAll)
            return freeNodes;

        let index = Math.floor(Math.random() * freeNodes.length);
        return freeNodes[index];
    }

    breadthFirstSearch(node, mazeType) {
        let backtrackNode = null;
        this.queue.push(node);
        let childNodes = null;

        //while(this.queue.length > 0) {
        let searchLoop = setInterval(() => {
            if(this.queue.length == 0) {
                clearInterval(searchLoop);
            }

            node = this.queue[0];
            node.setVisited(true);
            node.setBackground(NODE_COLOR_VISITED);

            childNodes = this.findUnvisitedNode(node, mazeType, true, false);

            if(childNodes == null) {
                this.queue.shift();
                return;
            }

            for (var i = 0; i < childNodes.length; i++) {
                if(childNodes[i].hasParent() == false) {
                    childNodes[i].setParent(node);

                    if (childNodes[i].isDestination) {
                        backtrackNode = childNodes[i];

                        let parentNode = backtrackNode.getParent();

                        let backTrackInterval = setInterval(() => {
                            parentNode.setBackground(NODE_COLOR_PATH);
                            parentNode = parentNode.getParent();
                            if(parentNode == null)
                                clearInterval(backTrackInterval);
                        }, 10);

                        clearInterval(searchLoop);
                        return;
                    }

                    childNodes[i].setBackground(NODE_COLOR_INQUEUE)
                    this.queue.push(childNodes[i]);
                }
            }

            // destination node found, exit loop.
            if(backtrackNode != null)
                return;

            this.queue.shift();
        }, 10);
    }

    aStarSearch(startNode, endNode) {

        // create an open list
        let open = [];

        // movement costs
        const diagonalCost = 14; // sqrt(2) * 10
        const normalCost   = 10; // sqrt(1) * 10

        // add starting node to the open queue
        open.push(startNode);

        // start the search
        let aStarLoop = setInterval(() => {

            // when the list is empty, stop
            if(open.length == 0) {
                print("finished");
                clearInterval(aStarLoop);
                return;
            }

            // find smallest F cost
            let smallestFCost = 0;
            for (var i = 0; i < open.length; i++) {
                if(open[i].getCostF() < open[smallestFCost].getCostF())
                    smallestFCost = i;
            }

            // fetch and mark current node.
            let node = open[smallestFCost]; // open.shift();
            node.setVisited(true);
            node.setBackground(NODE_COLOR_VISITED);

            // Remove current node from openList
            for (var i = open.length-1; i >= 0; i--) {
                if(node.equalTo(open[i])) {
                    open.splice(i, 1);
                    break;
                }
            }

            // fetch adjacent nodes
            let adjacentNodes = this.findUnvisitedNode(node, MAZE_BLOCK, true, false);
            if (adjacentNodes == null)
                return;

            // process adjacent nodes
            for (let i = 0; i < adjacentNodes.length; i++) {
                let adjacentNode = adjacentNodes[i];
                let moveCost = (adjacentNode.isDiagonalTo(node) ? diagonalCost : normalCost);

                if(adjacentNode.hasParent() === false) {

                    // Destination node reached ?
                    if(adjacentNode.equalTo(endNode)) {
                        endNode.setParent(node);
                        open = [];

                        // backtrack to start node
                        let parentNode = endNode.getParent();
                        let backTrackInterval = setInterval(() => {
                            parentNode.setBackground(NODE_COLOR_PATH);
                            parentNode = parentNode.getParent();

                            if(parentNode == null)
                                clearInterval(backTrackInterval);

                        }, 10);

                        clearInterval(aStarLoop);
                        return;
                    }

                    adjacentNode.setParent(node);
                    adjacentNode.setCostG(node.getCostG() + moveCost);

                    adjacentNode.setCostH(
                        moveCost
                      * (Math.abs(endNode.x - adjacentNode.x)
                      + Math.abs(endNode.y - adjacentNode.y))
                    );
                    adjacentNode.setBackground(NODE_COLOR_INQUEUE);

                    //open.addSorted(adjacentNode);
                    open.push(adjacentNode);
                } else {

                    // If moving from the current node to the next adjacent node ..
                    // costs more than it would when moving from the starting node.
                    // then we should look for another adjacent node.
                    if(node.getCostG() + moveCost >= adjacentNode.getCostG())
                        return;

                    // Otherwise update the node to become a 'child-node' ..
                    // of the current node and recalculate G[, H values]
                    adjacentNode.setParent(node);
                    adjacentNode.setCostG(node.getCostG() + moveCost);
                }
            }


        }, 10);
    }

    dijkstraSearch() {}

}
