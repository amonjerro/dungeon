COLOR_MAP = [
    "#000000",
    "#ffffff",
    "#33AA33",
    '#878733',
    '#338787',
    '#5555BB'
]


function paint_room(room){
    // ctx.fillRect(room.x_coord*cell_x,room.y_coord*cell_y,room.width*cell_x,room.height*cell_y);
    ctx.strokeStyle = '#999999';
    ctx.strokeRect(room.x_coord*cell_x,room.y_coord*cell_y,room.width*cell_x,room.height*cell_y);
}

function paint_corridor(cell){
    ctx.strokeStyle = '#33AA33';
    ctx.fillStyle = '#338833'
    ctx.fillRect(cell.x*cell_x,cell.y*cell_y, cell_x, cell_y)
    ctx.strokeRect(cell.x*cell_x,cell.y*cell_y, cell_x, cell_y);
    if (cell.dir){
        switch(cell.dir){
            case 's':
                ctx.fillRect(cell.x*cell_x, (cell.y-1)*cell_y, cell_x, cell_y)    
                ctx.strokeRect(cell.x*cell_x, (cell.y-1)*cell_y, cell_x, cell_y)
                break;
            case 'n':
                ctx.fillRect(cell.x*cell_x, (cell.y+1)*cell_y, cell_x, cell_y)
                ctx.strokeRect(cell.x*cell_x, (cell.y+1)*cell_y, cell_x, cell_y)
                break;
            case 'e':
                ctx.fillRect((cell.x-1)*cell_x, cell.y*cell_y, cell_x, cell_y)
                ctx.strokeRect((cell.x-1)*cell_x, cell.y*cell_y, cell_x, cell_y)
                break;
            case 'w':
                ctx.fillRect((cell.x+1)*cell_x, cell.y*cell_y, cell_x, cell_y)
                ctx.strokeRect((cell.x+1)*cell_x, cell.y*cell_y, cell_x, cell_y)
                break;
        }
    }
}

function paint_valid_wall_teardown(x,y){
    ctx.fillStyle = '#fcdebe'
    ctx.fillRect(cell_x*x+3, cell_y*y+3, 4, 4)
}

function paint_frontier(cell){
    ctx.strokeStyle = '#3333AA';
    ctx.strokeRect(cell.x*cell_x, cell.y*cell_y, cell_x, cell_y);
}

function paint_cell(x, y, type){
    ctx.fillStyle = COLOR_MAP[type]
    ctx.fillRect(x*cell_x,y*cell_y, cell_x, cell_y)
}

function paint_map(){
    for (let y = 0; y < map.length; y++){
        for (let x = 0; x < map[0].length; x++){
            paint_cell(x, y, map[y][x])
        }
    }
}

function clear_canvas(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
}