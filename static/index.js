import levels from './levels.js';
let currentLevel = 1;
let currentLevelIndex = currentLevel - 1;

let canvas;
let context;
let fpsInterval = 1000 / 30; // the denominator is frames-per-second
let now;
let then = Date.now();
let request_id;
let isPaused = false;

let hasCheated = false;

let xChange, yChange, squareSize;
xChange = yChange = squareSize = 24;

let iFrames = 0;
let iFrameMax = 45;

let door1 = [176, 177, 184, 185];
let door2 = [176, 177, 184, 185];

let door1_0;
let door1_1;
let door1_2;
let door1_3;

let door2_0;
let door2_1;
let door2_2;
let door2_3;

let doorsOpened = false;

function openDoor(arr) {
    return arr.map(value => value + 2);
}

let tilesPerRow = 8;
let tileSize = 32;
let backgroundImage = new Image();

let maxPlayerHealth = 5;
let maxPlayerStam = 5;
let player = {
    score: 0,
    health: maxPlayerHealth,
    damage: 2,
    bowDamage: 1,
    stamina: maxPlayerStam*10,
    x: 64,
    y: 64,
    width: 64,
    height: 64,
    frameX: 0,
    frameY: 2,
    xChange: 8,
    yChange: 8,
    swordFrame: 0,
    bowFrame: 0,
    bowFrameCounter: 0,
    attackFrameCounter: 0,
    isAttacking: false,
    isSprinting: false,
    isKilling: false,
    isHit: false,
    hitFrameCounter: 0,
    isHealing: false,
    isCheating: false,
    moveFrameCounter: 0,
    healthGainFrameCounter: 0,
    hasPowerup: false,
}

let moveLeft, moveRight, moveUp, moveDown;
moveLeft = moveRight = moveUp = moveDown = false;

let playerHitbox = {
    x: 0, 
    y: 0, 
    width: player.width/2, 
    height: player.height-12
}

let playerHealthBar = {
    x: player.x,
    y: player.y,
    width: 64,
    height: 16,
    frameX: 0,
    frameY: 5,
}

let staminaBar = {
    x: player.x,
    y: player.y + 16,
    width: 64,
    height: 16,
    frameX: 0,
    frameY: maxPlayerStam,
    max: maxPlayerStam*10,
    frameCounter: 0,
}

let maxPotionUses = 1;
let toolbar = {
    width: 32,
    height: 32,
    frameX: 0,
    frameY: maxPotionUses,
}

let staminaFrameInterval = staminaBar.max / 5; // how often the stamina bar frame updates

let inventory = ["sword", "bow", "potion"];
let current_item = 0;
let showCurrentItem = false;
let showCurrentItemCounter = 0;
let playerProjectiles = [];
let clickX, clickY;

let swordAnimation = {
    frameX: 0,
    frameY: 0,
    frameCounter: 0,
    width: 96,
    height: 96,
}

let enemyProjectiles = [];
let projectileSpeed = 8;
let totalProjectiles = 0;

let playerWalk = new Image();
let playerAttack = new Image();
let playerBow = new Image();
let playerHealthBarImage = new Image();
let playerStaminaBarImage = new Image();

let attackUp = new Image();
let attackDown = new Image();
let attackLeft = new Image();
let attackRight = new Image();
let attackImage;

let skeletonWalk = new Image();
let skeletonAttack = new Image();
let skeletonDead = new Image();
let armoured_skeletonWalk = new Image();
let armoured_skeletonAttack = new Image();
let armoured_skeletonDead = new Image();
let archerWalk = new Image();
let archerAttack = new Image();
let archerDead = new Image();
let mageWalk = new Image();
let mageAttack = new Image();
let mageDead = new Image();
let paladinWalk = new Image();
let paladinAttack = new Image();
let paladinDead = new Image();
let bossWalk = new Image();
let bossAttack = new Image();
let bossDead = new Image();

let enemyHealthBarImage = new Image();

let arrowImage = new Image();
let fireball = new Image();
let icicle = new Image();

let damageImage = new Image();
let toolbarImage = new Image();
let healthGainImage = new Image();

let powerupImage = new Image();

let enemyImages = {
    "skeleton":{
        "walk" : skeletonWalk,
        "attack" : skeletonAttack,
        "dead" : skeletonDead,
    },
    "armoured_skeleton":{
        "walk" : armoured_skeletonWalk,
        "attack" : armoured_skeletonAttack,
        "dead" : armoured_skeletonDead,
    },
    "paladin":{
        "walk" : paladinWalk,
        "attack" : paladinAttack,
        "dead" : paladinDead,
    },
    "archer":{
        "walk" : archerWalk,
        "attack" : archerAttack,
        "dead" : archerDead,
    },
    "mage":{
        "walk" : mageWalk,
        "attack" : mageAttack,
        "dead" : mageDead,
    },
    "boss":{
        "walk" : bossWalk,
        "attack" : bossAttack,
        "dead" : bossDead,
    },
}

let enemyHealthBar = {
    width: 64,
    height: 16,
    frame: 10
}

let enemySpawnQueue = levels[currentLevelIndex]["enemySpawnQueue"];

let enemyId = 0;

let time = 0;
let timeFrameCounter = 30;
let timerElement;

let levelElement;
let powerupElement;
let powerupMessage = `POWERUP: NONE`;
let scoreElement;
let highscoreElement;
let cheatsElement;
let cheatStatus = 'OFF';
let cheatClass = 'red';
let endElement;

let currentMinute;
let currentSecond;

let controlsElement;
let startPauseElement;
let pauseElement;
let resultElement;
let levelComplete;

let spawn;
let exit;

document.addEventListener("DOMContentLoaded", init, false);


function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    levelElement = document.querySelector("#level");
    powerupElement = document.querySelector("#powerup");
    cheatsElement = document.querySelector("#cheats");
    scoreElement = document.querySelector("#score");
    timerElement = document.querySelector("#timer");
    highscoreElement = document.querySelector("#highscore");
    resultElement = document.querySelector("#result");
    endElement = document.querySelector("#end");
    startPauseElement = document.querySelector("#startPause")
    pauseElement = document.querySelector("#pause")
    controlsElement = document.querySelector("#controls")

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);
    window.addEventListener("keydown", handleInventory, false);
    window.addEventListener("keydown", enableCheats, false);
    window.addEventListener("keydown", handleKeyPress, false);

    // disable right click
    window.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });

    exit = {
        x: canvas.width/2-16,
        y: boundaryLocation()["down"],
        width: 32,
        height: 64,
    }

    spawn = {
        x: canvas.width/2-128,
        y: boundaryLocation()["up"],
        width: 256,
        height: 128,
    }

    player.x = canvas.width/2-32;
    player.y = 96;

    load_assets([
        {"var": playerWalk, "url": "static/images/player_animations/PLAYER_WALK.png"},
        {"var": playerAttack, "url": "static/images/player_animations/PLAYER_ATTACK.png"},
        {"var": playerBow, "url": "static/images/player_animations/PLAYER_BOW.png"},
        {"var": playerHealthBarImage, "url": "static/images/stats/PLAYER_HEALTHBAR.png"},
        {"var": playerStaminaBarImage, "url": "static/images/stats/STAMINA_BAR.png"},
        {"var": attackUp, "url": "static/images/player_attack/ATTACK_UP.png"},
        {"var": attackDown, "url": "static/images/player_attack/ATTACK_DOWN.png"},
        {"var": attackLeft, "url": "static/images/player_attack/ATTACK_LEFT.png"},
        {"var": attackRight, "url": "static/images/player_attack/ATTACK_RIGHT.png"},
        {"var": skeletonWalk, "url": "static/images/enemies/skeleton/SKELETON_WALK.png"},
        {"var": skeletonAttack, "url": "static/images/enemies/skeleton/SKELETON_ATTACK.png"},
        {"var": skeletonDead, "url": "static/images/enemies/skeleton/SKELETON_DEAD.png"},
        {"var": armoured_skeletonWalk, "url": "static/images/enemies/armoured_skeleton/ARMOURED_SKELETON_WALK.png"},
        {"var": armoured_skeletonAttack, "url": "static/images/enemies/armoured_skeleton/ARMOURED_SKELETON_ATTACK.png"},
        {"var": armoured_skeletonDead, "url": "static/images/enemies/armoured_skeleton/ARMOURED_SKELETON_DEAD.png"},
        {"var": archerWalk, "url": "static/images/enemies/archer/ARCHER_WALK.png"},
        {"var": archerAttack, "url": "static/images/enemies/archer/ARCHER_ATTACK.png"},
        {"var": archerDead, "url": "static/images/enemies/archer/ARCHER_DEAD.png"},
        {"var": mageWalk, "url": "static/images/enemies/mage/MAGE_WALK.png"},
        {"var": mageAttack, "url": "static/images/enemies/mage/MAGE_ATTACK.png"},
        {"var": mageDead, "url": "static/images/enemies/mage/MAGE_DEAD.png"},
        {"var": bossWalk, "url": "static/images/enemies/boss/BOSS_WALK.png"},
        {"var": bossAttack, "url": "static/images/enemies/boss/BOSS_ATTACK.png"},
        {"var": bossDead, "url": "static/images/enemies/boss/BOSS_DEAD.png"},
        {"var": paladinWalk, "url": "static/images/enemies/paladin/PALADIN_WALK.png"},
        {"var": paladinAttack, "url": "static/images/enemies/paladin/PALADIN_ATTACK.png"},
        {"var": paladinDead, "url": "static/images/enemies/paladin/PALADIN_DEAD.png"},
        {"var": enemyHealthBarImage, "url": "static/images/stats/ENEMY_HEALTHBAR.png"},
        {"var": arrowImage, "url": "static/images/enemies/archer/ARROW.png"},
        {"var": fireball, "url": "static/images/enemies/mage/FIREBALL.png"},
        {"var": icicle, "url": "static/images/enemies/mage/ICICLE.png"},
        {"var": backgroundImage, "url": "static/images/tiles.png"},
        {"var": damageImage, "url": "static/images/stats/DMG_NUMS.png"},
        {"var": toolbarImage, "url": "static/images/stats/TOOLBAR.png"},
        {"var": healthGainImage, "url": "static/images/stats/HEALTH_GAIN.png"},
        {"var": powerupImage, "url": "static/images/stats/POWERUPS.png"},
    ], draw)
    
    draw();
}

function draw() {
    if (!isPaused) {
        request_id = window.requestAnimationFrame(draw);
    }
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);

    levelComplete = (enemySpawnQueue.length === 0 && enemies.length === 0);

    displayMap();

    displayHUD()

    if (enemiesPerLevel > 0 && enemySpawnQueue.length !== 0) {
        createEnemies();
    }

    // draw player 
    if (! player.isAttacking) {
        context.drawImage(playerWalk, player.frameX*player.width, player.frameY*player.height, player.width, player.height,
                        player.x, player.y, player.width, player.height);
    }
    
    for (let e of enemies) { // enemies dont move until player moves certain distance (out of "spawn" area)
        if (!collides(player, spawn)) {
            e.canSpawn = true;
        }
    }

    handleAttacking();

    handleEnemyAttacking();

    drawEnemies();
    
    handleEnemyProjectiles();

    handleProjectiles();
    
    moveEnemies();

    movePlayer(); 

    playerStats();

    // createObstacles();

    createPowerups();

    handlePowerups();
    console.log(staminaBar.frameX)
}

function displayMap() {
    let background = [
        [171, 168, 170, 169, 169, 170, 168, 169, 168, 170, 169, 170, 170, 168, 169, 169, 170, 168, 169, 170, 168, 169, 170, 168, 169, 170, 168, 169, 170, 172],
        [149, 129, 130, 128, 129, 130, 128, 129, 130, 128, 129, 130, 128, 129, door1_0, door1_1, 129, 130, 128, 129, 130, 128, 129, 130, 128, 129, 130, 128, 129, 148],
        [157, 140, 141, 139, 140, 141, 139, 140, 141, 139, 140, 141, 139, 140, door1_2, door1_3, 140, 141, 139, 140, 141, 139, 140, 141, 139, 140, 141, 139, 140, 156],
        [165, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 50, 51, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 164],
        [149, 1, 1, 1, 1, 1, 1, 31, 28, 1, 1, 1, 1, 1, 50, 51, 1, 1, 1, 1, 7, 15, 1, 21, 1, 1, 1, 1, 1, 148],
        [157, 1, 21, 1, 1, 1, 1, 22, 31, 1, 1, 1, 1, 1, 60, 61, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 156],
        [165, 1, 1, 24, 1, 1, 1, 1, 60, 41, 48, 40, 48, 41, 56, 57, 48, 48, 40, 41, 41, 61, 1, 1, 1, 1, 1, 1, 1, 164],
        [149, 1, 1, 7, 1, 1, 1, 1, 48, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 49, 1, 1, 1, 1, 1, 1, 1, 148],
        [157, 1, 1, 1, 1, 1, 1, 1, 41, 1, 1, 1, 1, 1, 1, 12, 11, 1, 1, 1, 1, 40, 1, 1, 1, 1, 1, 1, 1, 156],
        [165, 49, 41, 48, 41, 40, 49, 48, 40, 1, 21, 1, 1, 1, 1, 13, 30, 1, 1, 1, 1, 40, 41, 49, 33, 41, 40, 48, 49, 164],
        [149, 1, 1, 1, 1, 1, 1, 1, 49, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 41, 15, 1, 1, 1, 1, 1, 1, 148],
        [157, 1, 1, 1, 1, 1, 1, 1, 33, 1, 1, 1, 1, 1, 1, 15, 1, 1, 1, 1, 1, 40, 1, 1, 1, 1, 1, 1, 1, 156],
        [165, 1, 1, 1, 1, 1, 1, 1, 57, 41, 48, 49, 40, 41, 61, 60, 48, 41, 40, 41, 40, 56, 23, 1, 1, 1, 1, 1, 1, 164],
        [149, 1, 7, 10, 1, 21, 1, 1, 1, 1, 1, 1, 1, 1, 57, 56, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 7, 8, 1, 148],
        [157, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 50, 51, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 11, 7, 156],
        [165, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 50, 51, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 164],
        [149, 133, 134, 135, 133, 134, 135, 133, 134, 135, 133, 134, 135, 133, door2_0, door2_1, 133, 134, 135, 133, 134, 135, 133, 134, 135, 133, 134, 135, 133, 148],
        [157, 141, 142, 143, 141, 142, 143, 141, 142, 143, 141, 142, 143, 141, door2_2, door2_3, 141, 142, 143, 141, 142, 143, 141, 142, 143, 141, 142, 143, 141, 156],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ]

    door1_0 = door1[0];
    door1_1 = door1[1];
    door1_2 = door1[2];
    door1_3 = door1[3];
    door2_0 = door2[0];
    door2_1 = door2[1];
    door2_2 = door2[2];
    door2_3 = door2[3];

    // background
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
    
    if (levelComplete) {
        endOfLevel();
    }
}

function endOfLevel() {
    if (currentLevel === 5) {
        resultElement.innerHTML = "YOU WON"
        resultElement.className = "green"
        stop();
        return
    }
    if (!doorsOpened) {
        doorsOpened = true;
        door2 = openDoor(door2);
    }
    if (collides(player, exit)) {
        updateLevel();
        player.x = canvas.width/2 -32;
        player.y = 64;
        levelComplete = false;
    }
}

function updateLevel() {
    maxPotionUses++;
    toolbar.frameY = maxPotionUses;

    maxPlayerHealth ++;
    playerHealthBar.frameX ++;
    player.health = playerHealthBar.frameY = maxPlayerHealth;

    
    maxPlayerStam ++;
    staminaBar.frameX ++;
    player.stamina = maxPlayerStam*10;
    staminaBar.frameY = maxPlayerStam
    
    currentLevel ++;
    player.score += 100;
    enemySpawnQueue = levels[currentLevelIndex]["enemySpawnQueue"];
}

function boundaryLocation() {
    let leftBoundary = 32;
    let rightBoundary = canvas.width-32;
    let upBoundary = 52;
    let downBoundary = canvas.height-132;
    let boundaryValues = {
        "left": leftBoundary, 
        "right": rightBoundary,
        "up": upBoundary,
        "down": downBoundary
    };

    return boundaryValues;
}

function outOfBounds(x, y) {
    let leftBoundary = 32;
    let rightBoundary = canvas.width-32;
    let upBoundary = 52;
    let downBoundary = canvas.height-132;
    let boundaries = [];

    if (x <= leftBoundary) {
        boundaries.push("left");
    }
    if (x >= rightBoundary) {
        boundaries.push("right");
    }
    if (y <= upBoundary) {
        boundaries.push("up");
    }
    if (y >= downBoundary) {
        boundaries.push("down");
    }
    
    if (boundaries.length === 0) {
        return "false";
    }
    return boundaries;
}

function displayHUD() {
    if (timeFrameCounter === 0) {
        time ++;
        timeFrameCounter = 30;
    }
    else {
        timeFrameCounter --;
    }

    levelElement.innerHTML = `LEVEL ${currentLevel}`

    powerupElement.innerHTML = powerupMessage;

    cheatsElement.innerHTML = `CHEATS: ${cheatStatus}`;
    cheatsElement.className = cheatClass;

    scoreElement.innerHTML = `SCORE: ${player.score}`;

    currentMinute = Math.floor(time/60);
    currentSecond = time % 60;
    currentSecond = ('0'+currentSecond).slice(-2);
    timerElement.innerHTML = `${currentMinute}:${currentSecond}`;

    highscoreElement.innerHTML = `HIGHSCORE: ${highscore_value}`;

    context.drawImage(toolbarImage, 0, toolbar.frameY*32, 96, 32,
        0, canvas.height-32, 96, 32)

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
            cheatStatus = 'ON';
            cheatClass = 'green';
        }
        else {
            player.isCheating = false;
            cheatStatus = 'OFF';
            cheatClass = 'red';
        }
    }
}

function handleKeyPress(event) {
    let key = event.key
    if (key === 'b' || key === 'B') {
        togglePause();
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

function togglePause() {
    isPaused = !isPaused;
     
    if (!isPaused) {
        startPauseElement.className = "";
        pauseElement.className = "hide";
        controlsElement.className = "hide";
        draw();
    }
    else {
        startPauseElement.className = "hide";
        pauseElement.className = "";
        controlsElement.className = "";
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
        player.moveFrameCounter ++;
        if (player.moveFrameCounter === 2) {
            player.moveFrameCounter = 0;
            player.frameX = (player.frameX + 1) % 4;
        }
    }
    
    if ( !(moveLeft && moveRight) && !(moveUp && moveDown)) {
        if (moveLeft && !(outOfBounds(x, y).includes("left"))) {
            player.x -= player.xChange;
            player.frameY = 1;
        }
        if (moveRight && !(outOfBounds(x+w, y).includes("right"))) {
            player.x += player.xChange;
            player.frameY = 3;
        }
        if (moveUp && !(outOfBounds(x, y).includes("up"))) {
            player.y -= player.yChange;
            player.frameY = 0;
        }
        if (moveDown && !(outOfBounds(x, y+h).includes("down"))) {
            player.y += player.yChange;
            player.frameY = 2;
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
            if (player.stamina % staminaFrameInterval === 0 && staminaBar.frameY > 0) {
                staminaBar.frameY --;
            }
        }
        else if (player.stamina > 0) {
            player.stamina --;
            if (player.stamina % staminaFrameInterval === 0 && staminaBar.frameY > 0) {
                staminaBar.frameY --;
            }
        }
        else {
            player.isSprinting = false;
        }
    }
        
    if (! player.isSprinting) {
        if (!powerupSpeed) {
            if (player.xChange > 8) {
                player.xChange -= 1;
                player.yChange -= 1;
            }
        }

        if (player.stamina < staminaBar.max) {
            if (staminaBar.frameCounter === 5) {
                player.stamina ++;
                if (staminaBar.frameY < maxPlayerStam && player.stamina % staminaFrameInterval === 0) {
                    staminaBar.frameY ++;
                }
                staminaBar.frameCounter = 0;
            }
            else {
                staminaBar.frameCounter ++;
            }
        }
    }

}

function handleAttacking() {
    window.addEventListener("click", attack, false);
    if (player.isAttacking) {
        moveUp = moveLeft = moveDown = moveRight = false;
        player.isSprinting = false;
        if (inventory[current_item] === "sword") {
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

            // sword attack animation
            if (swordAnimation.frameCounter === 1) {
                swordAnimation.frameCounter = 0;
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
                swordAnimation.frameCounter++;
            }
                
            context.drawImage(playerAttack, player.swordFrame*player.width, player.frameY*player.height, player.width, player.height,
                player.x, player.y, player.width, player.height);

            player.attackFrameCounter ++;
            if (player.attackFrameCounter === 3) { 
                player.swordFrame ++;
                player.attackFrameCounter = 0;
            }
            
            for (let e of enemies) {
                if (collides(e, swordHitbox) && !e.isDying && e.canSpawn && !e.isSpawning) {
                    if (! e.isHit) {
                        if (player.swordFrame <= 3) {
                            e.health -= player.damage;
                            e.damageFrame = player.damage -1;
                        }
                        
                        if (e.health <= 0) {
                            e.isDying = true;
                            e.deathFrame = 0;
                            e.deathFrameCounter = 0;
                            player.score ++;
                        }
                        e.isHit = true;
                    }

                    else if (player.swordFrame <= 3 && e.isHit && enemyInfo[e.type]["canKnockback"]) {
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
                        
                        let w = e.enemyHitbox.width;
                        let h = e.enemyHitbox.height;

                        // prevent enemies from being knocked out of bounds
                        if (outOfBounds(e.x+w/2, e.y).includes("left")) {
                            e.x = boundaryLocation()["left"] - w/2;
                        }
                        if (outOfBounds(e.x+w, e.y).includes("right")) {
                            e.x = boundaryLocation()["right"] - w;
                        }
                        if (outOfBounds(e.x, e.y+h).includes("down")) {
                            e.y = boundaryLocation()["down"] - h;
                        }
                        if (outOfBounds(e.x, e.y+h/2).includes("up")) { // top border
                            e.y = boundaryLocation()["up"] - h/3;
                        }
                    }
                }
            }

            if (player.swordFrame === 6) {
                player.isAttacking = false;
                player.swordFrame = 0;
                for (let e of enemies) {
                    e.isHit = false;
                }
            }
        }
    
        else if (inventory[current_item] === "bow") {
            if (player.bowFrameCounter === 0) {
                player.bowFrame = (player.bowFrame +1) % 10;
                player.bowFrameCounter = 2;
            }
            player.bowFrameCounter --;
            context.drawImage(playerBow, player.bowFrame*player.width, player.frameY*player.height, 64, 64,
                player.x, player.y, 64, 64)
            if (player.bowFrame === 0) {
                let playerProjectile = {
                    x: player.x,
                    y: player.y,
                    width: 64,
                    height: 64,
                    dx: 0,
                    dy: 0,
                    hasFired: false,
                    frameX: 0,
                    frameY: 0,
                }
                playerProjectiles.push(playerProjectile)
                player.isAttacking = false;
                player.bowFrameCounter = 0;
            }
        }
        
        else if (inventory[current_item] === "potion") {
            context.drawImage(playerWalk, player.frameX*player.width, player.frameY*player.height, player.width, player.height,
                player.x, player.y, player.width, player.height);
            if (player.health < maxPlayerHealth && !player.isHealing && toolbar.frameY > 0) {
                player.health ++;
                playerHealthBar.frameY ++;
                player.isHealing = true;
                toolbar.frameY --;
            }

            if (player.isHealing) {
                moveUp = moveLeft = moveDown = moveRight = false;
                if (player.healthGainFrameCounter < 20) {
                    context.drawImage(healthGainImage, 0, 0, 24, 12,
                        player.x+player.width/3, player.y-32, 24, 12)
                    player.healthGainFrameCounter ++;
                    
                    context.drawImage(toolbarImage, 64, toolbar.frameY*32, toolbar.width, toolbar.height,
                        player.x+player.width/4, player.y+player.height, toolbar.width, toolbar.height);
                }
                else {
                    player.isHealing = false;
                    player.healthGainFrameCounter = 0;
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
            for (let p of enemyProjectiles) {
                if (e.id === p.id) {
                    enemyProjectiles.splice(enemyProjectiles.indexOf(p), 1)
                }
            }
            e.deathFrameCounter++;
            if (e.deathFrameCounter === 5) {
                e.deathFrameCounter = 0;
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

    for (let e of enemies) {
        if (e.isHit) {
            context.drawImage(damageImage, e.damageFrame*24, 0, 24, 16,
                e.x+e.width/3, e.y-16, 24, 16)
        }
    }
}

function handleProjectiles() {
    for (let p of playerProjectiles) {
        let projectileHitbox = {
            x: p.x,
            y: p.y,
            width: p.width,
            height: p.height
        }

        if (! p.hasFired) {
            projectileHitbox.x += 32
            projectileHitbox.y += 32
            
            let direction = calculateDirection(projectileHitbox.x, projectileHitbox.y, clickX, clickY);
            
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
                player.frameY = 2;
            }
            else { // up
                p.frameY = 2;
                projectileHitbox.y += projectileHitbox.height/6;
                player.frameY = 0;
            }
            projectileHitbox.x = p.x +p.width/3;
            projectileHitbox.width = p.width/3;
            projectileHitbox.height /= 2;
        }
        else if (-0.25 < p.dy && p.dy < 0.25) {
            if (p.dx > 0.9) { // right
                p.frameY = 4;
                projectileHitbox.x += projectileHitbox.width/2;
                player.frameY = 3;
            }
            else { // left
                p.frameY = 0;
                player.frameY = 1;
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
            player.frameY = 1;
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
            player.frameY = 3;
        }
        for (let e of enemies) {
            if (collides(projectileHitbox, e.enemyHitbox) && !e.isDying && e.canSpawn && !e.isSpawning) {
                e.health -= player.bowDamage;
                e.damageFrame = player.bowDamage -1;
                playerProjectiles.splice(playerProjectiles.indexOf(p), 1)
                e.isHit = true;
                if (e.health <= 0) {
                    e.isDying = true;
                    e.deathFrame = 0;
                    e.deathFrameCounter = 0;
                    player.score ++;
                }
                break;
            }
        }
    
        if (p.hasFired) {    
            let x = projectileHitbox.x;
            let y = projectileHitbox.y;
            let w = projectileHitbox.width;
            let h = projectileHitbox.height;
            
            // projectile reaches the edge
            if ((outOfBounds(x, y).includes("left")) || ((outOfBounds(x,y+h).includes("down"))) || 
                (outOfBounds(x, y).includes("up")) || ((outOfBounds(x+w,y).includes("right")))) {
                    playerProjectiles.splice(playerProjectiles.indexOf(p), 1)
                    projectileHitbox.x = player.x;
                    projectileHitbox.y = player.y;
                    projectileHitbox.hasFired = false;
            }
            else {
                p.frameX = (p.frameX + 1) % 2;
                context.drawImage(arrowImage, p.frameX*p.width, p.frameY*p.height, p.width, p.height,
                    p.x, p.y, p.width, p.height)
                }
            
        }
    }
}

function attack(event) {
    if (!player.isAttacking) {
        player.isAttacking = true;
    }
    
    let rect = canvas.getBoundingClientRect();
    clickX = event.clientX - rect.left;
    clickY = event.clientY - rect.top;
}

let enemiesPerLevel = 50;
let maxEnemiesAtOnce = 10;
let enemies = [];

// the order to spawn enemies
let enemyInfo = {
    "skeleton": {
        "maxHealth": 3,
        "speed": 4,
        "canKnockback": true,
        "attackType": "melee"
    },
    "armoured_skeleton": {
        "maxHealth": 6,
        "speed": 6,
        "canKnockback": true,
        "attackType": "melee"
    },
    "paladin": {
        "maxHealth": 10,
        "speed": 8,
        "canKnockback": true,
        "attackType": "melee"
    },
    "archer": {
        "maxHealth": 3,
        "speed": 4,
        "attackDistance": 4,
        "canKnockback": true,
        "attackType": "range",
        "maxProjectiles": 1,
        "projectile": arrowImage,
        "attackAnimationFrames": 13,
        "projectileAnimationFrames": 2,
        "delay": 60,
    },
    "mage": {
        "maxHealth": 5,
        "speed": 6,
        "attackDistance": 6,
        "canKnockback": true,
        "attackType": "range",
        "maxProjectiles": 2,
        "projectile": fireball,
        "attackAnimationFrames": 7,
        "projectileAnimationFrames": 8,
        "delay": 30
    },
    "boss": {
        "maxHealth": 50,
        "speed": 6,
        "attackDistance": 8,
        "canKnockback": false,
        "attackType": "range",
        "maxProjectiles": 3,
        "projectile": icicle,
        "attackAnimationFrames": 7,
        "projectileAnimationFrames": 8,
        "delay": 15
    },
}

let breakCheck;
function createEnemies() {
    breakCheck = false;
    while (enemies.length < maxEnemiesAtOnce) {
        if (enemySpawnQueue.length === 0) break;
        let nextSpawn = enemySpawnQueue[0]

            let type; // which enemy to spawn
            let amount; // how many to spawn 

            // separating string into type and amount e.g. "mage 2" -> type="mage", "amount"=2
            // if there is a space that means the digit is only 1 character long, so slice the last character
            if ((nextSpawn.slice(-2)).includes(" ")) { 
                amount = nextSpawn.slice(-1);
                type = nextSpawn.slice(0, -2);
            }
            else { // otherwise slice the last 2 characters for a two digit number
                amount = nextSpawn.slice(-2);
                type = nextSpawn.slice(0, -3);
            }
            amount = Number(amount);
            let initialAmount = amount;

        for (amount; amount > 0; amount --) {
            let isValid = false;
            let e = {
                type: type,
                health: enemyInfo[type]["maxHealth"],
                x: 0,
                y: 0, 
                width: 64,
                height: 64,
                xChange: enemyInfo[type]["speed"],
                yChange: enemyInfo[type]["speed"],
                frameX: 0,
                frameY: 0,
                attackFrameX: 0,
                attackFrameY: 0,
                moveUp: false,
                moveLeft: false,
                moveDown: false,
                moveRight: false,
                moveFrameCounter: 0,
                isAttacking: false,
                attackFrameCounter: 0,
                isDying: false,
                deathFrame: 0,
                deathFrameCounter: 0,
                isSpawning: true,
                spawnFrame: 5,
                spawnFrameCounter: 0,
                isHit: false,
                hitFrameCounter: 0,
                damageFrame: -1,
                canSpawn: false,
            }
            
            e.enemyHitbox = {
                x: e.x+16, 
                y: e.y+12, 
                width: e.width/2, 
                height: e.height-12
            }

            if (enemyInfo[e.type]["attackType"] === "range") {
                // e.canFire = false;
                e.projectileCounter = 0;
                totalProjectiles += enemyInfo[e.type]["maxProjectiles"];
            }
            
            e.id = enemyId;
            enemyId ++;

            e.x = randint(boundaryLocation()["left"]*8, boundaryLocation()["right"]-e.width);
            e.y = randint(boundaryLocation()["up"]*4, boundaryLocation()["down"]-e.height);

            // convert co-ordinates to multiples of 4
            e.x = (e.x + (4 - e.x % 4));
            e.y = (e.y + (4 - e.y % 4));
            
            enemies.push(e);
            enemiesPerLevel --;

            if (enemies.length === maxEnemiesAtOnce) {
                // if (initialAmount === amount) {
                //     amount --;
                // }
                amount = amount.toString();
                enemySpawnQueue[0] = enemySpawnQueue[0].replace(initialAmount, amount-1)
                breakCheck = true;
                break;
            }

        }
        if (breakCheck) {
            break;
        }
        enemySpawnQueue.shift();
    }
}

function drawEnemies() {
    for (let e of enemies) {
        // spawn animation - the reverse of dying animation
        if (e.isSpawning) {
            e.moveUp = e.moveLeft = e.moveDown = e.moveRight = false;
            if (e.canSpawn) {
                e.spawnFrameCounter++;
            }
            if (e.spawnFrameCounter === 5) {
                e.spawnFrameCounter = 0;
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
            context.drawImage(enemyImages[e.type]["attack"], e.attackFrameX*e.width, e.frameY*e.height, e.width, e.height,
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
        e.enemyHitbox = {
            x: e.x+16, 
            y: e.y+12, 
            width: e.width/2, 
            height: e.height-12
        }
        
        if (e.isHit) {
            if (e.hitFrameCounter === 15) {
                e.isHit = false;
                e.hitFrameCounter = 0;
            }
            else {
                e.hitFrameCounter++;
            }
        }

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
            let playerX = player.width*enemyInfo[e.type]["attackDistance"];
            let playerY = player.height*enemyInfo[e.type]["attackDistance"]/2;
            if ((distanceX <= playerX && distanceY <= playerY)) {
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
        if (! e.isHit || !enemyInfo[e.type]["canKnockback"]) {
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
            e.moveFrameCounter ++
            if (e.moveFrameCounter === 2) {
                e.moveFrameCounter = 0;
                e.frameX = (e.frameX + 1) % 9;
            }
        }
    }
}
let j = 30;
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
                
                e.attackFrameCounter++;
                if (e.attackFrameCounter >= 5) {
                    e.attackFrameCounter = 0;
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
                e.attackFrameCounter++;
                if (e.attackFrameCounter >= 5) {
                    e.attackFrameCounter = 0;
                    e.attackFrameX++;
                    
                    if (e.attackFrameX === enemyInfo[e.type]["attackAnimationFrames"]) {
                        // e.canFire = true;
                        e.isAttacking = false;
                        e.attackFrameX = 0;
                    }
                }
                if ((enemyProjectiles.length < totalProjectiles) 
                    && (e.projectileCounter < enemyInfo[e.type]["maxProjectiles"]) && j === 0) {
                    let p = {
                        id: e.id,
                        hasFired: false,
                        delay: enemyInfo[e.type]["delay"],
                        x: e.x,
                        y: e.y,
                        width: 64,
                        height: 64,
                        frameX: 0,
                        frameY: 0,
                        canFire: true, 
                    }
                    enemyProjectiles.push(p);
                    e.projectileCounter ++;
                    j = 30;
                }
                else if (j > 0 ){
                    j--;
                }
            }
        }
    }
}

function handleEnemyProjectiles() {
    for (let p of enemyProjectiles) {
        for (let e of enemies) {
            if (p.delay > 0) {
                p.delay --;
            }
            else {
                p.canFire = true;
            }
            if (p.id === e.id && p.canFire) {

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
                if ((outOfBounds(x, y).includes("left")) || ((outOfBounds(x,y+h).includes("down"))) || 
                    (outOfBounds(x, y).includes("up")) || ((outOfBounds(x+w,y).includes("right")))) {
                    for (let e of enemies) {
                        // relate projectile to the enemy that fired it, delay between each fire, can't fire while moving
                        if (e.id === p.id && p.delay === 0 && !(e.moveUp || e.moveLeft || e.moveDown || e.moveRight)) {
                            p.x = e.x;
                            p.y = e.y;
                            p.hasFired = false;
                            p.canFire = false;
                            p.delay = enemyInfo[e.type]["delay"];
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
            else {
                if (p.id === e.id) {
                    p.x = e.x;
                    p.y = e.y;
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
    if (!player.isCheating && !powerupInvincibility) {
        if (player.health > 0) {
            iFrames = iFrameMax;
            player.health--;
            playerHealthBar.frameY --;
            player.isHit = true;
        }
    }
}

function playerStats() {
    context.drawImage(playerHealthBarImage, playerHealthBar.frameX*playerHealthBar.width, playerHealthBar.frameY*playerHealthBar.height, playerHealthBar.width, playerHealthBar.height,
        player.x, player.y-14, playerHealthBar.width, playerHealthBar.height);

    context.drawImage(playerStaminaBarImage, staminaBar.frameX*staminaBar.width, staminaBar.frameY*staminaBar.height, staminaBar.width, staminaBar.height,
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

    if (iFrames > 0) iFrames -= 1;

    if (player.health === 0) {
        resultElement.innerHTML = "YOU DIED"
        resultElement.className = "red"
        stop();
        return;
    }
}

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

let xhttp;
function stop() {
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keydown", handleKeyPress, false);
    window.cancelAnimationFrame(request_id);

    endElement.className = "";

    let data = new FormData();
    data.append("score", player.score);
    data.append("time", time);
    if (hasCheated) {
        hasCheated = 1;
    }
    else {
        hasCheated = 0;
    }
    data.append("cheats", hasCheated);

    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST", "/store_score", true);
    xhttp.send(data)
}

function handle_response() {
    if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
            if (xhttp.responseText === "success") {
                console.log("Yes");
            }
            else {
                console.log("No");
            }
        }
    }
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

let obstacles = [];
let obstaclesAmount = 5;

function createObstacles() {
    while (obstacles.length < obstaclesAmount) {
        let isValid = true;
        let obX = randint(boundaryLocation()["left"]*8, boundaryLocation()["right"]-2*squareSize);
        let obY = randint(boundaryLocation()["up"], boundaryLocation()["down"]-2*squareSize);

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
            let initialOb = {
                x: obX, 
                y: obY, 
                width: squareSize,
                height: squareSize
            };

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
                
                let o = { 
                    x: newObX, 
                    y: newObY, 
                    width: squareSize,
                    height: squareSize, 
                };
                
                obstacles.push(o);
            }
        }
    }

    context.fillStyle = "cyan";
    for (let o of obstacles) {
        context.fillRect(o.x, o.y, o.size, o.size);

        if (collides(player, o)) {
            if (iFrames === 0) {
                takeDamage();
            }
        }
    }
}

let powerups = [];
let powerupSpawnTimer = randint(15, 25);
let powerupSpawnFrameCounter = 30;
let powerupTimer = 0;
let powerupTimeFrameCounter = 30;
let powerupCanSpawn = false;

let powerupStarted = false;
let powerupSpeed = false;
let powerupHealth = false;
let powerupHealthMessage = `HEALTH POTION GAINED`;
let powerupDamage = false;
let powerupInvincibility = false;

let normalPlayerDamage = player.damage;
let normalPlayerBowDamage = player.bowDamage;

function createPowerups() {
    if (!powerupCanSpawn && !player.hasPowerup) {
        if (powerupSpawnTimer === 0) {
            powerupSpawnTimer = randint(15, 25);
            powerupSpawnFrameCounter = 30;
            powerupCanSpawn = true;
        }
        else {
            if (powerupSpawnFrameCounter === 0) {
                powerupSpawnFrameCounter = 30;
                powerupSpawnTimer --;
            }
            else {
                powerupSpawnFrameCounter --;
            }
        }
    }
        if (powerups.length < 1) {
            let isValid = true;
            let frameX;
            let frameY;
    
            let powerupOdds = randint(1, 10)
            
            if (powerupOdds <= 4) frameX = frameY = 0; 
            else if (powerupOdds <= 7) {
                frameX = 0;
                frameY = 1;
            }
            else if (powerupOdds <= 9) {
                frameX = 1;
                frameY = 0;
            }
            else frameX = frameY = 1;

            let powerupX = randint(boundaryLocation()["left"], boundaryLocation()["right"]-2*squareSize);
            let powerupY = randint(boundaryLocation()["up"]+squareSize, boundaryLocation()["down"]-squareSize);

            if (!(powerupX % squareSize === 0)) {
                powerupX = (Math.round(powerupX / squareSize) * squareSize) + 1;
            } 
            else {
                powerupX++;
            }
            if (!(powerupY % squareSize === 0)) {
                powerupY = (Math.round(powerupY / squareSize) * squareSize) + 1;
            } 
            else {
                powerupY++;
            }

            let powerup = {
                x: powerupX,
                y: powerupY,
                width: 32,
                height: 32,
                frameX: frameX,
                frameY: frameY,
            }
        
            for (let o of obstacles) {
                if (collides(powerup, o)) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                powerups.push(powerup);
            }
        }    
    
    if (powerupCanSpawn) {
        for (let pu of powerups) {
            context.drawImage(powerupImage, pu.frameX*32, pu.frameY*32, pu.width, pu.height,
                pu.x, pu.y, pu.width, pu.height
            )

            if (collides(player, pu)) {
                player.hasPowerup = true;
                player.score ++;
            }
        }
    }
}

function handlePowerups() {
    if (powerupDamage) {
        powerupElement.innerHTML = `ATTACK INCREASE: ${powerupTimer}`;
    }
    else {
        player.damage = normalPlayerDamage;
        player.bowDamage = normalPlayerBowDamage;
    }
    if (powerupSpeed) {
        player.xChange = player.yChange = 16;
        powerupElement.innerHTML = `SUPER SPEED: ${powerupTimer}`;
    }
    if (powerupInvincibility) {
        powerupElement.innerHTML = `INVINCIBILITY: ${powerupTimer}`;
    }
    if (powerupHealth) {
        powerupElement.innerHTML = powerupHealthMessage;
    }

    if (player.hasPowerup) {
        if (!powerupStarted) {
            for (let pu of powerups) {
                if (pu.frameX === 0 && pu.frameY === 0) { // sapphire
                    powerupTimer = 8;
                    powerupSpeed = true;
                }
                else if (pu.frameX === 0 && pu.frameY === 1) { // ruby
                    if (toolbar.frameY < maxPotionUses) toolbar.frameY ++;
                    else powerupHealthMessage = `MAX POTIONS LIMIT`;
                    powerupTimer = 3;
                    powerupHealth = true;
                }
                else if (pu.frameX === 1 && pu.frameY === 0) { // emerald
                    powerupTimer = 8;
                    powerupDamage = true;
                    player.damage ++;
                    player.bowDamage ++;
                }
                else { // diamond
                    powerupTimer = 5;
                    powerupInvincibility = true;
                }
                powerups.pop(pu);
                powerupStarted = true;
            }
        }

        if (powerupTimer > 0) {
            if (powerupTimeFrameCounter === 0) {
                powerupTimeFrameCounter = 30;
                powerupTimer --;
                if (powerupTimer === 0) {
                    player.hasPowerup = false;
                    powerupStarted = false;
                    powerupSpeed = powerupHealth = powerupDamage = powerupInvincibility = false;
                    powerupMessage = `POWERUP: NONE`;
                }
            }
            else {
                powerupTimeFrameCounter --;
            }
        }
        powerupCanSpawn = false;
    }
}