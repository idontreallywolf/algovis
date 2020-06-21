/*
    TODO: lagg when calling requestAnimationFrame
*/
class Visualizer {
    /**
        @param canvasId
        @param directed
        @param weighted
    */
    constructor(canvasId, directed, weighted)
    {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = 1120;
        this.canvas.height = 640;
        this.ctx = this.canvas.getContext('2d');
        this.isDirected = directed;
        this.isWeighted = weighted;
        this.mouseDown  = false;

        this.nodes = [];
        this.tileSize = 32;

        this.canvasEventHandler();
        this.createNodes();
    }

    update() {

    }

    render() {
        this.drawGrid();
        window.requestAnimationFrame(() => this.render());
    }

    canvasEventHandler() {
        this.canvas.addEventListener('click',     (event) => {});
        this.canvas.addEventListener('mousedown', (event) => { this.mouseDown = true;  });
        this.canvas.addEventListener('mouseup',   (event) => { this.mouseDown = false; });

        this.canvas.addEventListener('mousemove', (event) => {
            let node = this.getNodeByMousePos(event);
            if(this.mouseDown)
                if (!node.isObstacle)
                    node.makeObstacle(true);
        });


        this.canvas.addEventListener('click', (event) => { });
    }

    getNodeByMousePos(event) {
        let x = Math.floor(event.offsetX / this.tileSize);
        let y = Math.floor(event.offsetY / this.tileSize);
        return this.nodes[y][x];
    }

    /**
        Initializes grid

        @param canvasId
        @param directed
        @param weighted
    */
    createNodes()
    {
        for (let i = 0; i < this.canvas.clientHeight / this.tileSize; i++) {
            let row = []
            for (let j = 0; j < this.canvas.clientWidth / this.tileSize; j++) {
                row.push(new Tile(this.tileSize, this.tileSize, Math.random() >= 0.9));
            }
            this.nodes.push(row);
        }

        this.drawGrid();
        this.render();
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();

        for (var i = 0; i < this.nodes.length; i++) {
            for (var j = 0; j < this.nodes[0].length; j++) {
                this.ctx.fillStyle = this.nodes[i][j].bg;
                this.ctx.fillRect(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize)
            }
        }

        this.ctx.strokeStyle = "#bebebe";
        // horizontal
        for (var i = 0; i < this.canvas.height / this.tileSize; i++) {
            this.ctx.moveTo(0, i * this.tileSize);
            this.ctx.lineTo(this.canvas.clientWidth, i * this.tileSize);
        }

        // vertical
        for (var i = 0; i < this.canvas.width / this.tileSize; i++) {
            this.ctx.moveTo(i * this.tileSize, 0);
            this.ctx.lineTo(i * this.tileSize, this.canvas.clientHeight);
        }

        this.ctx.moveTo(this.canvas.width, 0);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.moveTo(0, this.canvas.height);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);

        this.ctx.stroke();
    }

}
