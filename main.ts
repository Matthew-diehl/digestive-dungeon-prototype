namespace NumProp {
    export const enemies = NumProp.create()
}
namespace BoolProp {
    export const cleared = BoolProp.create()
    export const empty = BoolProp.create()
    export const chest = BoolProp.create()
    export const boss = BoolProp.create()
    export const left = BoolProp.create()
    export const right = BoolProp.create()
    export const up = BoolProp.create()
    export const down = BoolProp.create()

}
namespace AnyProp {
    export const tileMap = AnyProp.create()
}
let direction = 0;
let numOfDirections = 0;
let genLoc: number[] = [];
let startY = 0;
let startX = 0;
let takenRooms: boolean[][] = [];
let floorLayout: number[][] = [];
let roomFilledArray: blockObject.BlockObject[][] = []

roomFilledArray = [
    [
        blockObject.create(),
        blockObject.create(),
        blockObject.create(),
        blockObject.create()
    ],
    [
        blockObject.create(),
        blockObject.create(),
        blockObject.create(),
        blockObject.create()
    ],
    [
        blockObject.create(),
        blockObject.create(),
        blockObject.create(),
        blockObject.create()
    ],
    [
        blockObject.create(),
        blockObject.create(),
        blockObject.create(),
        blockObject.create()
    ]
]
let floor = 0;
let initialValue = 0;
let numberOfEdgeRooms = 0;
let rooms = [tiles.createMap(tilemap`level2`)];
rooms[0] = tiles.createMap(tilemap`room0`);
rooms[1] = tiles.createMap(tilemap`room4`);
rooms[2] = tiles.createMap(tilemap`room2`);
rooms[3] = tiles.createMap(tilemap`room6`);
let currentRoom: number = null;
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
floorGen(floor);
fillRooms(floorLayout)
currentX = startX;
currentY = startY;

console.log("Post room filling:")
for (let i = 0; i <= floorLayout.length - 1; i++) {
    let message = "";
    for (let j = 0; j <= floorLayout[i].length - 1; j++) {
        message = message + floorLayout[i][j].toString() + "\t";
    }
    console.log(message)
}
swapRooms(currentX,currentY)
//end of onStart code


// getters
function getUp(row: number, col: number) {
    return blockObject.getBooleanProperty(roomFilledArray[row][col], BoolProp.up)
}
function getDown(row: number, col: number) {
    return blockObject.getBooleanProperty(roomFilledArray[row][col], BoolProp.down)
}
function getLeft(row: number, col: number) {
    return blockObject.getBooleanProperty(roomFilledArray[row][col], BoolProp.left)
}
function getRight(row: number, col: number) {
    return blockObject.getBooleanProperty(roomFilledArray[row][col], BoolProp.right)
}
function getTileMap(row: number, col: number) {
    return blockObject.getAnyProperty(roomFilledArray[row][col], AnyProp.tileMap)
}
function getEmpty(row: number, col: number) {
    return blockObject.getBooleanProperty(roomFilledArray[row][col], BoolProp.empty)
}
function getCleared(row: number, col: number) {
    return blockObject.getBooleanProperty(roomFilledArray[row][col], BoolProp.cleared)
}
function getChest(row: number, col: number) {
    return blockObject.getBooleanProperty(roomFilledArray[row][col], BoolProp.chest)
}
function getBoss(row: number, col: number) {
    return blockObject.getBooleanProperty(roomFilledArray[row][col], BoolProp.boss)
}
function getEnemies(row: number, col: number) {
    return blockObject.getNumberProperty(roomFilledArray[row][col], NumProp.enemies)
}
// setters
function setEmpty(row: number, col: number, empty: boolean) {
    blockObject.setBooleanProperty(roomFilledArray[row][col], BoolProp.empty, empty)
}
function setCleared(row: number, col: number, cleared: boolean) {
    blockObject.setBooleanProperty(roomFilledArray[row][col], BoolProp.cleared, cleared)
}

function setTileMap(row: number, col: number, tile: number) {
    switch (tile) {
        case 1: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`room0`);
            break;
        case 2: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap, tilemap`room0`);
            break;
        case 3: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap, tilemap`room0`);
            break;
        case 4: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap, tilemap`room0`);
            break;
        case 5: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap, tilemap`room0`);
            break;
        case 6: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap, tilemap`room0`);
            break;
        case 7: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap, tilemap`room0`);
            break;
        case 8: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap, tilemap`room0`);
            break;
        case 9: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap, tilemap`room0`);
            break;
        default:
            blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`level9`);

    }

}
function setBoss(row: number, col: number, boss: boolean) {
    blockObject.setBooleanProperty(roomFilledArray[row][col], BoolProp.boss, boss)
}
function setLeft(row: number, col: number, left: boolean) {
    blockObject.setBooleanProperty(roomFilledArray[row][col], BoolProp.left, left)
}
function setRight(row: number, col: number, right: boolean) {
    blockObject.setBooleanProperty(roomFilledArray[row][col], BoolProp.right, right)
}
function setUp(row: number, col: number, up: boolean) {
    blockObject.setBooleanProperty(roomFilledArray[row][col], BoolProp.up, up)
}
function setDown(row: number, col: number, down: boolean) {
    blockObject.setBooleanProperty(roomFilledArray[row][col], BoolProp.down, down)
}

function setDoors(row: number, col: number, layout: number[][]) {
    //this will set flags on the objects so we know which directions need doors
    let up3 = true
    let down3 = true
    let left3 = true
    let right3 = true
    if (row - 1 < 0) {
        up3 = false
    }
    else if (layout[row - 1][col] == 0) {
        up3 = false
    }
    if (row + 1 > 3) {
        down3 = false
    }
    else if (layout[row + 1][col] == 0) {
        down3 = false
    }
    if (col - 1 < 0) {
        left3 = false
    }
    else if (layout[row][col - 1] == 0) {
        left3 = false
    }
    if (col + 1 > 3) {
        right3 = false
    }
    else if (layout[row][col + 1] == 0) {
        right3 = false
    }
    // if the direction is still true there is a room to that side of the current room.
    if (up3) {
        setUp(row, col, true)
    }
    else {
        setUp(row, col, false)
    }
    if (down3) {
        setDown(row, col, true)
    }
    else {
        setDown(row, col, false)
    }
    if (left3) {
        setLeft(row, col, true)
    }
    else {
        setLeft(row, col, false)
    }
    if (right3) {
        setRight(row, col, true)
    }
    else {
        setRight(row, col, false)
    }

}
function setEnemies(row: number, col: number, enemies: number) {
    blockObject.setNumberProperty(roomFilledArray[row][col], NumProp.enemies, enemies)
}
function setChest(row: number, col: number, chest: boolean) {
    blockObject.setBooleanProperty(roomFilledArray[row][col], BoolProp.chest, chest)
}
//end of getters and setters



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
    console.log("pre room filling:")
    for (let i = 0; i <= floorLayout.length - 1; i++) {
        let message = "";
        for (let j = 0; j <= floorLayout[i].length - 1; j++) {
            message = message + floorLayout[i][j].toString() + "\t";
        }
        console.log(message)
    }
    if(numberOfEdgeRooms < 1){
        floorGen(floor)
    }
    floorLayout[startX][startY] = 9;

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

function fillRooms(layout: number[][]){
    //mark boss room first
    let distance = 0
    let bossMarked = false;
    for (let i = 0; i < layout.length; i++) {
        for (let j = 0; j < layout[i].length; j++) {
            if (layout[i][j] == 2) {
                if ((Math.abs(i - startX) + Math.abs(j - startY)) > distance){
                    distance = Math.abs(i - startX) + Math.abs(j - startY);
                }
            }
        }
    }
    for (let i = 0; i < layout.length; i++) {
        for (let j = 0; j < layout[i].length; j++) {
            if (layout[i][j] == 2) {
                if ((Math.abs(i - startX) + Math.abs(j - startY)) == distance && bossMarked == false) {
                    layout[i][j] = 3;
                    bossMarked = true;
                }
            }
        }
    }
    // Now empty rooms are 1, edge rooms are 2, the boss room is 3, and start room is 9.
    // Next the empty rooms will get marked with a random room number from 4 to 8.
    for (let i = 0; i < layout.length; i++) {
        for (let j = 0; j < layout[i].length; j++) {
            if (layout[i][j] == 1) {
                layout[i][j] = randint(4, 8);
            }
        }
    }
    // Next fill in an empty array with Objects of rooms corresponding to the number in each location
    for (let a = 0; a <= layout.length - 1; a++) {
        for (let b = 0; b <= layout[a].length - 1; b++) {
            // roomFilledArray[i][j] = { tileMap: 0, enemies: 0, chest: false, cleared: true, boss: false, empty: false}
            if (layout[a][b] == 9) {
                setTileMap(a, b, layout[a][b])
                setEnemies(a, b, 0)
                setChest(a, b, false)
                setCleared(a, b, true)
                setBoss(a, b, false)
                setEmpty(a, b, false)
                setDoors(a, b, layout)

            }
            // roomFilledArray[i][j] = { tileMap: 1, enemies: 3, chest: true, cleared: false, boss: false, empty: false}
            if (layout[a][b] == 2) {
                setTileMap(a, b, layout[a][b])
                setEnemies(a, b, 3)
                setChest(a, b, true)
                setCleared(a, b, false)
                setBoss(a, b, false)
                setEmpty(a, b, false)
                setDoors(a, b, layout)
            }
            // roomFilledArray[i][j] = { tileMap: 2, enemies: 2, chest: true, cleared: false, boss: true, empty: false}
            if (layout[a][b] == 3) {
                setTileMap(a, b, layout[a][b])
                setEnemies(a, b, 2)
                setChest(a, b, true)
                setCleared(a, b, false)
                setBoss(a, b, true)
                setEmpty(a, b, false)
                setDoors(a, b, layout)
            }
            // roomFilledArray[i][j] = { tileMap: 3, enemies: randint(2, 4), chest: false, cleared: false, boss: false, empty: false }
            if (layout[a][b] == 4) {
                setTileMap(a, b, layout[a][b])
                setEnemies(a, b, randint(2, 4))
                setChest(a, b, false)
                setCleared(a, b, false)
                setBoss(a, b, false)
                setEmpty(a, b, false)
                setDoors(a, b, layout)
            }
            // roomFilledArray[i][j] = { tileMap: 3, enemies: randint(3, 5), chest: true, cleared: false, boss: false, empty: false }
            if (layout[a][b] == 5) {
                setTileMap(a, b, layout[a][b])
                setEnemies(a, b, randint(3, 5))
                setChest(a, b, true)
                setCleared(a, b, false)
                setBoss(a, b, false)
                setEmpty(a, b, false)
                setDoors(a, b, layout)
            }
            // roomFilledArray[i][j] = { tileMap: 3, enemies: randint(1, 2), chest: false, cleared: false, boss: false, empty: false }
            if (layout[a][b] == 6) {
                setTileMap(a, b, layout[a][b])
                setEnemies(a, b, randint(1, 2))
                setChest(a, b, false)
                setCleared(a, b, false)
                setBoss(a, b, false)
                setEmpty(a, b, false)
                setDoors(a, b, layout)
            }
            // roomFilledArray[i][j] = { tileMap: 3, enemies: randint(2, 4), chest: false, cleared: false, boss: false, empty: false }
            if (layout[a][b] == 7) {
                setTileMap(a, b, layout[a][b])
                setEnemies(a, b, randint(2, 4))
                setChest(a, b, false)
                setCleared(a, b, false)
                setBoss(a, b, false)
                setEmpty(a, b, false)
                setDoors(a, b, layout)
            }
            // roomFilledArray[i][j] = { tileMap: 3, enemies: 4, chest: true, cleared: false, boss: false, empty: false }
            if (layout[a][b] == 8) {
                setTileMap(a, b, layout[a][b])
                setEnemies(a, b, 4)
                setChest(a, b, true)
                setCleared(a, b, false)
                setBoss(a, b, false)
                setEmpty(a, b, false)
                setDoors(a, b, layout)
            }
            // roomFilledArray[i][j] = { tileMap: 4, empty: true}
            if (layout[a][b] == 0) {
                setEmpty(a, b, true)
            }
        }
    }

}
//when you leave one room and enter another this function will swap out the old room for the new one. this is a wip.
function swapRooms(currentX: number, currentY: number){
    if(currentRoom == null){
        tiles.setCurrentTilemap(getTileMap(currentX, currentY))       
    }
    //pick up here matt to swap to all other rooms correctly!!!

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