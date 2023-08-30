function Renderer(cell_x, cell_y){
    this.COLOR_MAP = [
        "#000000",
        "#ffffff",
        "#33AA33",
        '#878733',
        '#338787',
        '#5555BB'
    ]
    this.cell_x = cell_x;
    this.cell_y = cell_y;
    this.grid = false
    const PERSON_RADIUS = 2;
    const HIGHLIGHT_RADIUS = 2;

    this.paint_faction_map = (rooms) => {
        for (let r = 0; r < rooms.length; r++){
            let room_owner = rooms[r].owner
            if (room_owner >= 0){
                this.paint_room(rooms[r], pickAColor(room_owner))
            } else {
                this.paint_room(rooms[r], this.COLOR_MAP[5])
            }
            
        }
    }
    
    this.paint_room = (room, color) =>{
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.strokeRect(
            room.x_coord*dungeonMap.cell_x,
            room.y_coord*dungeonMap.cell_y,
            room.width*dungeonMap.cell_x,
            room.height*dungeonMap.cell_y
        );
        ctx.fillRect(
            room.x_coord*dungeonMap.cell_x,
            room.y_coord*dungeonMap.cell_y,
            room.width*dungeonMap.cell_x,
            room.height*dungeonMap.cell_y
        )
    }
    
    this.paint_corridor = (cell)=>{
        ctx.strokeStyle = '#33AA33';
        ctx.fillStyle = '#338833'
        ctx.fillRect(
            cell.x*dungeonMap.cell_x,
            cell.y*dungeonMap.cell_y,
            dungeonMap.cell_x, dungeonMap.cell_y
        )
        ctx.strokeRect(
            cell.x*dungeonMap.cell_x,
            cell.y*dungeonMap.cell_y,
            dungeonMap.cell_x, dungeonMap.cell_y
        );
        if (cell.dir){
            switch(cell.dir){
                case 's':
                    ctx.fillRect(
                        cell.x*dungeonMap.cell_x,
                        (cell.y-1)*dungeonMap.cell_y,
                        dungeonMap.cell_x, dungeonMap.cell_y
                    )    
                    ctx.strokeRect(
                        cell.x*dungeonMap.cell_x,
                        (cell.y-1)*dungeonMap.cell_y,
                        dungeonMap.cell_x, dungeonMap.cell_y
                    )
                    break;
                case 'n':
                    ctx.fillRect(
                        cell.x*dungeonMap.cell_x,
                        (cell.y+1)*dungeonMap.cell_y,
                        dungeonMap.cell_x, dungeonMap.cell_y
                    )
                    ctx.strokeRect(
                        cell.x*dungeonMap.cell_x,
                        (cell.y+1)*dungeonMap.cell_y,
                        dungeonMap.cell_x, dungeonMap.cell_y
                    )
                    break;
                case 'e':
                    ctx.fillRect(
                        (cell.x-1)*dungeonMap.cell_x,
                        cell.y*dungeonMap.cell_y,
                        dungeonMap.cell_x, dungeonMap.cell_y
                    )
                    ctx.strokeRect(
                        (cell.x-1)*dungeonMap.cell_x,
                        cell.y*dungeonMap.cell_y,
                        dungeonMap.cell_x, dungeonMap.cell_y
                    )
                    break;
                case 'w':
                    ctx.fillRect(
                        (cell.x+1)*dungeonMap.cell_x,
                        cell.y*dungeonMap.cell_y,
                        dungeonMap.cell_x, dungeonMap.cell_y
                    )
                    ctx.strokeRect(
                        (cell.x+1)*dungeonMap.cell_x,
                        cell.y*dungeonMap.cell_y,
                        dungeonMap.cell_x, dungeonMap.cell_y
                    )
                    break;
            }
        }
    }
    
    this.paint_valid_wall_teardown = (x,y) =>{
        ctx.fillStyle = '#fcdebe'
        ctx.fillRect(
            dungeonMap.cell_x*x+3,
            dungeonMap.cell_y*y+3, 
            4,4)
    }
    
    this.paint_frontier = (cell)=>{
        ctx.strokeStyle = '#3333AA';
        ctx.strokeRect(
            cell.x*dungeonMap.cell_x,
            cell.y*dungeonMap.cell_y,
            dungeonMap.cell_x, dungeonMap.cell_y);
    }
    
    this.paint_cell = (x, y, type)=>{
        ctx.fillStyle = this.COLOR_MAP[type]
        ctx.fillRect(
            x*dungeonMap.cell_x,
            y*dungeonMap.cell_y,
            dungeonMap.cell_x, dungeonMap.cell_y)
    }
    
    this.paint_map = ()=>{
        for (let y = 0; y < map.length; y++){
            for (let x = 0; x < map[0].length; x++){
                this.paint_cell(x, y, map[y][x])
            }
        }
    }
    
    this.clear_canvas = ()=>{
        ctx.clearRect(0,0, canvas.width, canvas.height)
    }

    this.paintGrid = ()=>{
        ctx.strokeStyle = '#ccc';
        for (var i = 1; i < dungeonMap.total_x_cells; i++){
            ctx.moveTo(i*dungeonMap.cell_x,0);
            ctx.lineTo(i*dungeonMap.cell_x,dungeonMap.total_y_cells*dungeonMap.cell_y);
        }
        ctx.stroke();
        for (var i = 1; i < dungeonMap.total_y_cells; i++){
            ctx.moveTo(0,i*dungeonMap.cell_y);
            ctx.lineTo(dungeonMap.total_x_cells*dungeonMap.cell_x,i*dungeonMap.cell_y);
        }
        ctx.stroke();
    }
    
    this.showGrid = ()=>{
        this.paintGrid();
    }
    this.hideGrid = ()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height)
        this.paint_map()
    }
    
    this.toggleGrid = ()=>{
        this.grid = !this.grid;
        if (this.grid){
            this.showGrid();
        } else {
            this.hideGrid();
        }
    }

    this.paintIndividual = (x,y, fill_color, radius_highlight) =>{
        let highlight = 0;
        if (radius_highlight){
            highlight = HIGHLIGHT_RADIUS;
        }
        ctx.beginPath();
        ctx.fillStyle = this.COLOR_MAP[5];
        ctx.fillRect(x, y, cell_x, cell_y);
        ctx.fillStyle = fill_color;
        ctx.arc(x+(this.cell_x/2), y+(this.cell_y/2), PERSON_RADIUS+highlight, 0, 2*Math.PI);
        ctx.fill();
    }
}

var renderer = new Renderer(10, 10);