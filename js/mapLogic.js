function DungeonMap(height, width){
    //Basic cell information
    this.cell_x = 10;
    this.cell_y = 10;
    this.total_y_cells = Math.floor(height / this.cell_y);
    this.total_x_cells = Math.floor(width / this.cell_x);

    //Room stuff
    this.minRoomHeight = 3;
    this.minRoomWidth = 3;
    this.maxRoomWidth = 11;
    this.maxRoomHeight = 11;
    this.maxRoomDoors = 3;
    this.maxSparseness = 150;
    this.attempts = 200;

    //Constants for less trouble
    this.CONSTANTS = Object.freeze({
        WALL_TILE : 0,
        ROOM_TILE : 1,
        CORRIDOR_TILE : 2,
        CONNECTION_TILE : 3,
        CONNECTED_TILE : 4,
        FLOOD_FILLED : 5,
        PRE_FILL : 6
    })
    
    this.room_array = [];

    this.pickStart = () =>{
        var x;
        var y;
        var not_placeable = true;
        while (not_placeable){
            x = randomOddIntFromInterval(1, this.total_x_cells-1);
            y = randomOddIntFromInterval(1, this.total_y_cells-1);
            if (map[y][x] == this.CONSTANTS.WALL_TILE){
                not_placeable = false;
            }
        }
        map[y][x] = this.CONSTANTS.CORRIDOR_TILE;
        return {x:x, y:y};
    }

    this.scan_for_new_seeds = ()=>{
        let seed = null
        for(let y = 1; y < this.total_y_cells-1; y += 2){
            let found = false;
            for (let x = 1; x < this.total_x_cells-1; x += 2){
                if (map[y][x] != this.CONSTANTS.WALL_TILE){
                    continue;
                }
                let horizon = this.get_valid_cell_neighbors({x:x, y:y}, 2, this.CONSTANTS.WALL_TILE)
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

    this.map_room = (room)=>{
        for (var i = room.y_coord; i < (room.y_coord+room.height);i++){
            for (var j = room.x_coord; j < (room.x_coord +room.width); j++){
                map[i][j] = this.CONSTANTS.ROOM_TILE;
            }
        }
    }

    this.create_room = ()=>{
        var room = {
            width: randomOddIntFromInterval(this.minRoomWidth,this.maxRoomWidth),
            height: randomOddIntFromInterval(this.minRoomHeight,this.maxRoomHeight),
            neighbors: []
        }
        room.y_coord = randomOddIntFromInterval(1,this.total_y_cells-room.height-2);
        room.x_coord = randomOddIntFromInterval(1,this.total_x_cells-room.width-2);
        room.key = 'x:'+room.x_coord+'y:'+room.y_coord
        return room;
    }

    this.detect_room_collision = (room_a,room_b) =>{
        return (room_a.x_coord < room_b.x_coord + room_b.width &&
        room_a.x_coord + room_a.width > room_b.x_coord &&
        room_a.y_coord < room_b.y_coord + room_b.height &&
        room_a.height + room_a.y_coord > room_b.y_coord)
    }

    this.establish_rooms = () => { 
        var room;
        var collision;
        for (var i = 0; i < this.attempts; i++){
            collision = false;
            room = this.create_room();
            for (var j = 0; j < this.room_array.length; j++){
                if(this.detect_room_collision(room, this.room_array[j])){
                    collision = true;
                    break;
                }
            }
            if (!collision){
                this.map_room(room);
                this.room_array.push(room);
            }
        }
    }

    this.check_map_validity = (x,y)=>{
        if (x < 1 || y < 1){
            return false
        }
        if (x > this.total_x_cells-2 || y > this.total_y_cells-2 ){
            return false
        }
        return true
    }

    this.get_valid_cell_neighbors = (cell, distance, criterion)=>{
        let valid_neighbors = []
        
        let north_neighbor = null
        if(this.check_map_validity(cell.x, cell.y-distance)){
            north_neighbor = map[cell.y-distance][cell.x]
        }
        let south_neighbor = null
        if(this.check_map_validity(cell.x, cell.y+distance)){
            south_neighbor = map[cell.y+distance][cell.x]
        }
        let east_neighbor = null
        if(this.check_map_validity(cell.x+distance, cell.y)){
            east_neighbor = map[cell.y][cell.x+distance]
        }
        let west_neighbor = null
        if(this.check_map_validity(cell.x-distance, cell.y)){
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


    this.get_valid_wall_teardown = (x,y)=>{
        // Check vertical connection
        if (
            (map[y-1][x] > this.CONSTANTS.WALL_TILE && map[y+1][x] > this.CONSTANTS.WALL_TILE) && 
            (map[y-1][x] < this.CONSTANTS.CONNECTION_TILE && map[y+1][x] < this.CONSTANTS.CONNECTION_TILE)
            ){
            let top = map[y-1][x]
            let bottom = map[y+1][x]
            if (top == this.CONSTANTS.CORRIDOR_TILE && top == bottom){
                null;
            } else {
                //Mark as 3
                map[y][x] = this.CONSTANTS.CONNECTION_TILE
            }
        }
        // Check Horizontal Connection
        if (
            (map[y][x-1] > this.CONSTANTS.WALL_TILE && map[y][x+1] > this.CONSTANTS.WALL_TILE) &&
            (map[y][x-1] < this.CONSTANTS.CONNECTION_TILE && map[y][x+1] < this.CONSTANTS.CONNECTION_TILE)
            ){
            let left = map[y][x-1]
            let right = map[y][x+1]
            if (left == this.CONSTANTS.CORRIDOR_TILE && left == right){
                null;
            } else {
                //Mark as 3
                map[y][x] = this.CONSTANTS.CONNECTION_TILE
            }
        }
    }

    this.dig_corridor = (cell)=>{
        map[cell.y][cell.x] = this.CONSTANTS.CORRIDOR_TILE
        switch(cell.dir){
            case 'n':
                map[cell.y+1][cell.x] = this.CONSTANTS.CORRIDOR_TILE
                break;
            case 's':
                map[cell.y-1][cell.x] = this.CONSTANTS.CORRIDOR_TILE
                break;
            case 'e':
                map[cell.y][cell.x-1] = this.CONSTANTS.CORRIDOR_TILE
                break;
            case 'w':
                map[cell.y][cell.x+1] = this.CONSTANTS.CORRIDOR_TILE
                break;
        }
    }

    this.make_corridors = (starting_cell)=>{
        let horizon = []
        let current_cell = starting_cell
        horizon = this.get_valid_cell_neighbors(current_cell, 2, this.CONSTANTS.WALL_TILE)

        while (horizon.length > 0){
            let index = Math.floor(Math.random()*horizon.length)
            current_cell = horizon[index]
            horizon.splice(index, 1)
            if (map[current_cell.y][current_cell.x] == this.CONSTANTS.WALL_TILE){
                this.dig_corridor(current_cell)
                let new_horizon = this.get_valid_cell_neighbors(current_cell, 2, this.CONSTANTS.WALL_TILE)
                horizon = horizon.concat(new_horizon)
            }
            
        }
        
    }

    this.add_room_doors = ()=>{
        for(let i = 0; i < this.room_array.length; i++){
            let current_room = this.room_array[i]
            current_room.established_connections = 0
            let candidates = []

            //Populate the Candidates
            for (let w = 0; w < current_room.width; w++){
                //Iterate over vertical perimeter wall
                if (w == 0 || w == current_room.width-1){
                    for (let h = 0; h < current_room.height; h++){
                        if (map[current_room.y_coord+h][current_room.x_coord+w-1] == this.CONSTANTS.CONNECTED_TILE){
                            current_room.established_connections++;
                        } else if (map[current_room.y_coord+h][current_room.x_coord+w-1] == this.CONSTANTS.CONNECTION_TILE) {
                            candidates.push({
                                x:current_room.x_coord+w-1,
                                y:current_room.y_coord+h,
                                beyond_coordinates:{
                                    x:current_room.x_coord+w-2,
                                    y:current_room.y_coord+h
                                }

                            })
                        } else if(map[current_room.y_coord+h][current_room.x_coord+w+1] == this.CONSTANTS.CONNECTED_TILE) {
                            current_room.established_connections++;
                        } else if (map[current_room.y_coord+h][current_room.x_coord+w+1] == this.CONSTANTS.CONNECTION_TILE){
                            candidates.push({
                                x:current_room.x_coord+w+1,
                                y:current_room.y_coord+h,
                                beyond_coordinates:{
                                    x:current_room.x_coord+w+2,
                                    y:current_room.y_coord+h
                                }
                            })
                        }
                    }
                }
            
                //Check top
                if (map[current_room.y_coord-1][current_room.x_coord+w] == this.CONSTANTS.CONNECTED_TILE){
                    current_room.established_connections++

                } else if (map[current_room.y_coord-1][current_room.x_coord+w] == this.CONSTANTS.CONNECTION_TILE){
                    candidates.push({
                        x:current_room.x_coord+w,
                        y:current_room.y_coord-1,
                        beyond_coordinates:{
                            x:current_room.x_coord+w,
                            y:current_room.y_coord-2
                        }
                    })
                }
                //Check bottom
                bottom_margin = current_room.y_coord+current_room.height
                if (map[bottom_margin][current_room.x_coord+w] == this.CONSTANTS.CONNECTED_TILE){
                    current_room.established_connections++

                } else if (map[bottom_margin][current_room.x_coord+w] == this.CONSTANTS.CONNECTION_TILE){
                    candidates.push({
                        x:current_room.x_coord+w,
                        y:bottom_margin,
                        beyond_coordinates:{
                            x:current_room.x_coord+w,
                            y:bottom_margin+1
                        }
                    })
                }
            }

            //Add new connections until the limit is reached
            while(current_room.established_connections < this.maxRoomDoors){
                let candidate = candidates.splice(randomIntFromInterval(0, candidates.length-1),1)[0]
                map[candidate.y][candidate.x] = this.CONSTANTS.CONNECTED_TILE
                current_room.established_connections++
                let possible_neighbor = candidate.beyond_coordinates
                if (map[possible_neighbor.y][possible_neighbor.x] == this.CONSTANTS.ROOM_TILE){
                    //These are two adjacent rooms
                    let adjacent_room = this.find_room_from_coordinates(possible_neighbor.x, possible_neighbor.y)
                    if (!adjacent_room){
                        console.log(possible_neighbor, current_room)
                        console.log(this.room_array)
                        throw 'Weird room'
                    }

                    //Check if rooms already marked as neighbors
                    if(current_room.neighbors.filter((e)=>{return e.key == adjacent_room.key}).length == 0){
                        current_room.neighbors.push(adjacent_room)
                        //Reciprocal
                        adjacent_room.neighbors.push(current_room)
                    }
                    
                }

            }

        }
        this.prep_map()
    }

    this.prep_map = ()=>{
        for (let y = 0; y < map.length; y++){
            for (let x = 0; x < map[0].length; x++){
                if (map[y][x] == this.CONSTANTS.WALL_TILE || map[y][x] == this.CONSTANTS.CONNECTION_TILE){
                    map[y][x] = this.CONSTANTS.WALL_TILE
                } else {
                    map[y][x] = this.CONSTANTS.PRE_FILL
                }
            }
        }
        this.flood_fill()
    }

    this.flood_fill = ()=>{
        let starting_flood = {
            x:this.room_array[0].x_coord,
            y:this.room_array[0].y_coord
        }
        let horizon = this.get_valid_cell_neighbors(starting_flood, 1, this.CONSTANTS.PRE_FILL)
        while(horizon.length > 0){
            let current_cell = horizon.pop()
            map[current_cell.y][current_cell.x] = this.CONSTANTS.FLOOD_FILLED
            let new_horizon = this.get_valid_cell_neighbors(current_cell, 1, this.CONSTANTS.PRE_FILL)
            horizon = horizon.concat(new_horizon)
        }

        this.detect_dead_ends()
    }

    this.is_dead_end = (cell)=>{
        let neighbors = this.get_valid_cell_neighbors(cell, 1, this.CONSTANTS.FLOOD_FILLED)
        return [neighbors.length == 1, neighbors]
    }

    this.detect_dead_ends = ()=>{
        let deadEnds = []
        let sparsenessCounter = 0
        for (let y = 1; y < map.length-1; y++){
            for (let x = 1; x < map[0].length-1; x++){
                if(map[y][x] != this.CONSTANTS.WALL_TILE) {
                    let isPossibleDeadEnd = this.is_dead_end({x:x, y:y})
                    if(isPossibleDeadEnd[0]){
                        deadEnds.push({x:x, y:y, dir:isPossibleDeadEnd[1][0].dir})
                    }
                }
            }
        }

        while(sparsenessCounter < this.maxSparseness && deadEnds.length > 0){
            let deadEnd = deadEnds.pop()
            let isPossibleDeadEnd = null
            map[deadEnd.y][deadEnd.x] = this.CONSTANTS.WALL_TILE;
            //Evaluate if neighbor is now a dead end
            switch(deadEnd.dir){
                case 'n':
                    isPossibleDeadEnd = this.is_dead_end({x:deadEnd.x, y:deadEnd.y-1})
                    if (isPossibleDeadEnd[0]){
                        deadEnds.push({x:deadEnd.x, y:deadEnd.y-1, dir:isPossibleDeadEnd[1][0].dir})
                        sparsenessCounter++;
                    }
                    break;
                case 's':
                    isPossibleDeadEnd = this.is_dead_end({x:deadEnd.x, y:deadEnd.y+1})
                    if (isPossibleDeadEnd[0]){
                        deadEnds.push({x:deadEnd.x, y:deadEnd.y+1, dir:isPossibleDeadEnd[1][0].dir})
                        sparsenessCounter++;
                    }
                    break;
                case 'e':
                    isPossibleDeadEnd = this.is_dead_end({x:deadEnd.x+1, y:deadEnd.y})
                    if (isPossibleDeadEnd[0]){
                        deadEnds.push({x:deadEnd.x+1, y:deadEnd.y, dir:isPossibleDeadEnd[1][0].dir})
                        sparsenessCounter++;
                    }
                    break;
                case 'w':
                    isPossibleDeadEnd = this.is_dead_end({x:deadEnd.x-1, y:deadEnd.y})
                    if (isPossibleDeadEnd[0]){
                        deadEnds.push({x:deadEnd.x-1, y:deadEnd.y, dir:isPossibleDeadEnd[1][0].dir})
                        sparsenessCounter++;
                    }
                    break;
            }
        }
        renderer.paint_map()
    }
    
    this.find_room_from_coordinates = (x,y) => {
        for (let r = 0; r < this.room_array.length; r++){
            let room = this.room_array[r];
            if (x >= room.x_coord && x <= room.x_coord+room.width
                 && y >= room.y_coord && y <= room.y_coord+room.height){
                    return room
            }
        }
    }

    this.filter_rooms_with_neighbors = () =>{
        return this.room_array.filter((e)=>{return e.neighbors.length > 0})
    }

    this.factionDivvy = (factions) => {
        for (let r = 0; r < this.room_array.length; r++){
            this.room_array[r].owner = randomIntFromInterval(0, factions.length-1)
            this.room_array[r].is_contested = false
        }

        //Evaluate if contested
        let rooms_with_neighbors = this.filter_rooms_with_neighbors()
        for (let r = 0; r < rooms_with_neighbors.length; r++){
            let room_ref = rooms_with_neighbors[r]
            let neighbor_factions = new Set(room_ref.neighbors.map((e)=>{return e.owner}))
            
            if (neighbor_factions.length > 1 || (neighbor_factions.length == 1 && !neighbor_factions.has(room_ref.owner))){
                room_ref.is_contested = true   
            }
        }
    }
}