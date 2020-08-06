class Visualizer {
    /**
        @param canvasId
        @param directed
        @param weighted
    */
    constructor(canvasId, directed, weighted) {

        this.canvas = document.getElementById(canvasId);
        this.canvas.width = 1120;
        this.canvas.height = 640;
        this.ctx = this.canvas.getContext('2d');
        this.isDirected = directed;
        this.isWeighted = weighted;
        this.mouseDown  = false;

        this.tileSize = TILESIZE_DEFAULT;
        this.nodes = [];

        this.handTool = TOOL_EMPTYNODE;
        this.currentMaze = null;

        this.selectedNode = null;
        this.previousNode = null;

        this.lastNodeId = 1;

        this.targets = 0;
        this.maxTargets = 2;
        this.targetPoints = [];

        this.pathStack = [];

        this.animationFrameId = null;

        this.canvasEventHandler();
        this.createNodes();

    }

    update() { }

    render() {
        this.drawGrid();
        this.animationFrameId = window.requestAnimationFrame(() => this.render());
    }

    canvasEventHandler() {
        this.canvas.addEventListener('mousedown', (event) => {
            this.mouseDown = true;

            if(this.handTool == TOOL_MOVENODE) {
                let node = this.getNodeByMousePos(event);

                if(node === undefined)
                    return;

                // do not move empty nodes
                if(node.isEmpty())
                    return;

                this.selectedNode = node;
            }

        });

        this.canvas.addEventListener('mouseup', (event) => {
            this.mouseDown = false;

            if(this.selectedNode == null)
                return;

            if(this.handTool == TOOL_MOVENODE) {
                if(this.previousNode != null)
                    this.clearNode(this.selectedNode);

                this.selectedNode = null;
                this.previousNode = null;
            }
        });

        this.canvas.addEventListener('mousemove', (event) => {
            if(!this.mouseDown)
                return;

            let node = this.getNodeByMousePos(event);

            if(node === undefined)
                return;

            switch(this.handTool) {
                case TOOL_EMPTYNODE:
                    node.reset();

                    break;

                case TOOL_OBSTACLE:
                    if(!node.isObstacle) node.makeObstacle(true);
                    break;

                case TOOL_DESTINATION:
                    if(!node.isDestination && this.targets < this.maxTargets) {
                        node.makeDestination(true);
                        this.targetPoints.push(node);
                        this.targets++;
                    }
                    break;

                case TOOL_MOVENODE:
                {
                    if(this.selectedNode == null
                    || this.selectedNode.equalTo(node))
                        break;

                    // restore previous node & save current node
                    if(this.previousNode !== null)
                        this.restoreNode(this.previousNode);

                    this.previousNode = node;

                    // clone selectedNode & modify x,y to match current node
                    let newNode = _.clone(this.selectedNode, true);

                    newNode.x = node.x;
                    newNode.y = node.y;
                    newNode.gridPos.x = node.gridPos.x;
                    newNode.gridPos.y = node.gridPos.y;

                    this.nodes[node.y][node.x] = newNode;
                } break;
            }
        });

        this.canvas.addEventListener('click', (event) => {
            console.log(this.getNodeByMousePos(event));
        });
    }

    getNodeByMousePos(event) {
        let x = Math.floor(event.offsetX / this.tileSize);
        let y = Math.floor(event.offsetY / this.tileSize);
        if (this.nodes[y] === undefined)
            return;
        return this.nodes[y][x];
    }

    /**
        Initializes grid

        @param canvasId
        @param directed
        @param weighted
    */
    createNodes(firstCall = true) {
        for (let i = 0; i < Math.floor(this.canvas.clientHeight / this.tileSize); i++) {
            let row = []

            for (let j = 0; j < Math.floor(this.canvas.clientWidth / this.tileSize); j++)
                row.push(new Tile(++this.lastNodeId, j, i, false/*Math.random() >= 0.9*/, this.tileSize));

            this.nodes.push(row);
        }

        this.drawGrid();
        if(firstCall)
            this.render();
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;

        for (var i = 0; i < this.nodes.length; i++) {
            for (var j = 0; j < this.nodes[0].length; j++) {
                this.ctx.fillStyle = this.nodes[i][j].bg;
                this.ctx.fillRect(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize)
                this.nodes[i][j].drawEdges(this.ctx);
            }
        }

        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        if(this.selectedNode !== null) {
            this.ctx.strokeStyle = NODE_COLOR_HIGHLIGHT;
            this.ctx.rect(this.selectedNode.gridPos.x, this.selectedNode.gridPos.y, this.tileSize, this.tileSize);
        }
        if(this.previousNode !== null) {
            this.ctx.strokeStyle = NODE_COLOR_HIGHLIGHT;
            this.ctx.rect(this.previousNode.gridPos.x, this.previousNode.gridPos.y, this.tileSize, this.tileSize);
        }
        this.ctx.stroke();
    }

    clear() {
        this.targetPoints = [];
        this.targets = 0;

        for (var i = 0; i < this.nodes.length; i++)
            for (var j = 0; j < this.nodes[0].length; j++)
                this.nodes[i][j].reset();
    }

    generateObstacles() {
        for (var i = 0; i < this.nodes.length; i++)
            for (var j = 0; j < this.nodes[0].length; j++)
                this.nodes[i][j].makeObstacle(Math.random() >= 0.9);
    }

    fillWithObstacles() {
        for (var i = 0; i < this.nodes.length; i++)
            for (var j = 0; j < this.nodes[0].length; j++) {
                this.nodes[i][j].makeObstacle(true);
                this.nodes[i][j].setVisited(false);
                this.nodes[i][j].resetEdges();
            }
    }

    generateMaze(type) {
        this.currentMaze = type;
        this.clear();
        if(type == MAZE_BLOCK)
            this.fillWithObstacles();

        new MazeGenerator(this.nodes, type);
    }

    findPath(algorithm) {
        this.freeVisitedPaths();

        let pf = new PathFinder(this.nodes, this.pathStack);
        switch (algorithm) {
            case PATH_FINDER_DFS:
            {

                pf.depthFirstSearch(this.targetPoints[0], this.currentMaze)
                .then(() => {
                    if(this.pathStack == false) {
                        console.log("no path");
                        return;
                    }

                    // Backtrack
                    let i = 0;
                    let backTrackDfs = setInterval(() => {

                        let node = this.pathStack[i];
                        node.setBackground(NODE_COLOR_PATH);

                        i++;
                        if(i == this.pathStack.length-1) {
                            this.pathStack = [];
                            clearInterval(backTrackDfs);
                        }

                    }, 10);

                });


            } break;

            case PATH_FINDER_BFS:
                pf.breadthFirstSearch(this.targetPoints[0], this.currentMaze);
                break;

            case PATH_FINDER_ASTAR:
                pf.aStarSearch(this.targetPoints[0], this.targetPoints[1]);
                break;
            default:
                console.log("[Visualizer Error] Unknown algorithm.");
                break;
        }
    }

    setHandTool(tool) {
        this.handTool = tool;
    }

    clearNode(n) {
        this.nodes[n.y][n.x] = new Tile(++this.lastNodeId, n.x, n.y, false, this.tileSize);
    }

    restoreNode(n) {
        let node = new Tile(++this.lastNodeId, n.x, n.y, false, this.tileSize);

        node.isObstacle = n.isObstacle;
        node.isDestination = n.isDestination;
        node.bg = n.bg;
        node.edges = n.edges;

        this.nodes[n.y][n.x] = node;
    }

    freeVisitedPaths() {
        for (var i = 0; i < this.nodes.length; i++)
            for (var j = 0; j < this.nodes[0].length; j++) {
                if(this.nodes[i][j].isEmpty() || this.nodes[i][j].isDestination)
                    this.nodes[i][j].setVisited(false);
                if(this.nodes[i][j].isObstacle)
                    this.nodes[i][j].setVisited(true);
            }
    }

    setTileSize(s) {
        this.tileSize = s;
        this.nodes = [];
        this.createNodes(false);
        this.drawGrid();
    }
}
