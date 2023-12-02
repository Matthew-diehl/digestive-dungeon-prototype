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
let menuOpen: boolean = false
let playerMaxHealth = 3
let playerDamage = 1
let currentWeaponDamage = 0;
let attackSpeed: number = 400
let lifeStealChance: number = 0;
let playerSpeed: number = 50;
let playerImmunityFrames: number = 3000;
let playerDodgeChance: number = 0;
let firstTimeRoom1: boolean = true;
let floorBossAlive: boolean

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

all_items = [
    img`
    . . . . . . . . . . . . . . . . 
    . . . . e e e e e . . . . . . . 
    . . . e e d d d e e e e . . . . 
    . . . 4 e e d d d d d e . . . . 
    . . 4 4 5 e e e d d d d e e . . 
    . . 4 2 2 5 5 e e e d d d e . . 
    . . 4 2 2 2 5 5 5 e e e d e . . 
    . . 4 2 2 5 5 5 5 5 5 5 e e . . 
    . 4 4 5 5 5 5 5 5 5 5 4 4 . . . 
    . 4 4 5 5 5 2 2 5 5 5 4 . . . . 
    . 4 4 5 5 2 2 2 2 5 5 4 . . . . 
    . . 4 5 5 5 2 2 4 4 5 4 . . . . 
    . . 4 5 5 5 4 4 . 4 5 4 . . . . 
    . . 4 5 4 4 4 . . . 4 . . . . . 
    . . 4 4 4 . 4 . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `,
    img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . 7 7 7 e e . . . . . . . 
    . . 7 7 6 6 6 e e . . . . . . . 
    . . 7 . 7 7 7 e c . . . . . . . 
    . . . . e e e c 2 2 2 . . . . . 
    . . . 2 2 2 2 2 2 d 2 2 . . . . 
    . . . 2 2 2 2 2 2 2 d 2 . . . . 
    . . . 2 2 2 2 2 2 2 2 2 . . . . 
    . . . 2 2 2 2 2 2 2 2 2 . . . . 
    . . . 2 2 2 2 2 2 2 2 2 . . . . 
    . . . e 2 2 2 2 2 2 2 e . . . . 
    . . . . e 2 2 e 2 2 e . . . . . 
    . . . . . e e . e e . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `,
    img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . b . . . . . . . . . . . b . . 
    b 3 b . b b b b b b b . b 3 b . 
    b 3 3 b 3 3 3 1 3 3 3 b 3 3 b . 
    . b 3 b 3 3 1 3 3 3 3 b 3 b . . 
    b 3 3 b 3 1 3 3 1 3 3 b 3 3 b . 
    b 3 3 b 3 3 3 1 3 3 3 b 3 3 b . 
    b 3 3 b 3 3 3 3 3 3 3 b 3 3 b . 
    . b 3 b b 3 3 3 3 3 b b 3 b . . 
    b b b b b b b 3 b b b b b b b . 
    b b b . b b b b b b b . b b b . 
    . b . . . . . . . . . . . b . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `,
    img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . b . . b . . . . . 
    . . . . . . . . b . . b . . . . 
    . . . . . . 6 b 6 6 b 6 . . . . 
    . . . . . 6 e b e e b e 6 . . . 
    . . . 6 6 e e b e e b e e 6 . . 
    . . 6 . 6 c e e e e e e c 6 . . 
    . . 6 . 6 6 c c c c c c 6 6 . . 
    . . 6 . 6 9 6 6 6 6 6 6 9 6 . . 
    . . 8 . 8 9 9 9 9 9 9 9 9 8 . . 
    . . 8 . 8 8 9 9 9 9 9 9 8 8 . . 
    . . . 8 8 8 8 8 8 8 8 8 8 . . . 
    . . . . . . 8 8 8 8 8 8 . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `,
    img`
    . f f f . . . . . . . . f f f . 
    f f c . . . . . . . f c b b c . 
    f c c . . . . . . f c b b c . . 
    c f . . . . . . . f b c c c . . 
    c f f . . . . . f f b b c c . . 
    f f f c c . c c f b c b b c . . 
    f f f c c c c c f b c c b c . . 
    . f c 3 c c 3 b c b c c c . . . 
    . c b 3 b c 3 b b c c c c . . . 
    c c b b b b b b b b c c . . . . 
    c 1 1 b b b 1 1 b b b f c . . . 
    f b b b b b b b b b b f c c . . 
    f b c b b b c b b b b f . . . . 
    . f 1 f f f 1 b b b c f . . . . 
    . . f b b b b b b c f . . . . . 
    . . . f f f f f f f . . . . . . 
    `,
    img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . b b b b b . . . . . . . . . . 
    b 1 1 1 1 1 b . . . . . . . . . 
    b 1 1 1 1 1 b . . . . . . . . . 
    b b b b b b 2 e 1 1 e e e . . . 
    e 2 2 2 2 2 2 1 1 2 2 2 2 e . . 
    e 2 2 2 2 2 1 1 2 2 2 2 2 2 e . 
    e 2 2 2 2 2 1 1 2 2 2 2 2 2 e . 
    e 2 2 2 2 2 1 1 2 2 2 2 2 2 e . 
    b b b b b b 1 1 b b b b b b b . 
    b 1 1 1 1 1 1 1 1 1 1 1 1 1 b . 
    b b b b b b b b b b b b b b b . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `,
    img`
    . . . . . 6 6 6 6 6 6 . . . . . 
    . . . 6 6 9 9 5 5 9 9 6 6 . . . 
    . . 6 9 9 9 5 5 5 1 9 9 9 6 . . 
    . 6 9 9 9 5 5 5 1 5 5 9 9 9 6 . 
    . 6 9 9 9 5 5 1 5 5 5 9 9 9 6 . 
    . 6 5 5 5 5 1 5 5 5 5 1 5 5 6 . 
    . 6 5 5 5 1 5 5 5 5 1 5 5 5 6 . 
    . 6 5 5 1 5 5 5 5 1 5 5 5 5 6 . 
    . 6 9 1 5 5 5 5 1 5 5 5 9 9 6 . 
    . . 6 9 9 5 5 5 5 5 5 9 9 6 . . 
    . . 6 9 5 5 5 5 5 5 5 5 9 6 . . 
    . . . 6 4 5 5 9 9 5 5 4 6 . . . 
    . . . 6 4 4 9 9 9 9 4 4 6 . . . 
    . . . . 6 4 6 6 6 6 4 6 . . . . 
    . . . . 6 6 6 6 6 6 6 6 . . . . 
    . . . . . 6 6 6 6 6 6 . . . . . 
    `,
    img`
    . . . . . . . . . . . . . . . . 
    . . . . 3 3 3 3 3 . . . . . . . 
    . . . 3 3 3 3 3 3 3 3 . . . . . 
    . . 3 3 2 2 2 e 3 3 3 3 . . . . 
    . . 3 2 2 2 e 2 2 3 3 . . . . . 
    . . 3 e e c e e 2 . . . . . . . 
    . . . 2 e c c e 2 2 2 . . . . . 
    . . . 2 2 2 2 2 2 2 2 2 . . . . 
    . . 2 2 2 e e e e e 2 2 2 . . . 
    . . 2 2 e c c c c c e 2 2 . . . 
    . . e e c c c c c c c e e . . . 
    . . e e e c c c c c e e e . . . 
    . . . e e e e e e e e e . . . . 
    . . . . e e e e e e e . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `
]
all_labels = [
    "Pizza Slice",
    "Apple",
    "Candy",
    "Coffee",
    "Bat",
    "Running Shoes",
    "Shield",
    "Ninja Headband"
]
all_weapons = [
    img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . c d . . 
    . . . . . . . . . . . d e d . . 
    . . . . . . . . . . d c c . . . 
    . . . . . . . . . d e c . . . . 
    . . . . . . . . c e d . . . . . 
    . . . . e . . c c d . . . . . . 
    . . . . e e d e d . . . . . . . 
    . . . . . e e c . . . . . . . . 
    . . . . e e e e . . . . . . . . 
    . . . e e e . e e . . . . . . . 
    . . . e e . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `,
    img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . 1 1 . . 
    . . . . . . . . . . . 1 8 1 . . 
    . . . . . . . . . . 1 8 1 . . . 
    . . . . . . . . . 1 8 1 . . . . 
    . . . . . . . . 1 8 1 . . . . . 
    . . . . 8 . . 1 8 1 . . . . . . 
    . . . . 8 8 1 8 1 . . . . . . . 
    . . . . . 8 8 1 . . . . . . . . 
    . . . . 8 8 8 8 . . . . . . . . 
    . . . 8 8 8 . 8 8 . . . . . . . 
    . . . 8 8 . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `,
    img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . d d . . . . . 
    . . . . . . . . . 1 1 . . . . . 
    . . . . . . . . . . 1 1 . . . . 
    . . . . . . . . . d 1 1 1 1 . . 
    . . . . . . . . d 1 b . b b . . 
    . . . . . . . d 1 b . . . . . . 
    . . . . . . d 1 b . . . . . . . 
    . . . . . d 1 b . . . . . . . . 
    . d d . d 1 b . . . . . . . . . 
    . d 1 1 1 b . . . . . . . . . . 
    . . . 1 1 . . . . . . . . . . . 
    . . . . 1 b . . . . . . . . . . 
    . . . . b b . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `,
    img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . b . . . . . . . 
    . . . . . . . b d b . . . . . . 
    . . . . . . b d d d b e e . . . 
    . . . . . b d d d d d b e . . . 
    . . . . . . b d d d d d b . . . 
    . . . . . . . b d d d d d b . . 
    . . . . . . . c b d d d d d b . 
    . . . . . . e c c b d d d b . . 
    . . . . . e e e . . b b b . . . 
    . . . . e e e . . . . b . . . . 
    . . . e e e . . . . . . . . . . 
    . . e e e . . . . . . . . . . . 
    . . e e . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `,
    img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . e e . . . . . 
    . . . . . . . . e e e 1 . . . . 
    . . . . . . . e e e 1 1 1 . . . 
    . . . . . . e e e 1 1 1 1 b . . 
    . . . . . e e e 1 1 1 1 b 1 1 . 
    . . . . e e e b 1 1 1 b 1 1 . . 
    . . . e e e . . b 1 b 1 1 . . . 
    . . e e e . . . . b b b . . . . 
    . e e e . . . . . . b . . . . . 
    . e e . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `,
    img`
    . . . . . . . . . . . . . . . . 
    . . . . . . c c c c c c c . . . 
    . . . . . c b b b b b b b c . . 
    . . . . c b b c c c c c b b c . 
    . . . . c b c b b b b b c b c . 
    . . . . c b b b b b b b b b c . 
    . . . . c b b b b b b b b b c . 
    . . . . c b b b b b b b b b c . 
    . . . . c b c b b b b b c b c . 
    . . . . c b b c c c c c b b c . 
    . . . . c c b b b b b b b c . . 
    . . . c c c c c c c c c c . . . 
    . . c c c . . . . . . . . . . . 
    . c c c . . . . . . . . . . . . 
    c . c . . . . . . . . . . . . . 
    c c . . . . . . . . . . . . . . 
    `
]
weapon_labels = [
    "Old Sword",
    "Sword",
    "Bone",
    "Hammer",
    "Axe",
    "Frying Pan"
]
weaponSprites = [
    blockObject.create(),
    blockObject.create(),
    blockObject.create(),
    blockObject.create(),
    blockObject.create(),
    blockObject.create()
]
for (let index = 0; index <= all_weapons.length - 1; index++) {
    SetSprite(index, all_weapons[index])
    switch(index){
        case 0: setDamage(index, 4)
        break;
        case 1: setDamage(index, 6)
        break;
        case 2: setDamage(index, 6)
        break;
        case 3: setDamage(index, 7)
        break;
        case 4: setDamage(index, 8)
        break;
        case 5: setDamage(index, 12)
        break;
        default: 0
    }
}

let statusbar = statusbars.create(40, 10, StatusBarKind.Health)
statusbar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
statusbar.setBarBorder(2, 15)
statusbar.left = 30
statusbar.bottom = 112
statusbar.max = 3
statusbar.setFlag(SpriteFlag.Invisible, true)

sprites.onOverlap(SpriteKind.Player, SpriteKind.weapon, function (sprite, otherSprite) {
    for (let index = 0; index <= all_weapons.length - 1; index++) {
        for (let item of toolbar.get_items()) {
            if (item.image == all_weapons[index]) {
                if (toolbar.get_items() != []) {
                    toolbar.set_items([])
                }
                mySprite3 = sprites.create(all_weapons[index], SpriteKind.weapon)
                spawn_weapon(mySprite3, sprite)
                pause(100)
                break;
            }
        }
        if (otherSprite.image.equals(all_weapons[index])) {
            if (add_weapon([Inventory.create_item(weapon_labels[index], all_weapons[index])])) {
                sprite.sayText("damage: " + getDamage(index), 1000, false)
                currentWeaponDamage = getDamage(index)
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
                if(index == 0){
                    sprite.sayText("health +", 2000, true)
                    playerMaxHealth ++
                    statusbar.max = playerMaxHealth
                    statusbar.value ++
                }
                else if (index == 1){
                    sprite.sayText("health +", 2000, true)
                    playerMaxHealth = playerMaxHealth + 2
                    statusbar.max = playerMaxHealth
                    statusbar.value = statusbar.value + 2
                }
                else if (index == 2){
                    sprite.sayText("attack speed +", 2000, true)
                    attackSpeed = attackSpeed - (attackSpeed * .20)
                }
                else if (index == 3){
                    sprite.sayText("attack speed +", 2000, true)
                    attackSpeed = attackSpeed - (attackSpeed * .40)
                }
                else if (index == 4){
                    sprite.sayText("lifesteal +", 2000, true)
                    lifeStealChance = lifeStealChance + 10
                }
                else if (index == 5){
                    sprite.sayText("speed +", 2000, true)
                    playerSpeed = playerSpeed + 20
                    updateSpeed(playerSpeed,sprite)
                }
                else if (index == 6){
                    sprite.sayText("immune frames +", 2000, true)
                    playerImmunityFrames = playerImmunityFrames + 4000
                }
                else if (index == 7){
                    sprite.sayText("dodge chance +", 2000, true)
                    playerDodgeChance = playerDodgeChance + 25
                }
                sprites.destroy(otherSprite)
                break;
            }
        }
    }
})


scene.onOverlapTile(SpriteKind.Player, tiles.util.door0, function (sprite, location) {
    if(getCleared(GcurrentX,GcurrentY)){
        if (!getBoss(GcurrentX, GcurrentY)) {
            GcurrentY = GcurrentY - 1

            goingUp = true
            goingDown = false
            goingLeft = false
            goingRight = false
            blockControl.raiseEvent(3, 0)
            pause(1000)
        }
        else {
            if (GcurrentY - 1 < 0) {
                floor = floor + 1;
                gameStart(sprite)
            }
            else {
                GcurrentY = GcurrentY - 1

                goingUp = true
                goingDown = false
                goingLeft = false
                goingRight = false
                blockControl.raiseEvent(3, 0)
                pause(1000)
            }
        }
    }
    

})
scene.onOverlapTile(SpriteKind.Player, tiles.util.door15, function (sprite, location) {
    if(getCleared(GcurrentX,GcurrentY)){
    if(!getBoss(GcurrentX,GcurrentY)){
    GcurrentY = GcurrentY + 1

    goingUp = false
    goingDown = true
    goingLeft = false
    goingRight = false
    blockControl.raiseEvent(3, 0)
    pause(1000)
    }
    else{
        if (GcurrentY +1 > 3) {
            floor = floor+1;
            gameStart(sprite)
        }
        else{
            GcurrentY = GcurrentY + 1

            goingUp = false
            goingDown = true
            goingLeft = false
            goingRight = false
            blockControl.raiseEvent(3, 0)
            pause(1000)
        }
    }
    }
    
})

scene.onOverlapTile(SpriteKind.Player,  tiles.util.door6, function (sprite, location) {
    if(getCleared(GcurrentX,GcurrentY)){
        if (!getBoss(GcurrentX, GcurrentY)) {
            GcurrentX = GcurrentX - 1

            goingUp = false
            goingDown = false
            goingLeft = true
            goingRight = false
            blockControl.raiseEvent(3, 0)
            pause(1000)
        }
        else {
            if (GcurrentX - 1 < 0) {
                floor = floor + 1;
                gameStart(sprite)
            }
            else {
                GcurrentX = GcurrentX - 1

                goingUp = false
                goingDown = false
                goingLeft = true
                goingRight = false
                blockControl.raiseEvent(3, 0)
                pause(1000)
            }
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, tiles.util.door9, function (sprite, location) {
    if(getCleared(GcurrentX,GcurrentY)){
        if (!getBoss(GcurrentX, GcurrentY)) {
            GcurrentX = GcurrentX + 1

            goingUp = false
            goingDown = false
            goingLeft = false
            goingRight = true
            blockControl.raiseEvent(3, 0)
            pause(1000)
        }
        else {
            if (GcurrentX + 1 > 3) {
                floor = floor + 1;
                gameStart(sprite)
            }
            else {
                GcurrentX = GcurrentX + 1

                goingUp = false
                goingDown = false
                goingLeft = false
                goingRight = true
                blockControl.raiseEvent(3, 0)
                pause(1000)
            }
        }
    }
    
})
let gameStarted = false
scene.setBackgroundImage(assets.image`FinalMenuScreen`)
let pressA = sprites.create(img`
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    333311111111111111111111111111111111111111113333
    333333333333333333333333333333333333333333333333
    322222222222222222222222222222222222222222222223
    325555555555555555555555555555555555555555555523
    325555552225555555555555555555555222555555555523
    225555552552555555555555555555555222555555555522
    225555552552525552255222522255552252255555555522
    225555552225522522225255525555552252255555555522
    225555552555525525555525552555522222225555555522
    225555552555525552255222522255522555225555555522
    225555555555555555555555555555555555555555555522
    225555552222555555552225525555555555552255555522
    225555555225555555552552525555555555552255555522
    225555555225552255552552525522555252552255555522
    225555555225525525552225525255255252552555555522
    22555555522552552555255552525525552255555555552e
    e2555555522555225555255552552222525255255555552e
    e2555555555555555555555555555555522255555555552e
    e2222222222222222222222222222222222222222222222e
    eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
    eeecccccccccccccccccccccccccccccccccccccccccceee
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
    ................................................
`, SpriteKind.Player)
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!gameStarted){
        gameStarted = true
        scene.setBackgroundImage(assets.image`Empty`)
        sprites.destroy(pressA)
        blockControl.raiseEvent(5, 0)
    }
})
blockControl.onEvent(5, 0, function() {
    start()
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
        case 1: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`FinalTilemap9`);
            break;
        case 2: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`FinalTilemap2`);
            break;
        case 3: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`FinalTilemap3`);
            break;
        case 4: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`FinalTilemap4`);
            break;
        case 5: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`FinalTilemap5`);
            break;
        case 6: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`FinalTilemap6`);
            break;
        case 7: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`FinalTilemap7`);
            break;
        case 8: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`FinalTilemap8`);
            break;
        case 9: blockObject.setAnyProperty(roomFilledArray[row][col], AnyProp.tileMap,tilemap`FinalTilemap9`);
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
    menuOpen = false
    playerMaxHealth = 3
    playerDamage = 1
    currentWeaponDamage = 0;
    attackSpeed = 400
    lifeStealChance = 0;
    playerSpeed = 50;
    playerImmunityFrames = 3000;
    playerDodgeChance = 0;
    statusbar.setFlag(SpriteFlag.Invisible, false)

    let player = sprites.create(assets.image`up arrow`, SpriteKind.Player)
    controller.moveSprite(player, playerSpeed, playerSpeed)
    scene.cameraFollowSprite(player)
    //giving player starting Sword
    // basic movements
    forever(function () {
        while (controller.right.isPressed()) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . . 6 9 9 9 9 f f f . . . . 
            . . . . 6 9 9 9 9 9 5 5 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . 6 6 6 9 9 9 9 9 5 . . . . 
            . . . 6 9 9 6 2 2 2 2 . . . . . 
            . . . . 6 6 2 2 2 2 2 2 . . . . 
            . . . . 6 9 6 9 9 2 2 2 . . . . 
            . . . . 6 9 6 9 9 9 2 2 . . . . 
            . . . . 6 9 6 9 9 9 9 2 . . . . 
            . . . . 6 9 6 9 9 9 9 6 . . . . 
            . . . . . 6 f f f f f . . . . . 
            . . . . . . 6 6 6 . . . . . . . 
            . . . . . . 6 6 6 6 6 . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . . 6 9 9 9 9 f f f . . . . 
            . . . . 6 9 9 9 9 9 5 5 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . 6 6 6 9 9 9 9 9 5 . . . . 
            . . . 6 9 9 6 2 2 2 2 . . . . . 
            . . . . 6 6 2 2 2 2 2 2 . . . . 
            . . . . 6 9 6 9 9 2 2 2 . . . . 
            . . . . 6 9 6 9 9 9 2 2 . . . . 
            . . . . 6 9 6 9 9 9 9 2 . 6 . . 
            . . . . 6 9 6 9 9 9 9 6 6 6 . . 
            . . . . . 6 f f f f 6 6 6 6 . . 
            . . . . . 6 6 6 . . 6 6 6 . . . 
            . . . . . 6 6 6 6 . 6 6 . . . . 
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
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . . . f f f 5 5 f f f . . . . 
            . . . . 6 5 5 5 5 5 5 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . 6 6 6 9 9 5 5 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 9 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . . 6 6 6 6 6 . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . . . f f f 5 5 f f f . . . . 
            . . . . 6 5 5 5 5 5 5 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . 6 6 6 9 9 5 5 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 2 6 6 6 9 6 . . 
            . . 6 9 6 9 9 9 6 9 9 9 6 6 . . 
            . . . 6 f f f f 6 9 9 9 6 . . . 
            . . . . 6 6 6 . 6 9 9 9 6 . . . 
            . . . . 6 6 6 . 6 6 6 6 . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . . . f f f 5 5 f f f . . . . 
            . . . . 6 5 5 5 5 5 5 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . 6 6 6 9 9 5 5 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 9 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . . 6 6 6 6 6 . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . . . f f f 5 5 f f f . . . . 
            . . . . 6 5 5 5 5 5 5 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . 6 6 6 9 9 5 5 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 6 6 2 9 9 9 6 9 6 . . 
            . . 6 6 9 9 9 6 9 9 9 6 9 6 . . 
            . . . 6 9 9 9 6 f f f f 6 . . . 
            . . . 6 9 9 9 6 . 6 6 6 . . . . 
            . . . . 6 6 6 6 . 6 6 6 . . . . 
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
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . 6 6 6 9 9 6 6 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . . 6 6 6 6 6 . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . 6 6 6 9 9 6 6 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . . . 6 6 6 . . . . . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . 6 6 6 9 9 6 6 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . . 6 6 6 6 6 . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . 6 6 6 9 9 6 6 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . . . . . . . . 6 6 6 . . . . 
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
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . f f f 9 9 9 9 6 . . . . 
            . . . . 5 5 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 6 6 6 . . . 
            . . . . . 2 2 2 2 6 9 9 6 . . . 
            . . . . 2 2 2 2 2 2 6 6 . . . . 
            . . . . 2 2 2 9 9 6 9 6 . . . . 
            . . . . 2 2 9 9 9 6 9 6 . . . . 
            . . . . 2 9 9 9 9 6 9 6 . . . . 
            . . . . 6 9 9 9 9 6 9 6 . . . . 
            . . . . . f f f f f 6 . . . . . 
            . . . . . . . 6 6 6 . . . . . . 
            . . . . . 6 6 6 6 6 . . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . f f f 9 9 9 9 6 . . . . 
            . . . . 5 5 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 6 6 6 . . . 
            . . . . . 2 2 2 2 6 9 9 6 . . . 
            . . . . 2 2 2 2 2 2 6 6 . . . . 
            . . . . 2 2 2 9 9 6 9 6 . . . . 
            . . . . 2 2 9 9 9 6 9 6 . . . . 
            . . 6 . 2 9 9 9 9 6 9 6 . . . . 
            . . 6 6 6 9 9 9 9 6 9 6 . . . . 
            . . 6 6 6 6 f f f f 6 . . . . . 
            . . . 6 6 6 . . 6 6 6 . . . . . 
            . . . . 6 6 . 6 6 6 6 . . . . . 
            `],
                100,
                false
            )
            pause(100)
        }
    })
    //end walk animation code

    //add inventory and toolbar
    make_toolbar()
    Make_inventory()

    controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
        if (!menuOpen) {
            inventory.setFlag(SpriteFlag.Invisible, false)
            menuOpen = true
        }
        else {
            inventory.setFlag(SpriteFlag.Invisible, true)
            menuOpen = false
        }
    })
    // attack animation
    let attacking: boolean = false;
    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        if (!attacking) {
            if (direction == 2) {
                attacking = true
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
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . . 6 9 9 9 9 f f f . . . . 
            . . . . 6 9 9 9 9 9 5 5 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . 6 6 6 9 9 9 9 9 5 . . . . 
            . . . 6 9 9 6 2 2 2 2 . . . . . 
            . . . . 6 6 2 2 2 2 2 2 . . . . 
            . . . . 6 9 6 9 9 2 2 2 . . . . 
            . . . . 6 9 6 9 9 9 2 2 . . . . 
            . . . . 6 9 6 9 9 9 9 2 . . . . 
            . . . . 6 9 6 9 9 9 9 6 . . . . 
            . . . . . 6 f f f f f . . . . . 
            . . . . . . 6 6 6 . . . . . . . 
            . . . . . . 6 6 6 6 6 . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . . 6 9 9 9 9 f f f . . . . 
            . . . . 6 9 9 9 9 9 5 5 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . 6 6 6 9 9 9 9 9 5 . . . . 
            . . . 6 9 9 6 2 2 2 2 . . . . . 
            . . . . 6 6 2 2 2 2 2 2 . . . . 
            . . . . 6 9 6 6 6 6 6 6 6 . . . 
            . . . . 6 9 9 9 9 9 9 9 9 6 . . 
            . . . . 6 6 6 6 6 6 6 6 6 . . . 
            . . . . 6 9 6 9 9 9 9 6 . . . . 
            . . . . . 6 f f f f f . . . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . . 6 6 6 6 6 . 6 6 6 6 6 . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . . 6 9 9 9 9 f f f . . . . 
            . . . . 6 9 9 9 9 9 5 5 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . 6 6 6 9 9 9 9 9 5 . . . . 
            . . . 6 9 9 6 2 2 2 2 . . . . . 
            . . . . 6 6 2 2 2 2 2 2 . . . . 
            . . . . 6 9 6 9 9 2 2 2 . . . . 
            . . . . 6 9 6 9 9 9 2 2 . . . . 
            . . . . 6 9 6 9 9 9 9 2 . . . . 
            . . . . 6 9 6 9 9 9 9 6 . . . . 
            . . . . . 6 f f f f f . . . . . 
            . . . . . . 6 6 6 . . . . . . . 
            . . . . . . 6 6 6 6 6 . . . . . 
            `],
                    100,
                    false
                )
                pause(200)
                sprites.destroy(projectile)
                pause(attackSpeed)
                attacking = false
            }
            else if (direction == 1) {
                attacking = true
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
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . f f f 9 9 9 9 6 . . . . 
            . . . . 5 5 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 6 6 6 . . . 
            . . . . . 2 2 2 2 6 9 9 6 . . . 
            . . . . 2 2 2 2 2 2 6 6 . . . . 
            . . . . 2 2 2 9 9 6 9 6 . . . . 
            . . . . 2 2 9 9 9 6 9 6 . . . . 
            . . . . 2 9 9 9 9 6 9 6 . . . . 
            . . . . 6 9 9 9 9 6 9 6 . . . . 
            . . . . . f f f f f 6 . . . . . 
            . . . . . . . 6 6 6 . . . . . . 
            . . . . . 6 6 6 6 6 . . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . f f f 9 9 9 9 6 . . . . 
            . . . . 5 5 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 6 6 6 . . . 
            . . . . . 2 2 2 2 6 9 9 6 . . . 
            . . . . 2 2 2 2 2 2 6 6 . . . . 
            . . . 6 2 2 2 9 9 6 9 6 . . . . 
            . . 6 9 2 2 9 9 9 6 9 9 6 . . . 
            . . . 6 2 9 9 9 9 6 6 9 6 . . . 
            . . . . 6 9 9 9 9 9 6 9 9 6 . . 
            . . . . . f f f f f f 6 6 6 . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . 6 6 6 6 6 . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . f f f 9 9 9 9 6 . . . . 
            . . . . 5 5 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 6 6 6 . . . 
            . . . . . 2 2 2 2 6 9 9 6 . . . 
            . . . . 2 2 2 2 2 2 6 6 . . . . 
            . . . . 2 2 2 9 9 6 9 6 . . . . 
            . . . . 2 2 9 9 9 6 9 6 . . . . 
            . . . . 2 9 9 9 9 6 9 6 . . . . 
            . . . . 6 9 9 9 9 6 9 6 . . . . 
            . . . . . f f f f f 6 . . . . . 
            . . . . . . . 6 6 6 . . . . . . 
            . . . . . 6 6 6 6 6 . . . . . . 
            `],
                    100,
                    false
                )
                pause(200)
                sprites.destroy(projectile2)
                pause(attackSpeed)
                attacking = false
            }
            else if (direction == 4) {
                attacking = true
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
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . . . f f f 5 5 f f f . . . . 
            . . . . 6 5 5 5 5 5 5 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . 6 6 6 9 9 5 5 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 9 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . . 6 6 6 6 6 . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . . . f f f 5 5 f f f . . . . 
            . . . . 6 5 5 5 5 5 5 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . 6 6 6 9 9 5 5 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 6 . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 9 6 9 2 2 9 9 6 9 6 . . 
            . . 6 9 9 6 9 9 2 9 9 6 6 9 6 . 
            . . 6 9 9 6 9 9 9 9 9 6 6 9 9 6 
            . . 6 9 9 6 f f f f f f . 6 6 . 
            . . . 6 6 6 6 . . 6 6 6 . . . . 
            . . . 6 6 6 6 6 . 6 6 6 . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . . . f f f 5 5 f f f . . . . 
            . . . . 6 5 5 5 5 5 5 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . 6 6 6 9 9 5 5 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 9 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . . 6 6 6 6 6 . . 
            `],
                    100,
                    false
                )
                pause(200)
                sprites.destroy(Projectile3)
                pause(attackSpeed)
                attacking = false
            }
            else if (direction == 3) {
                attacking = true
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
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . 6 6 6 9 9 6 6 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . . 6 6 6 6 6 . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 6 . . . 
            . . . . 6 9 9 6 6 9 9 6 9 6 . . 
            . . . . 6 9 9 6 6 9 9 6 9 6 . . 
            . . 6 6 6 9 9 6 6 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 6 . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 6 . . . 
            . 6 9 6 6 9 9 6 6 9 9 6 . . . . 
            6 9 9 6 6 9 9 6 6 9 9 6 . . . . 
            . 6 6 . f f f f f f f f . . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . . 6 6 6 6 6 . 6 6 6 . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . 6 6 6 9 9 6 6 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . . 6 6 6 6 6 . . 
            `],
                    100,
                    false
                )
                pause(200)
                sprites.destroy(projectile4)
                pause(attackSpeed)
                attacking = false
            }
        }
    })
    //end attack animation
    //roll animation
    controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
        if (direction == 2) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . . 6 9 9 9 9 f f f . . . . 
            . . . . 6 9 9 9 9 9 5 5 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . 6 6 6 9 9 9 9 9 5 . . . . 
            . . . 6 9 9 6 2 2 2 2 . . . . . 
            . . . . 6 6 2 2 2 2 2 2 . . . . 
            . . . . 6 9 6 9 9 2 2 2 . . . . 
            . . . . 6 9 6 9 9 9 2 2 . . . . 
            . . . . 6 9 6 9 9 9 9 2 . 6 . . 
            . . . . 6 9 6 9 9 9 9 6 6 6 . . 
            . . . . . 6 f f f f 6 6 6 6 . . 
            . . . . . 6 6 6 . . 6 6 6 . . . 
            . . . . . 6 6 6 6 . 6 6 . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . 6 6 6 6 6 . . . . . 
            . . . 1 1 1 1 1 1 1 1 1 1 1 . . 
            . . d d d d 9 9 9 9 9 9 6 . . . 
            . . . . 6 9 9 9 9 9 d d d d . . 
            . . . . 6 9 1 1 1 1 1 9 6 . . . 
            . . . . d d d d 9 9 9 9 6 . . . 
            . . . . 6 9 9 9 9 d d d d . . . 
            . . . 1 1 1 1 1 1 1 1 1 1 1 . . 
            . . . . . . 6 6 6 6 6 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . . 6 9 9 9 9 f f f . . . . 
            . . . . 6 9 9 9 9 9 5 5 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . 6 6 6 9 9 9 9 9 5 . . . . 
            . . . 6 9 9 6 2 2 2 2 . . . . . 
            . . . . 6 6 2 2 2 2 2 2 . . . . 
            . . . . 6 9 6 9 9 2 2 2 . . . . 
            . . . . 6 9 6 9 9 9 2 2 . . . . 
            . . . . 6 9 6 9 9 9 9 2 . 6 . . 
            . . . . 6 9 6 9 9 9 9 6 6 6 . . 
            . . . . . 6 f f f f 6 6 6 6 . . 
            . . . . . 6 6 6 . . 6 6 6 . . . 
            . . . . . 6 6 6 6 . 6 6 . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . . 6 9 9 9 9 f f f . . . . 
            . . . . 6 9 9 9 9 9 5 5 . . . . 
            . . . . 6 9 9 9 9 9 9 5 . . . . 
            . . . 6 6 6 9 9 9 9 9 5 . . . . 
            . . . 6 9 9 6 2 2 2 2 . . . . . 
            . . . . 6 6 2 2 2 2 2 2 . . . . 
            . . . . 6 9 6 9 9 2 2 2 . . . . 
            . . . . 6 9 6 9 9 9 2 2 . . . . 
            . . . . 6 9 6 9 9 9 9 2 . . . . 
            . . . . 6 9 6 9 9 9 9 6 . . . . 
            . . . . . 6 f f f f f . . . . . 
            . . . . . . 6 6 6 . . . . . . . 
            . . . . . . 6 6 6 6 6 . . . . . 
            `],
                200,
                false
            )
            player.setFlag(SpriteFlag.Ghost, true)
            pause(500)
            player.setFlag(SpriteFlag.Ghost, false)
        }
        if (direction == 1) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . f f f 9 9 9 9 6 . . . . 
            . . . . 5 5 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 6 6 6 . . . 
            . . . . . 2 2 2 2 6 9 9 6 . . . 
            . . . . 2 2 2 2 2 2 6 6 . . . . 
            . . . . 2 2 2 9 9 6 9 6 . . . . 
            . . . . 2 2 9 9 9 6 9 6 . . . . 
            . . 6 . 2 9 9 9 9 6 9 6 . . . . 
            . . 6 6 6 9 9 9 9 6 9 6 . . . . 
            . . 6 6 6 6 f f f f 6 . . . . . 
            . . . 6 6 6 . . 6 6 6 . . . . . 
            . . . . 6 6 . 6 6 6 6 . . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . 6 6 6 6 6 . . . . . 
            . . . 1 1 1 1 1 1 1 1 1 1 1 . . 
            . . d d d d 9 9 9 9 9 9 6 . . . 
            . . . . 6 9 9 9 9 9 d d d d . . 
            . . . . 6 9 1 1 1 1 1 9 6 . . . 
            . . . . d d d d 9 9 9 9 6 . . . 
            . . . . 6 9 9 9 9 d d d d . . . 
            . . . 1 1 1 1 1 1 1 1 1 1 1 . . 
            . . . . . . 6 6 6 6 6 . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . f f f 9 9 9 9 6 . . . . 
            . . . . 5 5 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 6 6 6 . . . 
            . . . . . 2 2 2 2 6 9 9 6 . . . 
            . . . . 2 2 2 2 2 2 6 6 . . . . 
            . . . . 2 2 2 9 9 6 9 6 . . . . 
            . . . . 2 2 9 9 9 6 9 6 . . . . 
            . . 6 . 2 9 9 9 9 6 9 6 . . . . 
            . . 6 6 6 9 9 9 9 6 9 6 . . . . 
            . . 6 6 6 6 f f f f 6 . . . . . 
            . . . 6 6 6 . . 6 6 6 . . . . . 
            . . . . 6 6 . 6 6 6 6 . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . f f f 9 9 9 9 6 . . . . 
            . . . . 5 5 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 9 6 . . . . 
            . . . . 5 9 9 9 9 9 6 6 6 . . . 
            . . . . . 2 2 2 2 6 9 9 6 . . . 
            . . . . 2 2 2 2 2 2 6 6 . . . . 
            . . . . 2 2 2 9 9 6 9 6 . . . . 
            . . . . 2 2 9 9 9 6 9 6 . . . . 
            . . . . 2 9 9 9 9 6 9 6 . . . . 
            . . . . 6 9 9 9 9 6 9 6 . . . . 
            . . . . . f f f f f 6 . . . . . 
            . . . . . . . 6 6 6 . . . . . . 
            . . . . . 6 6 6 6 6 . . . . . . 
            `],
                200,
                false
            )
            player.setFlag(SpriteFlag.Ghost, true)
            pause(500)
            player.setFlag(SpriteFlag.Ghost, false)
        }
        if (direction == 4) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . . . f f f 5 5 f f f . . . . 
            . . . . 6 5 5 5 5 5 5 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . 6 6 6 9 9 5 5 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 6 6 2 9 9 9 6 9 6 . . 
            . . 6 6 9 9 9 6 9 9 9 6 9 6 . . 
            . . . 6 9 9 9 6 f f f f 6 . . . 
            . . . 6 9 9 9 6 . 6 6 6 . . . . 
            . . . . 6 6 6 6 . 6 6 6 . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . 1 . d . . . 1 . . . . 
            . . . . . 1 6 d 6 6 d 1 . . . . 
            . . . . . 1 9 d 9 9 d 1 . . . . 
            . . . . 6 1 9 d 1 9 d 1 6 . . . 
            . . . . 6 1 9 9 1 9 d 1 6 . . . 
            . . . . 6 1 9 9 1 9 9 1 6 . . . 
            . . . . 6 1 9 9 1 d 9 1 6 . . . 
            . . . . 6 1 9 9 1 d 9 1 6 . . . 
            . . . . . 1 d 9 9 d 9 1 . . . . 
            . . . . . 1 d 6 6 d 6 1 . . . . 
            . . . . . 1 d . . . . 1 . . . . 
            . . . . . . d . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . . . f f f 5 5 f f f . . . . 
            . . . . 6 5 5 5 5 5 5 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . 6 6 6 9 9 5 5 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 2 6 6 6 9 6 . . 
            . . 6 9 6 9 9 9 6 9 9 9 6 6 . . 
            . . . 6 f f f f 6 9 9 9 6 . . . 
            . . . . 6 6 6 . 6 9 9 9 6 . . . 
            . . . . 6 6 6 . 6 6 6 6 . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 9 9 9 9 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . . . f f f 5 5 f f f . . . . 
            . . . . 6 5 5 5 5 5 5 6 . . . . 
            . . . . 6 9 9 5 5 9 9 6 . . . . 
            . . 6 6 6 9 9 5 5 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 9 9 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . . 6 6 6 6 6 . . 
            `],
                200,
                false
            )
            player.setFlag(SpriteFlag.Ghost, true)
            pause(500)
            player.setFlag(SpriteFlag.Ghost, false)
        }
        if (direction == 3) {
            animation.runImageAnimation(
                player,
                [img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . 6 6 6 9 9 6 6 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . . . . . . . . 6 6 6 . . . . 
            `, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . 1 . d . . . 1 . . . . 
            . . . . . 1 6 d 6 6 d 1 . . . . 
            . . . . . 1 9 d 9 9 d 1 . . . . 
            . . . . 6 1 9 d 1 9 d 1 6 . . . 
            . . . . 6 1 9 9 1 9 d 1 6 . . . 
            . . . . 6 1 9 9 1 9 9 1 6 . . . 
            . . . . 6 1 9 9 1 d 9 1 6 . . . 
            . . . . 6 1 9 9 1 d 9 1 6 . . . 
            . . . . . 1 d 9 9 d 9 1 . . . . 
            . . . . . 1 d 6 6 d 6 1 . . . . 
            . . . . . 1 d . . . . 1 . . . . 
            . . . . . . d . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . 6 6 6 9 9 6 6 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . . . 6 6 6 . . . . . . . . . 
            `, img`
            . . . . . 6 6 6 6 6 6 . . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . . . 6 9 9 6 6 9 9 6 . . . . 
            . . 6 6 6 9 9 6 6 9 9 6 6 6 . . 
            . . 6 9 9 6 6 6 6 6 6 9 9 6 . . 
            . . . 6 6 2 2 2 2 2 2 6 6 . . . 
            . . 6 9 6 9 2 2 2 2 9 6 9 6 . . 
            . . 6 9 6 9 9 2 2 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . 6 9 6 9 9 6 6 9 9 6 9 6 . . 
            . . . 6 f f f f f f f f 6 . . . 
            . . . . 6 6 6 . . 6 6 6 . . . . 
            . . 6 6 6 6 6 . . 6 6 6 6 6 . . 
            `],
                200,
                false
            )
            player.setFlag(SpriteFlag.Ghost, true)
            pause(500)
            player.setFlag(SpriteFlag.Ghost, false)
        }
    })
    //end roll animation code

    //player damage
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
        let dodgeCheck = randint(1, 100)
        if (playerDodgeChance >= dodgeCheck) {
            sprite.sayText("dodged!", 1000, true)
        }
        else {
            statusbar.value += - playerDamage
        }
        sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
        pause(playerImmunityFrames)
        sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
    })
    // enemy damage
    sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
        statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -currentWeaponDamage
        if (statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value == 0) {
            let lifeStealCheck = randint(1, 100)
            if (lifeStealChance >= lifeStealCheck) {
                statusbar.value++
            }
            sprites.destroy(otherSprite, effects.disintegrate, 100)
        }
        pause(1000)
    })
    //enemy finished moving
    scene.onPathCompletion(SpriteKind.Enemy, function (sprite: Sprite, location: tiles.Location) {
        animation.stopAnimation(animation.AnimationTypes.All, sprite)
        blockControl.raiseEvent(6, 0)
    })
    gameStart(player)
    
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

function gameStart(player: Sprite){
    tiles.destroySpritesOfKind(SpriteKind._TileSprite)
    tiles.setCurrentTilemap(assets.tilemap`empty`)
    player.setPosition(80, 60)

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

    initialValue = 0;
    numberOfEdgeRooms = 0;

    //floor and room gen
    floorGen(floor);
    let floorCleared = false
    fillRooms(floorLayout)
    floorBossAlive = true
    console.log("post room filling:")
    for (let i = 0; i <= floorLayout.length - 1; i++) {
        let message = "";
        for (let j = 0; j <= floorLayout[i].length - 1; j++) {
            message = message + floorLayout[i][j].toString() + "\t";
        }
        console.log(message)
    }
    GcurrentX = startX;
    GcurrentY = startY;

    fullRoomLoadSequence(GcurrentX,GcurrentY,player)
}
function fullRoomLoadSequence (currentX: number, currentY: number, player: Sprite){
    swapRooms(GcurrentX, GcurrentY)
    sprites.destroyAllSpritesOfKind(SpriteKind.weapon)
    player.setFlag(SpriteFlag.GhostThroughSprites, true)
    //game.splash("up " + getUp(currentX, currentY) + " down " + getDown(currentX, currentY) + " right " + getRight(currentX, currentY) + " left " + getLeft(currentX, currentY))
    loadRoomTilesEnemies(GcurrentX, GcurrentY, player)
    let roomUnlocked = false
    roomEnemiesLeft = getEnemies(currentX, currentY)
    chestLooted = false
    timer.background(function() {
        if (roomEnemiesLeft == 0 || getCleared(currentX, currentY)) {
            
            blockControl.raiseEvent(1, 0)
            
        }
        pause(3000)
        player.setFlag(SpriteFlag.GhostThroughSprites, false)
        
    })
    
    
    
    blockControl.waitForEvent(1, 0)
    blockControl.onEvent(2, 0, function () {
        if(!roomUnlocked){
        setCleared(currentX, currentY, true)
        unlockRoom(currentX, currentY)
        roomUnlocked = true;
        }
    })

    scene.onOverlapTile(SpriteKind.Player, assets.tile`LockedChest`, function (sprite, location) {
        if(!chestLooted && roomEnemiesLeft == 0) {
            tiles.coverAllTiles(assets.tile`LockedChest`, assets.tile`OpenedChest`)
            let loot = randint(1,100)
            if(loot <= 65) {
                let rollRare = randint(1,16)
                if(rollRare <= 4) {
                    give_item(0,player)
                }
                else if( 4 < rollRare && rollRare <= 8){
                    give_item(2,player)
                }
                else if (8 < rollRare && rollRare <= 12){
                    give_item(5,player)
                }
                else if (12 < rollRare && rollRare <= 14){
                    give_weapon(1,player,72,44)
                }
                else {
                    give_weapon(2,player,72,44)
                }
            }
            else if (65 < loot && loot <= 90){
                let rollEpic = randint(1,16)
                if (rollEpic <= 4) {
                    give_item(1, player)
                }
                else if (4 < rollEpic && rollEpic <= 8) {
                    give_item(3, player)
                }
                else if (8 < rollEpic && rollEpic <= 12) {
                    give_item(4, player)
                }
                else if (12 < rollEpic && rollEpic <= 14) {
                    give_weapon(3, player, 72, 44)
                }
                else {
                    give_weapon(4, player, 72, 44)
                }
            }
            else {
                let legendaryRoll = randint(1,10)
                if (legendaryRoll <= 4) {
                    give_item(6, player)
                }
                else if (4 < legendaryRoll && legendaryRoll <= 8) {
                    give_item(7, player)
                }
                else{
                    give_weapon(5,player,72,44)
                }
            }
            chestLooted = true
            blockControl.raiseEvent(2, 0)  
        }
    })  
    if(floorLayout[currentX][currentY] == 9 && firstTimeRoom1 == true){
        give_weapon(0, player)
        firstTimeRoom1 = false
    }
    setEnemies(currentX, currentY, 0)
    pause(1000)
    tiles.coverAllTiles(assets.tile`LockedChest`, assets.tile`UnlockedChest`)
    if (getChest(currentX, currentY) && chestLooted == false) {
        scene.cameraShake(4, 500)
    }
    else if(getEnemies(currentX,currentY) == 0){
        blockControl.raiseEvent(2,0)
    }
    if (getCleared(currentX, currentY)) {
        tiles.coverAllTiles(assets.tile`LockedChest`, assets.tile`OpenedChest`)
        chestLooted = true;
        blockControl.raiseEvent(2, 0)
    }
    
    

    blockControl.onEvent(3, 0, function() {
        if (goingUp) {
            player.setPosition(72, 96)
        }
        else if (goingDown) {
            player.setPosition(72, 24)
        }
        else if (goingRight) {
            player.setPosition(24, 52)
        }
        else {
            player.setPosition(136, 52)

        }
        tiles.destroySpritesOfKind(SpriteKind._TileSprite)
        fullRoomLoadSequence(GcurrentX, GcurrentY, player)
    })
}

function unlockRoom(currentX:number,currentY:number){
    pause(1000)
    scene.cameraShake(4, 500)
    if(!getBoss(currentX,currentY)){
    if (getUp(currentX, currentY)) {
        tiles.setWallAt(tiles.getTileLocation(4, 0), false)
        tiles.setWallAt(tiles.getTileLocation(5, 0), false)
        tiles.coverAllTiles(tiles.util.door0, assets.tile`TopDoorOpenLeft`)
        tiles.coverAllTiles(tiles.util.door5, assets.tile`TopDoorOpenRight`)
    }
    if (getDown(currentX, currentY)) {
        tiles.setWallAt(tiles.getTileLocation(4, 7), false)
        tiles.setWallAt(tiles.getTileLocation(5, 7), false)
        tiles.coverAllTiles(tiles.util.door15, assets.tile`BottomDoorOpenRight`)
        tiles.coverAllTiles(tiles.util.door10, assets.tile`BottomDoorOpenLeft`)
    }
    if (getRight(currentX, currentY)) {
        tiles.setWallAt(tiles.getTileLocation(9, 3), false)
        tiles.setWallAt(tiles.getTileLocation(9, 4), false)
        tiles.coverAllTiles(tiles.util.door9, assets.tile`RightDoorOpenBottom`)
        tiles.coverAllTiles(tiles.util.door12, assets.tile`RightDoorOpenTop`)
    }
    if (getLeft(currentX, currentY)) { 
        tiles.setWallAt(tiles.getTileLocation(0, 3), false)
        tiles.setWallAt(tiles.getTileLocation(0, 4), false)
        tiles.coverAllTiles(tiles.util.door6, assets.tile`LeftDoorOpenTop`)
        tiles.coverAllTiles(tiles.util.door3, assets.tile`LeftDoorOpenBottom`)
    }
    }
    else {
        if (getUp(currentX, currentY)) {
            //up
            tiles.setWallAt(tiles.getTileLocation(7, 0), false)
            tiles.setWallAt(tiles.getTileLocation(8, 0), false)
            tiles.coverAllTiles(tiles.util.door0, assets.tile`TopDoorOpenLeft`)
            tiles.coverAllTiles(tiles.util.door5, assets.tile`TopDoorOpenRight`)
            //down
            tiles.setWallAt(tiles.getTileLocation(7, 15), false)
            tiles.setWallAt(tiles.getTileLocation(8, 15), false)
            tiles.coverAllTiles(tiles.util.door15, assets.tile`BottomDoorOpenRight`)
            tiles.coverAllTiles(tiles.util.door10, assets.tile`BottomDoorOpenLeft`)
        }
        if (getDown(currentX, currentY)) {
            //down
            tiles.setWallAt(tiles.getTileLocation(7, 15), false)
            tiles.setWallAt(tiles.getTileLocation(8, 15), false)
            tiles.coverAllTiles(tiles.util.door15, assets.tile`BottomDoorOpenRight`)
            tiles.coverAllTiles(tiles.util.door10, assets.tile`BottomDoorOpenLeft`)
            //up
            tiles.setWallAt(tiles.getTileLocation(7, 0), false)
            tiles.setWallAt(tiles.getTileLocation(8, 0), false)
            tiles.coverAllTiles(tiles.util.door0, assets.tile`TopDoorOpenLeft`)
            tiles.coverAllTiles(tiles.util.door5, assets.tile`TopDoorOpenRight`)
        }
        if (getRight(currentX, currentY)) {
            //right
            tiles.setWallAt(tiles.getTileLocation(15, 7), false)
            tiles.setWallAt(tiles.getTileLocation(15, 8), false)
            tiles.coverAllTiles(tiles.util.door9, assets.tile`RightDoorOpenBottom`)
            tiles.coverAllTiles(tiles.util.door12, assets.tile`RightDoorOpenTop`)
            //left
            tiles.setWallAt(tiles.getTileLocation(0, 7), false)
            tiles.setWallAt(tiles.getTileLocation(0, 8), false)
            tiles.coverAllTiles(tiles.util.door6, assets.tile`LeftDoorOpenTop`)
            tiles.coverAllTiles(tiles.util.door3, assets.tile`LeftDoorOpenBottom`)
        }
        if (getLeft(currentX, currentY)) {
            //left
            tiles.setWallAt(tiles.getTileLocation(0, 7), false)
            tiles.setWallAt(tiles.getTileLocation(0, 8), false)
            tiles.coverAllTiles(tiles.util.door6, assets.tile`LeftDoorOpenTop`)
            tiles.coverAllTiles(tiles.util.door3, assets.tile`LeftDoorOpenBottom`)
            //right
            tiles.setWallAt(tiles.getTileLocation(15, 7), false)
            tiles.setWallAt(tiles.getTileLocation(15, 8), false)
            tiles.coverAllTiles(tiles.util.door9, assets.tile`RightDoorOpenBottom`)
            tiles.coverAllTiles(tiles.util.door12, assets.tile`RightDoorOpenTop`)
        }
    }
}


function loadRoomTilesEnemies(currentX: number, currentY: number, player: Sprite){
    
    for (let index = 0; index < getEnemies(currentX,currentY); index++) {
        let kindOfEnemy = randint(1,floor*2)

        switch(kindOfEnemy){
            case 1: 
                let skele = sprites.create(img`
                . . . . . 1 1 1 1 1 1 . . . . .
                . . . . 1 1 1 1 1 1 1 1 . . . .
                . . . . 1 c c 1 1 c c 1 . . . .
                . . . . 1 c c 1 1 c c 1 . . . .
                . . . . 1 b b 1 1 b b 1 . . . .
                . . . . 1 1 1 c c 1 1 1 . . . .
                . . . . 1 1 1 1 1 1 1 1 . . . .
                . . . . . c b c b c b . . . . .
                . . . . 1 1 1 1 1 1 1 1 . . . .
                . . . c c c c 1 1 c c c c . . .
                . . c b c b c 1 1 c b c b c . .
                . . . . 1 1 1 1 1 1 1 1 . . . .
                . . . . . . . b b . . . . . . .
                . . . . . . . 1 1 . . . . . . .
                . . . . c c c . . c c c . . . .
                . . c c c c c . . c c c c c . .
                `, SpriteKind.Enemy)
                forever(function(){
                scene.followPath(skele, scene.aStar(tiles.locationOfSprite(skele), tiles.locationOfSprite(player)), 10)
                    animation.runImageAnimation(
                        skele,
                        [img`
        . . . . . 1 1 1 1 1 1 . . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . 1 c c 1 1 c c 1 . . . . 
        . . . . 1 c c 1 1 c c 1 . . . . 
        . . . . 1 b b 1 1 b b 1 . . . . 
        . . . . 1 1 1 c c 1 1 1 . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . . c b c b c b . . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . c c c c 1 1 c c c c . . . 
        . . c b c b c 1 1 c b c b c . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . . . . b b . . . . . . . 
        . . . . . . . 1 1 . . . . . . . 
        . . . . c c c . . c c c . . . . 
        . . c c c c c . . c c c c c . . 
                        `, img`
        . . . . . 1 1 1 1 1 1 . . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . 1 c c 1 1 c c 1 . . . . 
        . . . . 1 c c 1 1 c c 1 . . . . 
        . . . . 1 b b 1 1 b b 1 . . . . 
        . . . . 1 1 1 c c 1 1 1 . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . . c b c b c b . . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . c c c c 1 1 c c c c . . . 
        . . c b c b c 1 1 c b c b c . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . c . c b b . . . . . . . 
        . . . . c c c 1 1 . . . . . . . 
        . . . . c 1 c . . c c . . . . . 
        . . . . c c c . . c c . . . . . 
                        `, img`
        . . . . . 1 1 1 1 1 1 . . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . 1 c c 1 1 c c 1 . . . . 
        . . . . 1 c c 1 1 c c 1 . . . . 
        . . . . 1 b b 1 1 b b 1 . . . . 
        . . . . 1 1 1 c c 1 1 1 . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . . c b c b c b . . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . c c c c 1 1 c c c c . . . 
        . . c b c b c 1 1 c b c b c . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . . . . b b . . . . . . . 
        . . . . . . . 1 1 . . . . . . . 
        . . . . c c c . . c c c . . . . 
        . . c c c c c . . c c c c c . . 
                        `, img`
        . . . . . 1 1 1 1 1 1 . . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . 1 c c 1 1 c c 1 . . . . 
        . . . . 1 c c 1 1 c c 1 . . . . 
        . . . . 1 b b 1 1 b b 1 . . . . 
        . . . . 1 1 1 c c 1 1 1 . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . . b c b c b c . . . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . c c c c 1 1 c c c c . . . 
        . . c b c b c 1 1 c b c b c . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        . . . . . . . b b c . c . . . . 
        . . . . . . . 1 1 c c c . . . . 
        . . . . . c c . . c 1 c . . . . 
        . . . . . c c . . c c c . . . . 
                        `],
                        500,
                        true
                    )
                    blockControl.waitForEvent(6, 0)
                })
                let skeleBar = statusbars.create(20, 6, StatusBarKind.EnemyHealth)
                skeleBar.attachToSprite(skele)
                skeleBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
                skeleBar.setBarBorder(1, 15)
                skeleBar.max = 10
                tiles.placeOnRandomTile(skele, assets.tile`FloorTile`)
            break;
            case 2:
                let slime = sprites.create(img`
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . 6 6 6 6 . . . . . .
                    . . . . . 6 7 7 7 7 6 . . . . .
                    . . . . 6 7 7 7 7 7 7 6 . . . .
                    . . . 6 7 1 1 7 7 1 1 7 6 . . .
                    . . 6 7 1 f 5 5 5 5 f 1 7 6 . .
                    . . 6 7 7 5 5 5 5 5 5 7 7 6 . .
                    . . 6 7 7 5 5 5 5 5 5 7 7 6 . .
                    . . 6 7 7 5 5 5 5 5 5 7 7 6 . .
                    . . 6 7 7 7 5 5 5 5 7 7 7 6 . .
                    . . . 6 7 7 7 7 7 7 7 7 6 . . .
                    . . . . 6 6 6 6 6 6 6 6 . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                `, SpriteKind.Enemy)
                forever(function () {
                    scene.followPath(slime, scene.aStar(tiles.locationOfSprite(slime), tiles.locationOfSprite(player)), 30)
                    animation.runImageAnimation(
                        slime,
                        [img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . 6 6 6 6 . . . . . . 
        . . . . . 6 7 7 7 7 6 . . . . . 
        . . . . 6 7 7 7 7 7 7 6 . . . . 
        . . . 6 7 1 1 7 7 1 1 7 6 . . . 
        . . 6 7 1 f 5 5 5 5 f 1 7 6 . . 
        . . 6 7 7 5 5 5 5 5 5 7 7 6 . . 
        . . 6 7 7 5 5 5 5 5 5 7 7 6 . . 
        . . 6 7 7 5 5 5 5 5 5 7 7 6 . . 
        . . 6 7 7 7 5 5 5 5 7 7 7 6 . . 
        . . . 6 7 7 7 7 7 7 7 7 6 . . . 
        . . . . 6 6 6 6 6 6 6 6 . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . 6 6 6 6 6 6 . . . . . 
        . . . . 6 f 1 5 5 1 f 6 . . . . 
        . . . 6 1 1 5 5 5 5 1 1 6 . . . 
        . . 6 7 7 5 5 5 5 5 5 7 7 6 . . 
        . . 6 7 7 5 5 5 5 5 5 7 7 6 . . 
        . . . 6 7 7 5 5 5 5 7 7 6 . . . 
        . . . . 6 6 6 6 6 6 6 6 . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `],
                        200,
                        true
                    )
                    blockControl.waitForEvent(6,0)
                })
                let slimeBar = statusbars.create(20, 6, StatusBarKind.EnemyHealth)
                slimeBar.attachToSprite(slime)
                slimeBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
                slimeBar.setBarBorder(1, 15)
                slimeBar.max = 5
                tiles.placeOnRandomTile(slime, assets.tile`FloorTile`)
            break;
            case 3:
                let virus = sprites.create(img`
                    . . . . . . . a a . . . . . . .
                    . . . . . . a 9 9 a . . . . . .
                    . . . . . a 9 9 9 9 a . . . . .
                    . . . . a 9 a 9 9 a 9 a . . . .
                    . . . . a 9 9 a a 9 9 a . . . .
                    . . . . a 9 9 a a 9 9 a . . . .
                    . . . . a 9 a 9 9 a 9 a . . . .
                    . . . . . a 9 9 9 9 a . . . . .
                    . . . . . . a 9 9 a . . . . . .
                    . . . . . . 6 a a 6 . . . . . .
                    . . . 8 . . 6 9 9 6 . . 8 . . .
                    . . 8 . 8 . 6 9 9 6 . 8 . 8 . .
                    . . 8 . 8 . 6 9 9 6 . 8 . 8 . .
                    . 8 . . . 8 6 9 9 6 8 . . . 8 .
                    . 8 . . . 8 6 6 6 6 8 . . . 8 .
                    . 8 . . . . . . . . . . . . 8 .
                `, SpriteKind.Enemy)
                forever(function () {
                    scene.followPath(virus, scene.aStar(tiles.locationOfSprite(virus), tiles.locationOfSprite(player)), 40)
                    animation.runImageAnimation(
                        virus,
                        [img`
        . . . . . . . a a . . . . . . . 
        . . . . . . a 9 9 a . . . . . . 
        . . . . . a 9 9 9 9 a . . . . . 
        . . . . a 9 a 9 9 a 9 a . . . . 
        . . . . a 9 9 a a 9 9 a . . . . 
        . . . . a 9 9 a a 9 9 a . . . . 
        . . . . a 9 a 9 9 a 9 a . . . . 
        . . . . . a 9 9 9 9 a . . . . . 
        . . . . . . a 9 9 a . . . . . . 
        . . . . . . 6 a a 6 . . . . . . 
        . . . 8 . . 6 9 9 6 . . 8 . . . 
        . . 8 . 8 . 6 9 9 6 . 8 . 8 . . 
        . . 8 . 8 . 6 9 9 6 . 8 . 8 . . 
        . 8 . . . 8 6 9 9 6 8 . . . 8 . 
        . 8 . . . 8 6 6 6 6 8 . . . 8 . 
        . 8 . . . . . . . . . . . . 8 . 
                        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . a a . . . . . . . 
        . . . . . . a 9 9 a . . . . . . 
        . . . . . a 9 9 9 9 a . . . . . 
        . . . . a 9 a 9 9 a 9 a . . . . 
        . . . . a 9 9 a a 9 9 a . . . . 
        . . . . a 9 9 a a 9 9 a . . . . 
        . . . . a 9 a 9 9 a 9 a . . . . 
        . . . . . a 9 9 9 9 a . . . . . 
        . . . . . . a 9 9 a . . . . . . 
        . . . 8 8 . 6 a a 6 . 8 8 . . . 
        . . 8 . 8 . 6 9 9 6 . 8 . 8 . . 
        . . 8 . 8 . 6 9 9 6 . 8 . 8 . . 
        . . 8 . . 8 6 9 9 6 8 . . 8 . . 
        . . 8 . . 8 6 9 9 6 8 . . 8 . . 
        . . 8 . . . 6 6 6 6 . . . 8 . . 
                        `],
                        50,
                        true
                    )
                    blockControl.waitForEvent(6, 0)
                })
                let virusBar = statusbars.create(20, 6, StatusBarKind.EnemyHealth)
                virusBar.attachToSprite(virus)
                virusBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
                virusBar.setBarBorder(1, 15)
                virusBar.max = 7
                tiles.placeOnRandomTile(virus, assets.tile`FloorTile`)
            break;
            case 4:
                let worm= sprites.create(assets.image`underGround`, SpriteKind.Enemy)
                forever(function () {
                    scene.followPath(worm, scene.aStar(tiles.locationOfSprite(worm), tiles.locationOfSprite(player)), 40)
                    scene.onPathCompletion(SpriteKind.Enemy, function(sprite: Sprite, location: tiles.Location) {
                        animation.runImageAnimation(
                            worm,
                            [img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . b b b b b . . 
        . . . . . . . . b c c c c c b b 
        . . . . . . . . c f f f f f c b 
        . . . . . . . . b c c c c c 3 b 
        . . . . . . . . b 3 3 3 3 3 3 b 
        . . . . . . . . b b b b b b b b 
        . . . . . . . . b 3 3 3 3 3 3 b 
        . . . . . . . . b 3 3 3 3 3 3 b 
        . . . . . . . . e 3 e 3 e 3 e b 
        . . . . . . . e . e . e . e . e 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . . . . b b b b b b b b . . . . 
        . . . b 3 3 3 3 3 3 3 3 b . . . 
        . . b 3 3 3 3 3 3 3 3 3 b b . . 
        . . b 3 3 3 3 3 3 3 3 3 b 3 b . 
        . . b 3 3 3 3 3 3 3 3 b 3 3 3 b 
        . . c c c c c 3 3 3 3 b 3 3 3 b 
        . c f f f f f c 3 3 b 3 3 3 3 b 
        . . c c c c c 3 3 3 b 3 3 3 3 b 
        . . . . . . . b 3 b 3 3 3 3 b b 
        . . . . . . . . b 3 3 3 3 b 3 b 
        . . . . . . . . b 3 3 b b 3 3 b 
        . . . . . . . . b b b 3 3 3 3 b 
        . . . . . . . . b 3 3 3 3 3 3 b 
        . . . . . . . . e 3 e 3 e 3 e b 
        . . . . . . . e . e . e . e . e 
        . . . . . . . . . . . . . . . . 
                        `],
                            200,
                            false
                        )
                    })
                    worm.setImage(img`
                        . . . . b b b b b b b b . . . .
                        . . . b 3 3 3 3 3 3 3 3 b . . .
                        . . b 3 3 3 3 3 3 3 3 3 b b . .
                        . . b 3 3 3 3 3 3 3 3 3 b 3 b .
                        . . b 3 3 3 3 3 3 3 3 b 3 3 3 b
                        . . c c c c c 3 3 3 3 b 3 3 3 b
                        . c f f f f f c 3 3 b 3 3 3 3 b
                        . . c c c c c 3 3 3 b 3 3 3 3 b
                        . . . . . . . b 3 b 3 3 3 3 b b
                        . . . . . . . . b 3 3 3 3 b 3 b
                        . . . . . . . . b 3 3 b b 3 3 b
                        . . . . . . . . b b b 3 3 3 3 b
                        . . . . . . . . b 3 3 3 3 3 3 b
                        . . . . . . . . e 3 e 3 e 3 e b
                        . . . . . . . e . e . e . e . e
                        . . . . . . . . . . . . . . . .
                    `)
                    pause(2000)
                    animation.runImageAnimation(
                        worm,
                        [img`
        . . . . b b b b b b b b . . . . 
        . . . b 3 3 3 3 3 3 3 3 b . . . 
        . . b 3 3 3 3 3 3 3 3 3 b b . . 
        . . b 3 3 3 3 3 3 3 3 3 b 3 b . 
        . . b 3 3 3 3 3 3 3 3 b 3 3 3 b 
        . . c c c c c 3 3 3 3 b 3 3 3 b 
        . c f f f f f c 3 3 b 3 3 3 3 b 
        . . c c c c c 3 3 3 b 3 3 3 3 b 
        . . . . . . . b 3 b 3 3 3 3 b b 
        . . . . . . . . b 3 3 3 3 b 3 b 
        . . . . . . . . b 3 3 b b 3 3 b 
        . . . . . . . . b b b 3 3 3 3 b 
        . . . . . . . . b 3 3 3 3 3 3 b 
        . . . . . . . . e 3 e 3 e 3 e b 
        . . . . . . . e . e . e . e . e 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . b b b b b . . 
        . . . . . . . . b c c c c c b b 
        . . . . . . . . c f f f f f c b 
        . . . . . . . . b c c c c c 3 b 
        . . . . . . . . b 3 3 3 3 3 3 b 
        . . . . . . . . b b b b b b b b 
        . . . . . . . . b 3 3 3 3 3 3 b 
        . . . . . . . . b 3 3 3 3 3 3 b 
        . . . . . . . . e 3 e 3 e 3 e b 
        . . . . . . . e . e . e . e . e 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `],
                        200,
                        false
                    )
                    worm.setImage(assets.image`underGround`)
                })
                let wormBar = statusbars.create(20, 6, StatusBarKind.EnemyHealth)
                wormBar.attachToSprite(slime)
                wormBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
                wormBar.setBarBorder(1, 15)
                wormBar.max = 12
                tiles.placeOnRandomTile(slime, assets.tile`FloorTile`)
        }

        
    }

    if(!getUp(currentX,currentY)){
        tiles.coverAllTiles(tiles.util.door0, assets.tile`HorizontalWall`)
        tiles.coverAllTiles(tiles.util.door5, assets.tile`HorizontalWall`)
    }
    else{
        tiles.coverAllTiles(tiles.util.door0, assets.tile`TopDoorClosedLeft`)
        tiles.coverAllTiles(tiles.util.door5, assets.tile`TopDoorClosedRight`)
    }
    if (!getDown(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door15, assets.tile`HorizontalWall`)
        tiles.coverAllTiles(tiles.util.door10, assets.tile`HorizontalWall`)
    }
    else{
        tiles.coverAllTiles(tiles.util.door15, assets.tile`BottomDoorClosedRight`)
        tiles.coverAllTiles(tiles.util.door10, assets.tile`BottomDoorClosedLeft`)
    }
    if (!getRight(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door9, assets.tile`VerticalWall`)
        tiles.coverAllTiles(tiles.util.door12, assets.tile`VerticalWall`)
    }  
    else{
        tiles.coverAllTiles(tiles.util.door9, assets.tile`RightDoorClosedBottom`)
        tiles.coverAllTiles(tiles.util.door12, assets.tile`RightDoorClosedTop`)

    } 
    if (!getLeft(currentX, currentY)) {
        tiles.coverAllTiles(tiles.util.door6, assets.tile`VerticalWall`)
        tiles.coverAllTiles(tiles.util.door3, assets.tile`VerticalWall`)
    }
    else{
        tiles.coverAllTiles(tiles.util.door6, assets.tile`LeftDoorClosedTop`)
        tiles.coverAllTiles(tiles.util.door3, assets.tile`LeftDoorClosedBottom`)
    }

    if (getBoss(currentX, currentY) && floorBossAlive) {
        if(floor == 1){
        tiles.coverAllTiles(tiles.util.object4, assets.tile`FloorTile`)
        setEnemies(currentX,currentY, 3)
        let kingWorm = sprites.create(img`
            ................................
            ..........ccccccccccccc.........
            .........cbbdddddddddddc........
            ........cbbbdddddddbbdddc.......
            .......cbbbbddddddbbbbdddc......
            ......cbbbbdddddddddbbbdddc.....
            ......cdddddddddddddddddddc.....
            ......cdddcccccccccccccdddc.....
            ......cdcc3333333333333ccdc.....
            ......cc333ccccccccccc333cc.....
            ......c33cc33333333333cc33c.....
            ......c3c333ccccccccc333c3c.....
            ......c3333cbbbbbbbbbc3333c.....
            ......cccccbdddddddddbccccc.....
            ......cbbbbdddbbddddddbbbbc.....
            ......cdddddddbbbbddddddddc.....
            ......ccdddddddddddddddddcc.....
            ......cdcdddddddddddddddcdc.....
            ......cddcccccccccccccccbdc.....
            ......cddddddddddbbbbbbbddc.....
            ......cdbdddddddddddbbddddc.....
            ......cddbbbbbbdddddddddddc.....
            ......cddddddddddddddbbdddc.....
            ......ccddddddddddbbbbbddcc.....
            ......cdcdddddddddddbbddcdc.....
            ......cddcccccccccccccccddc.....
            ......cdddddddddddddddddddc.....
            ......cdbdbdbdbdbdbdbdbdbdc.....
            ......cbcbcbcbcbcbcbcbcbcbc.....
            .....c.c.c.c.c.c.c.c.c.c.c.c....
            ................................
            ................................
        `, SpriteKind.Enemy)

        let bossWormBar = statusbars.create(40, 8, StatusBarKind.EnemyHealth)
        bossWormBar.attachToSprite(kingWorm)
        bossWormBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
        bossWormBar.setBarBorder(1, 15)
        bossWormBar.max = 50
        tiles.placeOnRandomTile(kingWorm, tiles.util.object4)
        floorBossAlive = false
        }

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

function spawn_weapon(weapon_Sprite: Sprite, player: Sprite) {
    if (player.y < 60) {
        weapon_Sprite.setPosition(player.x, player.y + 30)
    } else if (player.y > 60) {
        weapon_Sprite.setPosition(player.x, player.y - 30)
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

function give_weapon(idx: number, player: Sprite, x?:number, y?: number) {
    weapon_drop = sprites.create(all_weapons[idx], SpriteKind.weapon)
    if(x == null || y == null){
        weapon_drop.setPosition(player.x, player.y)
        currentWeaponDamage = getDamage(idx)
    }
    else{
        weapon_drop.setPosition(x, y)
    }
    weapon_drop.follow(player, 15)
}

function give_item(idx: number, player2: Sprite) {
    item_drop = sprites.create(all_items[idx], SpriteKind.item)
    item_drop.setPosition(72, 44)
    item_drop.follow(player2, 15)
}

function updateSpeed(speed: number, sprite: Sprite){
    controller.moveSprite(sprite,speed,speed)
}