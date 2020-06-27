class PathFinder {
    constructor(nodes, stack) {
        this.nodes = nodes;
        this.stack = stack;
        this.queue = [];
    }

    depthFirstSearch(node, mazeType) {
        node.setVisited(true);
        let nextNode = this.findUnvisitedNode(node, mazeType);

        if(nextNode == null) {
            let n = this.stack.pop();
            if(n !== undefined)
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

    findUnvisitedNode(node, mazeType = MAZE_BLOCK, returnAll = false) {
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

        while(this.queue.length > 0) {
            node = this.queue[0];
            node.setVisited(true);

            childNodes = this.findUnvisitedNode(node, mazeType, true);

            if(childNodes == null) {
                this.queue.shift();
                continue;
            }

            for (var i = 0; i < childNodes.length; i++) {
                if(childNodes[i].hasParent() == false) {
                    childNodes[i].setParent(node);

                    if (childNodes[i].isDestination) {
                        backtrackNode = childNodes[i];
                        break;
                    }

                    this.queue.push(childNodes[i]);
                }
            }

            // destination node found, exit loop.
            if(backtrackNode != null)
                break;

            this.queue.shift();
        }

        if(backtrackNode != null) {
            let parentNode = backtrackNode.getParent();
            while(parentNode != null) {
                parentNode.setBackground(NODE_COLOR_PATH);
                parentNode = parentNode.getParent();
            }
        }
    }

    aStarSearch() {}
    dijkstraSearch() {}

}
