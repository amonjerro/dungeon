
function paintRoom(room){
    // ctx.fillRect(room.x_coord*cell_x,room.y_coord*cell_y,room.width*cell_x,room.height*cell_y);
    ctx.strokeStyle = '#999999';
    ctx.strokeRect(room.x_coord*cell_x,room.y_coord*cell_y,room.width*cell_x,room.height*cell_y);
}

function paintCorridor(cell){
    ctx.strokeStyle = '#33AA33';
    ctx.strokeRect(cell.x*cell_x,cell.y*cell_y, cell_x, cell_y);
    if (cell.dir){
        switch(cell.dir){
            case 's':
                ctx.strokeRect(cell.x*cell_x, (cell.y-1)*cell_y, cell_x, cell_y)
                break;
            case 'n':
                ctx.strokeRect(cell.x*cell_x, (cell.y+1)*cell_y, cell_x, cell_y)
                break;
            case 'e':
                ctx.strokeRect((cell.x-1)*cell_x, cell.y*cell_y, cell_x, cell_y)
                break;
            case 'w':
                ctx.strokeRect((cell.x+1)*cell_x, cell.y*cell_y, cell_x, cell_y)
                break;
        }
    }
}

function paintFrontier(cell){
    ctx.strokeStyle = '#3333AA';
    ctx.strokeRect(cell.x*cell_x, cell.y*cell_y, cell_x, cell_y);
}