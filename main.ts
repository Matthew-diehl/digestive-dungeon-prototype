
let direction = 0;
let numOfDirections = 0;
let genLoc: number[] = [];
let startY = 0;
let startX = 0;
let takenRooms: boolean[][] = [];
let floorLayout: number[][] = [];
let floor = 0;
let initialValue = 0;
let numberOfEdgeRooms = 0;
let rooms = [tiles.createMap(tilemap`level2`)];
rooms[0] = tiles.createMap(tilemap`room0`);
rooms[1] = tiles.createMap(tilemap`room4`);
rooms[2] = tiles.createMap(tilemap`room2`);
rooms[3] = tiles.createMap(tilemap`room6`);
let currentX;
let currentY;
floorLayout = [
[
0,
0,
0,
0
],
[
0,
0,
0,
0
],
[
0,
0,
0,
0
],
[
0,
0,
0,
0
]
]
takenRooms = [
[
false,
false,
false,
false
],
[
false,
false,
false,
false
],
[
false,
false,
false,
false
],
[
false,
false,
false,
false
]
]
floorGen(1);


function floorGen(floorNum: number) {
    startX = randint(0, 3)
    startY = randint(0, 3)
    currentX = startX
    currentY = startY
    floorLayout[startX][startY] = 1
    takenRooms[startX][startY] = true
    genLoc = [currentX * 10 + currentY]
    let newSum = sumFloorLayout(floorLayout);
    while (newSum < 9) {
        let k = 0
        let right = false
        let left = false
        let down = false
        let up = false
        numOfDirections = randint(1, 3)
        if(newSum >= 2){numOfDirections = 1}
        currentX = (genLoc[0]- genLoc[0]%10) / 10;
        currentY = genLoc[0] % 10;
        while (genLoc.length != 0 || genLoc != null){
            if (currentY - 1 < 0 || currentY + 1 > 3 || currentX - 1 < 0 || currentX + 1 > 3){
                // case up is out of bounds
                if (currentY - 1 < 0 && currentY + 1 <= 3 && currentX + 1 <= 3 && currentX - 1 >= 0){
                    if (takenRooms[currentX][currentY + 1] == true && takenRooms[currentX - 1][currentY] == true && takenRooms[currentX + 1][currentY] == true){
                        genLoc.shift();
                        if (genLoc != null) {
                            currentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            currentY = genLoc[0] % 10;
                        }
                    }
                    else{
                        break;
                    }
                }
                    // case down is out of bounds
                else if (currentY - 1 >= 0 && currentY + 1 > 3 && currentX + 1 <= 3 && currentX - 1 >= 0) {
                    if (takenRooms[currentX][currentY - 1] == true && takenRooms[currentX - 1][currentY] == true && takenRooms[currentX + 1][currentY] == true ){
                        genLoc.shift();
                        if (genLoc != null) {
                            currentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            currentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                    //case left is out of bounds
                else if (currentY - 1 >= 0 && currentY + 1 <= 3 && currentX + 1 <= 3 && currentX - 1 < 0) {
                    if (takenRooms[currentX][currentY - 1] == true && takenRooms[currentX][currentY + 1] == true && takenRooms[currentX + 1][currentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            currentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            currentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                //case right is out of bounds
                else if (currentY - 1 >= 0 && currentY + 1 <= 3 && currentX + 1 > 3 && currentX - 1 >= 0) {
                    if (takenRooms[currentX][currentY - 1] == true && takenRooms[currentX][currentY + 1] == true && takenRooms[currentX - 1][currentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            currentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            currentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                // case up and left are out of bounds
                else if (currentY - 1 < 0 && currentY + 1 <= 3 && currentX + 1 <= 3 && currentX - 1 < 0) {
                    if (takenRooms[currentX][currentY + 1] == true && takenRooms[currentX + 1][currentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            currentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            currentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                // case up and right are out of bounds
                else if (currentY - 1 < 0 && currentY + 1 <= 3 && currentX + 1 > 3 && currentX - 1 >= 0) {
                    if (takenRooms[currentX][currentY + 1] == true && takenRooms[currentX - 1][currentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            currentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            currentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                //case down and left are out of bounds
                else if (currentY - 1 >= 0 && currentY + 1 > 3 && currentX + 1 <= 3 && currentX - 1 < 0) {
                    if (takenRooms[currentX][currentY - 1] == true && takenRooms[currentX + 1][currentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            currentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            currentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                //case down and right are out of bounds
                else if (currentY - 1 >= 0 && currentY + 1 > 3 && currentX + 1 > 3 && currentX - 1 >= 0) {
                    if (takenRooms[currentX][currentY - 1] == true && takenRooms[currentX - 1][currentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            currentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            currentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                // case all in bounds but full
            } else if (currentY - 1 >= 0 && currentY + 1 <= 3 && currentX + 1 <= 3 && currentX - 1 >= 0){
                if (takenRooms[currentX][currentY - 1] == true && takenRooms[currentX][currentY + 1] == true && takenRooms[currentX - 1][currentY] == true && takenRooms[currentX + 1][currentY] == true ){
                if(genLoc != null){
                genLoc.shift();
                }
                if (genLoc != null){
                    currentX = (genLoc[0] - genLoc[0] % 10) / 10;
                    currentY = genLoc[0] % 10;
                }
                }
                else{
                    break;
                }
            }
            else{
                break;
            }
       }
        if(genLoc.length == 0 || genLoc == null) {
            for(let m = 0; m < takenRooms.length;m++){
                for(let n = 0; n < takenRooms[m].length;n++){
                    if(takenRooms[m][n] == true){
                            genLoc.push((m*10)+n)
                    }
                }
            }
        }
        while (k < numOfDirections) {
            direction = randint(1, 4)
            // up
            if (direction == 1 && up == false) {
                up = true
                numOfDirections += -1
            } else {
                direction = randint(1, 4)
            }
            // down
            if (direction == 2 && down == false) {
                down = true
                numOfDirections += -1
            } else {
                direction = randint(1, 4)
            }
            // left
            if (direction == 3 && left == false) {
                left = true
                numOfDirections += -1
            } else {
                direction = randint(1, 4)
            }
            // right
            if (direction == 4 && right == false) {
                right = true
                numOfDirections += -1
            } else {
                direction = randint(1, 4)
            }
        }
        // checking if direction and its inside the 4x4 floor grid
        if (currentY - 1 >= 0 && up == true && takenRooms[currentX][currentY - 1] == false) {
            floorLayout[currentX][currentY - 1] = 1
            takenRooms[currentX][currentY - 1] = true
            genLoc.push((currentX * 10) + currentY - 1)
        }
        if (currentY + 1 <= 3 && down == true && takenRooms[currentX][currentY + 1] == false) {
            floorLayout[currentX][currentY + 1] = 1
            takenRooms[currentX][currentY + 1] = true
            genLoc.push((currentX * 10) + currentY + 1)
        }
        if (currentX - 1 >= 0 && left == true && takenRooms[currentX - 1][currentY] == false) {
            floorLayout[currentX - 1][currentY] = 1
            takenRooms[currentX - 1][currentY] = true
            genLoc.push(((currentX - 1) * 10) + currentY)
        }
        if (currentX + 1 <= 3 && right == true && takenRooms[currentX + 1][currentY] == false) {
            floorLayout[currentX + 1][currentY] = 1
            takenRooms[currentX + 1][currentY] = true
            genLoc.push(((currentX + 1) * 10) + currentY)
        }
        newSum = sumFloorLayout(floorLayout);
        genLoc.shift()
    }
    
    console.log("sum: " + newSum)
    findEdgeRooms(floorLayout);
    for (let i = 0; i <= floorLayout.length - 1; i++) {
        let message = "";
        for (let j = 0; j <= floorLayout[i].length - 1; j++) {
            message = message + floorLayout[i][j].toString() + "\t";
        }
        console.log(message)
    }

}

function sumAround(layout: number[][], c: number, v: number){
    let sum = 0;
    let up = true;
    let down = true;
    let left = true;
    let right = true;

    if (c-1 < 0){
        up = false;
    }
    if (c + 1 > 3) {
        down = false;
    }
    if (v - 1 < 0) {
        left = false;
    }
    if (v + 1 > 3) {
        right = false;
    }
    
    if(up == true){
        sum = sum+layout[c-1][v];
    }
    if(down == true){
        sum = sum+layout[c+1][v];
    }
    if(left == true){
        sum = sum+layout[c][v-1];
    }
    if (right == true) {
        sum = sum+layout[c][v+1];
    }

    return sum;
}


function findEdgeRooms(layout: number[][]){
    let i = 0
    let j = 0
    for (i = 0; i < layout.length; i++) {
        for (j = 0; j < layout[i].length; j++) {
            if(sumAround(layout, i, j) == 1){
                layout[i][j] = 2;
                numberOfEdgeRooms ++;
            }
        }
    }
}



function sumFloorLayout(layout: number[][]) {
    let sum: number = 0
    let i = 0
    let j = 0
    for ( i = 0; i < layout.length; i++) {
        for ( j = 0; j < layout[i].length; j++) {
            sum = sum + layout[i][j]
        }
    }
    return sum
}