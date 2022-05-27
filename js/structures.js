//Basic cell information
var cell_x = 10;
var cell_y = 10;
var total_y_cells = Math.floor(canvas.height / cell_y);
var total_x_cells = Math.floor(canvas.width / cell_x);

//Constants for less trouble
const WALL_TILE = 0;
const ROOM_TILE = 1;
const CORRIDOR_TILE = 2;
const CONNECTION_TILE = 3;

function mapRoom(room){
    for (var i = room.y_coord; i < (room.y_coord+room.height);i++){
        for (var j = room.x_coord; j < (room.x_coord +room.width); j++){
            map[i][j] = ROOM_TILE;
        }
    }
}

function createRoom(min, max){
    var room = {
        width: randomOddIntFromInterval(min,max),
        height: randomOddIntFromInterval(min,max)
    }
    room.y_coord = randomOddIntFromInterval(1,total_y_cells-room.height-1);
    room.x_coord = randomOddIntFromInterval(1,total_x_cells-room.width-1);
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

    if (north_neighbor == WALL_TILE) {
        valid_neighbors.push({x:cell.x, y:cell.y-2, dir:'n'})
    }
    if (south_neighbor == WALL_TILE){
        valid_neighbors.push({x:cell.x, y:cell.y+2, dir:'s'})
    }
    if (east_neighbor == WALL_TILE){
        valid_neighbors.push({x:cell.x+2, y:cell.y, dir:'e'})
    }
    if (west_neighbor == WALL_TILE){
        valid_neighbors.push({x:cell.x-2, y:cell.y, dir:'w'})
    }
    return valid_neighbors
}

function get_valid_wall_teardown(x,y){
    is_valid_connection = false
    // Check vertical connection
    if (
        (map[y-1][x] > WALL_TILE && map[y+1][x] > WALL_TILE) && 
        (map[y-1][x] < CONNECTION_TILE && map[y+1][x] < CONNECTION_TILE)
        ){
        let top = map[y-1][x]
        let bottom = map[y+1][x]
        if (top == CORRIDOR_TILE && top == bottom){
            null;
        } else {
            //Mark as 3
            map[y][x] = CONNECTION_TILE
            is_valid_connection = true
        }
    }
    // Check Horizontal Connection
    if (
        (map[y][x-1] > WALL_TILE && map[y][x+1] > WALL_TILE) &&
        (map[y][x-1] < CONNECTION_TILE && map[y][x+1] < CONNECTION_TILE)
        ){
        let left = map[y][x-1]
        let right = map[y][x+1]
        if (left == CORRIDOR_TILE && left == right){
            null;
        } else {
            //Mark as 3
            map[y][x] = CONNECTION_TILE
            is_valid_connection = true
        }
    }
    return is_valid_connection
}

function dig_corridor(cell){
    map[cell.y][cell.x] = CORRIDOR_TILE
    switch(cell.dir){
        case 'n':
            map[cell.y+1][cell.x] = CORRIDOR_TILE
            break;
        case 's':
            map[cell.y-1][cell.x] = CORRIDOR_TILE
            break;
        case 'e':
            map[cell.y][cell.x-1] = CORRIDOR_TILE
            break;
        case 'w':
            map[cell.y][cell.x-+1] = CORRIDOR_TILE
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
        if (map[current_cell.y][current_cell.x] == WALL_TILE){
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