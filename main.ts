 namespace NumProp {
    export const enemies = NumProp.create()
    export const damage = NumProp.create()
}
namespace SpriteKind {
    export const hurt = SpriteKind.create()
    export const item = SpriteKind.create()
    export const weapon = SpriteKind.create()
    export const fireball = SpriteKind.create()
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
let floor = 0;
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
    music.play(music.createSong(hex`0078000408010305001c000f0a006400f4010a00000400000000000000000000000000000000020c0000000400012404000800012006001c00010a006400f401640000040000000000000000000000000000000002060000000400011d09010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c80007000000010002090a`), music.PlaybackMode.InBackground)

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
        case 2: setDamage(index, 7)
        break;
        case 3: setDamage(index, 8)
        break;
        case 4: setDamage(index, 9)
        break;
        case 5: setDamage(index, 20)
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
                music.play(music.createSong(hex`0078000408010403001c0001dc00690000045e0100040000000000000000000005640001040003180000000400012704000800012908000c00012a0c001000012c07001c00020a006400f401640000040000000000000000000000000000000003180000000400011d04000800012008000c00011d0c001000012008001c000e050046006603320000040a002d0000006400140001320002010002180000000400012204000800012408000c0001220c001000012409010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c80018000000010001010400050001010800090001010c000d000101`), music.PlaybackMode.InBackground)
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
                music.play(music.createSong(hex`002c010408010301001c000f05001202c102c20100040500280000006400280003140006020004120000000400012004000800012208000c00012406001c00010a006400f401640000040000000000000000000000000000000002120000000400011d04000800011e08000c00012007001c00020a006400f401640000040000000000000000000000000000000003120000000400012504000800012908000c00012c`), music.PlaybackMode.InBackground)

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
                    playerDodgeChance = playerDodgeChance + 35
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
                gameStart(sprite, floor)
            }
            else if (!takenRooms[GcurrentX][GcurrentY - 1]) {
                floor = floor + 1;
                gameStart(sprite, floor)
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
            gameStart(sprite, floor)
        }
        else if (!takenRooms[GcurrentX][GcurrentY + 1]){
            floor = floor + 1;
            gameStart(sprite, floor)
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
                gameStart(sprite, floor)
            }
            else if (!takenRooms[GcurrentX - 1][GcurrentY]) {
                floor = floor + 1;
                gameStart(sprite, floor)
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
                gameStart(sprite, floor)
            }
            else if (!takenRooms[GcurrentX + 1][GcurrentY]) {
                floor = floor + 1;
                gameStart(sprite, floor)
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
music.play(music.createSong(hex`0078000408020109010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c8001200000001000102100011000102200021000102`), music.PlaybackMode.InBackground)
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
let logo = sprites.create(img`
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
    cccccccccccccccccccccccccccccccccccccccccccccccc
    c2222222222222222222222222222222222222222222222c
    c2bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb2c
    c2b333333333333333333333333333333333333333333b2c
    c2b3ccccc333333333333333333333333333333333333b2c
    c2b33c333c3cc33333333333333c333cc333333333333b2c
    c2b33c333c3cc33333333333333c333cc333333333333b2c
    c2b33c333c333333333333333ccccc333333333333333b2c
    c2b33c333c33c3ccc3ccc3ccc33c333c3c3c3ccc33333b2c
    c2b33c333c33c3c3c3cc33cc333c333c3c3c3cc333333b2c
    c2b3cc333c33c3c3c3c33333c33c333c3ccc3c3333333b2c
    c2b3ccccc333c3ccc3ccc3cc333c333c33c33ccc33333b2c
    c2b3333333333333c3333333333333333333333333333b2c
    c2b3ccccc33333ccc3333333333333333333666666663b2c
    c2b33c333c33333333333333333333333333699999963b2c
    c2b33c333c33333333333333333333333333699999963b2c
    c2b33c333c333333333333333333333333336ff55ff63b2c
    c2b33c333c3c3c3ccc3ccc3ccc3ccc3ccc33655555563b2c
    c2b33c333c3c3c3c3c3c3c3cc33c3c3c3c33699559963b2c
    c2b3cc333c3c3c3c3c3ccc3c333c3c3c3c33699559963b2c
    c2b3ccccc33ccc3c3c333c3ccc3ccc3c3c33666666663b2c
    c2b3333333333333333ccc33333333333333333333333b2c
    c2bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb2c
    c2222222222222222222222222222222222222222222222c
    cccccccccccccccccccccccccccccccccccccccccccccccc
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
`)
pressA.setPosition(80,110)
logo.setPosition(80, 10)
pause(200)
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    music.play(music.createSong(hex`0078000408010108001c000e050046006603320000040a002d00000064001400013200020100020600000004000120`),music.PlaybackMode.InBackground)
    if (!gameStarted){
        gameStarted = true
        scene.setBackgroundImage(assets.image`Empty`)
        sprites.destroy(pressA)
        sprites.destroy(logo)
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
    info.setScore(0)

    let player = sprites.create(assets.image`up arrow`, SpriteKind.Player)
    controller.moveSprite(player, playerSpeed, playerSpeed)
    scene.cameraFollowSprite(player)
    //count up start
    info.startCountup()
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
            music.play(music.createSong(hex`0078000408010103001c0001dc00690000045e0100040000000000000000000005640001040003060000000400011d`), music.PlaybackMode.InBackground)
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
            music.play(music.createSong(hex`002c010408020207001c00020a006400f401640000040000000000000000000000000000000003120000000400012004000800012408000c00012709010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c80018000000010001020400050001040800090001060c000d000108`),music.PlaybackMode.InBackground)
        }
        else {
            statusbar.value += - playerDamage
            music.play(music.createSong(hex`0078000408020204001c00100500640000041e000004000000000000000000000000000a040004060000000400012c09010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c8000600000001000102`),music.PlaybackMode.InBackground)
        }
        sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
        pause(playerImmunityFrames)
        sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
        if(statusbar.value == 0){
            if(floor == 0){

            }
            else {

                game.setGameOverMessage(false, "You Died! Time: "+ info.getTimeElapsed())
                game.gameOver(false)
            }
        }
    })
    sprites.onOverlap(SpriteKind.Player, SpriteKind.fireball, function (sprite, otherSprite) {
        sprites.destroy(otherSprite,effects.fire,100)
        let dodgeCheck = randint(1, 100)
        if (playerDodgeChance >= dodgeCheck) {
            sprite.sayText("dodged!", 1000, true)
            music.play(music.createSong(hex`002c010408020207001c00020a006400f401640000040000000000000000000000000000000003120000000400012004000800012408000c00012709010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c80018000000010001020400050001040800090001060c000d000108`), music.PlaybackMode.InBackground)

        }
        else {
            statusbar.value += - playerDamage
            music.play(music.createSong(hex`0078000408020204001c00100500640000041e000004000000000000000000000000000a040004060000000400012c09010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c8000600000001000102`), music.PlaybackMode.InBackground)

        }
        sprite.setFlag(SpriteFlag.GhostThroughSprites, true)
        pause(playerImmunityFrames)
        sprite.setFlag(SpriteFlag.GhostThroughSprites, false)
        if (statusbar.value == 0) {
            game.setGameOverMessage(false, "You Died! Time: " + info.getTimeElapsed())
            game.gameOver(false)
        }
    })
    // enemy damage
    sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
        statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -currentWeaponDamage
        if (statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value == 0) {
            let lifeStealCheck = randint(1, 100)
            if (lifeStealChance >= lifeStealCheck) {
                statusbar.value++
                music.play(music.createSong(hex`002c010408010301001c000f05001202c102c201000405002800000064002800031400060200040c0000000400011e04000800012205001c000f0a006400f4010a0000040000000000000000000000000000000002060008000c00012709010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c800150000000100020409040005000204070800090002080a`),music.PlaybackMode.InBackground)
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
    give_weapon(5, player, 128,180)
    gameStart(player, floor)
    
}


function bossStartSpawn (player: Sprite){
    tiles.setCurrentTilemap(tilemap`Outside`)
    player.setPosition(128, 170)

    let monster = sprites.create(assets.image`monster1`, SpriteKind.Enemy)
    let monsterBar = statusbars.create(40, 8, StatusBarKind.EnemyHealth)
    monsterBar.attachToSprite(monster)
    monsterBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
    monsterBar.setBarBorder(1, 15)
    monsterBar.max = 500
    monsterBar.value = 500
    monster.setPosition(128, 60)
    let bossOver = false
    forever(function () {
        let mySprite: Sprite = null
        animation.runImageAnimation(
            monster,
            [assets.image`monster1`, assets.image`monster2`],
            200,
            true
        )
        if (bossOver){}
        else{
        if (monsterBar.value > 375) {
            scene.followPath(monster, scene.aStar(tiles.locationOfSprite(monster), tiles.locationOfSprite(player)), 30)
            pause(2000)
        }
        else if (monsterBar.value <= 375 && monsterBar.value > 250) {
            scene.followPath(monster, scene.aStar(tiles.locationOfSprite(monster), tiles.locationOfSprite(player)), 40)
            pause(1000)
            scene.followPath(monster, scene.aStar(tiles.locationOfSprite(monster), tiles.locationOfSprite(player)), 40)
            pause(1000)
        }
        else {
            bossOver = true
            pause(500)
            monster.destroy()
            tiles.setCurrentTilemap(assets.tilemap`empty`)
            player.setFlag(SpriteFlag.Invisible, true)
            statusbar.setFlag(SpriteFlag.Invisible, true)
            monsterBar.setFlag(SpriteFlag.Invisible, true)
            toolbar.setFlag(SpriteFlag.Invisible, true)
            scene.setBackgroundImage(img`
                9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999fffffffffffffffffffffffffffffdddddddddddddddddddddddeeeeeeeeeeeeeeeeeeee
                999999999999999999999999999999999999999999999999999999999999999999999999999999999999999ffffffffffffffffffffffffffffffffdddddddddddddddddddddddeeeeeeeeeeeeeeeeee
                99999999999999999999999999999999999999999999999999999999999999999999999999999999999999fffffffffffffffffffffffffffffffffdddddddddddddddddddddddddeeeeeeeeeeeeeeee
                999999999999999999999999999999999999999999999999999999999999999999999999999999999999fffffffffffffffffffffffffffffffffffddddddddddddddddddddddddddeeeeeeeeeeeeeee
                99999999999999999999999999999999999999999999999999999999999999999999999999999999999fffffffffffffffffffffffffffffffffffddddddddddddddddddddddddddddeeeeeeeeeeeeee
                9911111111111111111111111911111111119999999999999999999999999999999999999999999999fffffffffffffffffffffffffffffffffddddddddddddddddddddddddddddddddeeeeeeeeeeeee
                1111111111111111111111111111111111111111119999999999999999999999999999999999999999fffffffffffffffffffffffffffffffdddddddddddddddddddddddddddddddddddeeeeeeeeeeee
                11111111111111111111111111111111111111111111111199999111111999999999999999999999fffffffffffffffffffffffffffffffddddddddddddddddddddddddddddddddddddddeeeeeeeeeee
                1111111111111111111111111111111111111111111111111111111111111999999999999999999ffffffffffffffffffffffffffddddddddddddddddddddddddddddddddddddddddddddeeeeeeeeeee
                111111111111111111111111111111111111111111111111111111111111111999999999999999ffffffffffffffffffffffffddddddddddddddddddddddddddddddddddddddddddddddddeeeeeeeeee
                1111111111111111111111111111111111111111111111111111111111111111199999999999fffffffffffffffffffffffddddddddddddddddddddddddddddddddddddddddddddddddddddeeeeeeeee
                1111111111bbbbbb11111111111111111111111111111111111111111111111111199999999ffffffffffffffffffdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddeeeeeeee
                1111111bbbbbbbbbbb111111111111111111111111111111111111111111111111111111199ffffffffffffffffdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddeeeeeeee
                1111bbbbbbbbbbbbbbb1111111111111111111bbbbb11111111111111111111111111111199ffffffffffffffffffffddddddddddddddddddddddddddddddddddddddddddddddddddddddddddeeeeeee
                11bbbbbbbbbb11bbbbbbb11111111111bbbbbb11111bbb111111111111111111111111111999fffffffff1111111111ffdddddddddddddddddddddddddddddddddddddddddddddddddddddddddeeeeee
                1bbbbbbbb1111111bbbbbb111111111b11111111111111bbb111111111bb1111111111111199ffffff11111111111111ffdddddddddddddddddddddddddddddddddddddddddddddddddddddddddeeeee
                1bbbbb11111111111bbbbb111111111111111111111111111bb11111bbb11111111111111199999ff11111111111111111fdddddddddddddddddddddddddddddddddddddddddddddddddddddddddeeee
                1bbb1111111111bbbbbbbb11111111111111111111111111111bbbbb1111111111111111119999ff111111111111111111ffdddddddddddddddddddddddddddddddddddddddddddddddddddddddddeee
                11111111111111bbbbbbbb11111111111111111111111111111111111111111111111111111999f11111111111111111111ffddddddddddddddddddddddddddddddddddddddddddddddddddddddddeee
                11111111111111bbbbbbbb1111111111111111111111111111111111111111111111111111199ff11f111111111111111111fdddddddddddddddddddddddddddddddddddddddddddddddddddddddddee
                11111111111111bbb11111111111111111111111111111111111111111111111bbbbbbbb1119ff11fff111111111111111111fddddddddddddddddddddddddddddddddddddddddddddddddddddddddde
                111111111111111111111111111111111111111111111111111111111111111bbbbbbbbb1119f11ffff111111111111111111fdddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                11111111111111111111111111111111111111111111111111bbbbbbb11111bbbbbbbbbb1119f11fffff11111111111111111fdddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                11111111111111111111111111111111111111111111111111bbbbbbbbbbbbbbbb111bbb111f11fffffff1111111111111111fdddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                111111111111111111111111111111bbb11111111111111111bbbbbbbbbbbbbbbb111bbb111f11fffffff111111111111111fffddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                111111111111111111111111111111111bbbbbbbb11111111111111bbbbbbbbb11111111111f11ffffffff11111111111111fffddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                1111111111111111111111111111111111111111bb1111111111111111bbbbb111111111119f11ffffffff11111111111111fffddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                111111111111111111111111111111111111111111b11111111111111111111111111111119f11ffffffff1111111111111ffffddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                1111111111119999991111111111111111111111111b1111111111111111111111111111119ff1ffffffff1111111111111ffffddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                11111111199999999999999911111111111111111111b111111111111111111111111111199ff1fffffffff11111111111fffffddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                111119999999999999999999999911111111111111111bbbb111111111111111111111111999ff.ffffffff1111111111ffffffddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                9999999999999999999999999999999911111111111111111111111111111111111111119999fffffffffff111111111ffffffdddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                9999999999999999999999999999999999999111111111111111111b11111111111111119999fffffffffff1111111ffffffffdddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                99999999999999999999999999999999999999999911111111111111bbbb1111111111999999ffffffffffffffffffffffffffdddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                9999999999999999999ff999999999999999999999911111111111111111bbb1111119999999ddfffffffffffffffffffffffddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                99999999999999999ffff9999999999999999999999991111111111111111111111199999999ddddddfffffffffffffffffddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                9999999999999999ff1ff9999999999999999999999999991111111111111111119999999999dddddddddddffffffffffddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                999999999999999ff1fff9999999999999999999999999999111111111111199999999999999ddffffdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                99999999999999ff11fff9999999999999999999999999999999999999999999999999999999dddddffddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                99999999999999ff1ffff9999999999999999999999999999999999999999999999999999999dddddddfdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                99999999999999fffffff9999999999999999999999999999999999999999999999999999999ffffdddffddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                99999999999999fffffff9999999999999999999999999999999999999999999999999999999fffffdddfddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                9999999999999dffffddd9999999999999999999999999999999999999999999999999999999fffffdddffdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                999999999999ddddddddd99999999999999999999999999999999999999999999999999999999ffffddddfdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                99999999999dddddddddd999999999999999999999ff999999999999999999999999999999999fffdddddddddddddd555555555555dddddddddddddddddddddddddddddddddddddddddddddddddddddd
                ff99999999ddddddddddd99999999999999999999fff999999999999999999999999999999999dddddddddddd555555555555555555555dddddddddddddddddddddddddddddddddddddddddddddddddd
                ff9999999dddddddddddd999999999999999999fffff999999999999999999999999999999999dddddddd55555555555555c5555555555555555555555dddddddddddddddddddddddddddddddddddddd
                ff9999999dddddddddddd9999999999999999ffff1ff999999999999999999999999999999999dddddd5555555555555555c555555555c5555555555555555dddddddddddddddddddddddddddddddddd
                ff999999ddddddddddddd999999999999999ffff11ff999999999999999999999999999999999dddd555555555555515555c55555555cc55555555555555555ddddddddddddddddddddddddddddddddd
                ff99999dddddddddddddd9999999999999ddffff1fff9999999999999999999999999999999999dd555551555555515555cc55555555cc5555555551555555555ddddddddddddddddddddddddddddddd
                ff99999ddddddddddddd9999999999999ddddddfffff9999999999999999999999999999999999d5555515555c5551555ccc5555155ccc55555555155c55555555dddddddddddddddddddddddddddddd
                ff9999dddddddddddddd999999999999ddddddddffff9999999999999999999999999999999999d5555515555c551555cccc5551555ccc5555555155cc555555515ddddddddddddddddddddddddddddd
                ff9999dddddddddddddd99999999999ddddddddddfff99999999999999999999999999999999999555515555cc515555cccc551555ccccc55555155ccc5555555155dddddddddddddddddddddddddddd
                ff9999ddcddddddddddd9999999999dddddddddddfff99999999999999999999999999999999999555115555ccc15555cccc551555cccccc5551555ccc5555555155dddddddddddddddddddddddddddd
                ff9999ddcddddddddddd999999999dddddddddddddd99999999999999999999999999999999999955555555cccc5555ccccc555555cccccc555555cccc5555555155dddddddddddddddddddddddddddd
                ff999dddcccddddddddd99999999dddddddddddddd999999999999999999999999999999999999955555555cccc5555ccccc555555cccccc55555ccccc5555551555dddddddddddddddddddddddddddd
                dd999dddddccdddddddd99999999dddddddddddddd99999999999999999999999999999999999999555555ccccc555ccccccc5555ccccccc5555cccccc55555515cccddddddddddddddddddddddddddd
                ddd99ddddddcccdddddd9999999dddddddddddddd99999999999999999999999999999999999999955555ccccccc55cccccccc555ccccccccccccccccc55555155ccccdddddddddddddddddddddddddd
                ddd99ddddddddcccdddd999999ddddddddddddddd99999999999999999999999999999999999999995555ccccccc55cccccccc555cccccccccccccccccc555155ccccccddddddddddddddddddddddddd
                ddd99ddddddddddddddd999999ddddddddddddddd9999999999999999999999999999999999999999555ccccccccc5cccccccccccccccccccccccccccccc51555ccccccddddddddddddddddddddddddd
                dddd9ddddddddddddddd99999ddddddddddddddd99999999999999999999999999992222229999999955ccccccccccccccccccccccccccccccccccccccccc555ccccccccdddddddddddddddddddddddd
                dddd9ddddddddddddddd9999dddddddddddddddd999999999999f9999999999922222222229999999955ccccccccccccccccccccccccccccccccccccccccc55cccccccccdddddddddddddddddddddddd
                ccdd9ddddddddddddddd9999dddddddddddddddd99999999999fff9999999222222222222299999999c5ccccccccccccccccccccccccccccccccccccccccc55cccccccccdddddddddddddddddddddddd
                ddddccdddddddddddddd9999ddddcddddddddddd99999999999fff9999922222222222299999999999ccccccccccccccccccccccccccccccccccffffcccccccccccccccccddddddddddddddddddddddd
                ddddccdddddddddddddd999ddddddccdddddddd999999999999ffff9222222222229999999999999999ccccccccccccccccccccc66666ccccccfffcccccccccccccccccccddddddddddddddddddddddd
                ddddccdddddddddddddd999ddddddddcccccdd9999999999999fff22222222229999999999999999999cccccccccccccccccccc6699966ccccccfcccccccccccccccccccccdddddddddddddddddddddd
                ddddccdddddddddddddd999ddddddddddddddd9999999999999f22222222229999999999992222999999cccccccccccccccccc6699999966ccccccccccccccccccccccccccdddddddddddddddddddddd
                dddddccdddddddddddddd99ddddddddddddddd999999999999d222222299999999999999222999999999ccccc666666cccccc669f9999996cccffffcccccccccccccccccccdddddddddddddddddddddd
                dddddccdddddddddddddd99ddddddddddddddd999999999999222222ddd9999999999222999999999999cccc6999999666cc6699ff999996ccccccccccccccccccccccccccdddddddddddddddddddddd
                ddddddcdddddddddddddd99ddddddddddddddd9999999999222222dddddd999999992299999999999999cccc69999996666669995ff55996cccccccccccccccccccccccccccddddddddddddddddddddd
                ddddddcdddddddddddddd99dddddddddddddd9999999992222222dddddddd999999229999999999999999ccc669999669966999955555996ccfffcccccccc11ccccccccccccddddddddddddddddddddd
                ddddddcddddddddddddddd9dddddddddddddd999999992222222ddddddddd999999999999999999999999cccc6669966996699999555ff6ccccccccccccc1b1ccccccccccccddddddddddddddddddddd
                ddddddcddddddddddddddd9ddddddddddddd99999922222222dddddddddddd99999999999999999999999cccccc666666666669955595ffcccccccccccc1b1ccccccccccccccdddddddddddddddddddd
                ddddddccdddddddddddddd9ddddddddddddd9999222222229dddddddd22ddd99999999999999999999999ccccccccc6992222265559996cccccccccccc1b1cccccccccccccccdddddddddddddddddddd
                dddddddcddddddddddddddccdddddddddddd9992222222299dddddd22dddddd9999999929999999999999cccccccc6699222226669966ccccccc88ccc1b1ccccccccccccccccdddddddddddddddddddd
                dddddddcddddddddddddddccdddddddddddd9222222299999dddd22dddddddd9999992299999999999999cc66ccc6699992222226666cccccccc888c1b1ccccccccccccccccccddddddddddddddddddd
                dddddddcddddccccccddddccdddddddddddd2222229999999dd22ddddddddddd999992999999999999999cc666c669999992222269966cccccccc888b1cccccccccccccccccccddddddddddddddddddd
                ddcdddddcdddcddddccddddcdddddddddd222222299999999d2ddddddddddddd999929999999999999999cc66666fff99922299269996666cccccc888ccccccccccccccccccccddddddddddddddddddd
                ddcccdddcddddddddddddddcddddccccdd2222299999999999dddddddddddd22d99229999992999999999ccc66666fff992299966696699666ccc88888cccccccccccccccccccddddddddddddddddddd
                ddddddddcddddddddddddddcdddddddccd2222999999929999ddddddddddd2ddd92999992229999999999cccc66c6ffff9999966cc66699996cc888c888ccccccccccccccccccddddddddddddddddddd
                ddddddddccdddddddddddddccddddddddd2222999999299999dddddddd222dddd999999999999999999222222cccc66fff9966cccccc666996cc88ccc88ccccccccccccccccccddddddddddddddddddd
                dddddddddccddddddddddddccddddddddddd99999222999999ddddddddddddddd299999999999999992222222ccccc666ff66ccccccccc6666cccccccccccccccccccccccccccddddddddddddddddddd
                ddddddddddcdddddddddddddcddddddddddd999999999999999ddddddddddddd2d99999999999992222222222ccccccc6666ccccccccccccccccccccccccccccccccccccccccdddddddddddddddddddd
                ddddddddddccddddddddddddccdddddddddd992299999999999ddddd22dddd22dd9999999999222222222cccccccccccc66666ccccccccccccccccccccccccccccccccccccccdddddddddddddddddddd
                dddddddddddccdddddddddddccdddddddddd929999999999999dddd2ddddd2dddd9999999922222222229cccccccccccccc6666cccccccccccccccccccccccccccccccccccccdddddddddddddddddddd
                dddddddddddddddddddddddddddddddddddd299999992999999dd22ddddddddddd9999922222222229999ccccccccccccccc6666ccccccccccccccccccc55cccccccccccccccdddddddddddddddddddd
                ddddddddddddddddddddddddddddddddddd2d9999992999999922ddddddddd2ddd222222222222999999cccccccccccccccccccccccccccccccccccccc5555ccccccccccccccdddddddddddddddddddd
                ddddddddddddddddddddddddddddddddddddd99999299999922ddddddddd22dd22222222222299999999cccccccc5ccccccc5cccccccccc5ccccccccc555555cccccccccccccdddddddddddddddddddd
                dddddddddddddddddddddddddddddddddddddd9999299999929ddddddddd222222222222299999999999ccccccc55cccccc555ccccccccc5ccccccccc555555cccccccccccccdddddddddddddddddddd
                dddddddddddddddddddddddddddddddddddddd9999999999999ddddd222222222222999999999999999cccccccc555cccc5555cccccccc555ccccccc55555555ccccccccccccdddddddddddddddddddd
                dddddddddddddddddddddddddddddddddddddd9999999999999ddddd222222222299999999999999999ccccccc5555ccc555555cccccc5555ccccccc55555555ccccccccccccdddddddddddddddddddd
                ddddddddddddddddddddddddccddddddddddddd99999999999ddddd22222222ddd99999999999999999ccccccc5555ccc555555ccccc555551cccccc555551555cccccccccccdddddddddddddddddddd
                ddddddddddddddddddddddddcdddddcdddddddd99992299999dd222222222ddddd99999999999999999cccccc555555c5555555cccc55555515cccc5555551555cccccccccccdddddddddddddddddddd
                ddddddddddddddddddddddccdddddccddddddddd992999999d222222222ddddddd99999999999999999ccccc5555555c55551555ccc55555515ccc55555555155ccccccccccddddddddddddddddddddd
                ddddddddddddddddddddccddddddcddddddddddd22999999222222222ddddddddd99999999999999999ccc555551555555515555ccc555555155cc555555551555cccccccccddddddddddddddddddddd
                ddddddddddddddccccccdddddddcdddddddddd22dd999992222222dddddddddddd99999999999999999ccc555515555555115555cc5555555155cc555555551555cccccccccddddddddddddddddddddd
                ddddddccccccccddddddddddddcdddddddddddddddd999222222ddddddddddddd999999999999999999cc55511555555551555555555555551555c5555555515555ccccccccddddddddddddddddddddd
                dddddddddddddddddddddddddcddddddddddddddddd9922222ddddddddddddddd999999999999999999c555515555555551555555555555555555c5555555515555ccccccccddddddddddddddddddddd
                ddddddddddddddddddddddddccddddddddddddddcccd22222dddddddddddddddd999999999999999999c55115555555555555555555555555555555555555555555ccccccccddddddddddddddddddddd
                dddddddddddddddddddccdddcdddddddddddccccc2222222ddddddddddddddddd999999999999999999c551555555555555555dddddddddddddddd5dddd555555555cccccccddddddddddddddddddddd
                dddddddddddddddddccddddcdddddddddccccddd2222222dddddddddddddddddd99999999999999999cc555555555555dddddddddddddddddddddddddddddd555555cccccccddddddddddddddddddddd
                dddddddddddddddddcddddcdddddddddccddddd2222222dddddddddddddddddd999999999999999999cc5555555dddddddddddddddddddddddddddddddddddddddddddcccccddddddddddddddddddddd
                dddddddddddddddccddddccdddddddddcdddd2222222dddddddddddddddddddd999999999999999999cc555dddddddddddddddddddddddddddddddddddddddddddddddddcccddddddddddddddddddddd
                ddddddddddddddccddddcddddddddddcdd22222222dddddddddddddddddddddd99999999999999999cccdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                dddddddddddddcddddddcddddddddddcdd2222222ddddddddddddddddddddddd9999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                ddddddddddddcddddddcdddddddddddccd22222dddddddddddddddddddddddd99999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                ddddddddddddddddddcdddddddddddddcdddddddddddddddddddddddddddddd99999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                dddddddddddddddddcddddddddddddddcddddddddddddddddddddddddddddd9999999999999999999ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                dddddddddddddddddcdddddddddddddddddddddddddddddddddddddddddddd9999999999999999999ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                ddddddddddddddddcdddddddddddddddddddddddddddddddddddddddddddd99999999999999999999ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                ddddddddddddddddcddddddddddddddddddddddddddddddddddddddddddd9999999999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                dddddddddddddddcddddddddddddddddddddddddddddddddddddddddddd99999999999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                dddddddddddddddcdddddddddddddddddddddddddddddddddddddddddd999999999999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                ddddddddddddddcddddddddddddddddddddddddddddddddddddddddddd999999999999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                ddddddddddddddcdddddddddddddddddddddddddddddddddddddddddd99999999999999999999999999ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                ddddddddddddddcddddddddddddddddddddddddddddddddddddddddd9999999999999999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                dddddddddddddccddddddddddddddddddddddddddddddddddddddddd9999999999999999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                dddddddddddddddddddddddddddddddddddddddddddddddddddddd99999999999999999999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                ddddddddddddddddddddddddddddddddddddddddddddddddddddd999999999999999999999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                ddddddddddddddddddddddddddddddddddddddddddddddddddddd99999999999999999999999999999999999dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
            `)

            game.showLongText("The Knight Was Eaten!", DialogLayout.Bottom)
            pause(1000)
            player.setFlag(SpriteFlag.Invisible, false)
            statusbar.setFlag(SpriteFlag.Invisible, false)
            monsterBar.setFlag(SpriteFlag.Invisible, false)
            toolbar.setFlag(SpriteFlag.Invisible, false)
            scene.setBackgroundImage(assets.image`Empty`)
            floor++
            remove_item_from_toolbar(0)
            gameStart(player,floor)
            
        }
        }
        
    })

    
}

function bossEndSpawn(player: Sprite){
    tiles.setCurrentTilemap(tilemap`Outside`)
    player.setPosition(128, 170)
    
    let monster = sprites.create(assets.image`monster1`, SpriteKind.Enemy)
    let monsterBar = statusbars.create(40, 8, StatusBarKind.EnemyHealth)
    monsterBar.attachToSprite(monster)
    monsterBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
    monsterBar.setBarBorder(1, 15)
    monsterBar.max = 500
    monsterBar.value = 500
    monster.setPosition(128, 60)
    forever(function () {
        animation.runImageAnimation(
            monster,
            [assets.image`monster1`, assets.image`monster2`],
            200,
            true
        )
        if(monsterBar.value > 375){
            scene.followPath(monster, scene.aStar(tiles.locationOfSprite(monster), tiles.locationOfSprite(player)), 30)
            pause(2000)
        }
        else if (monsterBar.value <= 375 && monsterBar.value > 250){
            scene.followPath(monster, scene.aStar(tiles.locationOfSprite(monster), tiles.locationOfSprite(player)), 40)
            pause(1000)
            scene.followPath(monster, scene.aStar(tiles.locationOfSprite(monster), tiles.locationOfSprite(player)), 40)
            pause(1000)
        }
        else if (monsterBar.value <= 250 && monsterBar.value > 125){
            scene.followPath(monster, scene.aStar(tiles.locationOfSprite(monster), tiles.locationOfSprite(player)), 40)
            pause(500)
            scene.followPath(monster, scene.aStar(tiles.locationOfSprite(monster), tiles.locationOfSprite(player)), 40)
            pause(500)
        }
        else{
            scene.followPath(monster, scene.aStar(tiles.locationOfSprite(monster), tiles.locationOfSprite(player)), 60)
            pause(500)
            scene.followPath(monster, scene.aStar(tiles.locationOfSprite(monster), tiles.locationOfSprite(player)), 60)
            pause(200)
        }

        if(spriteutils.isDestroyed(monster)){

            game.setGameOverMessage(true, "You Won! Time: " + info.getTimeElapsed())
            game.gameOver(true)
        }
    })
    
    
}


function gameStart(player: Sprite, floor: number){
    console.log("floor: " + floor)
    if (floor == 0) {
        bossStartSpawn(player)
        blockControl.waitForEvent(9, 0)
    }
    tiles.destroySpritesOfKind(SpriteKind._TileSprite)
    tiles.setCurrentTilemap(assets.tilemap`empty`)

    if (floor == 4) {
        console.log("called boss spawn end")
        bossEndSpawn(player)
        blockControl.waitForEvent(111, 0)
    }
    
    player.setPosition(80, 60)
    currentRoom = null;
    info.changeScoreBy(1)
    startX = 0
    startY = 0
    statusbar.value = statusbar.max
    timer.background(function() {
        if (floor >= 2 && floor < 4) {
            tiles.setCurrentTilemap(assets.tilemap`empty`)
            player.setFlag(SpriteFlag.Invisible, true)
            statusbar.setFlag(SpriteFlag.Invisible, true)
            toolbar.setFlag(SpriteFlag.Invisible, true)
            scene.setBackgroundImage(img`
            11111111111111111111111ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd1111111111
            11111111111111111111111dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd111111111
            11111111111111111111111ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd11111111
            111111111111111111111dddddddddddddddddddddddd3333333333333333333333333333333333333333ddddddddddddddddddddddddddddd333333dddddddddddddddddddddddddddddddd11111111
            111111111111111111dddddddddddddddddddddd3333333333333333333333333333333333333333333333333333333333333333333333333333333333333ddddddddddddddddddddddddddddd111111
            1111111111111111ddddddddddddddddddddd3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333dddddddddddddddddddddddddd111111
            111111111111111dddddddddddddddddddd33333333333333333333333333333333333333333333333333333333333333333333333333333333332222222222233ddddddddddddddddddddddddd11111
            1111111111111ddddddddddddddddddd33333333333333333333333333333333333333333333333333333333333333333333333333333333333222222222222222222ddddddddddddddddddddddd1111
            111111111111dddddddddddddddd33333333333333333333333333333333333333333333333333333333333333333333333333333333333222222222222222222222223dddddddddddddddddddddd111
            11111111111dddddddddddddddd3333333333333333333333332222333333333333333333333333333333333333333333333333333332222222222222222222222222233333dddddddddddddddddd111
            111111111dddddddddddddddd333333222222233333222222222222222222333333333333333333333333333333333333333333322222222222222222222222222222223333333dddddddddddddddd11
            1111111dddddddddddddddd33332222222222222222222222222222222222222333333333333333333333333333333333333222222222222222222222222222222222222333333333ddddddddddddddd
            111111dddddddddddddd333322222222222222222222222222222222222222222222333333333333333333333333333333222222222222222222222222222222222222222233333333dddddddddddddd
            1111ddddddddddddddd3322222222222222222222222222222222222222222222222222333333333333333333333333222222222222222222222222222222222222222222223333333333ddddddddddd
            111ddddddddddddddd332222222222222222222222222222222222222222222222222222223333333333333333222222222222222222222222222222222222222222222222223333333333dddddddddd
            ddddddddddddddddd322222222222222222222222222222222222222222222222222222222223333333333222222222222222222222222222222222222222222222222222222233333333333dddddddd
            dddddddddddddddd222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222233333333333dddddd
            ddddddddddddd2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222233333333333ddddd
            ddddddddddd2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222223333333333dddd
            dddddddddd222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222223333333333333
            ddddddddd2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222223333333333
            dddddd2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222333333
            dddd222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222223333
            ddd2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222233
            2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222
            2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222
            2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222
            2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222
            2222222222222222222222222222222222222222222222222222222223333333322222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222
            2222222222222222222222222222222222222222222222222222223333333333333222222222222222222222222222222233333322222222222222222222222222222222222222222222222222222222
            2222222222222222222222222222222222222222222222223333333333333333333332222222222222222222222222233333333333332222222222222222222222222222222222222222222222222222
            2222222222222222222222222222222222222222222223333333333333333333333333332222222222222222222233333333333333333333222222222222222222222222222222222222222222222222
            2222222222222222222222222222222222222222222333333333333333333333333333333322222222222222223333333333333333333333333322222222222222222222222222222222222222222222
            2222222222222222222222222222222222222223333333333333333333333333333333333332222222222222333333333333333333333333333333222222222222222222222222222222222222222222
            2222222222222222222222222222222222223333333333333333333333333333333333333333222222222233333333333333333333333333333333332222222222222222222222222222222222222222
            2222222222222222222222222222222222233333333333333333333333333333333333333113332222233333333333333333333333333333333333333222222222222222222222222222222222222222
            2222222222222222222222222222222222333333333333333333333333333333333333331b13333333333333333333333333333333333333333333333332222222222222222222222222222222222222
            222222222222222222222222222222222333333333333333333333333333333333333331b133333333333333333333333333333333333333333333333333222222222222222222222222222222222222
            22222222222222222233322222222223333333333333333333333333333333333333331b1333333333333333333333333333333333333333333333333333322222222222222222222222222222222222
            2222222222222222333333333333333333333333333333333333333333333333333331b13333333333333333333333333333333333333333333333333333332222222222222222222222222222222222
            222222222222222333333333333333333333333333333333333333333333333333331b133333333333333333333333333333333333333333333333333333333222222222222222222222222222222222
            22222222222222333333333333333333333333333333333333333333333333338831b1333333333333336663333333333333333333333333333333333333333222222222222222222222222222222222
            2222222222222333333333333333333333333333333333333333333333333333388b13333666666666336996333333333333333333333333333333333333333322222222222222222222222222222222
            2222222222223333333333333333333333333333333333333333333333333333668833333699999996336996333333333333333333333333333333333333333333222222222222222222222222222222
            2222222222233333333333333333333333333333333333333333333333333336996883333699999996336996333333333333333333333333333333333333333333222222222222222222222222222222
            2222222222333333333333333333333333333333333333333333333333333336999683333699999996336996333333333333333333333333333333333333333333322222222222222222222222222222
            2222222223333333333333333333333333333333333333333333333333333386699963333699999996336996333333333333333333333333333333333333333333322222222222222222222222222222
            2222222233333333333333333333333333333333333333333333333333333888369996333699999996336996333333333333333333333333333333333333333333332222222222222222222222222222
            2222222333333333333333333333333333333333333333333333333333333883336999666699999996666996333333333333333333333333333333333333333333333222222222222222222222222222
            2222233333333333333333333333333333333333333333333333333333333333333699699699999996996996333333333333333333333333333333333333333333333322222222222222222222222222
            2222333333333333333333333333333333333333333333333333333333333333333366699222222222996996333333333333333333333333333333333333333333333332222222222222222222222222
            2223333333333333333333333333333333333333333333333333333333333333333333366222222222666663333333333333333333333333333333333333333333333333322222222222222222222222
            2233333333333333333333333333333333333333333333333333333333333333333333333622222226333333333333333333333333333333333333333333333333333333333222222222222222222222
            2333333333333333333333333333333333333333333333333333333333333333333333333692222296333333333333333333333333333333333333333333333333333333333333332222222222222222
            3333333333333333333333333333333333333333333333333333333333333333333333333699999996333333333333333333333333333333333333333333333333333333333333333332222222222222
            3333333333333333333333333333333333333333333333333333333333333333333333333699999996666633333333333333333333333333333333333333333333333333333333333333332222222222
            3333333333333333333333333333333333333333333333333333333333333333333333333699999996666666333333333333333333333333333333333333333333333333333333333333333222222222
            3333333333333333333333333333333333333333333333333333333333333333333333333666666666666666333333333333333333333333333333333333333333333333333333333333333322222222
            3333333333333333333333333333333333333333333333333333333333333333333333336663333333666666333333333333333333333333333333333333333333333333333333333333333332222222
            3333333333333333333333333333333333333333333333333333333333333333333333366663333333333333333333333333333333333333333333333333333333333333333333333333333333222222
            3333333333333333333333333333333333333333333333333333333333333333333333366663333333333333333333333333333333333333333333333333333333333333333333333333333333322222
            3333333333333333333333333333333333333333333333333333333333333333333333366663333333333333333333333333333333333333333333333333333333333333333333333333333333322222
            3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333332222
            3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333222
            3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333322
            3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333322
            3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333332
            3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333332
            3333333333333333333333333333333333333333333333333333332222333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
            3333333333333333333333333333333333333333333333333333222222223333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
            3333333333333333333333333333333333333333333333333322222222222233333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
            3333333333333333333333333333333333333333333333332222222222222223333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
            3333333333333333333333333333333333333333333333322222222222222222333333333333333333333333222222223333333333333333333333333333333333333333333333333333333333333333
            3333333333333333333333333333333333333333333332222222222222222222233333333333333333333322222222222222233333333333333333333333333333333333333333333333333333333333
            3333333333333333333333333333333333333333333222222222222222222222223333333333333333322222222222222222222333333333333333333333333333333333333333333333333333333333
            3333333333333333333333333333333333333333222222222222222222222222222333333333333332222222222222222222222222333333333333333333333333333333333333333333333333333333
            3333333333333333333333333333333333333322222222222222222222222222222233333333333222222222222222222222222222223333333333333333333333333333333333333333333333333333
            3333333333333333333333333333333222222222222222222222222222222222222222222322222222222222222222222222222222222223333333333333333333333333333333333333333333333333
            3333333333333333333333333333333222222222222222222222222222222222222222222222222222222222222222222222222222222222333333333333333333333333333333333333333333333333
            3333333333333333333333333333322222222222222222222222222222222222222222222222222222222222222222222222222222222222223333333333333333333333333333333333333333333333
            3333333333333333333333333333222222222222222222222222222222222222222222222222222222222222222222222222222222222222222333333333333333333333333333333333333333333333
            3333333333333333333333333332222222222222222222222222222222222222222222222222222222222222222222222222222222222222222333333333333333333333333333333333333333333333
            3333333333333333333333333222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222233333333333333333333333333333333333333333333
            3333333333333333333333332222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222223333333333333333333333333333333333333333333
            3333333333333333333333322222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222333333333333333333333333333333333333333333
            3333333333333333333333322222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222223333333333333333333333333333333333333333
            33333333333333333333332222222222222222222222222222222222222222222222222222222222222222ee222222222222222222222222222222222222222333333333333333333333333333333333
            333333333333333333333322222222222222222222222222222222222222222222222222222222222222eeeee22222222222222222222222222222222222222233333333333333333333333333333333
            333333333333333333333322222222222222222222222222222222222eeeeee2222222222222222eeeeeeeeeeeee22222222222222222222222222222222222223333333333333333333333333333333
            33333333333333333333332222222222222222222222222222222222eeeeeeee2222222222222eeeeeeeeeeeeeeeeee22222222222222222222222222222222222233333333333333333333333333333
            333333333333333333333322222222222222222222222222222222eeeeeeeeeee22222222eeeeeeeeeeeeeeeeeeeeeeee222222222222222222222222222222222223333333333333333333333333333
            33333333333333333333332222222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222222222222222222222222222222222333333333333333333333333333
            33333333333333333333332222222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222222222222222222222222222222222233333333333333333333333333
            33333333333333333333332222222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee22222222222222222222222222222222223333333333333333333333333
            3333333333333333333333222222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222222222222222222222222222222222333333333333333333333333
            3333333333333333333332222222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222222222222222222222222222233333333333333333333333
            333333333333333333333222222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee22222222222222222222222222233333333333333333333333
            33333333333333333333222222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222222222222222222222222233333333333333333333333
            3333333333333333333322222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee222222222222222222222222223333333333333333333333
            3333333333333333333322222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222222222222222222222223333333333333333333333
            33333333333333333332222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222222222222222222222222333333333333333333333
            3333333333333333333222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee222222222222222222222222333333333333333333333
            333333333333333332222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee22222222222222222222222233333333333333333333
            333333333333333322222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222222222222222222222233333333333333333333
            33333333333333332222222222222222222222222222eeeeeeeeeeeeeeeeeeeeeccccccccccccccccccccccccccccceeeeeeeeeeeeeeeeeeeeeee2222222222222222222222233333333333333333333
            33333333333333322222222222222222222222222222eeeeeeeeeeeeeeeeeeccccccccccccccccccccccccccccccccceeeeeeeeeeeeeeeeeeeeeee222222222222222222222233333333333333333333
            33333333333333222222222222222222222222222222eeeeeeeeeeeeeeeeccccccccccccccccccccccccccccccccccccceeeeeeeeeeeeeeeeeeeee222222222222222222222233333333333333333333
            33333333333333222222222222222222222222222222eeeeeeeeeeeeecccccccccccfffffffffffffffffffcccccccccccceeeeeeeeeeeeeeeeeee222222222222222222222333333333333333333333
            33333333333333222222222222222222222222222222eeeeeeeeeeeeccccccccfffffffffffffffffffffffffcccccccccccceeeeeeeeeeeeeeeee222222222222222222222333333333333333333333
            333333333333332222222222222222222222222222222eeeeeeeeeeeccccccffffffffffffffffffffffffffffffffcccccccceeeeeeeeeeeeeeee222222222222222222222333333333333333333333
            3333333333333322222222222222222222222222222222eeeeeeeeeeccccffffffffffffffffffffffffffffffffffffccccccceeeeeeeeeeeeeee222222222222222222223333333333333333333333
            3333333333333322222222222222222222222222222222eeeeeeeeeeeccccffffffffffffffffffffffffffffffffffffffcccceeeeeeeeeeeeee2222222222222222222223333333333333333333333
            33333333333333222222222222222222222222222222222eeeeeeeeeecccccfffffffffffffffffffffffffffffffffffffcccceeeeeeeeeeeeee2222222222222222222223333333333333333333333
            333333333333332222222222222222222222222222222222eeeeeeeeeccccccffffffffffffffffffffffffffffffffffffcccceeeeeeeeeeeee22222222222222222222223333333333333333333333
            3333333333333322222222222222222222222222222222222eeeeeeeeeccccccccffffffffffffffffffffffffffffffccccccceeeeeeeeeeee222222222222222222222223333333333333333333333
            3333333333333332222222222222222222222222222222222eeeeeeeeeeccccccccccfffffffffffffffffffffffccccccccccceeeeeeeeeeee222222222222222222222222333333333333333333333
            33333333333333322222222222222222222222222222222222eeeeeeeeeecccccccccccffffffffffffffffffccccccccccccceeeeeeeeeeee2222222222222222222222222333333333333333333333
            333333333333333322222222222222222222222222222222222eeeeeeeeeeeecccccccccccccccccccccccccccccccccccceeeeeeeeeeeeeee2222222222222222222222222333333333333333333333
            3333333333333333322222222222222222222222222222222222eeeeeeeeeeeeeeccccccccccccccccccccccccccccceeeeeeeeeeeeeeeeeee2222222222222222222222222333333333333333333333
            33333333333333333322222222222222222222222222222222222eeeeeeeeeeeeeeeccccccccccccccccccccccceeeeeeeeeeeeeeeeeeeeeee2222222222222222222222222333333333333333333333
        `)

            game.showLongText("The Knight Climbs Higher...", DialogLayout.Bottom)
            pause(1000)
            player.setFlag(SpriteFlag.Invisible, false)
            statusbar.setFlag(SpriteFlag.Invisible, false)
            toolbar.setFlag(SpriteFlag.Invisible, false)
            scene.setBackgroundImage(assets.image`Empty`)
            blockControl.raiseEvent(11, 0)

        }
        else {

            blockControl.raiseEvent(11, 0)
        }
    })
   
    blockControl.waitForEvent(11, 0)
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
        if (roomEnemiesLeft <= 0 || getCleared(currentX, currentY)) {
            
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
            music.play(music.createSong(hex`002c010408010301001c000f05001202c102c20100040500280000006400280003140006020004120000000400012708000c00012a10001400012c06001c00010a006400f4016400000400000000000000000000000000000000021e0000000400012004000800012408000c0001200c001000012410001400012707001c00020a006400f4016400000400000000000000000000000000000000031e0000000400011d04000800012008000c00011d0c0010000120100014000124`), music.PlaybackMode.InBackground)

        }
    })

    scene.onOverlapTile(SpriteKind.Player, assets.tile`LockedChest`, function (sprite, location) {
        if(!chestLooted && roomEnemiesLeft <= 0) {
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
        music.play(music.createSong(hex`0078000408020203001c0001dc00690000045e0100040000000000000000000005640001040003060004000800012a09010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c800060000000100010a`), music.PlaybackMode.InBackground)

    }
    else if(getEnemies(currentX,currentY) <= 0){
        blockControl.raiseEvent(2,0)
    }
    if (getCleared(currentX, currentY)) {
        tiles.coverAllTiles(assets.tile`LockedChest`, assets.tile`OpenedChest`)
        chestLooted = true;
        blockControl.raiseEvent(2, 0)
    }
    
    

    blockControl.onEvent(3, 0, function() {
        if(!getBoss(GcurrentX,GcurrentY)){
            if (goingUp) {
                player.setPosition(80, 96)
            }
            else if (goingDown) {
            player.setPosition(80, 24)
            }
            else if (goingRight) {
                player.setPosition(24, 60)
            }
            else {
                player.setPosition(138, 60)

            }
        }
        else {
            if (goingUp) {
                player.setPosition(128, 234)
            }
            else if (goingDown) {
            player.setPosition(128, 22)
            }
            else if (goingRight) {
                player.setPosition(22, 128)
            }
            else {
                player.setPosition(234, 128)

            }
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
            tiles.coverAllTiles(tiles.util.door15, assets.tile`BottomDoorOpenRightBoss`)
            tiles.coverAllTiles(tiles.util.door10, assets.tile`BottomDoorOpenLeftBoss`)
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
            tiles.coverAllTiles(tiles.util.door0, assets.tile`TopDoorOpenLeftBoss`)
            tiles.coverAllTiles(tiles.util.door5, assets.tile`TopDoorOpenRightBoss`)
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
            tiles.coverAllTiles(tiles.util.door6, assets.tile`LeftDoorOpenTopBoss`)
            tiles.coverAllTiles(tiles.util.door3, assets.tile`LeftDoorOpenBottomBoss`)
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
            tiles.coverAllTiles(tiles.util.door9, assets.tile`RightDoorOpenBottomBoss`)
            tiles.coverAllTiles(tiles.util.door12, assets.tile`RightDoorOpenTopBoss`)
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
                    scene.followPath(virus, scene.aStar(tiles.locationOfSprite(virus), tiles.locationOfSprite(player)), 45)
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
                        pause(400)
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
                            150,
                            false
                        )
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
                        150,
                        false
                    )
                    pause(150)
                    worm.setImage(assets.image`underGround`)
                    worm.setFlag(SpriteFlag.Ghost,true)
                    scene.followPath(worm, scene.aStar(tiles.locationOfSprite(worm), tiles.locationOfSprite(player)), 50)
                    pause(1000)
                    worm.setFlag(SpriteFlag.Ghost, false)
                })
                let wormBar = statusbars.create(20, 6, StatusBarKind.EnemyHealth)
                wormBar.attachToSprite(worm)
                wormBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
                wormBar.setBarBorder(1, 15)
                wormBar.max = 12
                tiles.placeOnRandomTile(worm, assets.tile`FloorTile`)
                break;
            case 5:
                let wizard = sprites.create(img`
                    . . . . . . . 8 8 . . . . . . .
                    . . . . . . 8 8 8 8 . . . . . .
                    . . 8 . . a a a a a a . . 8 . .
                    . . . 8 a a a a a a a a 8 . . .
                    . . . 8 f f 5 f f 5 f f 8 . . .
                    . . . 8 f f 5 f f 5 f f 8 . . .
                    . . . 8 f a a a a a a f 8 . . .
                    . f . f a a c c c c a a f . f .
                    . . f . f c 8 8 8 8 c f . f . .
                    f . f f f 8 8 8 8 8 8 f f f . f
                    . f f f f 8 8 8 8 8 8 f f f f .
                    . . f f f a 8 8 8 8 a f f f . .
                    . . . f f a a a a a a f f . . .
                    . . . c c c a a a a c c c . . .
                    . . . c c c c c c c c c c . . .
                    . . . c c c c c c c c c c . . .
                `, SpriteKind.Enemy)
                wizard.setFlag(SpriteFlag.GhostThroughWalls,true)
                forever(function () {
                    if(wizard.y <= player.y){
                        wizard.setImage(img`
                            . . . . . . . 8 8 . . . . . . .
                            . . . . . . 8 8 8 8 . . . . . .
                            . . 8 . . a a a a a a . . 8 . .
                            . . . 8 a a a a a a a a 8 . . .
                            . . . 8 f f 5 f f 5 f f 8 . . .
                            . . . 8 f f 5 f f 5 f f 8 . . .
                            . . . 8 f a a a a a a f 8 . . .
                            . f . f a a c c c c a a f . f .
                            . . f . f c 8 8 8 8 c f . f . .
                            f . f f f 8 8 8 8 8 8 f f f . f
                            . f f f f 8 8 8 8 8 8 f f f f .
                            . . f f f a 8 8 8 8 a f f f . .
                            . . . f f a a a a a a f f . . .
                            . . . c c c a a a a c c c . . .
                            . . . c c c c c c c c c c . . .
                            . . . c c c c c c c c c c . . .
                        `)
                    }
                    else if (wizard.y > player.y){
                        wizard.setImage(img`
                            . . . . . . . 8 8 . . . . . . .
                            . . . . . . 8 8 8 8 . . . . . .
                            . . 8 . . 8 8 8 8 8 8 . . 8 . .
                            . . . 8 a a 8 8 8 8 a a 8 . . .
                            . . . 8 c a a a a a a c 8 . . .
                            . . . 8 8 c a a a a c 8 8 . . .
                            . . . 8 8 8 c c c c 8 8 8 . . .
                            . . f . a a a a a a a a . f . .
                            . . . f c c 8 8 8 8 c c f . . .
                            . f f f 8 8 8 8 8 8 8 8 f f f .
                            . . f f 8 8 8 8 8 8 8 8 f f . .
                            . . . f a a 8 8 8 8 a a f . . .
                            . . . . c a a a a a a c . . . .
                            . . . c c c a a a a c c c . . .
                            . . . c c c c c c c c c c . . .
                            . . . c c c c c c c c c c . . .
                        `)
                    }
                    else if (wizard.x > player.x) {
                        wizard.setImage(img`
                            . . . . . . . . . 8 8 . . . . .
                            . . . . . . . 8 8 8 8 . . . . .
                            . . . . . a a 8 8 8 8 . . . . .
                            . . . . a a a a a 8 8 . . . . .
                            . . 8 8 8 8 c c c a a . . . . .
                            . . . . 5 f f f f c c . . . . .
                            . . . . 5 f f f f f f 8 8 . . .
                            . . f f a a a a a a a a . . . .
                            . . . c f c c c c c c c . . . .
                            . f f f f 8 8 8 8 8 c c c . . .
                            . . f f f 8 8 8 8 8 8 . . . . .
                            . . . f f 8 8 8 8 8 8 . . . . .
                            . f f f f a 8 8 8 8 8 . . . . .
                            . . . c a a a 8 8 8 8 . . . . .
                            . . . c c c a a a a a a . . . .
                            . . . c c c c c c c c c c c . .
                        `)
                    }
                    else {
                        wizard.setImage(img`
                            . . . . . 8 8 . . . . . . . . .
                            . . . . . 8 8 8 8 . . . . . . .
                            . . . . . 8 8 8 8 a a . . . . .
                            . . . . . 8 8 a a a a a . . . .
                            . . . . . a a c c c 8 8 8 8 . .
                            . . . . . c c f f f f 5 . . . .
                            . . . 8 8 f f f f f f 5 . . . .
                            . . . . a a a a a a a a f f . .
                            . . . . c c c c c c c f c . . .
                            . . . c c c 8 8 8 8 8 f f f f .
                            . . . . . 8 8 8 8 8 8 f f f . .
                            . . . . . 8 8 8 8 8 8 f f . . .
                            . . . . . 8 8 8 8 8 a f f f f .
                            . . . . . 8 8 8 8 a a a c . . .
                            . . . . a a a a a a c c c . . .
                            . . c c c c c c c c c c c . . .
                        `)
                    }
                    pause(2000)
                    if(!spriteutils.isDestroyed(wizard)){
                    let fireball = sprites.create(img`
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . 4 4 4 4 4 . . . . . . .
                        . . . 4 4 4 4 4 . . . . . . . .
                        . . 4 4 4 5 4 4 4 . . . . . . .
                        . . 4 4 4 5 5 4 4 4 . . 4 . . .
                        . . 4 4 5 1 5 4 4 4 4 4 4 . . .
                        . . 4 4 1 5 5 5 1 5 4 4 4 . . .
                        . . 4 4 5 5 1 5 5 5 5 4 4 . . .
                        . . 4 4 4 1 5 5 5 1 4 4 4 . . .
                        . . 4 4 4 4 5 1 5 4 4 4 4 . . .
                        . . . 4 4 4 4 4 4 4 4 4 . . . .
                        . . . . 4 4 4 4 4 4 4 . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                    `, SpriteKind.fireball)
                    animation.runImageAnimation(
                        fireball,
                        [img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . 4 4 4 4 4 . . . . . . . 
        . . . 4 4 4 4 4 . . . . . . . . 
        . . 4 4 4 5 4 4 4 . . . . . . . 
        . . 4 4 4 5 5 4 4 4 . . 4 . . . 
        . . 4 4 5 1 5 4 4 4 4 4 4 . . . 
        . . 4 4 1 5 5 5 1 5 4 4 4 . . . 
        . . 4 4 5 5 1 5 5 5 5 4 4 . . . 
        . . 4 4 4 1 5 5 5 1 4 4 4 . . . 
        . . 4 4 4 4 5 1 5 4 4 4 4 . . . 
        . . . 4 4 4 4 4 4 4 4 4 . . . . 
        . . . . 4 4 4 4 4 4 4 . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . 4 4 4 4 4 4 4 . . . . 
        . . . . 4 4 4 4 4 4 4 4 4 . . . 
        . . . 4 4 4 4 5 1 5 4 4 4 4 . . 
        . . . 4 4 4 1 5 5 1 5 5 4 4 . . 
        . . . 4 4 5 5 1 5 5 5 4 4 4 . . 
        . . . 4 4 1 5 5 5 4 4 4 4 4 . . 
        . . . 4 4 5 5 5 1 4 4 4 . 4 . . 
        . . . 4 4 4 1 5 5 4 4 . . . . . 
        . . . 4 4 4 4 5 4 4 . . . . . . 
        . . . . 4 4 4 4 4 4 . . . . . . 
        . . . . . 4 4 4 4 4 4 . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . 4 4 4 4 4 4 4 . . . . 
        . . . . 4 4 4 4 4 4 4 4 4 . . . 
        . . . 4 4 4 4 5 1 5 4 4 4 4 . . 
        . . . 4 4 4 1 5 5 5 1 4 4 4 . . 
        . . . 4 4 5 5 5 5 1 5 5 4 4 . . 
        . . . 4 4 4 5 1 5 5 5 1 4 4 . . 
        . . . 4 4 4 4 4 4 5 1 5 4 4 . . 
        . . . 4 . . 4 4 4 5 5 4 4 4 . . 
        . . . . . . . 4 4 4 5 4 4 4 . . 
        . . . . . . . . 4 4 4 4 4 . . . 
        . . . . . . . 4 4 4 4 4 . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . 4 4 4 4 4 4 . . . . . 
        . . . . . . 4 4 4 4 4 4 . . . . 
        . . . . . . 4 4 5 4 4 4 4 . . . 
        . . . . . 4 4 5 5 1 4 4 4 . . . 
        . . 4 . 4 4 4 1 5 5 5 4 4 . . . 
        . . 4 4 4 4 4 5 5 5 1 4 4 . . . 
        . . 4 4 4 5 5 5 1 5 5 4 4 . . . 
        . . 4 4 5 5 1 5 5 1 4 4 4 . . . 
        . . 4 4 4 4 5 1 5 4 4 4 4 . . . 
        . . . 4 4 4 4 4 4 4 4 4 . . . . 
        . . . . 4 4 4 4 4 4 4 . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `],
                        100,
                        true
                    )
                    let speed = 50
                    fireball.setPosition(wizard.x, wizard.y)
                    fireball.setFlag(SpriteFlag.GhostThroughWalls, true)
                    fireball.setFlag(SpriteFlag.AutoDestroy, true)
                    let tempspeed = distanceFormula(player.x - wizard.x, 0, player.y - wizard.y, 0)
                    let ratio = speed/tempspeed
                    fireball.vx = (player.x - wizard.x) * ratio
                    fireball.vy = (player.y - wizard.y) * ratio
                    let path = TilemapPath.create_path([tiles.getTileLocation(randint(1, 8), randint(1, 6))])
                    
                    pause(4000)
                    TilemapPath.follow_path(wizard, path, 30)
                    }
                })
                let wizBar = statusbars.create(20, 6, StatusBarKind.EnemyHealth)
                wizBar.attachToSprite(wizard)
                wizBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
                wizBar.setBarBorder(1, 15)
                wizBar.max = 10
                tiles.placeOnRandomTile(wizard, assets.tile`FloorTile`)
                break;
            case 6:
                let bact = sprites.create(img`
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . e . . . . . . . .
                    . . . e . . . e . . . e . . . .
                    . . . . e 4 4 4 4 4 e . . . . .
                    . . . . 4 e e e e e 4 . . . . .
                    . e e 4 e e e e e e e 4 e e . .
                    . . . 4 e e 5 4 5 e e 4 . . . .
                    . . . 4 e e 4 5 4 e e 4 . . . .
                    . . . 4 e e 5 4 5 e e 4 . . . .
                    . e e 4 e e e e e e e 4 e e . .
                    . . . . 4 e e e e e 4 . . . . .
                    . . . . e 4 4 4 4 4 e . . . . .
                    . . . e . . . e . . . e . . . .
                    . . . . . . . e . . . . . . . .
                    . . . . . . . . . . . . . . . .
                `, SpriteKind.Enemy)
                if (!getBoss(currentX, currentY)) {
                    forever(function () {
                        let bactPath = TilemapPath.create_path([tiles.getTileLocation(randint(1, 8), randint(1, 6)), tiles.getTileLocation(randint(1, 8), randint(1, 6))])
                        TilemapPath.follow_path(bact, bactPath, 25)
                    })
                }
                else {
                    forever(function () {
                        let bactPath = TilemapPath.create_path([tiles.getTileLocation(randint(1, 14), randint(1, 14)), tiles.getTileLocation(randint(1, 14), randint(1, 14))])
                        TilemapPath.follow_path(bact, bactPath, 35)
                    })
                }
                forever(function () {
                    
                    animation.runImageAnimation(
                        bact,
                        [img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . e . . . . . . . . 
        . . . e . . . e . . . e . . . . 
        . . . . e 4 4 4 4 4 e . . . . . 
        . . . . 4 e e e e e 4 . . . . . 
        . e e 4 e e e e e e e 4 e e . . 
        . . . 4 e e 5 4 5 e e 4 . . . . 
        . . . 4 e e 4 5 4 e e 4 . . . . 
        . . . 4 e e 5 4 5 e e 4 . . . . 
        . e e 4 e e e e e e e 4 e e . . 
        . . . . 4 e e e e e 4 . . . . . 
        . . . . e 4 4 4 4 4 e . . . . . 
        . . . e . . . e . . . e . . . . 
        . . . . . . . e . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . 5 . . . . . . . . 
        . . . 5 . . . e . . . 5 . . . . 
        . . . . e 4 4 4 4 4 e . . . . . 
        . . . . 4 e e e e e 4 . . . . . 
        . 5 e 4 e e e e e e e 4 e 5 . . 
        . . . 4 e e 4 5 4 e e 4 . . . . 
        . . . 4 e e 5 e 5 e e 4 . . . . 
        . . . 4 e e 4 5 4 e e 4 . . . . 
        . 5 e 4 e e e e e e e 4 e 5 . . 
        . . . . 4 e e e e e 4 . . . . . 
        . . . . e 4 4 4 4 4 e . . . . . 
        . . . 5 . . . e . . . 5 . . . . 
        . . . . . . . 5 . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `],
                        150,
                        true
                    )
                    pause(1000)
                    
                    if(!spriteutils.isDestroyed(bact)){
                    
                    let bomb = sprites.create(img`
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . 2 2 . . . . . . .
                        . . . . . . 2 4 4 2 . . . . . .
                        . . . . . 2 4 4 4 4 2 . . . . .
                        . . . . . 2 4 4 4 4 2 . . . . .
                        . . . . . . 2 4 4 2 . . . . . .
                        . . . . . . . 2 2 . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                    `, SpriteKind.fireball)
                    bomb.setScale(2)
                    bomb.setPosition(bact.x,bact.y)
                    bomb.setFlag(SpriteFlag.GhostThroughSprites, true)
                    animation.runImageAnimation(
                        bomb,
                        [img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . 2 2 . . . . . . . 
        . . . . . . 2 4 4 2 . . . . . . 
        . . . . . 2 4 4 4 4 2 . . . . . 
        . . . . . 2 4 4 4 4 2 . . . . . 
        . . . . . . 2 4 4 2 . . . . . . 
        . . . . . . . 2 2 . . . . . . . 
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
        . . . . . . . 7 7 . . . . . . . 
        . . . . . . 7 8 8 7 . . . . . . 
        . . . . . 7 8 8 8 8 7 . . . . . 
        . . . . . 7 8 8 8 8 7 . . . . . 
        . . . . . . 7 8 8 7 . . . . . . 
        . . . . . . . 7 7 . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `],
                        100,
                        true
                    )
                    pause(1000)
                    bomb.setFlag(SpriteFlag.GhostThroughSprites, true)
                    animation.runImageAnimation(
                        bomb,
                        [img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . 4 . . . . . 
        . . . . 2 . . . . 4 4 . . . . . 
        . . . . 2 4 . . 4 5 4 . . . . . 
        . . . . . 2 4 d 5 5 4 . . . . . 
        . . . . . 2 5 5 5 5 4 . . . . . 
        . . . . . . 2 5 5 5 5 4 . . . . 
        . . . . . . 2 5 4 2 4 4 . . . . 
        . . . . . . 4 4 . . 2 4 4 . . . 
        . . . . . 4 4 . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . 3 . . . . . . . . . . . 4 . . 
        . 3 3 . . . . . . . . . 4 4 . . 
        . 3 d 3 . . 4 4 . . 4 4 d 4 . . 
        . . 3 5 3 4 5 5 4 4 d d 4 4 . . 
        . . 3 d 5 d 1 1 d 5 5 d 4 4 . . 
        . . 4 5 5 1 1 1 1 5 1 1 5 4 . . 
        . 4 5 5 5 5 1 1 5 1 1 1 d 4 4 . 
        . 4 d 5 1 1 5 5 5 1 1 1 5 5 4 . 
        . 4 4 5 1 1 5 5 5 5 5 d 5 5 4 . 
        . . 4 3 d 5 5 5 d 5 5 d d d 4 . 
        . 4 5 5 d 5 5 5 d d d 5 5 4 . . 
        . 4 5 5 d 3 5 d d 3 d 5 5 4 . . 
        . 4 4 d d 4 d d d 4 3 d d 4 . . 
        . . 4 5 4 4 4 4 4 4 4 4 4 . . . 
        . 4 5 4 . . 4 4 4 . . . 4 4 . . 
        . 4 4 . . . . . . . . . . 4 4 . 
                        `],
                        200,
                        false
                    )
                    pause(200)
                    sprites.destroy(bomb)
                    }
                    
                })
                let bactBar = statusbars.create(20, 6, StatusBarKind.EnemyHealth)
                bactBar.attachToSprite(bact)
                bactBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
                bactBar.setBarBorder(1, 15)
                bactBar.max = 15
                tiles.placeOnRandomTile(bact, assets.tile`FloorTile`)
                break;
                default: 0
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
    tiles.coverAllTiles(tiles.util.object4, assets.tile`FloorTile`)
    if (getBoss(currentX, currentY) && floorBossAlive) {
        if(floor == 1){
        setEnemies(currentX,currentY, 3)
        roomEnemiesLeft = getEnemies(currentX, currentY)
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
        let wormAnimationSpeed = 300
        let wormMoveSpeed = 30
        pause(2000)
        forever(function() {
            kingWorm.setFlag(SpriteFlag.GhostThroughSprites, true)
            animation.runImageAnimation(
                kingWorm,
                [img`
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
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
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
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
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
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbcc333bcbbbb333bbbbbbc....
        ......cb33b33bbccb3b3cc333c.....
        .....cbccccb3bbbccbbbb33bb3c....
        ......cbcbcbcbcbcbcbc33bcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbbbbbbbbbbbbbcbbbbccbc....
        ......cbccccbbbbccbbcbbbbbc.....
        .....cbbbbbbbbbccbbbbbccccbc....
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbcc333bcbbbb333bbbbbbc....
        ......cb33b33bbccb3b3cc333c.....
        .....cbccccb3bbbccbbbb33bb3c....
        ......cbcbcbcbcbcbcbc33bcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbbbbbbbbbbbbbcbbbbccbc....
        ......cbccccbbbbccbbcbbbbbc.....
        .....cbbbbbbbbbccbbbbbccccbc....
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbcc333bcbbbb333bbbbbbc....
        ......cb33b33bbccb3b3cc333c.....
        .....cbccccb3bbbccbbbb33bb3c....
        ......cbcbcbcbcbcbcbc33bcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbbbbbbbbbbbbbcbbbbccbc....
        ......cbccccbbbbccbbcbbbbbc.....
        .....cbbbbbbbbbccbbbbbccccbc....
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `],
                wormAnimationSpeed,
                false
            )
            pause(wormAnimationSpeed)
            if(bossWormBar.value < 20){
                wormAnimationSpeed = 150
                wormMoveSpeed = 60
            }
            scene.followPath(kingWorm, scene.aStar(tiles.locationOfSprite(kingWorm), tiles.locationOfSprite(player)), wormMoveSpeed)
            pause(wormAnimationSpeed*5)
            kingWorm.setFlag(SpriteFlag.GhostThroughSprites, false)
            animation.runImageAnimation(
                kingWorm,
                [img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbbbbbbbbbbbbbcbbbbccbc....
        ......cbccccbbbbccbbcbbbbbc.....
        .....cbbbbbbbbbccbbbbbccccbc....
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbcc333bcbbbb333bbbbbbc....
        ......cb33b33bbccb3b3cc333c.....
        .....cbccccb3bbbccbbbb33bb3c....
        ......cbcbcbcbcbcbcbc33bcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbbbbbbbbbbbbbcbbbbccbc....
        ......cbccccbbbbccbbcbbbbbc.....
        .....cbbbbbbbbbccbbbbbccccbc....
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbcc333bcbbbb333bbbbbbc....
        ......cb33b33bbccb3b3cc333c.....
        .....cbccccb3bbbccbbbb33bb3c....
        ......cbcbcbcbcbcbcbc33bcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbbbbbbbbbbbbbcbbbbccbc....
        ......cbccccbbbbccbbcbbbbbc.....
        .....cbbbbbbbbbccbbbbbccccbc....
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        .......c.c.c.c.c.c.c.c.c.c......
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....cbcc333bcbbbb333bbbbbbc....
        ......cb33b33bbccb3b3cc333c.....
        .....cbccccb3bbbccbbbb33bb3c....
        ......cbcbcbcbcbcbcbc33bcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
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
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
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
        ......cbcbcbcbcbcbcbcbcbcbc.....
        .....c.c.c.c.c.c.c.c.c.c.c.c....
        ................................
        ................................
        `, img`
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
        `],
                wormAnimationSpeed,
                false
            )
            pause(wormAnimationSpeed*10)

            
        })

        
        }
        else if(floor == 2){
            setEnemies(currentX, currentY, 3)
            roomEnemiesLeft = getEnemies(currentX,currentY)
            let giantSlime = sprites.create(img`
                ................................
                ................................
                ................................
                ..........66666666666...........
                .........6999999999996..........
                .......66999999999999966........
                ......6999999999999fffff6.......
                .....6999999999999f11111f6......
                .....6999999999999f1fff1f6......
                ....69999999999999f1f1f1f96.....
                ...6999fffff888888f1fff1f996....
                ...699f11111fcccccf11111f996....
                ...699ffff11fccccccfffff9996....
                ...699ff1f11fcccccccc8999996....
                ...699ffff11fccccccccc899996....
                ..6699f11111fccccccccc899996....
                ..66999fffffcccccccccc8999966...
                ..6699998ccccccccccccc8999966...
                ..6669998ccccccccccccc89996666..
                ..6669998ccccccccccccc89996666..
                ..6669998ccccccccccccc89996666..
                ..66669998ccccccccccc899966666..
                ..666669988ccccccccc8899666666..
                ..6666666688ccccccc88666666666..
                ...666666666888888866666666666..
                ...66666666666666666666666666...
                ....6666666666666666666666666...
                .....66666666666666666666666....
                .......666666666...6666666......
                ................................
                ................................
                ................................
            `, SpriteKind.Enemy)
            let bossSlimeBar = statusbars.create(40, 8, StatusBarKind.EnemyHealth)
            bossSlimeBar.attachToSprite(giantSlime)
            bossSlimeBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
            bossSlimeBar.setBarBorder(1, 15)
            bossSlimeBar.max = 120
            bossSlimeBar.value = 120
            tiles.placeOnRandomTile(giantSlime, tiles.util.object4)
            floorBossAlive = false
            pause(2000)
            forever(function() {
                animation.runImageAnimation(
                    giantSlime,
                    [img`
        ................................
        ................................
        ................................
        ..........66666666666...........
        .........6999999999996..........
        .......66999999999999966........
        ......6999999999999fffff6.......
        .....6999999999999f11111f6......
        .....6999999999999f1fff1f6......
        ....69999999999999f1f1f1f96.....
        ...6999fffff888888f1fff1f996....
        ...699f11111fcccccf11111f996....
        ...699ffff11fccccccfffff9996....
        ...699ff1f11fcccccccc8999996....
        ...699ffff11fccccccccc899996....
        ..6699f11111fccccccccc899996....
        ..66999fffffcccccccccc8999966...
        ..6699998ccccccccccccc8999966...
        ..6669998ccccccccccccc89996666..
        ..6669998ccccccccccccc89996666..
        ..6669998ccccccccccccc89996666..
        ..66669998ccccccccccc899966666..
        ..666669988ccccccccc8899666666..
        ..6666666688ccccccc88666666666..
        ...666666666888888866666666666..
        ...66666666666666666666666666...
        ....6666666666666666666666666...
        .....66666666666666666666666....
        .......666666666...6666666......
        ................................
        ................................
        ................................
                    `, img`
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ..........66666666666...........
        .........6999999999996..........
        .......66999999999999966........
        ......6999999999999fffff6.......
        .....6999999999999f11111f6......
        .....6999999999999f11111f6......
        ....69999999999999f11ffff96.....
        ...6999fffff888888f11f1ff996....
        ...699f11111fcccccf11ffff996....
        ...699f11111fccccccfffff9996....
        ...699ffff11fcccccccc8999996....
        ...699ff1f11fccccccccc899996....
        ..6699ffff11fccccccccc899996....
        ..66999fffffcccccccccc8999966...
        ..66669998ccccccccccc899966666..
        ..666669988ccccccccc8899666666..
        ..6666666688ccccccc88666666666..
        ...666666666888888866666666666..
        ...66666666666666666666666666...
        ....6666666666666666666666666...
        .....66666666666666666666666....
        .......666666666...6666666......
        ................................
        ................................
        ................................
                    `],
                    150,
                    true
                )
                scene.followPath(giantSlime, scene.aStar(tiles.locationOfSprite(giantSlime), tiles.locationOfSprite(player)), 30)
                pause(3000)
                if(bossSlimeBar.value < 60 && !spriteutils.isDestroyed(giantSlime)){
                    roomEnemiesLeft++
                    setEnemies(currentX, currentY, roomEnemiesLeft)
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
                   
                    slime.setPosition(giantSlime.x + randint(-1,1),giantSlime.y + randint(-1,1))
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
                        blockControl.waitForEvent(6, 0)

                        sprites.onDestroyed(SpriteKind.Player, function(sprite: Sprite) {
                            roomEnemiesLeft--
                        })
                    })
                    let slimeBar = statusbars.create(20, 6, StatusBarKind.EnemyHealth)
                    slimeBar.attachToSprite(slime)
                    slimeBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
                    slimeBar.setBarBorder(1, 15)
                    slimeBar.max = 5
                }
                pause(2000)
            })
        }
        else if(floor == 3){
            setEnemies(currentX, currentY, 3)
            let bigBact = sprites.create(img`
                ................................
                ............ccc...ccc...........
                ............ccc...ccc...........
                .............a.....a............
                .............a.....a............
                .....cc.....aaa...aaa.....cc....
                .....cc.....aaaaaaaaa.....cc....
                .......aaaaa333333333aaaaa......
                .......aaa3333333333333aaa......
                .......aa333333333333333aa......
                .......a33333333333333333a......
                .......a33333bbbbbbc33333a......
                .cc..aa33333bbbbbbbcb33333aa..cc
                .ccaaaa3333bcccccbccbb3333aaaacc
                .cc..aa3333ccbbbcccbbb3333aa..cc
                ......a3333bcbbbccbccc3333a.....
                ......a3333bcbbccbbcbb3333a.....
                ......a3333bcbbcccbcbb3333a.....
                .cc..aa3333ccbccbccccc3333aa..cc
                .ccaaaa3333bbbcbbbccbb3333aaaacc
                .cc..aa33333bcbbbbcbb33333aa..cc
                .......a33333bbbbbcb33333a......
                .......a33333333333333333a......
                .......aa333333333333333aa......
                .......aaa3333333333333aaa......
                .......aaaaa333333333aaaaa......
                .....cc.....aaaaaaaaa.....cc....
                .....cc.....aaa...aaa.....cc....
                .............a.....a............
                .............a.....a............
                ............ccc...ccc...........
                ............ccc...ccc...........
            `, SpriteKind.Enemy)
            let bigBactBar = statusbars.create(40, 8, StatusBarKind.EnemyHealth)
            bigBactBar.attachToSprite(bigBact)
            bigBactBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
            bigBactBar.setBarBorder(1, 15)
            bigBactBar.max = 200
            bigBactBar.value = 200
            tiles.placeOnRandomTile(bigBact, tiles.util.object4)
            floorBossAlive = false
            let bactSpeed = 35
            pause(2000)

            forever(function () {
                let bigBactPath = TilemapPath.create_path([tiles.getTileLocation(randint(2, 13), randint(2, 13)), tiles.getTileLocation(randint(2, 13), randint(2, 13))])
                TilemapPath.follow_path(bigBact, bigBactPath, bactSpeed)
            })
            forever(function () {
                animation.runImageAnimation(
                    bigBact,
                    [img`
        ................................
        ............ccc...ccc...........
        ............ccc...ccc...........
        .............a.....a............
        .............a.....a............
        .....cc.....aaa...aaa.....cc....
        .....cc.....aaaaaaaaa.....cc....
        .......aaaaa333333333aaaaa......
        .......aaa3333333333333aaa......
        .......aa333333333333333aa......
        .......a33333333333333333a......
        .......a33333bbbbbbc33333a......
        .cc..aa33333bbbbbbbcb33333aa..cc
        .ccaaaa3333bcccccbccbb3333aaaacc
        .cc..aa3333ccbbbcccbbb3333aa..cc
        ......a3333bcbbbccbccc3333a.....
        ......a3333bcbbccbbcbb3333a.....
        ......a3333bcbbcccbcbb3333a.....
        .cc..aa3333ccbccbccccc3333aa..cc
        .ccaaaa3333bbbcbbbccbb3333aaaacc
        .cc..aa33333bcbbbbcbb33333aa..cc
        .......a33333bbbbbcb33333a......
        .......a33333333333333333a......
        .......aa333333333333333aa......
        .......aaa3333333333333aaa......
        .......aaaaa333333333aaaaa......
        .....cc.....aaaaaaaaa.....cc....
        .....cc.....aaa...aaa.....cc....
        .............a.....a............
        .............a.....a............
        ............ccc...ccc...........
        ............ccc...ccc...........
        `, img`
        ................................
        ............aaa...aaa...........
        ............aaa...aaa...........
        .............c.....c............
        .............c.....c............
        .....aa.....ccc...ccc.....aa....
        .....aa.....ccccccccc.....aa....
        .......ccccc333333333ccccc......
        .......ccc3333333333333ccc......
        .......cc333333333333333cc......
        .......c33333333333333333c......
        .......c33333bcbbcbb33333c......
        .aa..cc33333bbcbbccbb33333cc..aa
        .aacccc3333bbccbbccbbc3333ccccaa
        .aa..cc3333bbcbccccccc3333cc..aa
        ......c3333bbcbcbbbbbb3333c.....
        ......c3333ccccccccbbc3333c.....
        ......c3333bcbbcbbcccc3333c.....
        .aa..cc3333bcbbccbcbbb3333cc..aa
        .aacccc3333bcbbbcbccbb3333ccccaa
        .aa..cc33333bbbbcbbcb33333cc..aa
        .......c33333bbbcbbb33333c......
        .......c33333333333333333c......
        .......cc333333333333333cc......
        .......ccc3333333333333ccc......
        .......ccccc333333333ccccc......
        .....aa.....ccccccccc.....aa....
        .....aa.....ccc...ccc.....aa....
        .............c.....c............
        .............c.....c............
        ............aaa...aaa...........
        ............aaa...aaa...........
        `],
                    300,
                    true
                )
                if (bigBactBar.value < 75) {
                    bactSpeed = 75
                }

                pause(2000)

                if (!spriteutils.isDestroyed(bigBact)) {

                    let bomb = sprites.create(img`
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . 2 2 . . . . . . .
                        . . . . . . 2 4 4 2 . . . . . .
                        . . . . . 2 4 4 4 4 2 . . . . .
                        . . . . . 2 4 4 4 4 2 . . . . .
                        . . . . . . 2 4 4 2 . . . . . .
                        . . . . . . . 2 2 . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                        . . . . . . . . . . . . . . . .
                    `, SpriteKind.fireball)
                    bomb.setScale(3)
                    bomb.setPosition(bigBact.x, bigBact.y)
                    bomb.setFlag(SpriteFlag.GhostThroughSprites, true)
                    animation.runImageAnimation(
                        bomb,
                        [img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . a a a . . . . . . . 
        . . . . . a 3 3 3 a . . . . . . 
        . . . . a 3 3 3 3 3 a . . . . . 
        . . . a 3 3 3 3 3 3 3 a . . . . 
        . . . a 3 3 3 3 3 3 3 a . . . . 
        . . . a 3 3 3 3 3 3 3 a . . . . 
        . . . . a 3 3 3 3 3 a . . . . . 
        . . . . . a 3 3 3 a . . . . . . 
        . . . . . . a a a . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . 5 5 5 . . . . . . . 
        . . . . . 5 7 7 7 5 . . . . . . 
        . . . . 5 7 7 7 7 7 5 . . . . . 
        . . . 5 7 7 7 7 7 7 7 5 . . . . 
        . . . 5 7 7 7 7 7 7 7 5 . . . . 
        . . . 5 7 7 7 7 7 7 7 5 . . . . 
        . . . . 5 7 7 7 7 7 5 . . . . . 
        . . . . . 5 7 7 7 5 . . . . . . 
        . . . . . . 5 5 5 . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `],
                        200,
                        true
                    )
                    pause(1000)
                    bomb.setFlag(SpriteFlag.GhostThroughSprites, true)
                    animation.runImageAnimation(
                        bomb,
                        [img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . 4 . . . . . 
        . . . . 2 . . . . 4 4 . . . . . 
        . . . . 2 4 . . 4 5 4 . . . . . 
        . . . . . 2 4 d 5 5 4 . . . . . 
        . . . . . 2 5 5 5 5 4 . . . . . 
        . . . . . . 2 5 5 5 5 4 . . . . 
        . . . . . . 2 5 4 2 4 4 . . . . 
        . . . . . . 4 4 . . 2 4 4 . . . 
        . . . . . 4 4 . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
                        `, img`
        . 3 . . . . . . . . . . . 4 . . 
        . 3 3 . . . . . . . . . 4 4 . . 
        . 3 d 3 . . 4 4 . . 4 4 d 4 . . 
        . . 3 5 3 4 5 5 4 4 d d 4 4 . . 
        . . 3 d 5 d 1 1 d 5 5 d 4 4 . . 
        . . 4 5 5 1 1 1 1 5 1 1 5 4 . . 
        . 4 5 5 5 5 1 1 5 1 1 1 d 4 4 . 
        . 4 d 5 1 1 5 5 5 1 1 1 5 5 4 . 
        . 4 4 5 1 1 5 5 5 5 5 d 5 5 4 . 
        . . 4 3 d 5 5 5 d 5 5 d d d 4 . 
        . 4 5 5 d 5 5 5 d d d 5 5 4 . . 
        . 4 5 5 d 3 5 d d 3 d 5 5 4 . . 
        . 4 4 d d 4 d d d 4 3 d d 4 . . 
        . . 4 5 4 4 4 4 4 4 4 4 4 . . . 
        . 4 5 4 . . 4 4 4 . . . 4 4 . . 
        . 4 4 . . . . . . . . . . 4 4 . 
                        `],
                        200,
                        false
                    )
                    pause(200)
                    sprites.destroy(bomb)
                }

                
            })
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

function distanceFormula(x1: number, x2: number, y1: number, y2: number) {
    return Math.sqrt((y1 - y2) * (y1 - y2) + (x1 - x2) * (x1 - x2))
}