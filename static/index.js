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

let player = {
    score: 0,
    health: 5,
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
}

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

let playerWalk = new Image();
let playerSlash = new Image();
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
let mageWalk = new Image();
let mageCast = new Image();
let mageDead = new Image();

let fireball = new Image();
let icicle = new Image();

let map = new Image();

let xChange, yChange, squareSize;
xChange = yChange = squareSize = 20;

let food = []; 
let foodMultiplier = 5;
let foodQueue = 0; // add food one at a time

let obstacles = [];
let obstaclesAmount = 50;

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
    "mage" : {
        "amount": 0,
        "maxHealth": 2,
        "canKnockback": true,
        "attackType": "range",
        "maxProjectiles": 1
    },
}

let enemyTypes = Object.keys(enemyInfo)

let enemyImages = {
    "skeleton":{
        "walk" : skeletonWalk,
        "slash" : skeletonSlash,
        "dead" : skeletonDead,
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

let enemyId = 0;

let moveLeft, moveRight, moveUp, moveDown;
moveLeft = moveRight = moveUp = moveDown = false;

let faceLeft, faceRight, faceUp, faceDown;
faceLeft = faceRight = faceUp = faceDown = false;

let clickX = 0;
let clickY = 0;
let hasNewClick = false;

let projectileDelay = 60; 


document.addEventListener("DOMContentLoaded", init, false);


function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);
    // disable right click
    window.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });

    player.x = canvas.width-96
    player.y = canvas.height-192

    load_assets([
        {"var": playerWalk, "url": "../static/images/player_animations/CHARACTER_WALK.png"},
        {"var": playerSlash, "url": "../static/images/player_animations/CHARACTER_SLASH.png"},
        {"var": attackUp, "url": "../static/images/player_attack/ATTACK_UP.png"},
        {"var": attackDown, "url": "../static/images/player_attack/ATTACK_DOWN.png"},
        {"var": attackLeft, "url": "../static/images/player_attack/ATTACK_LEFT.png"},
        {"var": attackRight, "url": "../static/images/player_attack/ATTACK_RIGHT.png"},
        {"var": skeletonWalk, "url": "../static/images/enemies/skeleton/SKELETON_WALK.png"},
        {"var": skeletonSlash, "url": "../static/images/enemies/skeleton/SKELETON_SLASH.png"},
        {"var": skeletonDead, "url": "../static/images/enemies/skeleton/SKELETON_DEAD.png"},
        {"var": mageWalk, "url": "../static/images/enemies/mage/MAGE_WALK.png"},
        {"var": mageCast, "url": "../static/images/enemies/mage/MAGE_CAST.png"},
        {"var": mageDead, "url": "../static/images/enemies/mage/MAGE_DEAD.png"},
        {"var": fireball, "url": "../static/images/enemies/mage/FIREBALL.png"},
        {"var": icicle, "url": "../static/images/enemies/mage/ICICLE.png"},
        {"var": playerHealthBarImage, "url": "../static/images/stats/PLAYER_HEALTHBAR.png"},
        {"var": playerStaminaBarImage, "url": "../static/images/stats/STAMINA_BAR.png"},
        {"var": enemyHealthBarImage, "url": "../static/images/stats/ENEMY_HEALTHBAR.png"},
        {"var": scoreDisplay, "url": "../static/images/stats/SCORE_DISPLAY.png"},
        {"var": scoreDisplayNums, "url": "../static/images/stats/SCORE_DISPLAY_NUMS.png"},
        {"var": deathScreen, "url": "../static/images/stats/DEATH_SCREEN.png"},
        {"var": backgroundImage, "url": "../static/images/tiles.png"},
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

    if (enemiesPerLevel > 0 ) {
        createEnemies();
    }
    
    // draw player 
    if (! player.isAttacking) {
        context.drawImage(playerWalk, player.frameX*player.width, player.frameY*player.height, player.width, player.height,
                        player.x, player.y, player.width, player.height);
    }

    handleAttacking();

    handleEnemyAttacking();

    drawEnemies();
    
    handleProjectiles();
    
    moveEnemies();

    movePlayer(); 

    playerStats();
}

function movePlayer() {
    playerHitbox = {
        x: player.x+16, 
        y: player.y+12, 
        width: player.width/2, 
        height: player.height-12
    }

    if ((moveLeft || moveRight) && !(moveLeft && moveRight) || (moveUp || moveDown) && !(moveUp && moveDown)) {
        moveCounter ++
        if (moveCounter === 2) {
            moveCounter = 0;
            player.frameX = (player.frameX + 1) % 4;
        }
    }

    if ( !(moveLeft && moveRight) || !(moveUp && moveDown)) {
        if (moveUp && !(playerHitbox.y === 0)) {
            player.y -= player.yChange;
            player.frameY = 0;
        }
        if (moveLeft && !(playerHitbox.x === 0)) {
            player.x -= player.xChange;
            player.frameY = 1;
        }
        if (moveDown && !(playerHitbox.y + playerHitbox.width >= canvas.height)) {
            player.y += player.yChange;
            player.frameY = 2;
        }
        if (moveRight && !(playerHitbox.x + playerHitbox.width >= canvas.width)) {
            player.x += player.xChange;
            player.frameY = 3;
        }
    }
    
    if (!(moveLeft || moveRight || moveUp || moveDown)) {
        player.frameX = 0;
    }

    if (player.isSprinting) {
        if (player.stamina > 0 && player.xChange < 12) {
            player.xChange += 1;
            player.yChange += 1;
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

function handleAttacking() {
    window.addEventListener("click", attack, false);
    if (player.isAttacking) {
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
                swordAnimation.frameX ++
            }
            else {
                if (swordAnimation.frameY === 0) {
                    swordAnimation.frameX = 0;
                    swordAnimation.frameY ++
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
                    
                    // prevent enemies from being knocked out of bounds
                    if (e.x + enemyHitbox.width >= canvas.width) { // right border
                        e.x = canvas.width - enemyHitbox.width;
                    }
                    else if (e.x + enemyHitbox.width/2 <= 0) { // left border
                        e.x = -enemyHitbox.width/2;
                    }
                    else if (e.y + enemyHitbox.height >= canvas.height) { // bottom border
                        e.y = canvas.height - enemyHitbox.height;
                    }
                    else if (e.y + enemyHitbox.height/2 <= 0) { // top border
                        e.y = -enemyHitbox.height/2;
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
    
    // kill enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        if (e.isDying) {
            e.deathCounter++;
            if (e.deathCounter === 5) {
                e.deathCounter = 0;
                e.deathFrame++;
                if (e.deathFrame === 6) {
                    // remove projectile associated with enemy
                    for (let p of projectiles) {
                        if (e.id === p.id) {
                            projectiles.splice(projectiles.indexOf(p), 1)
                        }
                    }
                    enemies.splice(i, 1);
                    if (enemyInfo[e.type]["attackType"] === "range"){
                        totalProjectiles -= enemyInfo[e.type]["maxProjectiles"];
                    }
                }
            }
        }
    }
}

function attack() {
    if (!player.isAttacking) {
        player.isAttacking = true;
    }
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
                    e.canFire = true;
                    e.projectileCounter = 0
                    totalProjectiles += enemyInfo[e.type]["maxProjectiles"];
                }
                
                e.x = randint(0, canvas.width-e.width)
                e.y = randint(0, canvas.height-e.width)

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
            context.drawImage(enemyImages[e.type]["slash"], e.frameX*e.width, e.frameY*e.height, e.width, e.height,
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
            if (distanceX <= player.width*4 && distanceY <= player.height*2) {
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
                    e.frameX++;
                    
                    if (e.frameX === 6 && collides(playerHitbox, enemySwordHitbox)) {
                        if (iFrames === 0) {
                            takeDamage();
                        }
                    }
                    
                    if (e.frameX === 6) {
                        e.isAttacking = false;
                        e.frameX = 0;
                    }
                }
            }
            else if (enemyInfo[e.type]["attackType"] === "range") {
                if ((projectiles.length < totalProjectiles) && (e.projectileCounter < enemyInfo[e.type]["maxProjectiles"])) {
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

                e.attackCounter++;
                if (e.attackCounter >= 5) {
                    e.attackCounter = 0;
                    e.frameX++;
                    
                    if (e.frameX === 6) {
                        e.isAttacking = false;
                        e.frameX = 0;
                    }
                }
            }
        }
    }
}

function handleProjectiles() {
    for (let p of projectiles) {
        if (p.delay != 0) {
            p.delay --
        }
        

        // let hitbox = {
        //     x: p.x,
        //     y: p.y +p.height/4,
        //     width: p.width,
        //     height: p.height/2
        // }

        let projectileHitbox = {
            x: p.x,
            y: p.y,
            width: p.width,
            height: p.height
        }

        p.frameX = (p.frameX + 1) % 8;
        
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
            if (iFrames === 0) {
                takeDamage();
            }
        }
        
        // projectile reaches the edge 
        if ((projectileHitbox.y <= 0) || (projectileHitbox.y + projectileHitbox.height >= canvas.height) || 
            (projectileHitbox.x <= 0) || (projectileHitbox.x + projectileHitbox.width >= canvas.width)) {
            for (let e of enemies) {
                // relate projectile to the enemy that fired it, delay between each fire, can't fire while moving
                if (e.id === p.id && p.delay === 0 && !(e.moveUp || e.moveLeft || e.moveDown || e.moveRight)) {
                    p.x = e.x;
                    p.y = e.y;
                    p.hasFired = false;
                    p.delay = projectileDelay
                    break;
                }
            }
        }
        
        context.drawImage(fireball, 
            p.frameX*p.width, p.frameY*p.height, p.width, p.height,
            p.x, p.y, p.width, p.height)
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
    if (player.health > 0) {
        iFrames = iFrameMax;
        player.health--;
        healthBar.frame ++;
    }
}

function playerStats() {
    context.drawImage(playerHealthBarImage, 0, healthBar.frame*healthBar.height, healthBar.width, healthBar.height,
        player.x, player.y-14, healthBar.width, healthBar.height);

    context.drawImage(playerStaminaBarImage, 0, staminaBar.frame*staminaBar.height, staminaBar.width, staminaBar.height,
        player.x, player.y, staminaBar.width, staminaBar.height);
    
    // "score:"
    context.drawImage(scoreDisplay, 0, 0, score.width, score.height,
        0, canvas.height-score.height, score.width, score.height);

    // ones digit
    score.oneFrame = player.score % 10
    context.drawImage(scoreDisplayNums, score.oneFrame*score.numSize, 0, score.numSize, score.numSize,
        (score.width+2*score.numSize)-16, canvas.height-score.numSize, score.numSize, score.numSize);
    
    // tens digit
    score.tensFrame = Math.floor((player.score%100)/10)
    context.drawImage(scoreDisplayNums, score.tensFrame*score.numSize, 0, score.numSize, score.numSize,
        (score.width+score.numSize)-8, canvas.height-score.numSize, score.numSize, score.numSize);

    // hundreds digit
    score.hundredsFrame = Math.floor(player.score/100)
    context.drawImage(scoreDisplayNums, score.hundredsFrame*score.numSize, 0, score.numSize, score.numSize,
        score.width, canvas.height-score.height, score.numSize, score.numSize);

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