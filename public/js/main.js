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
    $("#tileSize").on("input change", function(e) {
        console.log($(this).val(), 2 ** $(this).val());
        visualizer.setTileSize(2 ** parseInt($(this).val()));
    });
});
