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
        console.log(Math.abs(startNode.x - endNode.x), Math.abs(startNode.y - endNode.y));
        // animation animationSpeed ( ms )
        let animationSpeed = 1;

        let pq = new priorityQueue((a, b) => a.getCostF() - b.getCostF());

        // movement costs
        const diagonalCost = 14; // sqrt(2) * 10
        const normalCost   = 10; // sqrt(1) * 10
        let deltaX, deltaY;

        // add starting node to the open queue
        //open.push(startNode);
        pq.add(startNode);

        // start the search
        let aStarLoop = setInterval(() => {

            if(pq.size == 0) {
                clearInterval(aStarLoop);
                return;
            }

            let node = pq.remove();
            node.setVisited(true);
            node.setBackground(NODE_COLOR_VISITED);

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
                        //open = [];

                        // backtrack to start node
                        let parentNode = endNode.getParent();
                        let backTrackInterval = setInterval(() => {
                            parentNode.setBackground(NODE_COLOR_PATH);
                            parentNode = parentNode.getParent();

                            if(parentNode == null)
                                clearInterval(backTrackInterval);

                        }, animationSpeed);

                        clearInterval(aStarLoop);
                        return;
                    }

                    adjacentNode.setParent(node);
                    adjacentNode.setCostG(node.getCostG() + moveCost);

                    // calculate heuristics
                    deltaX = Math.abs(endNode.x - adjacentNode.x);
                    deltaY = Math.abs(endNode.y - adjacentNode.y);

                    adjacentNode.setCostH(
                        moveCost * (deltaX + deltaY)
                        // (diagonalCost/2) * Math.min(deltaX,deltaY) +
                        // 10 * (Math.max(deltaX,deltaY) - Math.min(deltaX,deltaY))
                    );

                    adjacentNode.setBackground(NODE_COLOR_INQUEUE);

                    //open.push(adjacentNode);
                    pq.add(adjacentNode);
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


        }, 0);
    }

    dijkstraSearch() {}

}
