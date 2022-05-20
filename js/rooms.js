function mapRoom(room){
    for (var i = room.y_coord; i < (room.y_coord+room.height);i++){
        for (var j = room.x_coord; j < (room.x_coord +room.width); j++){
            map[i][j] = 1;
        }
    }
}

function createRoom(min, max){
    var room = {
        width: randomIntFromInterval(min,max),
        height: randomIntFromInterval(min,max)
    }
    room.y_coord = randomIntFromInterval(1,total_y_cells-room.height-1);
    room.x_coord = randomIntFromInterval(1,total_x_cells-room.width-1);
    return room;
}

function detectRoomCollision(room_a,room_b){
    return (room_a.x_coord < room_b.x_coord + room_b.width &&
       room_a.x_coord + room_a.width > room_b.x_coord &&
       room_a.y_coord < room_b.y_coord + room_b.height &&
       room_a.height + room_a.y_coord > room_b.y_coord)
}

function paintRoom(room){
    // ctx.fillRect(room.x_coord*cell_x,room.y_coord*cell_y,room.width*cell_x,room.height*cell_y);
    ctx.strokeStyle = '#999999';
    ctx.strokeRect(room.x_coord*cell_x,room.y_coord*cell_y,room.width*cell_x,room.height*cell_y);
}