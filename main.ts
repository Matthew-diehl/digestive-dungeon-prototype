 namespace NumProp {
    export const enemies = NumProp.create()
    export const damage = NumProp.create()
}
namespace SpriteKind {
    export const hurt = SpriteKind.create()
    export const item = SpriteKind.create()
    export const weapon = SpriteKind.create()
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
namespace ImageProp {
    export const image = ImageProp.create()
}
namespace SpriteKind {
    export const Boss =SpriteKind.create()
}
let directionOfRoomGen = 0;
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

//Movement variables
let weapon_drop: Sprite = null
let mySprite3: Sprite = null
let last_inventory_select = 0
let last_toolbar_select = 0
let cursor_in_inventory = false
let in_inventory = false
let item_drop: Sprite = null
let projectile4: Sprite = null
let Projectile3: Sprite = null
let projectile2: Sprite = null
let projectile: Sprite = null
let inventory: Inventory.Inventory = null
let item: Inventory.Item = null
let toolbar: Inventory.Toolbar = null
let direction = 2
let weapon_labels: string[] = []
let weaponSprites: blockObject.BlockObject[] = []
let all_weapons: Image[] = []
let all_labels: string[] = []
let all_items: Image[] = []
let myEnemy: Sprite = null
let mySprite: Sprite = null
let menuOpen: boolean = false
let playerMaxHealth = 3
let playerDamage = 100/playerMaxHealth +1

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

//direction listeners
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    direction = 1
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    direction = 2
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    direction = 3
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    direction = 4
})
//end of direction listeners
sprites.onDestroyed(SpriteKind.Enemy, function () {
    roomEnemiesLeft--
    if (roomEnemiesLeft == 0) {

        blockControl.raiseEvent(1, 0)
    }
})

all_items = [img`
    . . . . c c c b b b b b . . . . 
    . . c c b 4 4 4 4 4 4 b b b . . 
    . c c 4 4 4 4 4 5 4 4 4 4 b c . 
    . e 4 4 4 4 4 4 4 4 4 5 4 4 e . 
    e b 4 5 4 4 5 4 4 4 4 4 4 4 b c 
    e b 4 4 4 4 4 4 4 4 4 4 5 4 4 e 
    e b b 4 4 4 4 4 4 4 4 4 4 4 b e 
    . e b 4 4 4 4 4 5 4 4 4 4 b e . 
    8 7 e e b 4 4 4 4 4 4 b e e 6 8 
    8 7 2 e e e e e e e e e e 2 7 8 
    e 6 6 2 2 2 2 2 2 2 2 2 2 6 c e 
    e c 6 7 6 6 7 7 7 6 6 7 6 c c e 
    e b e 8 8 c c 8 8 c c c 8 e b e 
    e e b e c c e e e e e c e b e e 
    . e e b b 4 4 4 4 4 4 4 4 e e . 
    . . . c c c c c e e e e e . . . 
    `]
all_labels = ["Burger"]
all_weapons = [img`
    . . . . . . b b b b . . . . . . 
    . . . . . . b 4 4 4 b . . . . . 
    . . . . . . b b 4 4 4 b . . . . 
    . . . . . b 4 b b b 4 4 b . . . 
    . . . . b d 5 5 5 4 b 4 4 b . . 
    . . . . b 3 2 3 5 5 4 e 4 4 b . 
    . . . b d 2 2 2 5 7 5 4 e 4 4 e 
    . . . b 5 3 2 3 5 5 5 5 e e e e 
    . . b d 7 5 5 5 3 2 3 5 5 e e e 
    . . b 5 5 5 5 5 2 2 2 5 5 d e e 
    . b 3 2 3 5 7 5 3 2 3 5 d d e 4 
    . b 2 2 2 5 5 5 5 5 5 d d e 4 . 
    b d 3 2 d 5 5 5 d d d 4 4 . . . 
    b 5 5 5 5 d d 4 4 4 4 . . . . . 
    4 d d d 4 4 4 . . . . . . . . . 
    4 4 4 4 . . . . . . . . . . . . 
    `, img`
    4 4 4 . . 4 4 4 4 4 . . . . . . 
    4 5 5 4 4 5 5 5 5 5 4 4 . . . . 
    b 4 5 5 1 5 1 1 1 5 5 5 4 . . . 
    . b 5 5 5 5 1 1 5 5 1 1 5 4 . . 
    . b d 5 5 5 5 5 5 5 5 1 1 5 4 . 
    b 4 5 5 5 5 5 5 5 5 5 5 1 5 4 . 
    c d 5 5 5 5 5 5 5 5 5 5 5 5 5 4 
    c d 4 5 5 5 5 5 5 5 5 5 5 1 5 4 
    c 4 5 5 5 d 5 5 5 5 5 5 5 5 5 4 
    c 4 d 5 4 5 d 5 5 5 5 5 5 5 5 4 
    . c 4 5 5 5 5 d d d 5 5 5 5 5 b 
    . c 4 d 5 4 5 d 4 4 d 5 5 5 4 c 
    . . c 4 4 d 4 4 4 4 4 d d 5 d c 
    . . . c 4 4 4 4 4 4 4 4 5 5 5 4 
    . . . . c c b 4 4 4 b b 4 5 4 4 
    . . . . . . c c c c c c b b 4 . 
    `]
weaponSprites = [blockObject.create(), blockObject.create()]
for (let index = 0; index <= all_weapons.length - 1; index++) {
    SetSprite(index, all_weapons[index])
    setDamage(index, 4)
}
weapon_labels = ["pizza", "lemon"]

sprites.onOverlap(SpriteKind.Player, SpriteKind.weapon, function (sprite, otherSprite) {
    for (let index = 0; index <= all_weapons.length - 1; index++) {
        for (let item of toolbar.get_items()) {
            if (item.image == all_weapons[index]) {
                if (toolbar.get_items() != []) {
                    toolbar.set_items([])
                }
                mySprite3 = sprites.create(all_weapons[index], SpriteKind.weapon)
                spawn_weapon(mySprite3)
                pause(100)
                break;
            }
        }
        if (otherSprite.image.equals(all_weapons[index])) {
            if (add_weapon([Inventory.create_item(weapon_labels[index], all_weapons[index])])) {
                sprites.destroy(otherSprite)
                break;
            }
        }
    }
})



sprites.onOverlap(SpriteKind.Player, SpriteKind.item, function (sprite, otherSprite) {
    for (let index = 0; index <= all_items.length - 1; index++) {
        if (otherSprite.image.equals(all_items[index])) {
            if (add_item([Inventory.create_item(all_labels[index], all_items[index])])) {
                sprites.destroy(otherSprite)
                break;
            }
        }
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
        blockControl.raiseEvent(5, 0)
    }
})
blockControl.waitForEvent(5, 0)
start()




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
function getDamage(index: number){
    return blockObject.getNumberProperty(weaponSprites[index], NumProp.damage)
}
// setters
function setDamage(index: number, damage: number) {
    blockObject.setNumberProperty(weaponSprites[index], NumProp.damage, damage)
}
function SetSprite(index: number, image2: Image) {
    blockObject.setImageProperty(weaponSprites[index], ImageProp.image, image2)
}
function setEmpty(row: number, col: number, empty: boolean) {
    blockObject.setBooleanProperty(roomFilledArray[row][col], BoolProp.empty, empty)
}
function setCleared(row: number, col: number, cleared: boolean) {
    blockObject.setBooleanProperty(roomFilledArray[row][col], BoolProp.cleared, cleared)
}

function setTileMap(row: number, col: number, tile: number) {
    switch (tile) {
        case 1: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`Tilemap9`);
            break;
        case 2: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`Tilemap2`);
            break;
        case 3: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`Tilemap3`);
            break;
        case 4: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`Tilemap4`);
            break;
        case 5: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`Tilemap5`);
            break;
        case 6: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`Tilemap6`);
            break;
        case 7: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`Tilemap7`);
            break;
        case 8: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`Tilemap8`);
            break;
        case 9: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`Tilemap9`);
            break;
        default:
            blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap, tilemap`tilemapExample`);

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
    let player = sprites.create(assets.image`up arrow`, SpriteKind.Player)
    controller.moveSprite(player, 100, 100)
    scene.cameraFollowSprite(player)
    // basic movements
    forever(function () {
        while (controller.right.isPressed()) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . . f f f f f f . . . . 
            . . . . f f e e e e f 2 f . . . 
            . . . f f e e e e f 2 2 2 f . . 
            . . . f e e e f f e e e e f . . 
            . . . f f f f e e 2 2 2 2 e f . 
            . . . f e 2 2 2 f f f f e 2 f . 
            . . f f f f f f f e e e f f f . 
            . . f f e 4 4 e b f 4 4 e e f . 
            . . f e e 4 d 4 1 f d d e f . . 
            . . . f e e e 4 d d d d f . . . 
            . . . . f f e e 4 4 4 e f . . . 
            . . . . . 4 d d e 2 2 2 f . . . 
            . . . . . e d d e 2 2 2 f . . . 
            . . . . . f e e f 4 5 5 f . . . 
            . . . . . . f f f f f f . . . . 
            . . . . . . . f f f . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f f f . . . . 
            . . . . f f e e e e f 2 f . . . 
            . . . f f e e e e f 2 2 2 f . . 
            . . . f e e e f f e e e e f . . 
            . . . f f f f e e 2 2 2 2 e f . 
            . . . f e 2 2 2 f f f f e 2 f . 
            . . f f f f f f f e e e f f f . 
            . . f f e 4 4 e b f 4 4 e e f . 
            . . f e e 4 d 4 1 f d d e f . . 
            . . . f e e e e e d d d f . . . 
            . . . . . f 4 d d e 4 e f . . . 
            . . . . . f e d d e 2 2 f . . . 
            . . . . f f f e e f 5 5 f f . . 
            . . . . f f f f f f f f f f . . 
            . . . . . f f . . . f f f . . . 
            `, img`
            . . . . . . f f f f f f . . . . 
            . . . . f f e e e e f 2 f . . . 
            . . . f f e e e e f 2 2 2 f . . 
            . . . f e e e f f e e e e f . . 
            . . . f f f f e e 2 2 2 2 e f . 
            . . . f e 2 2 2 f f f f e 2 f . 
            . . f f f f f f f e e e f f f . 
            . . f f e 4 4 e b f 4 4 e e f . 
            . . f e e 4 d 4 1 f d d e f . . 
            . . . f e e e 4 d d d d f . . . 
            . . . . f f e e 4 4 4 e f . . . 
            . . . . . 4 d d e 2 2 2 f . . . 
            . . . . . e d d e 2 2 2 f . . . 
            . . . . . f e e f 4 5 5 f . . . 
            . . . . . . f f f f f f . . . . 
            . . . . . . . f f f . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f f f . . . . 
            . . . . f f e e e e f 2 f . . . 
            . . . f f e e e e f 2 2 2 f . . 
            . . . f e e e f f e e e e f . . 
            . . . f f f f e e 2 2 2 2 e f . 
            . . . f e 2 2 2 f f f f e 2 f . 
            . . f f f f f f f e e e f f f . 
            . . f f e 4 4 e b f 4 4 e e f . 
            . . f e e 4 d 4 1 f d d e f . . 
            . . . f e e e 4 d d d d f . . . 
            . . . . 4 d d e 4 4 4 e f . . . 
            . . . . e d d e 2 2 2 2 f . . . 
            . . . . f e e f 4 4 5 5 f f . . 
            . . . . f f f f f f f f f f . . 
            . . . . . f f . . . f f f . . . 
            `],
                100,
                false
            )
            pause(100)
        }
        while (controller.down.isPressed()) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . . f f f f . . . . . . 
            . . . . f f f 2 2 f f f . . . . 
            . . . f f f 2 2 2 2 f f f . . . 
            . . f f f e e e e e e f f f . . 
            . . f f e 2 2 2 2 2 2 e e f . . 
            . . f e 2 f f f f f f 2 e f . . 
            . . f f f f e e e e f f f f . . 
            . f f e f b f 4 4 f b f e f f . 
            . f e e 4 1 f d d f 1 4 e e f . 
            . . f e e d d d d d d e e f . . 
            . . . f e e 4 4 4 4 e e f . . . 
            . . e 4 f 2 2 2 2 2 2 f 4 e . . 
            . . 4 d f 2 2 2 2 2 2 f d 4 . . 
            . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
            . . . . . f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . f f f 2 2 f f f . . . . 
            . . . f f f 2 2 2 2 f f f . . . 
            . . f f f e e e e e e f f f . . 
            . . f f e 2 2 2 2 2 2 e e f . . 
            . f f e 2 f f f f f f 2 e f f . 
            . f f f f f e e e e f f f f f . 
            . . f e f b f 4 4 f b f e f . . 
            . . f e 4 1 f d d f 1 4 e f . . 
            . . . f e 4 d d d d 4 e f e . . 
            . . f e f 2 2 2 2 e d d 4 e . . 
            . . e 4 f 2 2 2 2 e d d e . . . 
            . . . . f 4 4 5 5 f e e . . . . 
            . . . . f f f f f f f . . . . . 
            . . . . f f f . . . . . . . . . 
            `, img`
            . . . . . . f f f f . . . . . . 
            . . . . f f f 2 2 f f f . . . . 
            . . . f f f 2 2 2 2 f f f . . . 
            . . f f f e e e e e e f f f . . 
            . . f f e 2 2 2 2 2 2 e e f . . 
            . . f e 2 f f f f f f 2 e f . . 
            . . f f f f e e e e f f f f . . 
            . f f e f b f 4 4 f b f e f f . 
            . f e e 4 1 f d d f 1 4 e e f . 
            . . f e e d d d d d d e e f . . 
            . . . f e e 4 4 4 4 e e f . . . 
            . . e 4 f 2 2 2 2 2 2 f 4 e . . 
            . . 4 d f 2 2 2 2 2 2 f d 4 . . 
            . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
            . . . . . f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . f f f 2 2 f f f . . . . 
            . . . f f f 2 2 2 2 f f f . . . 
            . . f f f e e e e e e f f f . . 
            . . f e e 2 2 2 2 2 2 e f f . . 
            . f f e 2 f f f f f f 2 e f f . 
            . f f f f f e e e e f f f f f . 
            . . f e f b f 4 4 f b f e f . . 
            . . f e 4 1 f d d f 1 4 e f . . 
            . . e f e 4 d d d d 4 e f . . . 
            . . e 4 d d e 2 2 2 2 f e f . . 
            . . . e d d e 2 2 2 2 f 4 e . . 
            . . . . e e f 5 5 4 4 f . . . . 
            . . . . . f f f f f f f . . . . 
            . . . . . . . . . f f f . . . . 
            `],
                100,
                false
            )
            pause(100)
        }
        while (controller.up.isPressed()) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . . f f f f . . . . . . 
            . . . . f f e e e e f f . . . . 
            . . . f e e e f f e e e f . . . 
            . . f f f f f 2 2 f f f f f . . 
            . . f f e 2 e 2 2 e 2 e f f . . 
            . . f e 2 f 2 f f 2 f 2 e f . . 
            . . f f f 2 2 e e 2 2 f f f . . 
            . f f e f 2 f e e f 2 f e f f . 
            . f e e f f e e e e f e e e f . 
            . . f e e e e e e e e e e f . . 
            . . . f e e e e e e e e f . . . 
            . . e 4 f f f f f f f f 4 e . . 
            . . 4 d f 2 2 2 2 2 2 f d 4 . . 
            . . 4 4 f 4 4 4 4 4 4 f 4 4 . . 
            . . . . . f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . f f e e e e f f . . . . 
            . . . f e e e f f e e e f . . . 
            . . . f f f f 2 2 f f f f . . . 
            . . f f e 2 e 2 2 e 2 e f f . . 
            . . f e 2 f 2 f f f 2 f e f . . 
            . . f f f 2 f e e 2 2 f f f . . 
            . . f e 2 f f e e 2 f e e f . . 
            . f f e f f e e e f e e e f f . 
            . f f e e e e e e e e e e f f . 
            . . . f e e e e e e e e f . . . 
            . . . e f f f f f f f f 4 e . . 
            . . . 4 f 2 2 2 2 2 e d d 4 . . 
            . . . e f f f f f f e e 4 . . . 
            . . . . f f f . . . . . . . . . 
            `, img`
            . . . . . . f f f f . . . . . . 
            . . . . f f e e e e f f . . . . 
            . . . f e e e f f e e e f . . . 
            . . f f f f f 2 2 f f f f f . . 
            . . f f e 2 e 2 2 e 2 e f f . . 
            . . f e 2 f 2 f f 2 f 2 e f . . 
            . . f f f 2 2 e e 2 2 f f f . . 
            . f f e f 2 f e e f 2 f e f f . 
            . f e e f f e e e e f e e e f . 
            . . f e e e e e e e e e e f . . 
            . . . f e e e e e e e e f . . . 
            . . e 4 f f f f f f f f 4 e . . 
            . . 4 d f 2 2 2 2 2 2 f d 4 . . 
            . . 4 4 f 4 4 4 4 4 4 f 4 4 . . 
            . . . . . f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . f f e e e e f f . . . . 
            . . . f e e e f f e e e f . . . 
            . . . f f f f 2 2 f f f f . . . 
            . . f f e 2 e 2 2 e 2 e f f . . 
            . . f e f 2 f f f 2 f 2 e f . . 
            . . f f f 2 2 e e f 2 f f f . . 
            . . f e e f 2 e e f f 2 e f . . 
            . f f e e e f e e e f f e f f . 
            . f f e e e e e e e e e e f f . 
            . . . f e e e e e e e e f . . . 
            . . e 4 f f f f f f f f e . . . 
            . . 4 d d e 2 2 2 2 2 f 4 . . . 
            . . . 4 e e f f f f f f e . . . 
            . . . . . . . . . f f f . . . . 
            `],
                100,
                false
            )
            pause(100)
        }
        while (controller.left.isPressed()) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . f f f f f f . . . . . . 
            . . . f 2 f e e e e f f . . . . 
            . . f 2 2 2 f e e e e f f . . . 
            . . f e e e e f f e e e f . . . 
            . f e 2 2 2 2 e e f f f f . . . 
            . f 2 e f f f f 2 2 2 e f . . . 
            . f f f e e e f f f f f f f . . 
            . f e e 4 4 f b e 4 4 e f f . . 
            . . f e d d f 1 4 d 4 e e f . . 
            . . . f d d d d 4 e e e f . . . 
            . . . f e 4 4 4 e e f f . . . . 
            . . . f 2 2 2 e d d 4 . . . . . 
            . . . f 2 2 2 e d d e . . . . . 
            . . . f 5 5 4 f e e f . . . . . 
            . . . . f f f f f f . . . . . . 
            . . . . . . f f f . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . f f f f f f . . . . . . 
            . . . f 2 f e e e e f f . . . . 
            . . f 2 2 2 f e e e e f f . . . 
            . . f e e e e f f e e e f . . . 
            . f e 2 2 2 2 e e f f f f . . . 
            . f 2 e f f f f 2 2 2 e f . . . 
            . f f f e e e f f f f f f f . . 
            . f e e 4 4 f b e 4 4 e f f . . 
            . . f e d d f 1 4 d 4 e e f . . 
            . . . f d d d e e e e e f . . . 
            . . . f e 4 e d d 4 f . . . . . 
            . . . f 2 2 e d d e f . . . . . 
            . . f f 5 5 f e e f f f . . . . 
            . . f f f f f f f f f f . . . . 
            . . . f f f . . . f f . . . . . 
            `, img`
            . . . . f f f f f f . . . . . . 
            . . . f 2 f e e e e f f . . . . 
            . . f 2 2 2 f e e e e f f . . . 
            . . f e e e e f f e e e f . . . 
            . f e 2 2 2 2 e e f f f f . . . 
            . f 2 e f f f f 2 2 2 e f . . . 
            . f f f e e e f f f f f f f . . 
            . f e e 4 4 f b e 4 4 e f f . . 
            . . f e d d f 1 4 d 4 e e f . . 
            . . . f d d d d 4 e e e f . . . 
            . . . f e 4 4 4 e e f f . . . . 
            . . . f 2 2 2 e d d 4 . . . . . 
            . . . f 2 2 2 e d d e . . . . . 
            . . . f 5 5 4 f e e f . . . . . 
            . . . . f f f f f f . . . . . . 
            . . . . . . f f f . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . f f f f f f . . . . . . 
            . . . f 2 f e e e e f f . . . . 
            . . f 2 2 2 f e e e e f f . . . 
            . . f e e e e f f e e e f . . . 
            . f e 2 2 2 2 e e f f f f . . . 
            . f 2 e f f f f 2 2 2 e f . . . 
            . f f f e e e f f f f f f f . . 
            . f e e 4 4 f b e 4 4 e f f . . 
            . . f e d d f 1 4 d 4 e e f . . 
            . . . f d d d d 4 e e e f . . . 
            . . . f e 4 4 4 e d d 4 . . . . 
            . . . f 2 2 2 2 e d d e . . . . 
            . . f f 5 5 4 4 f e e f . . . . 
            . . f f f f f f f f f f . . . . 
            . . . f f f . . . f f . . . . . 
            `],
                100,
                false
            )
            pause(100)
        }
    })
    //end walk animation code
    let statusbar = statusbars.create(40, 10, StatusBarKind.Health)
    statusbar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
    statusbar.setBarBorder(2, 15)
    statusbar.left = 30
    statusbar.bottom = 112

    //add inventory and toolbar
    make_toolbar()
    Make_inventory()

    controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
        if(!menuOpen){
            inventory.setFlag(SpriteFlag.Invisible, false)
            menuOpen = true
        }
        else {
            inventory.setFlag(SpriteFlag.Invisible, true)
            menuOpen = false
        }
    })
    // attack animation
    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        if (direction == 2) {
            projectile = sprites.createProjectileFromSprite(img`
            . . . . . . . . . . . . . . . . 
            . . . . . f . . . . . . . . . . 
            . . . . . f f . . . . . . . . . 
            . . . . . . f f . . . . . . . . 
            . . . . . . . f f . . . . . . . 
            . . . . . . . . f f . . . . . . 
            . . . . . . . . f f . . . . . . 
            . . . . . . . . f f . . . . . . 
            . . . . . . . . f f . . . . . . 
            . . . . . . . . f f . . . . . . 
            . . . . . . . f f . . . . . . . 
            . . . . . . f f . . . . . . . . 
            . . . . . f f . . . . . . . . . 
            . . . . . f . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, player, 150, 0)
            animation.runImageAnimation(
                player,
                [img`
            ........................
            ....ffffff..............
            ..ffeeeef2f.............
            .ffeeeef222f............
            .feeeffeeeef...cc.......
            .ffffee2222ef.cdc.......
            .fe222ffffe2fcddc.......
            fffffffeeeffcddc........
            ffe44ebf44ecddc.........
            fee4d41fddecdc..........
            .feee4dddedccc..........
            ..ffee44e4dde...........
            ...f222244ee............
            ...f2222e2f.............
            ...f444455f.............
            ....ffffff..............
            .....fff................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `, img`
            ........................
            .......fff..............
            ....fffff2f.............
            ..ffeeeee22ff...........
            .ffeeeeee222ff..........
            .feeeefffeeeef..........
            .fffffeee2222ef.........
            fffe222fffffe2f.........
            fffffffffeeefff.....cc..
            fefe44ebbf44eef...ccdc..
            .fee4d4bbfddef..ccddcc..
            ..feee4dddddfeecdddc....
            ...f2222222eeddcdcc.....
            ...f444445e44ddccc......
            ...ffffffffeeee.........
            ...fff...ff.............
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `, img`
            .......ff...............
            ....ffff2ff.............
            ..ffeeeef2ff............
            .ffeeeeef22ff...........
            .feeeeffeeeef...........
            .fffffee2222ef..........
            fffe222ffffe2f..........
            ffffffffeeefff..........
            fefe44ebf44eef..........
            .fee4d4bfddef...........
            ..feee4dddee.c..........
            ...f2222eeddeccccccc....
            ...f444e44ddecddddd.....
            ...fffffeeee.ccccc......
            ..ffffffff...c..........
            ..fff..ff...............
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `, img`
            ....ffffff..............
            ..ffeeeef2f.............
            .ffeeeef222f............
            .feeeffeeeef............
            .ffffee2222ef...........
            .fe222ffffe2f...........
            fffffffeeefff...........
            ffe44ebf44eef...........
            fee4d41fddef............
            .feee4ddddf.............
            ..fdde444ef.............
            ..fdde22ccc.............
            ...eef22cdc.............
            ...f4444cddc............
            ....fffffcddc...........
            .....fff..cddc..........
            ...........cdc..........
            ............cc..........
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `],
                100,
                false
            )
            pause(150)
            sprites.destroy(projectile)
        }
        if (direction == 1) {
            projectile2 = sprites.createProjectileFromSprite(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . f . . . . . . . . 
            . . . . . . f f . . . . . . . . 
            . . . . . f f . . . . . . . . . 
            . . . . f f . . . . . . . . . . 
            . . . f f . . . . . . . . . . . 
            . . . f f . . . . . . . . . . . 
            . . . f f . . . . . . . . . . . 
            . . . f f . . . . . . . . . . . 
            . . . f f . . . . . . . . . . . 
            . . . f f . . . . . . . . . . . 
            . . . . f f . . . . . . . . . . 
            . . . . . f f . . . . . . . . . 
            . . . . . . f f . . . . . . . . 
            . . . . . . . f . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, player, -150, 0)
            animation.runImageAnimation(
                player,
                [img`
            ..............ffffff....
            .............f2feeeeff..
            ............f222feeeeff.
            .......cc...feeeeffeeef.
            .......cdc.fe2222eeffff.
            .......cddcf2effff222ef.
            ........cddcffeeefffffff
            .........cddce44fbe44eff
            ..........cdceddf14d4eef
            ..........cccdeddd4eeef.
            ...........edd4e44eeff..
            ............ee442222f...
            .............f2e2222f...
            .............f554444f...
            ..............ffffff....
            ................fff.....
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `, img`
            ........................
            ..............fff.......
            .............f2fffff....
            ...........ff22eeeeeff..
            ..........ff222eeeeeeff.
            ..........feeeefffeeeef.
            .........fe2222eeefffff.
            .........f2efffff222efff
            ..cc.....fffeeefffffffff
            ..cdcc...fee44fbbe44efef
            ..ccddcc..feddfbb4d4eef.
            ....cdddceefddddd4eeef..
            .....ccdcddee2222222f...
            ......cccdd44e544444f...
            .........eeeeffffffff...
            .............ff...fff...
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `, img`
            ...............ff.......
            .............ff2ffff....
            ............ff2feeeeff..
            ...........ff22feeeeeff.
            ...........feeeeffeeeef.
            ..........fe2222eefffff.
            ..........f2effff222efff
            ..........fffeeeffffffff
            ..........fee44fbe44efef
            ...........feddfb4d4eef.
            ..........c.eeddd4eeef..
            ....ccccccceddee2222f...
            .....dddddcedd44e444f...
            ......ccccc.eeeefffff...
            ..........c...ffffffff..
            ...............ff..fff..
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `, img`
            ..............ffffff....
            .............f2feeeeff..
            ............f222feeeeff.
            ............feeeeffeeef.
            ...........fe2222eeffff.
            ...........f2effff222ef.
            ...........fffeeefffffff
            ...........fee44fbe44eff
            ............feddf14d4eef
            .............fdddd4eeef.
            .............fe444eddf..
            .............ccc22eddf..
            .............cdc22fee...
            ............cddc4444f...
            ...........cddcfffff....
            ..........cddc..fff.....
            ..........cdc...........
            ..........cc............
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `],
                100,
                false
            )
            pause(150)
            sprites.destroy(projectile2)
        }
        if (direction == 4) {
            Projectile3 = sprites.createProjectileFromSprite(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . f f . . . . . . . . . . f f . 
            . . f f . . . . . . . . f f . . 
            . . . f f . . . . . . f f . . . 
            . . . . f f f f f f f f . . . . 
            . . . . . f f f f f f . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, player, 0, 150)
            animation.runImageAnimation(
                player,
                [img`
            ........................
            .....ffff...............
            ...fff22fff.............
            ..fff2222fff............
            .fffeeeeeefff...........
            .ffe222222eef...........
            .fe2ffffff2ef...........
            .ffffeeeeffff...........
            ffefbf44fbfeff..........
            fee41fddf14eef..........
            .ffffdddddeef...........
            fddddf444eef............
            fbbbbf2222f4e...........
            fbbbbf2222fd4...........
            .fccf45544f44...........
            ..ffffffff..............
            ....ff..ff..............
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `, img`
            ........................
            ......ffff..............
            ....fff22fff............
            ...fff2222fff...........
            ..fffeeeeeefff..........
            ..ffe222222eef..........
            ..fe2ffffff2ef..........
            ..ffffeeeeffff..........
            .ffefbf44fbfeff.........
            .fee41fddf14eef.........
            fdfeeddddd4eff..........
            fbffee444edd4e..........
            fbf4f2222edde...........
            fcf.f22cccee............
            .ff.f44cdc4f............
            ....fffddcff............
            .....fddcff.............
            ....cddc................
            ....cdc.................
            ....cc..................
            ........................
            ........................
            ........................
            ........................
            `, img`
            ........................
            ........................
            .......ff...............
            .....ff22ff.............
            ...fff2222fff...........
            ..fff222222fff..........
            ..fff222222fff..........
            ..feeeeeeeeeeff.........
            .ffe22222222eff.........
            .fffffeeeefffff.........
            fdfefbf44fbfeff.........
            fbfe41fddf14ef..........
            fbffe4dddd4efe..........
            fcfef22222f4e...........
            .ff4f44554f4e...........
            ....ffffffdde...........
            .....ffffedde...........
            ..........ee............
            .........ccc............
            ........cc1cc...........
            .........c1c............
            .........c1c............
            .........c1c............
            .........c1c............
            `, img`
            ......ffff..............
            ....fff22fff............
            ...fff2222fff...........
            ..fffeeeeeefff..........
            ..ffe222222eef..........
            ..fe2ffffff2ef..........
            ..ffffeeeeffff......ccc.
            .ffefbf44fbfeff....cddc.
            .ffefbf44fbfeff...cddc..
            .fee4dddddd4eef.ccddc...
            fdfeeddddd4eeffecddc....
            fbffee4444ee4fddccc.....
            fbf4f222222f1edde.......
            fcf.f222222f44ee........
            .ff.f445544f............
            ....ffffffff............
            .....ff..ff.............
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `],
                100,
                false
            )
            pause(150)
            sprites.destroy(Projectile3)
        }
        if (direction == 3) {
            projectile4 = sprites.createProjectileFromSprite(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . f f f f f f . . . . . 
            . . . . f f f f f f f f . . . . 
            . . . f f . . . . . . f f . . . 
            . . f f . . . . . . . . f f . . 
            . f f . . . . . . . . . . f f . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, player, 0, -150)
            animation.runImageAnimation(
                player,
                [img`
            ........................
            .....ffff...............
            ...fff22fff.............
            ..fff2222fff............
            .fffeeeeeefff...........
            .ffe222222eef...........
            .fe2ffffff2ef...........
            .ffffeeeeffff...........
            ffefbf44fbfeff..........
            fee41fddf14eef..........
            .ffffdddddeef...........
            fddddf444eef............
            fbbbbf2222f4e...........
            fbbbbf2222fd4...........
            .fccf45544f44...........
            ..ffffffff..............
            ....ff..ff..............
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `, img`
            ........................
            ......ffff..............
            ....fff22fff............
            ...fff2222fff...........
            ..fffeeeeeefff..........
            ..ffe222222eef..........
            ..fe2ffffff2ef..........
            ..ffffeeeeffff..........
            .ffefbf44fbfeff.........
            .fee41fddf14eef.........
            fdfeeddddd4eff..........
            fbffee444edd4e..........
            fbf4f2222edde...........
            fcf.f22cccee............
            .ff.f44cdc4f............
            ....fffddcff............
            .....fddcff.............
            ....cddc................
            ....cdc.................
            ....cc..................
            ........................
            ........................
            ........................
            ........................
            `, img`
            ........................
            ........................
            .......ff...............
            .....ff22ff.............
            ...fff2222fff...........
            ..fff222222fff..........
            ..fff222222fff..........
            ..feeeeeeeeeeff.........
            .ffe22222222eff.........
            .fffffeeeefffff.........
            fdfefbf44fbfeff.........
            fbfe41fddf14ef..........
            fbffe4dddd4efe..........
            fcfef22222f4e...........
            .ff4f44554f4e...........
            ....ffffffdde...........
            .....ffffedde...........
            ..........ee............
            .........ccc............
            ........cc1cc...........
            .........c1c............
            .........c1c............
            .........c1c............
            .........c1c............
            `, img`
            ......ffff..............
            ....fff22fff............
            ...fff2222fff...........
            ..fffeeeeeefff..........
            ..ffe222222eef..........
            ..fe2ffffff2ef..........
            ..ffffeeeeffff......ccc.
            .ffefbf44fbfeff....cddc.
            .ffefbf44fbfeff...cddc..
            .fee4dddddd4eef.ccddc...
            fdfeeddddd4eeffecddc....
            fbffee4444ee4fddccc.....
            fbf4f222222f1edde.......
            fcf.f222222f44ee........
            .ff.f445544f............
            ....ffffffff............
            .....ff..ff.............
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `],
                100,
                false
            )
            pause(150)
            sprites.destroy(projectile4)
        }
    })
    //end attack animation
    //roll animation
    controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
        if (direction == 2) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . . . . . . . . . . . . 
            . . . . . f f f f f f . . . . . 
            . . . f f e e e e f 2 f . . . . 
            . . f f e e e e f 2 2 2 f . . . 
            . . f e e e f f e e e e f . . . 
            . . f f f f e e 2 2 2 2 e f . . 
            . . f e 2 2 2 f f f f e 2 f . . 
            . f f f f f f f e e e f f f . . 
            . f f e 4 4 e b f 4 4 e e f . . 
            . f e e 4 d 4 1 f d d e f . . . 
            . . f e e e e e d d d f . . . . 
            . . . . f 4 d d e 4 e f . . . . 
            . . . . f e d d e 2 2 f . . . . 
            . . . f f f e e f 5 5 f f . . . 
            . . . f f f f f f f f f f . . . 
            . . . . f f . . . f f f . . . . 
            `, img`
            . . . . . f f f f f f . . . . . 
            . . . f f e e e e f 2 f . . . . 
            . . f f e e e e f 2 2 2 f . . . 
            . . f e e e f f e e e e f . . . 
            . . f f f f e e 2 2 2 2 e f . . 
            . . f e 2 2 2 f f f f e 2 f . . 
            . f f f f f f f e e e f f f . . 
            . f f e 4 4 e b f 4 4 e e f . . 
            . f e e 4 d 4 1 f d d e f f . . 
            . . f e e e 4 d d d d f d d f . 
            . . . f f e e 4 e e e f b b f . 
            . . . . f 2 2 2 4 d d e b b f . 
            . . . . e 2 2 2 e d d e b f . . 
            . . . . f 4 4 4 f e e f f . . . 
            . . . . . f f f f f f . . . . . 
            . . . . . . f f f . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . f f f f f f . . . . . 
            . . . f f e e e e f 2 f . . . . 
            . . f f e e e e f 2 2 2 f . . . 
            . . f e e e f f e e e e f . . . 
            . . f f f f e e 2 2 2 2 e f . . 
            . . f e 2 2 2 f f f f e 2 f . . 
            . f f f f f f f e e e f f f . . 
            . f f e 4 4 e b f 4 4 e e f . . 
            . f e e 4 d 4 1 f d d e f . . . 
            . . f e e e e e d d d f . . . . 
            . . . . f 4 d d e 4 e f . . . . 
            . . . . f e d d e 2 2 f . . . . 
            . . . f f f e e f 5 5 f f . . . 
            . . . f f f f f f f f f f . . . 
            . . . . f f . . . f f f . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . f f f f f f . . . . . 
            . . . f f e e e e f 2 f . . . . 
            . . f f e e e e f 2 2 2 f . . . 
            . . f e e e f f e e e e f . . . 
            . . f f f f e e 2 2 2 2 e f . . 
            . . f e 2 2 2 f f f f e 2 f . . 
            . f f f f f f f e e e f f f . . 
            . f f e 4 4 e b f 4 4 e e f . . 
            . f e e 4 d 4 1 f d d e f f . . 
            . . f e e e 4 d d d d f d d f . 
            . . . . f e e 4 e e e f b b f . 
            . . . . f 2 2 2 4 d d e b b f . 
            . . . f f 4 4 4 e d d e b f . . 
            . . . f f f f f f e e f f . . . 
            . . . . f f . . . f f f . . . . 
            `],
                500,
                false
            )
            player.vx += 100
            pause(500)
            player.vx = 0
        }
        if (direction == 1) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . . . . . . . . . . . . 
            . . . . . f f f f f f . . . . . 
            . . . . f 2 f e e e e f f . . . 
            . . . f 2 2 2 f e e e e f f . . 
            . . . f e e e e f f e e e f . . 
            . . f e 2 2 2 2 e e f f f f . . 
            . . f 2 e f f f f 2 2 2 e f . . 
            . . f f f e e e f f f f f f f . 
            . . f e e 4 4 f b e 4 4 e f f . 
            . . f f e d d f 1 4 d 4 e e f . 
            . f d d f d d d d 4 e e e f . . 
            . f b b f e e e 4 e e f . . . . 
            . f b b e d d 4 2 2 2 f . . . . 
            . . f b e d d e 4 4 4 f f . . . 
            . . . f f e e f f f f f f . . . 
            . . . . f f f . . . f f . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . f f f f f f . . . . . 
            . . . . f 2 f e e e e f f . . . 
            . . . f 2 2 2 f e e e e f f . . 
            . . . f e e e e f f e e e f . . 
            . . f e 2 2 2 2 e e f f f f . . 
            . . f 2 e f f f f 2 2 2 e f . . 
            . . f f f e e e f f f f f f f . 
            . . f e e 4 4 f b e 4 4 e f f . 
            . . . f e d d f 1 4 d 4 e e f . 
            . . . . f d d d e e e e e f . . 
            . . . . f e 4 e d d 4 f . . . . 
            . . . . f 2 2 e d d e f . . . . 
            . . . f f 5 5 f e e f f f . . . 
            . . . f f f f f f f f f f . . . 
            . . . . f f f . . . f f . . . . 
            `, img`
            . . . . . f f f f f f . . . . . 
            . . . . f 2 f e e e e f f . . . 
            . . . f 2 2 2 f e e e e f f . . 
            . . . f e e e e f f e e e f . . 
            . . f e 2 2 2 2 e e f f f f . . 
            . . f 2 e f f f f 2 2 2 e f . . 
            . . f f f e e e f f f f f f f . 
            . . f e e 4 4 f b e 4 4 e f f . 
            . . f f e d d f 1 4 d 4 e e f . 
            . f d d f d d d d 4 e e e f . . 
            . f b b f e e e 4 e e f f . . . 
            . f b b e d d 4 2 2 2 f . . . . 
            . . f b e d d e 2 2 2 e . . . . 
            . . . f f e e f 4 4 4 f . . . . 
            . . . . . f f f f f f . . . . . 
            . . . . . . . f f f . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . f f f f f f . . . . . . 
            . . . f 2 f e e e e f f . . . . 
            . . f 2 2 2 f e e e e f f . . . 
            . . f e e e e f f e e e f . . . 
            . f e 2 2 2 2 e e f f f f . . . 
            . f 2 e f f f f 2 2 2 e f . . . 
            . f f f e e e f f f f f f f . . 
            . f e e 4 4 f b e 4 4 e f f . . 
            . . f e d d f 1 4 d 4 e e f . . 
            . . . f d d d e e e e e f . . . 
            . . . f e 4 e d d 4 f . . . . . 
            . . . f 2 2 e d d e f . . . . . 
            . . f f 5 5 f e e f f f . . . . 
            . . f f f f f f f f f f . . . . 
            . . . f f f . . . f f . . . . . 
            `],
                500,
                false
            )
            player.vx += -100
            pause(500)
            player.vx = 0
        }
        if (direction == 4) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . . f f f f . . . . . . 
            . . . . f f f 2 2 f f f . . . . 
            . . . f f f 2 2 2 2 f f f . . . 
            . . f f f e e e e e e f f f . . 
            . . f f e 2 2 2 2 2 2 e e f . . 
            . . f e 2 f f f f f f 2 e f . . 
            . . f f f f e e e e f f f f . . 
            . f f e f b f 4 4 f b f e f f . 
            . f e e 4 1 f d d f 1 4 e e f . 
            . . f f f f d d d d d e e f . . 
            . f d d d d f 4 4 4 e e f . . . 
            . f b b b b f 2 2 2 2 f 4 e . . 
            . f b b b b f 2 2 2 2 f d 4 . . 
            . . f c c f 4 5 5 4 4 f 4 4 . . 
            . . . f f f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . f f f 2 2 f f f . . . . 
            . . . f f f 2 2 2 2 f f f . . . 
            . . f f f e e e e e e f f f . . 
            . . f f e 2 2 2 2 2 2 e e f . . 
            . f f e 2 f f f f f f 2 e f f . 
            . f f f f f e e e e f f f f f . 
            . . f e f b f 4 4 f b f e f . . 
            . f f e 4 1 f d d f 1 4 e f . . 
            f d f f e 4 d d d d 4 e f e . . 
            f b f e f 2 2 2 2 e d d 4 e . . 
            f b f 4 f 2 2 2 2 e d d e . . . 
            f c f . f 4 4 5 5 f e e . . . . 
            . f f . f f f f f f f . . . . . 
            . . . . f f f . . . . . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . f f f 2 2 f f f . . . . 
            . . . f f f 2 2 2 2 f f f . . . 
            . . f f f e e e e e e f f f . . 
            . . f e e 2 2 2 2 2 2 e f f . . 
            . f f e 2 f f f f f f 2 e f f . 
            . f f f f f e e e e f f f f f . 
            . . f e f b f 4 4 f b f e f . . 
            . . f e 4 1 f d d f 1 4 e f . . 
            . . e f f f f d d d 4 e f . . . 
            . . f d d d d f 2 2 2 f e f . . 
            . . f b b b b f 2 2 2 f 4 e . . 
            . . f b b b b f 5 4 4 f . . . . 
            . . . f c c f f f f f f . . . . 
            . . . . f f . . . f f f . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . f f f 2 2 f f f . . . . 
            . . . f f f 2 2 2 2 f f f . . . 
            . . f f f e e e e e e f f f . . 
            . . f e e 2 2 2 2 2 2 e f f . . 
            . f f e 2 f f f f f f 2 e f f . 
            . f f f f f e e e e f f f f f . 
            . . f e f b f 4 4 f b f e f . . 
            . . f e 4 1 f d d f 1 4 e f f . 
            . . e f e 4 d d d d 4 e f f d f 
            . . e 4 d d e 2 2 2 2 f e f b f 
            . . . e d d e 2 2 2 2 f 4 f b f 
            . . . . e e f 5 5 4 4 f . f c f 
            . . . . . f f f f f f f . f f . 
            . . . . . . . . . f f f . . . . 
            `],
                500,
                false
            )
            player.vy += 100
            pause(500)
            player.vy = 0
        }
        if (direction == 3) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . . f f f f . . . . . . 
            . . . . f f e e e e f f . . . . 
            . . . f e e e f f e e e f . . . 
            . . f f f f f 2 2 f f f f f . . 
            . . f f e 2 e 2 2 e 2 e f f . . 
            . . f e 2 f 2 f f 2 f 2 e f . . 
            . . f f f 2 2 e e 2 2 f f f . . 
            . f f e f 2 f e e f 2 f e f f . 
            . f e e f f e e e e f e e e f . 
            . . f e e e e e e e e e e f . . 
            . . . f e e e e e e e e f . . . 
            . . e 4 f f f f f f f f 4 e . . 
            . . 4 d f 2 2 2 2 2 2 f d 4 . . 
            . . 4 4 f 4 4 4 4 4 4 f 4 4 . . 
            . . . . . f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . f f e e e e f f . . . . 
            . . . f e e e f f e e e f . . . 
            . . . f f f f 2 2 f f f f . . . 
            . . f f e 2 e 2 2 e 2 e f f . . 
            . . f e 2 f 2 f f f 2 f e f . . 
            . . f f f 2 f e e 2 2 f f f . . 
            . . f e 2 f f e e 2 f e e f . . 
            . f f e f f e e e f e e e f f . 
            . f f e e e e e e e e e e f f . 
            . . . f e e e e e e e e f . . . 
            . . . e f f f f f f f f 4 e . . 
            . . . 4 f 2 2 2 2 2 e d d 4 . . 
            . . . e f f f f f f e e 4 . . . 
            . . . . f f f . . . . . . . . . 
            `, img`
            . . . . . . f f f f . . . . . . 
            . . . . f f e e e e f f . . . . 
            . . . f e e e f f e e e f . . . 
            . . f f f f f 2 2 f f f f f . . 
            . . f f e 2 e 2 2 e 2 e f f . . 
            . . f e 2 f 2 f f 2 f 2 e f . . 
            . . f f f 2 2 e e 2 2 f f f . . 
            . f f e f 2 f e e f 2 f e f f . 
            . f e e f f e e e e f e e e f . 
            . . f e e e e e e e e e e f . . 
            . . . f e e e e e e e e f . . . 
            . . e 4 f f f f f f f f 4 e . . 
            . . 4 d f 2 2 2 2 2 2 f d 4 . . 
            . . 4 4 f 4 4 4 4 4 4 f 4 4 . . 
            . . . . . f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . f f e e e e f f . . . . 
            . . . f e e e f f e e e f . . . 
            . . . f f f f 2 2 f f f f . . . 
            . . f f e 2 e 2 2 e 2 e f f . . 
            . . f e f 2 f f f 2 f 2 e f . . 
            . . f f f 2 2 e e f 2 f f f . . 
            . . f e e f 2 e e f f 2 e f . . 
            . f f e e e f e e e f f e f f . 
            . f f e e e e e e e e e e f f . 
            . . . f e e e e e e e e f . . . 
            . . e 4 f f f f f f f f e . . . 
            . . 4 d d e 2 2 2 2 2 f 4 . . . 
            . . . 4 e e f f f f f f e . . . 
            . . . . . . . . . f f f . . . . 
            `],
                500,
                false
            )
            player.vy += -100
            pause(500)
            player.vy = 0
        }
    })
    //end roll animation code

    //player damage
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
        statusbar.value += - playerDamage
        pause(1000)
    })
    // enemy damage
    sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
        statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -50
        if (statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value == 0) {
            sprites.destroy(otherSprite, effects.disintegrate, 100)
        }
        pause(1000)
    })

    //floor and room gen
    floorGen(floor);
    fillRooms(floorLayout)
    GcurrentX = startX;
    GcurrentY = startY;
    fullRoomLoadSequence(GcurrentX,GcurrentY,player)

    
    
    
    
    

    
}
function fullRoomLoadSequence (currentX: number, currentY: number, player: Sprite){
    swapRooms(GcurrentX, GcurrentY)
    //game.splash("up " + getUp(currentX, currentY) + " down " + getDown(currentX, currentY) + " right " + getRight(currentX, currentY) + " left " + getLeft(currentX, currentY))
    loadRoomTilesEnemies(GcurrentX, GcurrentY)
    
    
    timer.background(function() {
        chestLooted = false        
        roomEnemiesLeft = getEnemies(currentX, currentY)
        if (roomEnemiesLeft == 0 || getCleared(currentX, currentY)) {
            
            blockControl.raiseEvent(1, 0)
            
        }
    })
    
    
    
    blockControl.waitForEvent(1, 0)
    timer.background(function() {
        scene.onOverlapTile(SpriteKind.Player, assets.tile`ChestLocked`, function (sprite, location) {
            tiles.coverAllTiles(assets.tile`ChestLocked`, sprites.dungeon.chestOpen)
            chestLooted = true
            blockControl.raiseEvent(2, 0)
            
        })
        setEnemies(currentX, currentY, 0)
        pause(1000)
        if(getChest(currentX, currentY)){
        scene.cameraShake(4, 500)
        tiles.coverAllTiles(assets.tile`ChestLocked`, sprites.dungeon.chestClosed)
        if (getCleared(currentX, currentY)) {
            tiles.coverAllTiles(assets.tile`ChestLocked`, sprites.dungeon.chestOpen)
            chestLooted = true;
            blockControl.raiseEvent(2, 0)
        }
        }
        else{
            blockControl.raiseEvent(2,0)
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
        tiles.setWallAt(tiles.getTileLocation(4, 0), false)
        tiles.coverAllTiles(tiles.util.door0, sprites.dungeon.doorOpenNorth)
    }
    if (getDown(currentX, currentY)) {
        tiles.setWallAt(tiles.getTileLocation(4, 7), false)
        tiles.coverAllTiles(tiles.util.door15, sprites.dungeon.doorOpenSouth)
    }
    if (getRight(currentX, currentY)) {
        tiles.setWallAt(tiles.getTileLocation(9, 3), false)
        tiles.coverAllTiles(tiles.util.door9, sprites.dungeon.doorOpenEast)
    }
    if (getLeft(currentX, currentY)) { 
        tiles.setWallAt(tiles.getTileLocation(0, 3), false)
        tiles.coverAllTiles(tiles.util.door6, sprites.dungeon.doorOpenWest)
    }
}


function loadRoomTilesEnemies(currentX: number, currentY: number){
    
    for (let index = 0; index < getEnemies(currentX,currentY); index++) {
        let myEnemy = sprites.create(img`
        . . . . . . . . . b 5 b . . . . 
        . . . . . . . . . b 5 b . . . . 
        . . . . . . b b b b b b . . . . 
        . . . . . b b 5 5 5 5 5 b . . . 
        . . . . b b 5 b c 5 5 d 4 c . . 
        . b b b b 5 5 5 b f d d 4 4 4 b 
        . b d 5 b 5 5 b c b 4 4 4 4 b . 
        . . b 5 5 b 5 5 5 4 4 4 4 b . . 
        . . b d 5 5 b 5 5 5 5 5 5 b . . 
        . b d b 5 5 5 d 5 5 5 5 5 5 b . 
        b d d c d 5 5 b 5 5 5 5 5 5 b . 
        c d d d c c b 5 5 5 5 5 5 5 b . 
        c b d d d d d 5 5 5 5 5 5 5 b . 
        . c d d d d d d 5 5 5 5 5 d b . 
        . . c b d d d d d 5 5 5 b b . . 
        . . . c c c c c c c c b b . . . 
        `, SpriteKind.Enemy)
        let statusbar2 = statusbars.create(20, 6, StatusBarKind.EnemyHealth)
        statusbar2.attachToSprite(myEnemy)
        statusbar2.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
        statusbar2.setBarBorder(1, 15)
        tiles.placeOnRandomTile(myEnemy, sprites.dungeon.floorDark2)
    }

    if(!getUp(currentX,currentY)){
        tiles.coverAllTiles(tiles.util.door0, sprites.dungeon.greenOuterNorth0)
    }
    else{
        tiles.coverAllTiles(tiles.util.door0, sprites.dungeon.doorClosedNorth)
    }
    if (!getDown(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door15, sprites.dungeon.greenOuterSouth1)
    }
    else{
        tiles.coverAllTiles(tiles.util.door15, sprites.dungeon.doorClosedSouth)
    }
    if (!getRight(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door9, sprites.dungeon.greenOuterEast0)
    }  
    else{
        tiles.coverAllTiles(tiles.util.door9, sprites.dungeon.doorClosedEast)
    } 
    if (!getLeft(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door6, sprites.dungeon.greenOuterWest0)
    }
    else{
        tiles.coverAllTiles(tiles.util.door6, sprites.dungeon.doorClosedWest)
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
            directionOfRoomGen = randint(1, 4)
            // up
            if (directionOfRoomGen == 1 && up == false) {
                up = true
                numOfDirections += -1
            } else {
                directionOfRoomGen = randint(1, 4)
            }
            // down
            if (directionOfRoomGen == 2 && down == false) {
                down = true
                numOfDirections += -1
            } else {
                directionOfRoomGen = randint(1, 4)
            }
            // left
            if (directionOfRoomGen == 3 && left == false) {
                left = true
                numOfDirections += -1
            } else {
                directionOfRoomGen = randint(1, 4)
            }
            // right
            if (directionOfRoomGen == 4 && right == false) {
                right = true
                numOfDirections += -1
            } else {
                directionOfRoomGen = randint(1, 4)
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
    tiles.setCurrentTilemap(getTileMap(currentX, currentY))
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

//movement and inventory functions

function make_toolbar() {
    toolbar = Inventory.create_toolbar([], 1)
    toolbar.setFlag(SpriteFlag.RelativeToCamera, true)
    toolbar.left = 4
    toolbar.bottom = scene.screenHeight() - 4
    toolbar.z = 50
}

function Make_inventory() {
    inventory = Inventory.create_inventory([], 32)
    inventory.setFlag(SpriteFlag.RelativeToCamera, true)
    inventory.setFlag(SpriteFlag.Invisible, true)
    inventory.left = 4
    inventory.top = 4
    inventory.z = 50
}

function add_item(item_in_list: Inventory.Item[]) {
    for (let item of inventory.get_items()) {
        if (item.get_image().equals(item_in_list[0].get_image())) {
            if (item.get_text(ItemTextAttribute.Tooltip) == "") {
                item.set_text(ItemTextAttribute.Tooltip, "2")
            } else {
                item.set_text(ItemTextAttribute.Tooltip, convertToText(parseFloat(item.get_text(ItemTextAttribute.Tooltip)) + 1))
            }
            inventory.update()
            return true
        }
    }
    if (inventory.get_items().length < inventory.get_number(InventoryNumberAttribute.MaxItems)) {
        inventory.get_items().push(item_in_list[0])
        item_in_list[0].set_text(ItemTextAttribute.Tooltip, "")
        inventory.update()
        return true
    }
    return false
}

function add_weapon(item_in_list: Inventory.Item[]) {
    for (let item of toolbar.get_items()) {
        if (item.get_image().equals(item_in_list[0].get_image())) {
            if (item.get_text(ItemTextAttribute.Tooltip) == "") {
                item.set_text(ItemTextAttribute.Tooltip, "2")
            } else {
                item.set_text(ItemTextAttribute.Tooltip, convertToText(parseFloat(item.get_text(ItemTextAttribute.Tooltip)) + 1))
            }
            toolbar.update()
            return true
        }
    }
    if (toolbar.get_items().length < toolbar.get_number(ToolbarNumberAttribute.MaxItems)) {
        toolbar.get_items().push(item_in_list[0])
        item_in_list[0].set_text(ItemTextAttribute.Tooltip, "")
        toolbar.update()
        return true
    }
    return false
}

function spawn_weapon(weapon_Sprite: Sprite) {
    if (mySprite.y < 60) {
        weapon_Sprite.setPosition(mySprite.x, mySprite.y + 30)
    } else if (mySprite.y > 60) {
        weapon_Sprite.setPosition(mySprite.x, mySprite.y - 30)
    }
}

function remove_item_from_toolbar(index: number) {
    item = toolbar.get_items()[index]
    if (!(item)) {
        return [][0]
    }
    if (item.get_text(ItemTextAttribute.Tooltip) == "") {
        if (toolbar.get_items().removeAt(0)) {

        }
    } else if (item.get_text(ItemTextAttribute.Tooltip) == "2") {
        item.set_text(ItemTextAttribute.Tooltip, "")
    } else {
        item.set_text(ItemTextAttribute.Tooltip, convertToText(parseFloat(item.get_text(ItemTextAttribute.Tooltip)) - 1))
    }
    toolbar.update()
    return Inventory.create_item(item.get_text(ItemTextAttribute.Name), item.get_image())
}
