window.addEventListener('load', () => {
    let visualizer = new Visualizer('canvas', false, false, 1000);

    $('#resetGraph').click(()   => { visualizer.clear(); });
    $('#genObstacle').click(()  => { visualizer.generateObstacles(); });

    $('#tool_dest').click(()      =>  { visualizer.setHandTool(TOOL_DESTINATION);   });
    $('#tool_obstacle').click(()  =>  { visualizer.setHandTool(TOOL_OBSTACLE);      });
    $('#tool_emptynode').click(() =>  { visualizer.setHandTool(TOOL_EMPTYNODE);     });
    $('#tool_movenode').click(()  =>  { visualizer.setHandTool(TOOL_MOVENODE);      });

    $('#mazegen_standard').click(() => { visualizer.generateMaze(MAZE_STANDARD); });
    $('#mazegen_block').click(()    => { visualizer.generateMaze(MAZE_BLOCK);    });

    $('#pathfind_dfs').click(()     => { visualizer.findPath(PATH_FINDER_DFS);   });
    $('#pathfind_bfs').click(()     => { visualizer.findPath(PATH_FINDER_BFS);   });
    $('#pathfind_astar').click(()     => { visualizer.findPath(PATH_FINDER_ASTAR);   });

    $("#tileSize").on("input change", function(e) {
        console.log($(this).val(), 2 ** $(this).val());
        visualizer.setTileSize(2 ** parseInt($(this).val()));
    });

    function binaryFind(searchElement) {
        'use strict';

        var minIndex = 0;
        var maxIndex = this.length - 1;
        var currentIndex = 0;
        var currentElement = null;

        console.log(minIndex, maxIndex, minIndex <= maxIndex);
        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = this[currentIndex];

            if (currentElement.getCostF() < searchElement.getCostF()) {
                minIndex = currentIndex + 1;
            } else if (currentElement.getCostF() > searchElement.getCostF()) {
                maxIndex = currentIndex - 1;
            } else {
                return { // Modification
                    found: true,
                    index: currentIndex
                };
            }
        }

        return { // Modification
            found: false,
            index: currentElement == null ? 0 : (currentElement.getCostF() < searchElement.getCostF() ? currentIndex + 1 : currentIndex)
        };
    }

    Array.prototype.binaryFind = binaryFind;
    Array.prototype.addSorted = function(element) {
        var res = this.binaryFind(element);
        if (!res.found) this.splice(res.index, 0, element);
    }
});
