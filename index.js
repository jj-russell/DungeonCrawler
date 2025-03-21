let canvas;
let context;
let fpsInterval = 1000 / 30; // the denominator is frames-per-second

let now;
let then = Date.now();
let request_id;

let player = {
    x: 64,
    y: 64,
    width: 64,
    height: 64,
    frameX: 0,
    frameY: 2,
    xChange: 8,
    yChange: 8,
    attackCounter: 0,
    isAttacking: false
}

let swordHitbox = {
    x: player.x,
    y: player.y,
    size: player.width,
}

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

let playerWalk = new Image();
let playerSlash = new Image();
let skeletonWalk = new Image();
let skeletonSlash = new Image();
let skeletonDead = new Image();
let mageWalk = new Image();
let mageCast = new Image();
let mageDead = new Image();

let xChange, yChange, squareSize;
xChange = yChange = squareSize = 20;

let food = []; 
let foodMultiplier = 5;
let foodQueue = 0; // add food one at a time

let obstacles = [];
let obstaclesAmount = 50;

let score = 0;
let health = 5;
let iFrames = 0;

let enemyLevelAmount = 10;
let maxEnemyCount = 5;
let enemies = [];

let enemyInfo = {
    "skeleton" : {
        "amount": 0,
        "attackType": "melee"
    },
    "mage" : {
        "amount": 10,
        "attackType": "range"
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

let moveLeft, moveRight, moveUp, moveDown;
moveLeft = moveRight = moveUp = moveDown = false;

let faceLeft, faceRight, faceUp, faceDown;
faceLeft = faceRight = faceUp = faceDown = false;

let clickX = 0;
let clickY = 0;
let hasNewClick = false;


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

    player.x = canvas.width/2
    player.y = canvas.height/2 - player.height

    load_assets([
        {"var": playerWalk, "url": "images/CHARACTER_WALK.png"},
        {"var": playerSlash, "url": "images/CHARACTER_SLASH.png"},
        {"var": skeletonWalk, "url": "images/SKELETON_WALK.png"},
        {"var": skeletonSlash, "url": "images/SKELETON_SLASH.png"},
        {"var": skeletonDead, "url": "images/SKELETON_DEAD.png"},
        {"var": mageWalk, "url": "images/MAGE_WALK.png"},
        {"var": mageCast, "url": "images/MAGE_CAST.png"},
        {"var": mageDead, "url": "images/MAGE_DEAD.png"}
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

    context.fillStyle = "black";
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (enemyLevelAmount > 0 ) {
        createEnemies();
    }
    handleAttacking();

    
    // draw player 
    if (! player.isAttacking) {
        context.drawImage(playerWalk, player.frameX*player.width, player.frameY*player.height, player.width, player.height,
                        player.x, player.y, player.width, player.height);
    }

    // other objects
    handleEnemyAttacking();
    for (let e of enemies) {
        // context.fillRect(enemyHitbox.x, enemyHitbox.y, enemyHitbox.width, enemyHitbox.height)
        if (e.isDying) {
            context.drawImage(enemyImages[e.type]["dead"], e.deathFrame * e.width, 0, e.width, e.height,
                            e.x, e.y, e.width, e.height);
        } else if (e.isAttacking) {
            context.drawImage(enemyImages[e.type]["slash"], e.frameX*e.width, e.frameY*e.height, e.width, e.height,
                            e.x, e.y, e.width, e.height);
        } else {
            context.drawImage(enemyImages[e.type]["walk"], e.frameX*e.width, e.frameY*e.height, e.width, e.height,
                            e.x, e.y, e.width, e.height);
        }
    }

    // kill enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        if (e.isDying) {
            e.deathCounter++;
            if (e.deathCounter >= 5) {
                e.deathCounter = 0;
                e.deathFrame++;
                if (e.deathFrame >= 6) {
                    enemies.splice(i, 1);
                }
            }
        }
    }

    moveEnemies();

    // movement
    movePlayer(); 

    // taking damage
    playerStats();
    if (iFrames > 0) iFrames -= 1;
    if (iFrames > 0) context.fillStyle = "red";

}

function handleAttacking() {
    window.addEventListener("click", attack, false);
    if (player.isAttacking) {
        moveUp = moveLeft = moveDown = moveRight = false;
        swordHitbox = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            isKilling: false
        }

        if (player.frameY === 0) { // up
            swordHitbox.x += swordHitbox.width * 0.1875
            swordHitbox.width *= 0.625
            swordHitbox.y = player.y - player.height/2;
        }
        else if (player.frameY === 1) { // left
            swordHitbox.y += swordHitbox.height / 4
            swordHitbox.height *= 0.75
            swordHitbox.x = player.x - player.width/2;
            context.beginPath();
            context.ellipse(swordHitbox.x+swordHitbox.width, swordHitbox.y+swordHitbox.height/2, swordHitbox.width, swordHitbox.height/2, 0, Math.PI/2, -Math.PI/2);
            context.lineWidth = 5;
            context.strokeStyle = 'gray';
            context.stroke();
        }
        else if (player.frameY === 2) { // down
            swordHitbox.x += swordHitbox.width * 0.1875
            swordHitbox.width *= 0.625
            swordHitbox.y = player.y + player.height/2;
        }
        else if (player.frameY === 3) { // right
            swordHitbox.y += swordHitbox.height / 4
            swordHitbox.height *= 0.75
            swordHitbox.x = player.x + player.width/2;
            context.beginPath();
            context.ellipse(swordHitbox.x, swordHitbox.y+swordHitbox.height/2, swordHitbox.width, swordHitbox.height/2, 0, -Math.PI/2, Math.PI/2);
            context.lineWidth = 5;
            context.strokeStyle = 'gray';
            context.stroke();
        }

        context.fillStyle = "red"
        context.fillRect(swordHitbox.x, swordHitbox.y, swordHitbox.width, swordHitbox.height)
        context.drawImage(playerSlash, swordFrame*player.width, player.frameY*player.height, player.width, player.height,
            player.x, player.y, player.width, player.height);

        player.attackCounter ++
        if (player.attackCounter === 2) { 
            swordFrame ++;
            player.attackCounter = 0;
        }

        if (swordFrame == 6) {
            player.isAttacking = false;
            swordFrame = 0;
        }

        if (swordFrame === 4) {
            for (let i = enemies.length - 1; i >= 0; i--) {
                let e = enemies[i];
                if (collides(e, swordHitbox) && !e.isDying) {
                    e.isDying = true;
                    e.deathFrame = 0;
                    e.deathCounter = 0;
                    score++;
                    break;
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
                    deathCounter: 0
                }
                
                e.x = randint(0, canvas.width-e.width)
                e.y = randint(0, canvas.height-e.width)

                // convert co-ordinates to multiples of 4
                e.x = (e.x + (4 - e.x%4))
                e.y = (e.y + (4 - e.y%4))

                enemies.push(e)
                enemyLevelAmount --

            }
            enemyInfo[type]["amount"] -= enemiesGenerated
        }
    }
}

function moveEnemies() {
    for (let e of enemies) {

        if (e.isAttacking || e.isDying) {
            continue;
        }
        // if enemy is next to the player;
        let distanceY = Math.abs(player.y - e.y);
        
           // player to the left of enemy and enemy is close    player to the right of enemy and enemy is close      
        if (((player.x <= e.x && player.x + e.width >= e.x) || (player.x >= e.x && player.x - e.width <= e.x))
            // and enemy is close vertically
            && distanceY <= player.height/4) {
            e.isAttacking = true;
            e.frameX = 0;
            // face the player
            if (player.x > e.x) e.frameY = 3; // right
            else if (player.x < e.x) e.frameY = 1; // left
            else if (player.y < e.y) e.frameY = 0; // up
            else if (player.y > e.y) e.frameY = 2; // down
            
            continue;
        }

        if (player.x - e.width > e.x) { // right
            e.x += e.xChange;
            e.frameY = 3;
            e.moveRight = true;
        }
        else if (player.x + e.width < e.x) { // left
            e.x -= e.xChange;
            e.frameY = 1;
            e.moveLeft = true;
        }
        else if (player.y < e.y) { // up
            e.y -= e.yChange;
            e.frameY = 0;
            e.moveUp = true;
        }
        else if (player.y > e.y) { // down
            e.y += e.yChange;
            e.frameY = 2;
            e.moveDown = true;
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
        if (enemyInfo[e.type]["attackType"] === "melee") {
            if (e.isAttacking) {
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
                    
                    if (e.frameX === 4 && collides(playerHitbox, enemySwordHitbox)) {
                        if (iFrames === 0) {
                            iFrames = 30;
                            health--;
                        }
                    }
                    
                    if (e.frameX === 6) {
                        e.isAttacking = false;
                        e.frameX = 0;
                    }
                }
            }
        } 
        else if (enemyInfo[e.type]["attackType"] === "range") {
            let projectile = {
                x: e.x,
                y: e.y,
                width: e.width,
                height: e.height
            }
            context.fillStyle = "purple"
            context.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
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
}

function playerStats() {
    let healthBar = document.querySelector("#health");
    healthBar.innerHTML = "Health: " + health

    let scoreDisplay = document.querySelector("#score");
    scoreDisplay.innerHTML = "Score: " + score
}



// ------------------------------------- \\



function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft" || key === "a" || key === "A" ||
        key === "ArrowRight" || key === "d" || key === "D" ||
        key === "ArrowUp" || key === "w" || key === "W" ||
        key === "ArrowDown" || key === "s" || key === "S") {
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

    let play = document.querySelector("#play > a");
    play.innerHTML = "Play Again";

    let outcome_element = document.querySelector("#outcome");
    outcome_element.innerHTML = outcome_txt;
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