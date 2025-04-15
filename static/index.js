let canvas;
let context;
let fpsInterval = 1000 / 30; // the denominator is frames-per-second

let now;
let then = Date.now();
let request_id;

let background = [
    [171, 168, 170, 169, 169, 170, 168, 169, 168, 170, 169, 170, 170, 168, 169, 169, 170, 168, 169, 170, 168, 169, 170, 168, 169, 170, 168, 169, 170, 172],
    [149, 129, 176, 177, 129, 130, 128, 129, 130, 128, 129, 130, 128, 129, 130, 128, 129, 130, 128, 129, 130, 128, 129, 130, 128, 129, 130, 128, 129, 148],
    [157, 140, 184, 185, 140, 141, 139, 140, 141, 139, 140, 141, 139, 140, 141, 139, 140, 141, 139, 140, 141, 139, 140, 141, 139, 140, 141, 139, 140, 156],
    [165, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 164],
    [149, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 148],
    [157, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 156],
    [165, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 164],
    [149, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 148],
    [157, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 156],
    [165, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 164],
    [149, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 148],
    [157, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 156],
    [165, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 164],
    [149, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 148],
    [157, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 156],
    [165, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 164],
    [149, 133, 134, 135, 133, 134, 135, 133, 134, 135, 133, 134, 135, 133, 134, 135, 133, 134, 135, 133, 134, 135, 176, 177, 133, 134, 135, 133, 134, 148],
    [157, 141, 142, 143, 141, 142, 143, 141, 142, 143, 141, 142, 143, 141, 142, 143, 141, 142, 143, 141, 142, 143, 184, 185, 143, 141, 142, 143, 141, 156],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
]

let tilesPerRow = 8;
let tileSize = 32;
let backgroundImage = new Image();

let maxPlayerHealth = 5;
let player = {
    score: 0,
    health: maxPlayerHealth,
    damage: 1,
    stamina: 50,
    x: 64,
    y: 64,
    width: 64,
    height: 64,
    frameX: 0,
    frameY: 2,
    xChange: 8,
    yChange: 8,
    attackCounter: 0,
    isAttacking: false,
    isSprinting: false,
    isKilling: false,
    isHit: false,
    hitFrameCounter: 0,
    isHealing: false,
    isCheating: false,
}

let hasCheated = false;

let inventory = ["sword", "bow", "potion"];
let current_item = 0;
let showCurrentItem = false;
let showCurrentItemCounter = 0;

let healthBar = {
    x: player.x,
    y: player.y,
    width: 64,
    height: 16,
    frame: 0,
}

let staminaBar = {
    x: player.x,
    y: player.y + 16,
    width: 64,
    height: 16,
    frame: 0,
    max: player.stamina,
    counter: 0,
}

// how often the stamina bar frame updates
let frameInterval =  staminaBar.max / 5; 

let swordAnimation = {
    frameX: 0,
    frameY: 0,
    counter: 0,
    width: 96,
    height: 96,
}

let projectiles = [];
let projectileSpeed = 8;
let totalProjectiles = 0;

let playerHitbox = {
    x: 0, 
    y: 0, 
    width: player.width/2, 
    height: player.height-12
}

let enemyHitbox  = {
    x: 0, 
    y: 0, 
    width: player.width/2, 
    height: player.height-12
}

let swordFrame = 0;
let enemySwordFrame = 0;

let moveCounter = 0;
let swingCounter = 0;

let score = {
    hundredsFrame: 0,
    tensFrame: 0,
    oneFrame: 0,
    width: 136,
    height: 32,
    numSize: 32,
}

let scoreDisplay = new Image();
let scoreDisplayNums = new Image();
let deathScreen = new Image();
let damageImage = new Image();
let toolbarImage = new Image();
let healthGainImage = new Image();

let playerWalk = new Image();
let playerSlash = new Image();
let playerBow = new Image();
let playerHealthBarImage = new Image();
let playerStaminaBarImage = new Image();

let attackUp = new Image();
let attackDown = new Image();
let attackLeft = new Image();
let attackRight = new Image();
let attackImage;

let enemyHealthBarImage = new Image();

let skeletonWalk = new Image();
let skeletonSlash = new Image();
let skeletonDead = new Image();
let archerWalk = new Image();
let archerAttack = new Image();
let archerDead = new Image();
let mageWalk = new Image();
let mageCast = new Image();
let mageDead = new Image();

let fireball = new Image();
let icicle = new Image();
let arrowImage = new Image();

let cheatImage = new Image();
let cheatStatusImage = new Image();

let map = new Image();

let xChange, yChange, squareSize;
xChange = yChange = squareSize = 20;

let bowFrame = 0;
let bowFrameCounter = 0;

// let food = []; 
// let foodMultiplier = 5;
// let foodQueue = 0; // add food one at a time

// let obstacles = [];
// let obstaclesAmount = 50;

let healthGainFrameCounter = 0;

let iFrames = 0;
let iFrameMax = 45;

let enemiesPerLevel = 100;
let maxEnemyCount = 5;
let enemies = [];

let enemyInfo = {
    "skeleton" : {
        "amount": 0,
        "maxHealth": 1,
        "canKnockback": true,
        "attackType": "melee"
    },
    "archer" : {
        "amount": 0,
        "maxHealth": 1,
        "canKnockback": true,
        "attackType": "range",
        "maxProjectiles": 1,
        "projectile": arrowImage,
        "attackAnimationFrames": 13,
        "projectileAnimationFrames": 2,
    },
    "mage" : {
        "amount": 0,
        "maxHealth": 1,
        "canKnockback": true,
        "attackType": "range",
        "maxProjectiles": 1,
        "projectile": fireball,
        "attackAnimationFrames": 7,
        "projectileAnimationFrames": 8,
    },
}

let enemyTypes = Object.keys(enemyInfo)

let enemyImages = {
    "skeleton":{
        "walk" : skeletonWalk,
        "slash" : skeletonSlash,
        "dead" : skeletonDead,
    },
    "archer":{
        "walk" : archerWalk,
        "slash" : archerAttack,
        "dead" : archerDead,
    },
    "mage":{
        "walk" : mageWalk,
        "slash" : mageCast,
        "dead" : mageDead,
    },
}

let enemyHealthBar = {
    width: 64,
    height: 16,
    frame: 10
}

let maxPotionUses = 1;

let toolbar = {
    width: 32,
    height: 32,
    frameX: 0,
    frameY: maxPotionUses,
}

let cheatFrame = 0;

// let damageNums = {
//     takeDmgFrame: 0,
//     giveDmgFrame: 0,
// }

let enemyId = 0;

let moveLeft, moveRight, moveUp, moveDown;
moveLeft = moveRight = moveUp = moveDown = false;

let faceLeft, faceRight, faceUp, faceDown;
faceLeft = faceRight = faceUp = faceDown = false;

// let clickX = 0;
// let clickY = 0;
// let hasNewClick = false;

let projectileDelay = 60;
let time = 0;
let timeFrameCounter = 0;

document.addEventListener("DOMContentLoaded", init, false);


function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);
    window.addEventListener("keydown", handleInventory, false);
    window.addEventListener("keydown", enableCheats, false);

    // disable right click
    window.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });

    player.x = 64;
    player.y = 64;

    load_assets([
        {"var": playerWalk, "url": "static/images/player_animations/PLAYER_WALK.png"},
        {"var": playerSlash, "url": "static/images/player_animations/PLAYER_SLASH.png"},
        {"var": playerBow, "url": "static/images/player_animations/PLAYER_BOW.png"},
        {"var": attackUp, "url": "static/images/player_attack/ATTACK_UP.png"},
        {"var": attackDown, "url": "static/images/player_attack/ATTACK_DOWN.png"},
        {"var": attackLeft, "url": "static/images/player_attack/ATTACK_LEFT.png"},
        {"var": attackRight, "url": "static/images/player_attack/ATTACK_RIGHT.png"},
        {"var": skeletonWalk, "url": "static/images/enemies/skeleton/SKELETON_WALK.png"},
        {"var": skeletonSlash, "url": "static/images/enemies/skeleton/SKELETON_SLASH.png"},
        {"var": skeletonDead, "url": "static/images/enemies/skeleton/SKELETON_DEAD.png"},
        {"var": archerWalk, "url": "static/images/enemies/archer/ARCHER_WALK.png"},
        {"var": archerAttack, "url": "static/images/enemies/archer/ARCHER_ATTACK.png"},
        {"var": archerDead, "url": "static/images/enemies/archer/ARCHER_DEAD.png"},
        {"var": mageWalk, "url": "static/images/enemies/mage/MAGE_WALK.png"},
        {"var": mageCast, "url": "static/images/enemies/mage/MAGE_CAST.png"},
        {"var": mageDead, "url": "static/images/enemies/mage/MAGE_DEAD.png"},
        {"var": arrowImage, "url": "static/images/enemies/archer/ARROW.png"},
        {"var": fireball, "url": "static/images/enemies/mage/FIREBALL.png"},
        {"var": icicle, "url": "static/images/enemies/mage/ICICLE.png"},
        {"var": playerHealthBarImage, "url": "static/images/stats/PLAYER_HEALTHBAR.png"},
        {"var": playerStaminaBarImage, "url": "static/images/stats/STAMINA_BAR.png"},
        {"var": enemyHealthBarImage, "url": "static/images/stats/ENEMY_HEALTHBAR.png"},
        {"var": scoreDisplay, "url": "static/images/stats/SCORE_DISPLAY.png"},
        {"var": scoreDisplayNums, "url": "static/images/stats/SCORE_DISPLAY_NUMS.png"},
        {"var": deathScreen, "url": "static/images/stats/DEATH_SCREEN.png"},
        {"var": backgroundImage, "url": "static/images/tiles.png"},
        {"var": damageImage, "url": "static/images/stats/DMG_NUMS.png"},
        {"var": toolbarImage, "url": "static/images/stats/TOOLBAR.png"},
        {"var": healthGainImage, "url": "static/images/stats/HEALTH_GAIN.png"},
        {"var": cheatImage, "url": "static/images/stats/CHEAT.png"},
        {"var": cheatStatusImage, "url": "static/images/stats/CHEAT_STATUS.png"},
    ], draw)
    
    draw();
}

function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);

    // background
    context.fillStyle = "black";
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 30; c++) {
            let tile = background[r][c];
            if (tile >= 0) {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(backgroundImage,
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize
                )
            }
        }
    }

    displayHUD()

    if (enemiesPerLevel > 0 ) {
        createEnemies();
    }
    
    // draw player 
    if (! player.isAttacking) {
        context.drawImage(playerWalk, player.frameX*player.width, player.frameY*player.height, player.width, player.height,
                        player.x, player.y, player.width, player.height);
    }
    
    handleAttacking();
    for (let e of enemies) {
        if (e.isHit) {
            context.drawImage(damageImage, 0, 0, 24, 16,
                e.x+e.width/3, e.y-16, 24, 16)
        }
    }
    handleEnemyAttacking();

    drawEnemies();
    
    handleEnemyProjectiles();

    handleProjectiles();
    
    moveEnemies();

    movePlayer(); 

    playerStats();

}

function outOfBounds(x, y) {
    let leftBoundary = 32;
    let rightBoundary = canvas.width-32;
    let upBoundary = 52;
    let downBoundary = canvas.height-132;
    
    if (x <= leftBoundary) {
        return ["left", leftBoundary];
    }
    else if (x >= rightBoundary) {
        return ["right", rightBoundary];
    }
    else if (y <= upBoundary) {
        return ["up", upBoundary];
    }
    else if (y >= downBoundary) {
        return ["down", downBoundary];
    }
    return "false";
}

function displayHUD() {
    context.drawImage(toolbarImage, 0, toolbar.frameY*32, 96, 32,
        0, canvas.height-32, 96, 32)
        
    context.drawImage(cheatImage, 0, cheatFrame*32, 160, 32,
        canvas.width/2-160, canvas.height-32, 160, 32)

    context.drawImage(cheatStatusImage, 0, cheatFrame*32, 80, 32,
        canvas.width/2+2, canvas.height-32, 80, 32)

    if (showCurrentItem) {
        context.drawImage(toolbarImage, toolbar.frameX*32, toolbar.frameY*32, toolbar.width, toolbar.height,
            player.x+player.width/4, player.y+player.height, toolbar.width, toolbar.height);
        showCurrentItemCounter ++;
    }
    if (showCurrentItemCounter === 30) {
        showCurrentItem = false;
        showCurrentItemCounter = 0;
    }
}

function enableCheats(event) {
    let key = event.key;
    if (key === "p" || key === "P") {
        if (! player.isCheating) {
            hasCheated = true;
            player.isCheating = true;
            cheatFrame ++;
        }
        else {
            player.isCheating = false;
            cheatFrame --;
        }
    }
}

function handleInventory(event) {
    if (! player.isAttacking) {
        let key = event.key;

        // cycling through inventory
        if (key === "e" || key === "E") {
            showCurrentItem = true;
            if (current_item === inventory.length-1) {
                current_item = 0;
            }
            else {
                current_item ++;
            }
            toolbar.frameX = current_item;
            showCurrentItemCounter = 0;
        }
        else if (key === "q" || key === "Q") {
            showCurrentItem = true;
            if (current_item === 0) {
                current_item = inventory.length - 1;
            }
            else {
                current_item --;
            }
            toolbar.frameX = current_item;
            showCurrentItemCounter = 0;
        }
    }
}

function movePlayer() {
    playerHitbox = {
        x: player.x+16, 
        y: player.y+12, 
        width: player.width/2, 
        height: player.height-12
    }
    let x = playerHitbox.x
    let y = playerHitbox.y
    let w = playerHitbox.width
    let h =playerHitbox.height

    if ((moveLeft || moveRight) && !(moveLeft && moveRight) || (moveUp || moveDown) && !(moveUp && moveDown)) {
        moveCounter ++
        if (moveCounter === 2) {
            moveCounter = 0;
            player.frameX = (player.frameX + 1) % 4;
        }
    }
    
    if ( !(moveLeft && moveRight) && !(moveUp && moveDown)) {
        if (moveUp && !(outOfBounds(x, y).includes("up"))) {
            player.y -= player.yChange;
            player.frameY = 0;
        }
        if (moveLeft && !(outOfBounds(x, y).includes("left"))) {
            player.x -= player.xChange;
            player.frameY = 1;
        }
        if (moveDown && !(outOfBounds(x, y+h).includes("down"))) {
            player.y += player.yChange;
            player.frameY = 2;
        }
        if (moveRight && !(outOfBounds(x+w, y).includes("right"))) {
            player.x += player.xChange;
            player.frameY = 3;
        }
    }

    if (!(moveLeft || moveRight || moveUp || moveDown) || ((moveLeft && moveRight) || (moveUp && moveDown))) {
        player.frameX = 0;
    }

    if (player.isSprinting) {
        if (player.stamina > 0 && player.xChange < 12) {
            player.xChange += 2;
            player.yChange += 2;
            player.stamina --;
            if (player.stamina % frameInterval === 0 && staminaBar.frame < 5) {
                staminaBar.frame ++
            }
        }
        else if (player.stamina > 0) {
            player.stamina --;
            if (player.stamina % frameInterval === 0 && staminaBar.frame < 5) {
                staminaBar.frame ++
            }
        }
        else {
            player.isSprinting = false;
        }
    }
        
    if (! player.isSprinting && player.stamina < staminaBar.max) {
        if (staminaBar.counter === 5) {
            player.stamina ++;
            if (staminaBar.frame > 0 && player.stamina % frameInterval === 0) {
                staminaBar.frame --
            }
            staminaBar.counter = 0;
        }
        else {
            staminaBar.counter ++;
        }
        if (player.xChange > 8) {
            player.xChange -= 1;
            player.yChange -= 1;
        }
    }
}

let mouseX, mouseY;
let playerProjectile = {
    x: player.x,
    y: player.y,
    width: 64,
    height: 64,
    dx: 0,
    dy: 0,
    hasFired: false,
}
let playerProjectiles = [];

function handleAttacking() {
    window.addEventListener("click", attack, false);
    if (player.isAttacking) {
        player.isSprinting = false;
        if (inventory[current_item] === "sword") {
            moveUp = moveLeft = moveDown = moveRight = false;
            let swordHitbox = {
                x: player.x,
                y: player.y,
                animationX: player.x,
                animationY: player.y,
                width: player.width,
                height: player.height,
                frameX: 0,
            }

            if (player.frameY === 0) { // up
                swordHitbox.animationX -= 16
                swordHitbox.animationY -= 48
                attackImage = attackUp;
                swordHitbox.x += swordHitbox.width * 0.1875
                swordHitbox.width *= 0.625
                swordHitbox.y = player.y - player.height/2;
            }
            else if (player.frameY === 1) { // left
                swordHitbox.animationX -= 48
                attackImage = attackLeft;
                swordHitbox.y += swordHitbox.height / 4
                swordHitbox.height *= 0.75
                swordHitbox.x = player.x - player.width/2;
            }
            else if (player.frameY === 2) { // down
                swordHitbox.animationX -= 16
                swordHitbox.animationY += 16
                attackImage = attackDown;
                swordHitbox.x += swordHitbox.width * 0.1875
                swordHitbox.width *= 0.625
                swordHitbox.y = player.y + player.height/2;
            }
            else if (player.frameY === 3) { // right
                swordHitbox.animationX += 16
                attackImage = attackRight;
                swordHitbox.y += swordHitbox.height / 4
                swordHitbox.height *= 0.75
                swordHitbox.x = player.x + player.width/2;
            }
            
            context.drawImage(attackImage, 
            swordAnimation.frameX*swordAnimation.width, swordAnimation.frameY*swordAnimation.height, swordAnimation.width, swordAnimation.height,
            swordHitbox.animationX, swordHitbox.animationY, swordAnimation.width, swordAnimation.height)

            // sword slash animation
            if (swordAnimation.counter === 1) {
                swordAnimation.counter = 0;
                if ((swordAnimation.frameY === 1 && swordAnimation.frameX < 3) || (swordAnimation.frameY === 0 && swordAnimation.frameX < 4)) {
                    swordAnimation.frameX ++;
                }
                else {
                    if (swordAnimation.frameY === 0) {
                        swordAnimation.frameX = 0;
                        swordAnimation.frameY ++;
                    }
                    else {
                        swordAnimation.frameX = 0;
                        swordAnimation.frameY = 0;
                    }
                }
            }
            else {
                swordAnimation.counter++;
            }
                
            context.drawImage(playerSlash, swordFrame*player.width, player.frameY*player.height, player.width, player.height,
                player.x, player.y, player.width, player.height);

            player.attackCounter ++;
            if (player.attackCounter === 3) { 
                swordFrame ++;
                player.attackCounter = 0;
            }
            
            for (let e of enemies) {
                if (collides(e, swordHitbox) && !e.isDying) {
                    if (! e.isHit) {
                        if (swordFrame <= 3) {
                            e.health -= player.damage;
                        }
                        
                        if (e.health <= 0) {
                            e.isDying = true;
                            e.deathFrame = 0;
                            e.deathCounter = 0;
                            player.score ++;
                            // score.oneFrame ++;
                        }
                        e.isHit = true;
                    }

                    else if (swordFrame <= 3 && e.isHit && enemyInfo[e.type]["canKnockback"] === true) {

                        // knockback enemies
                        if (player.frameY === 1) { // left
                            e.x -= 3*e.xChange;
                        }
                        else if (player.frameY === 3) { // right
                            e.x += 3*e.xChange;
                        }
                        else if (player.frameY === 2) { // down
                            e.y += 3*e.yChange;
                        }
                        else if (player.frameY === 0) { // up
                            e.y -= 3*e.yChange;
                        }
                        
                        let w = enemyHitbox.width;
                        let h = enemyHitbox.height;

                        // prevent enemies from being knocked out of bounds
                        if (outOfBounds(e.x+w, e.y).includes("right")) {
                            e.x = outOfBounds(e.x+w, e.y)[1] - w
                        }
                        else if (outOfBounds(e.x+w/2, e.y).includes("left")) {
                            e.x = outOfBounds(e.x+w/2, e.y)[1] - w/2;
                        }
                        else if (outOfBounds(e.x, e.y+h).includes("down")) {
                            e.y = outOfBounds(e.x, e.y+h)[1] - h;
                        }
                        else if (outOfBounds(e.x, e.y+h/2).includes("up")) { // top border
                            e.y = outOfBounds(e.x, e.y+h/2)[1] - h/3;
                        }
                    }
                }
            }

            if (swordFrame === 6) {
                player.isAttacking = false;
                swordFrame = 0;
                for (let e of enemies) {
                    e.isHit = false;
                }
            }
        }
    
        else if (inventory[current_item] === "bow") {
            moveUp = moveLeft = moveDown = moveRight = false;
            if (bowFrameCounter === 0) {
                bowFrame = (bowFrame +1) % 13;
                bowFrameCounter = 2;
            }
            bowFrameCounter --;
            context.drawImage(playerBow, bowFrame*player.width, player.frameY*player.height, 64, 64,
                player.x, player.y, 64, 64)
            if (bowFrame === 0) {
                let direction = calculateDirection(player.x, player.y, mouseX, mouseY);
                playerProjectile.dx = direction.dx
                playerProjectile.dy = direction.dy
                playerProjectile.hasFired = true;
                player.isAttacking = false;
                bowFrameCounter = 0;
            }
            if (playerProjectile.hasFired) {
                context.drawImage(arrowImage, 0, 0, 64, 64,
                    player.x, player.y, 64, 64)
            }
            
        }
        
        else if (inventory[current_item] === "potion") {
            // moveUp = moveLeft = moveDown = moveRight = false;
            context.drawImage(playerWalk, player.frameX*player.width, player.frameY*player.height, player.width, player.height,
                player.x, player.y, player.width, player.height);
            if (player.health < maxPlayerHealth && !player.isHealing && toolbar.frameY > 0) {
                player.health ++;
                healthBar.frame --;
                player.isHealing = true;
                toolbar.frameY --;
            }

            if (player.isHealing) {
                moveUp = moveLeft = moveDown = moveRight = false;
                if (healthGainFrameCounter < 20) {
                    context.drawImage(healthGainImage, 0, 0, 24, 12,
                        player.x+player.width/3, player.y-32, 24, 12)
                    healthGainFrameCounter ++;
                    
                    context.drawImage(toolbarImage, 64, toolbar.frameY*32, toolbar.width, toolbar.height,
                        player.x+player.width/4, player.y+player.height, toolbar.width, toolbar.height);
                }
                else {
                    player.isHealing = false;
                    healthGainFrameCounter = 0;
                }
            }
            if (! player.isHealing) {
                player.isAttacking = false;
            }
        }
    }

    // kill enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        if (e.isDying) {
            // remove projectile associated with enemy
            for (let p of projectiles) {
                if (e.id === p.id) {
                    projectiles.splice(projectiles.indexOf(p), 1)
                }
            }
            e.deathCounter++;
            if (e.deathCounter === 5) {
                e.deathCounter = 0;
                e.deathFrame++;
                if (e.deathFrame === 6) {
                    enemies.splice(i, 1);
                    if (enemyInfo[e.type]["attackType"] === "range"){
                        totalProjectiles -= enemyInfo[e.type]["maxProjectiles"];
                    }
                }
            }
        }
    }
}

function handleProjectiles() {
    if (playerProjectile.hasFired) {    
        playerProjectile.x += playerProjectile.dx * projectileSpeed
        playerProjectile.y += playerProjectile.dy * projectileSpeed
        let x = playerProjectile.x;
        let y = playerProjectile.y;
        let w = playerProjectile.width;
        let h = playerProjectile.height;

        // projectile reaches the edge
        if ((outOfBounds(x,y).includes("left")) || ((outOfBounds(x,y+h).includes("down"))) || 
            (outOfBounds(x,y).includes("up")) || ((outOfBounds(x+w,y).includes("right")))) {
                playerProjectile.x = player.x;
                playerProjectile.y = player.y;
                playerProjectile.hasFired = false;
        }
        else {
            context.drawImage(arrowImage, 0, 0, 64, 64,
                playerProjectile.x, playerProjectile.y, 64, 64)
        }
        
    }
}

function attack(event) {
    if (!player.isAttacking) {
        player.isAttacking = true;
    }
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function createEnemies() {
    if (enemies.length < maxEnemyCount) {
        // generating different types of enemies e.g. skeletons or mages
        for (let type of enemyTypes) {
            let enemiesGenerated = 0;
            // generating each enemy for the amount of time they're in the level
            let enemyCounter = enemyInfo[type]["amount"]
            for (let i = 0; i < enemyCounter; i++) {
                if (enemies.length === maxEnemyCount) break;
                enemiesGenerated ++
                let e = {
                    type: type,
                    health: enemyInfo[type]["maxHealth"],
                    x: 0,
                    y: 0, 
                    width: 64,
                    height: 64,
                    xChange: 4,
                    yChange: 4,
                    frameX: 0,
                    frameY: 0,
                    attackFrameX: 0,
                    attackFrameY: 0,
                    moveUp: false,
                    moveLeft: false,
                    moveDown: false,
                    moveRight: false,
                    moveCounter: 0,
                    isAttacking: false,
                    attackCounter: 0,
                    isDying: false,
                    deathFrame: 0,
                    deathCounter: 0,
                    isSpawning: true,
                    spawnFrame: 5,
                    spawnCounter: 0,
                    isHit: false,
                }
                
                e.id = enemyId;
                enemyId ++;

                if (enemyInfo[e.type]["attackType"] === "range") {
                    e.canFire = false;
                    e.projectileCounter = 0
                    totalProjectiles += enemyInfo[e.type]["maxProjectiles"];
                }
                
                e.x = randint(256, canvas.width-32-e.width)
                e.y = randint(52, canvas.height-152-e.height)

                // convert co-ordinates to multiples of 4
                e.x = (e.x + (4 - e.x%4))
                e.y = (e.y + (4 - e.y%4))

                enemies.push(e)
                enemiesPerLevel --

            }
            // the amount of each enemy type to generate 
            enemyInfo[type]["amount"] -= enemiesGenerated
        }
    }
}

function drawEnemies() {
    for (let e of enemies) {
        // spawn animation - the reverse of dying animation
        if (e.isSpawning) {
            e.moveUp = e.moveLeft = e.moveDown = e.moveRight = false;
            e.spawnCounter++;
            if (e.spawnCounter === 5) {
                e.spawnCounter = 0;
                e.spawnFrame--;
                if (e.spawnFrame === 0) {  
                    e.isSpawning = false;
                }
            } 
            context.drawImage(enemyImages[e.type]["dead"], e.spawnFrame * e.width, 0, e.width, e.height,
                e.x, e.y, e.width, e.height);

            continue;
        }
        else if (e.isDying) {
            context.drawImage(enemyImages[e.type]["dead"], e.deathFrame * e.width, 0, e.width, e.height,
                            e.x, e.y, e.width, e.height);

        } else if (e.isAttacking) {
            context.drawImage(enemyImages[e.type]["slash"], e.attackFrameX*e.width, e.frameY*e.height, e.width, e.height,
                            e.x, e.y, e.width, e.height);
        } else {
            context.drawImage(enemyImages[e.type]["walk"], e.frameX*e.width, e.frameY*e.height, e.width, e.height,
                            e.x, e.y, e.width, e.height);
        }
    
        enemyHealthBar.frame = Math.floor(e.health/(enemyInfo[e.type]["maxHealth"] / 10))

        context.drawImage(enemyHealthBarImage, 0, enemyHealthBar.frame*enemyHealthBar.height, enemyHealthBar.width, enemyHealthBar.height,
            e.x, e.y, enemyHealthBar.width, enemyHealthBar.height);
    }
}

function moveEnemies() {
    for (let e of enemies) {
        // dont move if attacking, dying, spawning
        if (e.isAttacking || e.isDying || e.isSpawning) {
            continue;
        }

        // e.attackFrameX = 0;
        // e.canFire = false;

        // if enemy is next to the player stop and attack
        let distanceY = Math.abs(player.y - e.y);
        let distanceX = Math.abs(player.x - e.x)
        
        if (enemyInfo[e.type]["attackType"] === "melee") {
            if (distanceX <= player.width && distanceY <= player.height/4) {
                e.isAttacking = true;
                e.frameX = 0;
                // face the player
                if (player.x > e.x) e.frameY = 3; // right
                else if (player.x < e.x) e.frameY = 1; // left
                else if (player.y < e.y) e.frameY = 0; // up
                else if (player.y > e.y) e.frameY = 2; // down
                
                continue;
            }
        }
        else if (enemyInfo[e.type]["attackType"] === "range") {
            if ((distanceX <= player.width*4 && distanceY <= player.height*2)) {
                e.isAttacking = true;
                e.moveUp = e.moveLeft = e.moveDown = e.moveRight = false;
                e.frameX = 0;
                // face the player
                if (player.x > e.x) e.frameY = 3; // right
                else if (player.x < e.x) e.frameY = 1; // left
                else if (player.y < e.y) e.frameY = 0; // up
                else if (player.y > e.y) e.frameY = 2; // down
                
                continue;
            }
        } 
        if (! e.isHit) {
            // movement
            if (player.x - e.width > e.x) { // right
                e.x += e.xChange;
                e.frameY = 3;
                e.moveRight = true;
                e.moveUp = e.moveLeft = e.moveDown = false;
            }
            else if (player.x + e.width < e.x) { // left
                e.x -= e.xChange;
                e.frameY = 1;
                e.moveLeft = true;
                e.moveUp = e.moveDown = e.moveRight = false;
            }
            else if (player.y < e.y) { // up
                e.y -= e.yChange;
                e.frameY = 0;
                e.moveUp = true;
                e.moveLeft = e.moveDown = e.moveRight = false;
            }
            else if (player.y > e.y) { // down
                e.y += e.yChange;
                e.frameY = 2;
                e.moveDown = true;
                e.moveUp = e.moveLeft = e.moveRight = false;
            }
        }

        if (e.moveUp || e.moveLeft || e.moveDown || e.moveRight){
            e.moveCounter ++
            if (e.moveCounter === 2) {
                e.moveCounter = 0;
                e.frameX = (e.frameX + 1) % 9;
            }
        }
        
        enemyHitbox = {
            x: e.x+16, 
            y: e.y+12, 
            width: e.width/2, 
            height: e.height-12
        }
    }
}

function handleEnemyAttacking() {
    for (let e of enemies) {
        if (e.isAttacking) {
            if (enemyInfo[e.type]["attackType"] === "melee") {
                let enemySwordHitbox = {
                    x: e.x,
                    y: e.y,
                    width: e.width,
                    height: e.height
                }
                
                if (e.frameY === 0) { // up
                    enemySwordHitbox.y = e.y - e.height/2;
                }
                else if (e.frameY === 1) { // left
                    enemySwordHitbox.x = e.x - e.width/2;
                }
                else if (e.frameY === 2) { // down
                    enemySwordHitbox.y = e.y + e.height/2;
                }
                else if (e.frameY === 3) { // right
                    enemySwordHitbox.x = e.x + e.width/2;
                }
                
                e.attackCounter++;
                if (e.attackCounter >= 5) {
                    e.attackCounter = 0;
                    e.attackFrameX++;
                    
                    if (e.attackFrameX === 6 && collides(playerHitbox, enemySwordHitbox)) {
                        if (iFrames === 0 && !e.isDying) {
                            takeDamage();
                        }
                    }
                    
                    if (e.attackFrameX === 6) {
                        e.isAttacking = false;
                        e.attackFrameX = 0;
                    }
                }
            }
            else if (enemyInfo[e.type]["attackType"] === "range") {
                e.attackCounter++;
                if (e.attackCounter >= 5) {
                    e.attackCounter = 0;
                    e.attackFrameX++;
                    
                    if (e.attackFrameX === enemyInfo[e.type]["attackAnimationFrames"]) {
                        e.canFire = true;
                        e.isAttacking = false;
                        e.attackFrameX = 0;
                    }
                }
                
                if ((projectiles.length < totalProjectiles) 
                    && (e.projectileCounter < enemyInfo[e.type]["maxProjectiles"]) && e.canFire) {
                    let p = {
                        id: e.id,
                        hasFired: false,
                        delay: projectileDelay,
                        x: e.x,
                        y: e.y,
                        width: 64,
                        height: 64,
                        frameX: 0,
                        frameY: 0,
                    }
                    projectiles.push(p);
                    e.projectileCounter ++;
                }
            }
        }
    }
}

function handleEnemyProjectiles() {
    for (let p of projectiles) {
        for (let e of enemies) {
            if (p.id === e.id && e.canFire) {
                if (p.delay != 0) {
                    p.delay --;
                }

                let projectileHitbox = {
                    x: p.x,
                    y: p.y,
                    width: p.width,
                    height: p.height
                }
                
                if (! p.hasFired) {
                    let direction = calculateDirection(p.x, p.y, player.x, player.y);
                    p.dx = direction.dx
                    p.dy = direction.dy
                    p.hasFired = true;
                }

                // regular projectile path
                p.x += p.dx * projectileSpeed
                p.y += p.dy * projectileSpeed

                if (-0.25 < p.dx && p.dx < 0.25) {
                    if (p.dy > 0.9) { // down
                        p.frameY = 6;
                        projectileHitbox.y += projectileHitbox.height/3;
                    }
                    else { // up
                        p.frameY = 2;
                        projectileHitbox.y += projectileHitbox.height/6;
                    }
                    projectileHitbox.x = p.x +p.width/3;
                    projectileHitbox.width = p.width/3;
                    projectileHitbox.height /= 2;
                }
                else if (-0.25 < p.dy && p.dy < 0.25) {
                    if (p.dx > 0.9) { // right
                        p.frameY = 4;
                        projectileHitbox.x += projectileHitbox.width/2;
                    }
                    else { // left
                        p.frameY = 0;
                    }
                    projectileHitbox.y = p.y +p.height/3;
                    projectileHitbox.height = p.height/3;
                    projectileHitbox.width /= 2;
                }
                else if (p.dx < -0.25) {
                    if (p.dy > 0.25) { // bottom left
                        p.frameY = 7;
                        projectileHitbox.y = p.y + p.height/2.5;
                    }
                    else { // top left
                        p.frameY = 1;
                        projectileHitbox.y = p.y + p.height/4;
                    }
                    projectileHitbox.x = p.x + 8;
                    projectileHitbox.height = p.height/3;
                    projectileHitbox.width /= 2;
                }
                else if (p.dx > -0.25) {
                    if (p.dy > 0.25) { // bottom right
                        p.frameY = 5;
                        projectileHitbox.y = p.y + p.height/2.5;
                    }
                    else { // top right
                        p.frameY = 3;
                        projectileHitbox.y = p.y + p.height/4;
                    }
                    projectileHitbox.x = p.x + 24;
                    projectileHitbox.height = p.height/3;
                    projectileHitbox.width /= 2;
                }

                if (collides(playerHitbox, projectileHitbox)) {
                    if (iFrames === 0 && !e.isDying) {
                        takeDamage();
                    }
                }
                let x = projectileHitbox.x;
                let y = projectileHitbox.y;
                let w = projectileHitbox.width;
                let h = projectileHitbox.height;

                // projectile reaches the edge
                if ((outOfBounds(x,y).includes("left")) || ((outOfBounds(x,y+h).includes("down"))) || 
                    (outOfBounds(x,y).includes("up")) || ((outOfBounds(x+w,y).includes("right")))) {
                    for (let e of enemies) {
                        // relate projectile to the enemy that fired it, delay between each fire, can't fire while moving
                        if (e.id === p.id && p.delay === 0 && !(e.moveUp || e.moveLeft || e.moveDown || e.moveRight)) {
                            p.x = e.x;
                            p.y = e.y;
                            p.hasFired = false;
                            e.canFire = false;
                            p.delay = projectileDelay
                            break;
                        }
                    }
                }
                else {
                    for (let e of enemies) {
                        if (e.id === p.id) {
                            p.frameX = (p.frameX + 1) % enemyInfo[e.type]["projectileAnimationFrames"];
                            context.drawImage(enemyInfo[e.type]["projectile"], 
                                p.frameX*p.width, p.frameY*p.height, p.width, p.height,
                                p.x, p.y, p.width, p.height)
                            break;
                        }
                    }
                }
            }
        }
    }
}

function calculateDirection(fromX, fromY, toX, toY) {
    let dx = toX - fromX;
    let dy = toY - fromY;
    
    let length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;
    
    return { dx, dy };
}

function takeDamage() {
    if (!player.isCheating) {
        if (player.health > 0) {
            iFrames = iFrameMax;
            player.health--;
            healthBar.frame ++;
            player.isHit = true;
        }
    }
}

function playerStats() {
    context.drawImage(playerHealthBarImage, 0, healthBar.frame*healthBar.height, healthBar.width, healthBar.height,
        player.x, player.y-14, healthBar.width, healthBar.height);

    context.drawImage(playerStaminaBarImage, 0, staminaBar.frame*staminaBar.height, staminaBar.width, staminaBar.height,
        player.x, player.y, staminaBar.width, staminaBar.height);

    if (player.isHit) {
        context.drawImage(damageImage, 0, 0, 24, 16,
            player.x+player.width/3, player.y-32, 24, 16);
    }
    
    if (player.hitFrameCounter === 15) {
        player.isHit = false;
        player.hitFrameCounter = 0;
    }
    else if (player.isHit) {
        player.hitFrameCounter ++;
    }
    
    // "score:"
    context.drawImage(scoreDisplay, 0, 0, score.width, score.height,
        canvas.width-2*score.width, canvas.height-score.height, score.width, score.height);

    // ones digit
    score.oneFrame = player.score % 10
    context.drawImage(scoreDisplayNums, score.oneFrame*score.numSize, 0, score.numSize, score.numSize,
        canvas.width-2*score.width+(score.width+2*score.numSize)-16, canvas.height-score.numSize, score.numSize, score.numSize);
    
    // tens digit
    score.tensFrame = Math.floor((player.score%100)/10)
    context.drawImage(scoreDisplayNums, score.tensFrame*score.numSize, 0, score.numSize, score.numSize,
        canvas.width-2*score.width+(score.width+score.numSize)-8, canvas.height-score.numSize, score.numSize, score.numSize);

    // hundreds digit
    score.hundredsFrame = Math.floor(player.score/100)
    context.drawImage(scoreDisplayNums, score.hundredsFrame*score.numSize, 0, score.numSize, score.numSize,
        canvas.width-2*score.width+score.width, canvas.height-score.height, score.numSize, score.numSize);

    if (iFrames > 0) iFrames -= 1;

    if (player.health === 0) {
        context.drawImage(deathScreen, 0, 0, 368, 64,
            canvas.width/2-184, canvas.height/2-32, 368, 64)
        stop();
        return;
    }
}



// ------------------------------------- \\



function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft" || key === "a" || key === "A" ||
        key === "ArrowRight" || key === "d" || key === "D" ||
        key === "ArrowUp" || key === "w" || key === "W" ||
        key === "ArrowDown" || key === "s" || key === "S" ||
        key === "Shift") {
        event.preventDefault();
    }

    if ((key === "ArrowLeft" || key === "a" || key === "A")) {
        moveLeft = true;
    }
    if ((key === "ArrowRight" || key === "d" || key === "D")) {
        moveRight = true;
    }
    if ((key === "ArrowUp" || key === "w" || key === "W")) {
        moveUp = true;
    }
    if ((key === "ArrowDown" || key === "s" || key === "S")) {
        moveDown = true;
    }
    if (key === "Shift" && (moveUp || moveLeft || moveDown || moveRight)) {
        if (player.stamina === 0) {
            player.isSprinting = false;
        }
        else {
            player.isSprinting = true;
        }
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft" || key === "a" || key === "A") {
        moveLeft = false;
    }
    if (key === "ArrowRight" || key === "d" || key === "D") {
        moveRight = false;
    }
    if (key === "ArrowUp" || key === "w" || key === "W") {
        moveUp = false;
    }
    if (key === "ArrowDown" || key === "s" || key === "S") {
        moveDown = false;
    }
    if (key === "Shift") {
        player.isSprinting = false;
    }
}

function collides(obj1, obj2) {
    if (obj1.x + obj1.size < obj2.x || 
        obj2.x + obj2.size < obj1.x || 
        obj1.y > obj2.y + obj2.size || 
        obj2.y > obj1.y + obj1.size) {
            return false;
    } 
    else if (obj1.x + obj1.width < obj2.x || 
        obj2.x + obj2.width < obj1.x || 
        obj1.y > obj2.y + obj2.height || 
        obj2.y > obj1.y + obj1.height) {
            return false;
    }
    return true;
}

function stop(outcome_txt) {
    window.removeEventListener("keydown", activate, false);
    window.cancelAnimationFrame(request_id);

    // let play = document.querySelector("#play > a");
    // play.innerHTML = "Play Again";

    // let outcome_element = document.querySelector("#outcome");
    // outcome_element.innerHTML = outcome_txt;
}

function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function load_assets(assets, callback) {
    let num_assets = assets.length;
    let loaded = function() {
        console.log("loaded");
        num_assets = num_assets - 1;
        if (num_assets === 0) {
            callback();
        }
    };
    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement) {
            console.log("img");
            element.addEventListener("load", loaded, false);
        }
        else if (element instanceof HTMLAudioElement) {
            console.log("audio");
            element.addEventListener("canplaythrough", loaded, false);
        }
        element.src = asset.url;
    }
}


function createObstacles() {
    while (obstacles.length < obstaclesAmount) {
        let isValid = true;
        let obX = randint(squareSize, canvas.width - 2*squareSize);
        let obY = randint(squareSize, canvas.height - 2*squareSize);

        if (!(obX % squareSize === 0)) {
            obX = (Math.round(obX / squareSize) * squareSize) + 1;
        } else {
            obX++;
        }
        if (!(obY % squareSize === 0)) {
            obY = (Math.round(obY / squareSize) * squareSize) + 1;
        } else {
            obY++;
        }

        for (let b of body) { // ensure obstacle doesnt spawn inside player
            if ((obX + 1 === b.x && obY + 1 === b.y)) {
                isValid = false;
                break;
            }
        }

        // obstacles cant spawn near player
        if ((player.x - 3*squareSize <= obX && player.x + 3*squareSize >= obX) && 
            (player.y - 3*squareSize <= obY && player.y + 3*squareSize >= obY)) {
            isValid = false;
            break;
        }

        // obstacles cant spawn near each other
        for (let o of obstacles) {
            if ((obX - 2*squareSize <= o.x && obX + 2*squareSize >= o.x) && 
                    (obY - 2*squareSize <= o.y && obY + 2*squareSize >= o.y))  {
            isValid = false;
            break;
            }
        }   

        if (isValid) {
            let numSides = randint(1, 4);
            let i = 0;
            
            let baseObX = obX;
            let baseObY = obY;
            
            // Add the initial obstacle
            let initialOb = { x: obX, y: obY, size: squareSize };
            obstacles.push(initialOb);
            
            while (i < numSides) {
                let side = randint(1, 4);
                
                let newObX = baseObX;
                let newObY = baseObY;
                
                if (side === 1) {
                    newObX += xChange;
                } else if (side === 2) {
                    newObX -= xChange;
                } else if (side === 3) {
                    newObY += yChange;
                } else if (side === 4) {
                    newObY -= yChange;
                }
                // obstacle out of bounds
                if (newObX + squareSize > canvas.width - squareSize ||
                    newObY + squareSize > canvas.height - squareSize ||
                    newObX < squareSize ||
                    newObY < squareSize) {
                    
                    continue;
                }
                
                i++;
                
                let o = { x: newObX, y: newObY, size: squareSize };
                
                obstacles.push(o);
            }
        }
    }

    context.fillStyle = "cyan";
    for (let o of obstacles) {
        context.fillRect(o.x, o.y, o.size, o.size);

        if (collides(player, o)) {
            stop("YOU LOSE");
            return;
        }
    }
}

function handleFood() {
    while (food.length < 1) {
        let isValid = true;

        // max is canvas.width-100 - squareSize rather than canvas.width-100 so the food cant spawn in the borders
        let foodX = randint(squareSize, canvas.width - 2*squareSize);
        let foodY = randint(squareSize, canvas.height - 2*squareSize);

        if (!(foodX % squareSize === 0)) {
            // convert food spawns to a sort of 'grid', they'll always align with the player
            foodX = (Math.round(foodX / squareSize) * squareSize) + 1;
        } else {
            foodX++;
        }
        if (!(foodY % squareSize === 0)) {
            foodY = (Math.round(foodY / squareSize) * squareSize) + 1;
        } else {
            foodY++;
        }

        for (let b of body) { // food cant spawn in player
            if (foodX + 1 === b.x && foodY + 1 === b.y) {
                isValid = false;
                break;
            }
        }
    
        // food cant spawn in obstacles
        for (let o of obstacles) {
            if (foodX === o.x && foodY === o.y) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            let f = { x: foodX, y: foodY, size: squareSize };
            food.push(f);
        }
    }

    context.fillStyle = "red";
    for (let f of food) {
        context.fillRect(f.x, f.y, f.size, f.size);

        if (collides(player, f)) {
            food.pop(f);
            foodQueue += foodMultiplier;
        }
    }
}