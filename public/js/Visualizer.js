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

        this.nodes = [];

        this.handTool = TOOL_EMPTYNODE;

        this.selectedNode = null;
        this.previousNode = null;

        this.lastNodeId = 1;

        this.targets = 0;
        this.maxTargets = 2;

        this.canvasEventHandler();
        this.createNodes();

    }

    update() { }

    render() {
        this.drawGrid();
        window.requestAnimationFrame(() => this.render());
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

        this.canvas.addEventListener('mouseup',   (event) => {
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
                    if(node.isObstacle)    node.makeObstacle(false);
                    if(node.isDestination) node.makeDestination(false);
                    break;

                case TOOL_OBSTACLE:
                    if(!node.isObstacle) node.makeObstacle(true);
                    break;

                case TOOL_DESTINATION:
                    if(!node.isDestination && this.targets < this.maxTargets) {
                        node.makeDestination(true);
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

        this.canvas.addEventListener('click', (event) => {});
    }

    getNodeByMousePos(event) {
        let x = Math.floor(event.offsetX / TILESIZE);
        let y = Math.floor(event.offsetY / TILESIZE);
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
    createNodes() {
        for (let i = 0; i < Math.floor(this.canvas.clientHeight / TILESIZE); i++) {
            let row = []

            for (let j = 0; j < this.canvas.clientWidth / TILESIZE; j++)
                row.push(new Tile(++this.lastNodeId, j, i, Math.random() >= 0.9));

            this.nodes.push(row);
        }

        this.drawGrid();
        this.render();
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;

        for (var i = 0; i < this.nodes.length; i++) {
            for (var j = 0; j < this.nodes[0].length; j++) {
                this.ctx.fillStyle = this.nodes[i][j].bg;
                this.ctx.fillRect(j * TILESIZE, i * TILESIZE, TILESIZE, TILESIZE)
                this.nodes[i][j].drawEdges(this.ctx);
            }
        }

        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        if(this.selectedNode !== null) {
            this.ctx.strokeStyle = NODE_COLOR_HIGHLIGHT;
            this.ctx.rect(this.selectedNode.gridPos.x, this.selectedNode.gridPos.y, TILESIZE, TILESIZE);
        }
        if(this.previousNode !== null) {
            this.ctx.strokeStyle = NODE_COLOR_HIGHLIGHT;
            this.ctx.rect(this.previousNode.gridPos.x, this.previousNode.gridPos.y, TILESIZE, TILESIZE);
        }
        this.ctx.stroke();
    }

    clear() {
        for (var i = 0; i < this.nodes.length; i++)
            for (var j = 0; j < this.nodes[0].length; j++)
                this.nodes[i][j].makeObstacle(false);
    }

    generateObstacles() {
        for (var i = 0; i < this.nodes.length; i++)
            for (var j = 0; j < this.nodes[0].length; j++)
                this.nodes[i][j].makeObstacle(Math.random() >= 0.9);
    }

    setHandTool(tool) {
        this.handTool = tool;
    }

    clearNode(n) {
        this.nodes[n.y][n.x] = new Tile(++this.lastNodeId, n.x, n.y, false);
    }

    restoreNode(n) {
        let node = new Tile(++this.lastNodeId, n.x, n.y, false);

        node.isObstacle = n.isObstacle;
        node.isDestination = n.isDestination;
        node.bg = n.bg;

        this.nodes[n.y][n.x] = node;
    }

}
