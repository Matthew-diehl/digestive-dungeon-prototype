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
namespace ImageProp {
    export const tileMap = ImageProp.create()
}
namespace SpriteKind {
    export const Boss =SpriteKind.create()
}
let direction = 0;
let numOfDirections = 0;
let genLoc: number[] = [];
let startY = 0;
let startX = 0;
let takenRooms: boolean[][] = [];
let floorLayout: number[][] = [];
let roomFilledArray: blockObject.BlockObject[][] = []

let roomEnemiesLeft: number
let chestLooted: boolean

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
let floor = 1;
let initialValue = 0;
let numberOfEdgeRooms = 0;
let currentRoom: number = null;
let GcurrentX: number;
let GcurrentY: number;
let previousX: number;
let previousY: number;

let goingUp: boolean;
let goingDown: boolean;
let goingRight: boolean;
let goingLeft: boolean;

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
//start of initial program loading.
sprites.onDestroyed(SpriteKind.Enemy, function () {
    roomEnemiesLeft--
    if (roomEnemiesLeft == 0) {

        blockControl.raiseEvent(1, 0)
    }
})

scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.chestClosed, function (sprite, location) {
    if (controller.A.isPressed()) {
        tiles.setTileAt(location, sprites.dungeon.chestOpen)
        chestLooted = true
        blockControl.raiseEvent(2, 0)
    }
})


scene.onOverlapTile(SpriteKind.Player, tiles.util.door0, function (sprite, location) {
    if(getCleared(GcurrentX,GcurrentY)){
    GcurrentY = GcurrentY - 1
    goingUp = true
    goingDown = false
    goingLeft = false
    goingRight = false

    blockControl.raiseEvent(3, 0)
    pause(1000)
    }
    

})
scene.onOverlapTile(SpriteKind.Player, tiles.util.door15, function (sprite, location) {
    if(getCleared(GcurrentX,GcurrentY)){
    GcurrentY = GcurrentY + 1

    goingUp = false
    goingDown = true
    goingLeft = false
    goingRight = false
    blockControl.raiseEvent(3, 0)
    pause(1000)
    }
    
})

scene.onOverlapTile(SpriteKind.Player,  tiles.util.door6, function (sprite, location) {
    if(getCleared(GcurrentX,GcurrentY)){
    GcurrentX = GcurrentX - 1
    goingUp = false
    goingDown = false
    goingLeft = true
    goingRight = false
    blockControl.raiseEvent(3, 0)
    pause(1000)
    }
})
scene.onOverlapTile(SpriteKind.Player, tiles.util.door9, function (sprite, location) {
    if(getCleared(GcurrentX,GcurrentY)){
    GcurrentY = GcurrentX + 1
    goingUp = false
    goingDown = false
    goingLeft = false
    goingRight = true
    blockControl.raiseEvent(3, 0)
    pause(1000)
    }
    
})
let gameStarted = false
scene.setBackgroundImage(assets.image`temp`)
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!gameStarted){
        gameStarted = true
        scene.setBackgroundImage(assets.image`Empty`)
        start()
    }
})





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
    return blockObject.getImageProperty(roomFilledArray[row][col], ImageProp.tileMap)
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
        case 1: blockObject.setImageProperty(roomFilledArray[row][col], ImageProp.tileMap,assets.image`room1`);
            break;
        case 2: blockObject.setImageProperty(roomFilledArray[row][col], ImageProp.tileMap,assets.image`Room2`);
            break;
        case 3: blockObject.setImageProperty(roomFilledArray[row][col], ImageProp.tileMap,assets.image`Room3`);
            break;
        case 4: blockObject.setImageProperty(roomFilledArray[row][col], ImageProp.tileMap,assets.image`Room4`);
            break;
        case 5: blockObject.setImageProperty(roomFilledArray[row][col], ImageProp.tileMap,assets.image`Room5`);
            break;
        case 6: blockObject.setImageProperty(roomFilledArray[row][col], ImageProp.tileMap,assets.image`Room6`);
            break;
        case 7: blockObject.setImageProperty(roomFilledArray[row][col], ImageProp.tileMap,assets.image`Room7`);
            break;
        case 8: blockObject.setImageProperty(roomFilledArray[row][col], ImageProp.tileMap,assets.image`Room8`);
            break;
        case 9: blockObject.setImageProperty(roomFilledArray[row][col], ImageProp.tileMap,assets.image`Room9`);
            break;
        default:
            blockObject.setAnyProperty(roomFilledArray[row][col], ImageProp.tileMap,assets.image`emptyRoom`);

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
    
    if (col - 1 < 0) {
        up3 = false
    }
    else if (layout[row][col - 1] == 0) {
        up3 = false
    }
    if (col + 1 > 3) {
        down3 = false
    }
    else if (layout[row][col + 1] == 0) {
        down3 = false
    }
    if (row - 1 < 0) {
        left3 = false
    }
    else if (layout[row - 1][col] == 0) {
        left3 = false
    }
    if (row + 1 > 3) {
        right3 = false
    }
    else if (layout[row + 1][col] == 0) {
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

//start function
function start(){
    //scene.setTileMap(assets.image`Room9`)
    //bossStartSpawn()
    gameStart()
    
}


function bossStartSpawn (){
    tiles.setCurrentTilemap(tilemap`Outside`)
    let monster = sprites.create(assets.image`Monster`, SpriteKind.Boss)
    let player = sprites.create(assets.image`Player`, SpriteKind.Player)
    player.setPosition(128, 170)
    monster.setPosition(128, 60)
    scene.cameraFollowSprite(player)
    controller.moveSprite(player)

    game.onUpdateInterval(5000, function () {
        if (spriteutils.distanceBetween(player, monster) > 20) {

            monster.follow(player, 20)
            pause(3000)
            
        }
    })
}

function gameStart(){
    let player = sprites.create(assets.image`Player`, SpriteKind.Player)
    controller.moveSprite(player)
    floorGen(floor);
    fillRooms(floorLayout)
    GcurrentX = startX;
    GcurrentY = startY;
    fullRoomLoadSequence(GcurrentX,GcurrentY,player)
    
    
    

    
}
function fullRoomLoadSequence (currentX: number, currentY: number, player: Sprite){
    swapRooms(GcurrentX, GcurrentY)
    game.splash("up " + getUp(currentX, currentY) + " down " + getDown(currentX, currentY) + " right " + getRight(currentX, currentY) + " left " + getLeft(currentX, currentY))
    loadRoomTilesEnemies(GcurrentX, GcurrentY)
    
    
    timer.background(function() {
        chestLooted = false        
        roomEnemiesLeft = getEnemies(currentX, currentY)
        game.showLongText("waiting", DialogLayout.Bottom)
        if (roomEnemiesLeft == 0 || getCleared(currentX, currentY)) {
            blockControl.raiseEvent(1, 0)
            
        }
    })
    
    
    
    blockControl.waitForEvent(1, 0)
    timer.background(function() {
        setEnemies(currentX, currentY, 0)
        pause(1000)
        scene.cameraShake(4, 500)
        tiles.coverAllTiles(assets.tile`ChestLocked`, sprites.dungeon.chestClosed)
        if (getCleared(currentX, currentY)) {
            tiles.coverAllTiles(sprites.dungeon.chestClosed, sprites.dungeon.chestOpen)
            chestLooted = true;
            blockControl.raiseEvent(2, 0)
        }
    })
    blockControl.waitForEvent(2, 0)
    setCleared(currentX, currentY, true)
    unlockRoom(currentX,currentY)

    
    blockControl.waitForEvent(3, 0)
    
    if(goingUp){
        player.setPosition(72, 96)
    }
    else if(goingDown){
        player.setPosition(72, 24)
    }
    else if(goingRight){
        player.setPosition(24, 52)
    }
    else{
        player.setPosition(136, 52)
        
    }
    fullRoomLoadSequence(GcurrentX, GcurrentY, player)
    
}

function unlockRoom(currentX:number,currentY:number){
    pause(1000)
    scene.cameraShake(4, 500)

    if (getUp(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door0, sprites.dungeon.doorOpenNorth)
    }
    if (getDown(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door15, sprites.dungeon.doorOpenSouth)
    }
    if (getRight(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door9, sprites.dungeon.doorOpenEast)
    }
    if (getLeft(currentX, currentY)) { 
        tiles.coverAllTiles(tiles.util.door6, sprites.dungeon.doorOpenWest)
    }
}


function loadRoomTilesEnemies(currentX: number, currentY: number){
    // top right corner
    scene.setTile(0, img`
        6 6 6 6 6 c c 6 6 6 6 6 6 6 c f
        7 7 7 7 7 c 7 7 7 7 7 7 7 c f c
        7 7 7 7 c c 7 7 7 7 7 7 c c c 6
        6 6 6 6 c 6 6 6 6 6 6 c c c 7 6
        c c c c c c c c c c c c c 7 7 6
        c 6 7 7 7 7 7 7 7 c c c 6 7 7 6
        c c 6 6 6 6 6 6 c c c c 6 7 7 6
        c c c c c c c c c c 6 c 6 7 7 6
        6 6 6 6 6 6 c c c 6 7 c 6 7 7 6
        6 6 6 6 6 c c c c 6 7 c 6 7 7 c
        c c c c c c c 6 c 6 7 c 6 7 7 c
        6 6 6 c c c 6 6 c 6 7 c 6 7 c c
        c c c c c c 6 6 c 6 7 c 6 c c c
        6 6 c c 6 c 6 6 c 6 7 c c c 7 6
        c f c c 6 c 6 6 c 6 6 c 6 7 7 6
        f c 6 c 6 c 6 6 c 6 c c 6 7 7 6
    `, true)
    // top left corner
    scene.setTile(1, img`
        f c 6 6 6 6 6 6 6 c c c c 6 6 6 
        c f c 7 7 7 7 7 7 7 7 c c 7 7 7 
        6 c c c 7 7 7 7 7 7 7 7 c c 7 7 
        6 7 c c c 6 6 6 6 6 6 6 6 c 6 6 
        6 7 7 c c c c c c c c c c c c c 
        6 7 7 6 c c c 6 7 7 7 7 7 7 6 c 
        6 7 7 6 c c c c 6 6 6 6 6 6 6 6 
        6 7 7 6 c 7 c c c c c c c c c c 
        6 7 7 6 c 7 6 c c c 6 6 6 6 6 6 
        c 7 7 6 c 7 6 c c c c 6 6 6 6 6 
        c c c 6 c 7 6 c 6 c c c c c c c 
        6 7 c c c 7 6 c 6 6 c c c 6 6 6 
        6 7 7 6 c 7 6 c 6 6 c c c c c c 
        6 7 7 6 c 7 6 c 6 6 c 6 c c c 6 
        6 7 7 6 c 6 c c 6 6 c 6 c 6 f c 
        6 7 7 6 c c c c 6 6 c 6 c 6 c f 
        `, true)
    // bottom right corner
    scene.setTile(2, img`
        f c 6 c 6 c 6 6 c c c c 6 7 7 6 
        c f 6 c 6 c 6 6 c c 6 c 6 7 7 6 
        6 c c c 6 c 6 6 c 6 7 c 6 7 7 6 
        c c c c c c 6 6 c 6 7 c 6 7 7 6 
        6 6 6 c c c 6 6 c 6 7 c c c 7 6 
        c c c c c c c 6 c 6 7 c 6 c c c 
        6 6 6 6 6 c c c c 6 7 c 6 7 7 c 
        6 6 6 6 6 6 c c c 6 7 c 6 7 7 6 
        c c c c c c c c c c 7 c 6 7 7 6 
        6 6 6 6 6 6 6 6 c c c c 6 7 7 6 
        c 6 7 7 7 7 7 7 6 c c c 6 7 7 6 
        c c c c c c c c c c c c c 7 7 6 
        6 6 c 6 6 6 6 6 6 6 6 c c c 7 6 
        7 7 c c 7 7 7 7 7 7 7 7 c c c 6 
        7 7 7 c c 7 7 7 7 7 7 7 7 c f c 
        6 6 6 c c c c 6 6 6 6 6 6 6 c f 
        `, true)
    // bottom left corner
    scene.setTile(3, img`
        6 7 7 6 c c 6 c 6 6 c 6 c 6 c f 
        6 7 7 6 c 6 6 c 6 6 c 6 c c f c 
        6 7 c c c 7 6 c 6 6 c 6 c c 6 6 
        c c c 6 c 7 6 c 6 6 c c c c c c 
        c c 7 6 c 7 6 c 6 6 c c c 6 6 6 
        c 7 7 6 c 7 6 c 6 c c c c c c c 
        c 7 7 6 c 7 6 c c c c 6 6 6 6 6 
        6 7 7 6 c 7 6 c c c 6 6 6 6 6 6 
        6 7 7 6 c 6 c c c c c c c c c c 
        6 7 7 6 c c c c 6 6 6 6 6 6 c c 
        6 7 7 6 c c c 7 7 7 7 7 7 7 6 c 
        6 7 7 c c c c c c c c c c c c c 
        6 7 c c c 6 6 6 6 6 6 c 6 6 6 6 
        6 c c c 7 7 7 7 7 7 c c 7 7 7 7 
        c f c 7 7 7 7 7 7 7 c 7 7 7 7 7 
        f c 6 6 6 6 6 6 6 c c 6 6 6 6 6 
        `, true)
    // top walls
    scene.setTile(4, img`
        6 6 6 c c 6 6 6 6 6 6 c c 6 6 6 
        7 7 7 7 c 7 7 7 7 7 7 7 c 7 7 7 
        7 7 7 6 c 7 7 7 7 7 7 7 c 7 7 7 
        6 6 6 6 c 6 6 6 6 6 6 6 c c 6 6 
        c c c c c c c c c c c c c c c c 
        c 6 7 7 7 7 7 6 c 6 7 7 7 7 7 6 
        c c 6 6 6 6 6 6 c c 6 6 6 6 6 6 
        c c c c c c c c c c c c c c c c 
        6 6 6 c 6 6 6 6 6 6 6 6 c 6 6 6 
        6 6 6 c c 6 6 6 6 6 6 6 c 6 6 6 
        c c c c c c c c c c c c c c c c 
        c 6 6 6 6 6 6 c c 6 6 6 6 6 6 c 
        c c c c c c c c c c c c c c c c 
        6 6 c c 6 6 6 6 6 6 c c 6 6 6 6 
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        `, true)
    // left walls
    scene.setTile(5, img`
        6 7 7 6 c 6 6 c 6 6 c c c 6 c c 
        6 7 7 6 c 7 6 c 6 6 c 6 c 6 c c 
        6 7 7 c c 7 6 c 6 6 c 6 c 6 c c 
        c c c c c 7 6 c c c c 6 c 6 c c 
        c 7 7 6 c 7 6 c 6 6 c 6 c c c c 
        6 7 7 6 c 7 6 c 6 6 c 6 c c c c 
        6 7 7 6 c 6 c c 6 6 c 6 c 6 c c 
        6 7 7 6 c c c c 6 6 c c c 6 c c 
        6 7 7 6 c 6 6 c 6 6 c c c 6 c c 
        6 7 7 6 c 7 6 c 6 6 c 6 c 6 c c 
        6 7 7 6 c 7 6 c 6 6 c 6 c 6 c c 
        c c c c c 7 6 c 6 c c 6 c 6 c c 
        c 7 6 6 c 7 6 c c c c 6 c c c c 
        6 7 7 6 c 7 6 c 6 6 c 6 c c c c 
        6 7 7 6 c 6 c c 6 6 c 6 c 6 c c 
        6 7 7 6 c c c c 6 6 c c c 6 c c 
        `, true)
    // bottom walls
    scene.setTile(6, img`
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        6 6 6 6 c c 6 6 6 6 6 6 c c 6 6 
        c c c c c c c c c c c c c c c c 
        c 6 6 6 6 6 6 c c 6 6 6 6 6 6 c 
        c c c c c c c c c c c c c c c c 
        6 6 6 c 6 6 6 6 6 6 6 c c 6 6 6 
        6 6 6 c 6 6 6 6 6 6 6 6 c 6 6 6 
        c c c c c c c c c c c c c c c c 
        6 6 6 6 6 6 c c 6 6 6 6 6 6 c c 
        6 7 7 7 7 7 6 c 6 7 7 7 7 7 6 c 
        c c c c c c c c c c c c c c c c 
        6 6 c c 6 6 6 6 6 6 6 c 6 6 6 6 
        7 7 7 c 7 7 7 7 7 7 7 c 6 7 7 7 
        7 7 7 c 7 7 7 7 7 7 7 c 7 7 7 7 
        6 6 6 c c 6 6 6 6 6 6 c c 6 6 6 
        `, true)
    // right walls
    scene.setTile(7, img`
        c c 6 c c c 6 6 c c c c 6 7 7 6 
        c c 6 c 6 c 6 6 c c 6 c 6 7 7 6 
        c c c c 6 c 6 6 c 6 7 c 6 7 7 6 
        c c c c 6 c c c c 6 7 c 6 6 7 c 
        c c 6 c 6 c c 6 c 6 7 c c c c c 
        c c 6 c 6 c 6 6 c 6 7 c 6 7 7 6 
        c c 6 c 6 c 6 6 c 6 7 c 6 7 7 6 
        c c 6 c c c 6 6 c 6 6 c 6 7 7 6 
        c c 6 c c c 6 6 c c c c 6 7 7 6 
        c c 6 c 6 c 6 6 c c 6 c 6 7 7 6 
        c c c c 6 c 6 6 c 6 7 c 6 7 7 6 
        c c c c 6 c 6 6 c 6 7 c 6 7 7 c 
        c c 6 c 6 c c c c 6 7 c c c c c 
        c c 6 c 6 c 6 6 c 6 7 c c 7 7 6 
        c c 6 c 6 c 6 6 c 6 7 c 6 7 7 6 
        c c 6 c c c 6 6 c 6 6 c 6 7 7 6 
        `, true)
    // top door
    scene.setTile(8, img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 4 4 4 4 4 4 4 4 4 4 4 4 7 7 
        7 4 4 4 4 4 4 4 4 4 4 4 4 4 4 7 
        4 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 
        4 1 4 1 4 1 1 1 4 1 1 1 4 1 1 4 
        4 1 4 1 4 1 4 1 4 1 4 1 4 1 4 4 
        4 1 1 4 4 1 1 1 4 1 1 1 4 1 4 4 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        4 4 4 4 4 4 4 4 1 4 4 4 4 4 4 4 
        4 4 4 4 4 4 4 1 1 4 4 4 4 4 4 4 
        4 4 4 4 4 4 4 4 1 4 4 4 4 4 4 4 
        4 4 4 4 4 4 4 1 1 1 4 4 4 4 4 4 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        `, false)
    // left door
    scene.setTile(9, img`
        3 3 3 c c c c c c c c c c c c c 
        3 3 c c c c c c c c c c c c c c 
        3 c c c c c c c c c c c c c c c 
        3 1 1 c c c c c c c c c c c c c 
        3 1 c 1 c 1 1 1 c 1 1 1 c 1 1 c 
        3 1 c 1 c 1 c 1 c 1 c 1 c 1 c c 
        3 1 1 c c 1 1 1 c 1 1 1 c 1 c c 
        3 c c c c c c c c c c c c c c c 
        3 c c c c c c c c c c c c c c c 
        3 c c c c c c 1 1 c c c c c c c 
        3 c c c c c 1 c c 1 c c c c c c 
        3 c c c c c c c 1 c c c c c c c 
        3 c c c c c c 1 c c c c c c c c 
        3 c c c c c 1 1 1 1 c c c c c c 
        3 3 c c c c c c c c c c c c c c 
        3 3 3 c c c c c c c c c c c c c 
        `, false)
    // right door
    scene.setTile(10, img`
        a a a a a a a a a a a a a 3 3 3 
        a a a a a a a a a a a a a a 3 3 
        a a a a a a a a a a a a a a a 3 
        a 1 1 a a a a a a a a a a a a 3 
        a 1 a 1 a 1 1 1 a 1 1 1 a 1 1 3 
        a 1 a 1 a 1 a 1 a 1 a 1 a 1 a 3 
        a 1 1 a a 1 1 1 a 1 1 1 a 1 a 3 
        a a a a a a a a a a a a a a a 3 
        a a a a a a a 1 1 1 a a a a a 3 
        a a a a a a a a a a 1 a a a a 3 
        a a a a a a a a 1 1 a a a a a 3 
        a a a a a a a a a a 1 a a a a 3 
        a a a a a a a 1 1 1 a a a a a 3 
        a a a a a a a a a a a a a a a 3 
        a a a a a a a a a a a a a a 3 3 
        a a a a a a a a a a a a a 3 3 3 
        `, false)
    // bottom door
    scene.setTile(11, img`
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 1 1 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 1 6 1 6 1 1 1 6 1 1 1 6 1 1 6 
        6 1 6 1 6 1 6 1 6 1 6 1 6 1 6 6 
        6 1 1 6 6 1 1 1 6 1 1 1 6 1 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 1 6 6 1 6 6 6 6 6 
        6 6 6 6 6 6 6 1 6 6 1 6 6 6 6 6 
        6 6 6 6 6 6 6 1 1 1 1 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 1 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 1 6 6 6 6 6 
        7 6 6 6 6 6 6 6 6 6 6 6 6 6 6 7 
        7 7 6 6 6 6 6 6 6 6 6 6 6 6 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        `, false)
    // normal floor
    scene.setTile(12, img`
        b d d d d d d d d d d d d d d c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        c c c c c c c c c c c c c c c a 
        `, false)
    for (let index = 0; index < getEnemies(currentX,currentY); index++) {
        let mySprite = sprites.create(img`
            . . . . . . . . . . b 5 b . . . 
            . . . . . . . . . b 5 b . . . . 
            . . . . . . b b b b b b . . . . 
            . . . . . b b 5 5 5 5 5 b . . . 
            . . . . b b 5 d 1 f 5 5 d f . . 
            . . . . b 5 5 1 f f 5 d 4 c . . 
            . . . . b 5 5 d f b d d 4 4 . . 
            . b b b d 5 5 5 5 5 4 4 4 4 4 b 
            b d d d b b d 5 5 4 4 4 4 4 b . 
            b b d 5 5 5 b 5 5 5 5 5 5 b . . 
            c d c 5 5 5 5 d 5 5 5 5 5 5 b . 
            c b d c d 5 5 b 5 5 5 5 5 5 b . 
            . c d d c c b d 5 5 5 5 5 d b . 
            . . c b d d d d d 5 5 5 b b . . 
            . . . c c c c c c c c b b . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Enemy)
        scene.placeOnRandomTile(mySprite, 13)
    }
    // floor with enemy
    scene.setTile(13, img`
        b d d d d d d d d d d d d d d c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        c c c c c c c c c c c c c c c a 
        `, false)
    // floor w/ chest
    scene.setTile(14,assets.image`Locked`, false)
    // floor w/ hole
    scene.setTile(15, img`
        c c c c c c c c c c c c c c c c 
        b b b c c c b b b b c c c c c d 
        f f c c c c f f f f f c c c f f 
        c c f f f f f c c c f f f f f c 
        f f f c c c f f f f f f c c f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        `, false)

    if(!getUp(currentX,currentY)){
        tiles.coverAllTiles(tiles.util.door0, sprites.dungeon.greenOuterNorth0)
    }
    if (!getDown(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door15, sprites.dungeon.greenOuterSouth1)
    }
    if (!getRight(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door9, sprites.dungeon.greenOuterEast0)
    }   
    if (!getLeft(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door6, sprites.dungeon.greenOuterWest0)
    }
}



function floorGen(floorNum: number) {
    startX = randint(0, 3)
    startY = randint(0, 3)
    GcurrentX = startX
    GcurrentY = startY
    floorLayout[startX][startY] = 1
    takenRooms[startX][startY] = true
    genLoc = [GcurrentX * 10 + GcurrentY]
    let newSum = sumFloorLayout(floorLayout);
    while (newSum < 9) {
        let k = 0
        let right = false
        let left = false
        let down = false
        let up = false
        numOfDirections = randint(1, 3)
        if(newSum >= 2){numOfDirections = 1}
        GcurrentX = (genLoc[0]- genLoc[0]%10) / 10;
        GcurrentY = genLoc[0] % 10;
        while (genLoc.length != 0 || genLoc != null){
            if (GcurrentY - 1 < 0 || GcurrentY + 1 > 3 || GcurrentX - 1 < 0 || GcurrentX + 1 > 3){
                // case up is out of bounds
                if (GcurrentY - 1 < 0 && GcurrentY + 1 <= 3 && GcurrentX + 1 <= 3 && GcurrentX - 1 >= 0){
                    if (takenRooms[GcurrentX][GcurrentY + 1] == true && takenRooms[GcurrentX - 1][GcurrentY] == true && takenRooms[GcurrentX + 1][GcurrentY] == true){
                        genLoc.shift();
                        if (genLoc != null) {
                            GcurrentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            GcurrentY = genLoc[0] % 10;
                        }
                    }
                    else{
                        break;
                    }
                }
                    // case down is out of bounds
                else if (GcurrentY - 1 >= 0 && GcurrentY + 1 > 3 && GcurrentX + 1 <= 3 && GcurrentX - 1 >= 0) {
                    if (takenRooms[GcurrentX][GcurrentY - 1] == true && takenRooms[GcurrentX - 1][GcurrentY] == true && takenRooms[GcurrentX + 1][GcurrentY] == true ){
                        genLoc.shift();
                        if (genLoc != null) {
                            GcurrentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            GcurrentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                    //case left is out of bounds
                else if (GcurrentY - 1 >= 0 && GcurrentY + 1 <= 3 && GcurrentX + 1 <= 3 && GcurrentX - 1 < 0) {
                    if (takenRooms[GcurrentX][GcurrentY - 1] == true && takenRooms[GcurrentX][GcurrentY + 1] == true && takenRooms[GcurrentX + 1][GcurrentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            GcurrentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            GcurrentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                //case right is out of bounds
                else if (GcurrentY - 1 >= 0 && GcurrentY + 1 <= 3 && GcurrentX + 1 > 3 && GcurrentX - 1 >= 0) {
                    if (takenRooms[GcurrentX][GcurrentY - 1] == true && takenRooms[GcurrentX][GcurrentY + 1] == true && takenRooms[GcurrentX - 1][GcurrentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            GcurrentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            GcurrentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                // case up and left are out of bounds
                else if (GcurrentY - 1 < 0 && GcurrentY + 1 <= 3 && GcurrentX + 1 <= 3 && GcurrentX - 1 < 0) {
                    if (takenRooms[GcurrentX][GcurrentY + 1] == true && takenRooms[GcurrentX + 1][GcurrentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            GcurrentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            GcurrentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                // case up and right are out of bounds
                else if (GcurrentY - 1 < 0 && GcurrentY + 1 <= 3 && GcurrentX + 1 > 3 && GcurrentX - 1 >= 0) {
                    if (takenRooms[GcurrentX][GcurrentY + 1] == true && takenRooms[GcurrentX - 1][GcurrentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            GcurrentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            GcurrentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                //case down and left are out of bounds
                else if (GcurrentY - 1 >= 0 && GcurrentY + 1 > 3 && GcurrentX + 1 <= 3 && GcurrentX - 1 < 0) {
                    if (takenRooms[GcurrentX][GcurrentY - 1] == true && takenRooms[GcurrentX + 1][GcurrentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            GcurrentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            GcurrentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                //case down and right are out of bounds
                else if (GcurrentY - 1 >= 0 && GcurrentY + 1 > 3 && GcurrentX + 1 > 3 && GcurrentX - 1 >= 0) {
                    if (takenRooms[GcurrentX][GcurrentY - 1] == true && takenRooms[GcurrentX - 1][GcurrentY] == true) {
                        genLoc.shift();
                        if (genLoc != null) {
                            GcurrentX = (genLoc[0] - genLoc[0] % 10) / 10;
                            GcurrentY = genLoc[0] % 10;
                        }
                    }
                    else {
                        break;
                    }
                }
                // case all in bounds but full
            } else if (GcurrentY - 1 >= 0 && GcurrentY + 1 <= 3 && GcurrentX + 1 <= 3 && GcurrentX - 1 >= 0){
                if (takenRooms[GcurrentX][GcurrentY - 1] == true && takenRooms[GcurrentX][GcurrentY + 1] == true && takenRooms[GcurrentX - 1][GcurrentY] == true && takenRooms[GcurrentX + 1][GcurrentY] == true ){
                if(genLoc != null){
                genLoc.shift();
                }
                if (genLoc != null){
                    GcurrentX = (genLoc[0] - genLoc[0] % 10) / 10;
                    GcurrentY = genLoc[0] % 10;
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
        if (GcurrentY - 1 >= 0 && up == true && takenRooms[GcurrentX][GcurrentY - 1] == false) {
            floorLayout[GcurrentX][GcurrentY - 1] = 1
            takenRooms[GcurrentX][GcurrentY - 1] = true
            genLoc.push((GcurrentX * 10) + GcurrentY - 1)
        }
        if (GcurrentY + 1 <= 3 && down == true && takenRooms[GcurrentX][GcurrentY + 1] == false) {
            floorLayout[GcurrentX][GcurrentY + 1] = 1
            takenRooms[GcurrentX][GcurrentY + 1] = true
            genLoc.push((GcurrentX * 10) + GcurrentY + 1)
        }
        if (GcurrentX - 1 >= 0 && left == true && takenRooms[GcurrentX - 1][GcurrentY] == false) {
            floorLayout[GcurrentX - 1][GcurrentY] = 1
            takenRooms[GcurrentX - 1][GcurrentY] = true
            genLoc.push(((GcurrentX - 1) * 10) + GcurrentY)
        }
        if (GcurrentX + 1 <= 3 && right == true && takenRooms[GcurrentX + 1][GcurrentY] == false) {
            floorLayout[GcurrentX + 1][GcurrentY] = 1
            takenRooms[GcurrentX + 1][GcurrentY] = true
            genLoc.push(((GcurrentX + 1) * 10) + GcurrentY)
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
    for (let a = 0; a < layout.length; a++) {
        for (let b = 0; b < layout[a].length; b++) {
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
    tiles.setCurrentTilemap(tilemap`empty`)
    scene.setTileMap(getTileMap(currentX, currentY))
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