//Basic cell information
var cell_x = 10;
var cell_y = 10;
var total_y_cells = Math.floor(canvas.height / cell_y);
var total_x_cells = Math.floor(canvas.width / cell_x);

//Room stuff
var minRoomHeight = 3;
var minRoomWidth = 3;
var maxRoomWidth = 11;
var maxRoomHeight = 11;
var maxRoomDoors = 3;
var maxSparseness = 150;
var attempts = 200;

//Constants for less trouble
const WALL_TILE = 0;
const ROOM_TILE = 1;
const CORRIDOR_TILE = 2;
const CONNECTION_TILE = 3;
const CONNECTED_TILE = 4;
const FLOOD_FILLED = 5;
const PRE_FILL = 6
var room_array = [];

function pick_start(){
    var x;
    var y;
    var not_placeable = true;
    while (not_placeable){
        x = randomOddIntFromInterval(1, total_x_cells-1);
        y = randomOddIntFromInterval(1, total_y_cells-1);
        if (map[y][x] == WALL_TILE){
            not_placeable = false;
        }
    }
    map[y][x] = 2;
    return {x:x, y:y};
}

function scan_for_new_seeds(){
    let seed = null
    for(let y = 1; y < total_y_cells-1; y += 2){
        let found = false;
        for (let x = 1; x < total_x_cells-1; x += 2){
            if (map[y][x] != WALL_TILE){
                continue;
            }
            let horizon = get_valid_cell_neighbors({x:x, y:y}, 2, WALL_TILE)
            if (horizon.length > 0){
                found = true;
                seed = {x:x, y:y}
                break;
            }
        }
        if (found){
            break;
        }
    }
    
    return seed
}

function map_room(room){
    for (var i = room.y_coord; i < (room.y_coord+room.height);i++){
        for (var j = room.x_coord; j < (room.x_coord +room.width); j++){
            map[i][j] = ROOM_TILE;
        }
    }
}

function create_room(){
    var room = {
        width: randomOddIntFromInterval(minRoomWidth,maxRoomWidth),
        height: randomOddIntFromInterval(minRoomHeight,maxRoomHeight)
    }
    room.y_coord = randomOddIntFromInterval(1,total_y_cells-room.height-2);
    room.x_coord = randomOddIntFromInterval(1,total_x_cells-room.width-2);
    return room;
}

function detect_room_collision(room_a,room_b){
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
        room = create_room();
        for (var j = 0; j < room_array.length; j++){
            if(detect_room_collision(room, room_array[j])){
                collision = true;
                break;
            }
        }
        if (!collision){
            map_room(room);
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

function get_valid_cell_neighbors(cell, distance, criterion){
    let valid_neighbors = []
    
    let north_neighbor = null
    if(check_map_validity(cell.x, cell.y-distance)){
        north_neighbor = map[cell.y-distance][cell.x]
    }
    let south_neighbor = null
    if(check_map_validity(cell.x, cell.y+distance)){
        south_neighbor = map[cell.y+distance][cell.x]
    }
    let east_neighbor = null
    if(check_map_validity(cell.x+distance, cell.y)){
        east_neighbor = map[cell.y][cell.x+distance]
    }
    let west_neighbor = null
    if(check_map_validity(cell.x-distance, cell.y)){
        west_neighbor = map[cell.y][cell.x-distance]
    }

    if (north_neighbor == criterion) {
        valid_neighbors.push({x:cell.x, y:cell.y-distance, dir:'n'})
    }
    if (south_neighbor == criterion){
        valid_neighbors.push({x:cell.x, y:cell.y+distance, dir:'s'})
    }
    if (east_neighbor == criterion){
        valid_neighbors.push({x:cell.x+distance, y:cell.y, dir:'e'})
    }
    if (west_neighbor == criterion){
        valid_neighbors.push({x:cell.x-distance, y:cell.y, dir:'w'})
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
            map[cell.y][cell.x+1] = CORRIDOR_TILE
            break;
    }
}

function make_corridors(starting_cell){
    let horizon = []
    let current_cell = starting_cell
    horizon = get_valid_cell_neighbors(current_cell, 2, WALL_TILE)

    while (horizon.length > 0){
        let index = Math.floor(Math.random()*horizon.length)
        current_cell = horizon[index]
        horizon.splice(index, 1)
        if (map[current_cell.y][current_cell.x] == WALL_TILE){
            dig_corridor(current_cell)
            let new_horizon = get_valid_cell_neighbors(current_cell, 2, WALL_TILE)
            horizon = horizon.concat(new_horizon)
        }
        
    }
    
}

function add_room_doors(){
    for(let i = 0; i < room_array.length; i++){
        let current_room = room_array[i]
        current_room.established_connections = 0
        let candidates = []

        //Populate the Candidates
        for (let w = 0; w < current_room.width; w++){
            //Iterate over vertical perimeter wall
            if (w == 0 || w == current_room.width-1){
                for (let h = 0; h < current_room.height; h++){
                    if (map[current_room.y_coord+h][current_room.x_coord+w-1] == CONNECTED_TILE){
                        current_room.established_connections++;
                    } else if (map[current_room.y_coord+h][current_room.x_coord+w-1] == CONNECTION_TILE) {
                        candidates.push({
                            x:current_room.x_coord+w-1,
                            y:current_room.y_coord+h
                        })
                    } else if(map[current_room.y_coord+h][current_room.x_coord+w+1] == CONNECTED_TILE) {
                        current_room.established_connections++;
                    } else if (map[current_room.y_coord+h][current_room.x_coord+w+1] == CONNECTION_TILE){
                        candidates.push({
                            x:current_room.x_coord+w+1,
                            y:current_room.y_coord+h
                        })
                    }
                }
            }
        
            //Check top
            if (map[current_room.y_coord-1][current_room.x_coord+w] == CONNECTED_TILE){
                current_room.established_connections++

            } else if (map[current_room.y_coord-1][current_room.x_coord+w] == CONNECTION_TILE){
                candidates.push({
                    x:current_room.x_coord+w,
                    y:current_room.y_coord-1
                })
            }
            //Check bottom
            bottom_margin = current_room.y_coord+current_room.height
            if (map[bottom_margin][current_room.x_coord+w] == CONNECTED_TILE){
                current_room.established_connections++

            } else if (map[bottom_margin][current_room.x_coord+w] == CONNECTION_TILE){
                candidates.push({
                    x:current_room.x_coord+w,
                    y:bottom_margin
                })
            }
        }

        //Add new connections until the limit is reached
        while(current_room.established_connections < maxRoomDoors){
            let candidate = candidates.splice(randomIntFromInterval(0, candidates.length-1),1)[0]
            map[candidate.y][candidate.x] = CONNECTED_TILE
            current_room.established_connections++
        }

    }
    prep_map()
}

function prep_map(){
    for (let y = 0; y < map.length; y++){
        for (let x = 0; x < map[0].length; x++){
            if (map[y][x] == WALL_TILE || map[y][x] == CONNECTION_TILE){
                map[y][x] = WALL_TILE
            } else {
                map[y][x] = PRE_FILL
            }
        }
    }
    flood_fill()
}

function flood_fill(){
    let starting_flood = {
        x:room_array[0].x_coord,
        y:room_array[0].y_coord
    }
    let horizon = get_valid_cell_neighbors(starting_flood, 1, PRE_FILL)
    while(horizon.length > 0){
        let current_cell = horizon.pop()
        map[current_cell.y][current_cell.x] = FLOOD_FILLED
        let new_horizon = get_valid_cell_neighbors(current_cell, 1, PRE_FILL)
        horizon = horizon.concat(new_horizon)
    }

    detect_dead_ends()
}

function is_dead_end(cell){
    let neighbors = get_valid_cell_neighbors(cell, 1, FLOOD_FILLED)
    return [neighbors.length == 1, neighbors]
}

function detect_dead_ends(){
    let deadEnds = []
    let sparsenessCounter = 0
    for (let y = 1; y < map.length-1; y++){
        for (let x = 1; x < map[0].length-1; x++){
            if(map[y][x] != WALL_TILE) {
                let isPossibleDeadEnd = is_dead_end({x:x, y:y})
                if(isPossibleDeadEnd[0]){
                    deadEnds.push({x:x, y:y, dir:isPossibleDeadEnd[1][0].dir})
                }
            }
        }
    }

    while(sparsenessCounter < maxSparseness && deadEnds.length > 0){
        let deadEnd = deadEnds.pop()
        let isPossibleDeadEnd = null
        map[deadEnd.y][deadEnd.x] = WALL_TILE;
        //Evaluate if neighbor is now a dead end
        switch(deadEnd.dir){
            case 'n':
                isPossibleDeadEnd = is_dead_end({x:deadEnd.x, y:deadEnd.y-1})
                if (isPossibleDeadEnd[0]){
                    deadEnds.push({x:deadEnd.x, y:deadEnd.y-1, dir:isPossibleDeadEnd[1][0].dir})
                    sparsenessCounter++;
                }
                break;
            case 's':
                isPossibleDeadEnd = is_dead_end({x:deadEnd.x, y:deadEnd.y+1})
                if (isPossibleDeadEnd[0]){
                    deadEnds.push({x:deadEnd.x, y:deadEnd.y+1, dir:isPossibleDeadEnd[1][0].dir})
                    sparsenessCounter++;
                }
                break;
            case 'e':
                isPossibleDeadEnd = is_dead_end({x:deadEnd.x+1, y:deadEnd.y})
                if (isPossibleDeadEnd[0]){
                    deadEnds.push({x:deadEnd.x+1, y:deadEnd.y, dir:isPossibleDeadEnd[1][0].dir})
                    sparsenessCounter++;
                }
                break;
            case 'w':
                isPossibleDeadEnd = is_dead_end({x:deadEnd.x-1, y:deadEnd.y})
                if (isPossibleDeadEnd[0]){
                    deadEnds.push({x:deadEnd.x-1, y:deadEnd.y, dir:isPossibleDeadEnd[1][0].dir})
                    sparsenessCounter++;
                }
                break;
        }
    }
    paint_map()
}