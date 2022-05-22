//Basic cell information
var cell_x = 10;
var cell_y = 10;
var total_y_cells = Math.floor(canvas.height / cell_y);
var total_x_cells = Math.floor(canvas.width / cell_x);

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

function establish_rooms(){ 
    var room;
    var collision;
    for (var i = 0; i < attempts; i++){
        collision = false;
        room = createRoom(min_room,max_room);
        for (var j = 0; j < room_array.length; j++){
            if(detectRoomCollision(room, room_array[j])){
                collision = true;
                break;
            }
        }
        if (!collision){
            mapRoom(room);
            room_array.push(room);
        }
    }
}

function check_map_validity(x,y){
    if (x < 1 || y < 1){
        return false
    }
    if (x > total_x_cells-2 || y > total_y_cells-2 ){
        return false
    }
    return true
}

function get_valid_cell_neighbors(cell){
    let valid_neighbors = []
    
    let north_neighbor = null
    if(check_map_validity(cell.x, cell.y-2)){
        north_neighbor = map[cell.y-2][cell.x]
    }
    let south_neighbor = null
    if(check_map_validity(cell.x, cell.y+2)){
        south_neighbor = map[cell.y+2][cell.x]
    }
    let east_neighbor = null
    if(check_map_validity(cell.x+2, cell.y)){
        east_neighbor = map[cell.y][cell.x+2]
    }
    let west_neighbor = null
    if(check_map_validity(cell.x-2, cell.y)){
        west_neighbor = map[cell.y][cell.x-2]
    }

    if (north_neighbor == 0) {
        valid_neighbors.push({x:cell.x, y:cell.y-2, dir:'n'})
    }
    if (south_neighbor == 0){
        valid_neighbors.push({x:cell.x, y:cell.y+2, dir:'s'})
    }
    if (east_neighbor == 0){
        valid_neighbors.push({x:cell.x+2, y:cell.y, dir:'e'})
    }
    if (west_neighbor == 0){
        valid_neighbors.push({x:cell.x-2, y:cell.y, dir:'w'})
    }
    return valid_neighbors
}

function dig_corridor(cell){
    map[cell.y][cell.x] = 2
    switch(cell.dir){
        case 'n':
            map[cell.y+1][cell.x] = 2
            break;
        case 's':
            map[cell.y-1][cell.x] = 2
            break;
        case 'e':
            map[cell.y][cell.x-1] = 2
            break;
        case 'w':
            map[cell.y][cell.x-+1] = 2
            break;
    }
}

function make_corridors(starting_cell){
    let horizon = []
    let current_cell = starting_cell
    paintCorridor(current_cell)
    horizon = get_valid_cell_neighbors(current_cell)
    for (let i = 0; i < horizon.length; i++){
        paintFrontier(horizon[i])
    }

    while (horizon.length > 0){
        let index = Math.floor(Math.random()*horizon.length)
        current_cell = horizon[index]
        horizon.splice(index, 1)
        if (map[current_cell.y][current_cell.x] == 0){
            dig_corridor(current_cell)
            paintCorridor(current_cell)
            let new_horizon = get_valid_cell_neighbors(current_cell)
            for (let i = 0; i < new_horizon.length; i++){
                paintFrontier(new_horizon[i])
            }
            horizon = horizon.concat(new_horizon)
        }
        
    }

}