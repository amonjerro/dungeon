function paintGrid(){
    ctx.beginPath();
    ctx.strokeStyle = '#555555';
    for (var i = 1; i < total_x_cells; i++){
        ctx.moveTo(i*cell_x,0);
        ctx.lineTo(i*cell_x,total_y_cells*cell_y);
    }
    ctx.stroke();
    for (var i = 1; i < total_y_cells; i++){
        ctx.moveTo(0,i*cell_y);
        ctx.lineTo(total_x_cells*cell_x,i*cell_y);
    }
    ctx.stroke();
}

function showGrid(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (var i = 0; i < room_array.length; i++){
        paintRoom(room_array[i]);
    }
    paintGrid();
}
function hideGrid(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (var i = 0; i < room_array.length; i++){
        paintRoom(room_array[i]);
    }
}

function toggleGrid(){
    grid = !grid;
    if (grid){
        showGrid();
    } else {
        hideGrid();
    }
}