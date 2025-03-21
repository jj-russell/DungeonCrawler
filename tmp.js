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
    yChange: 8
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

let playerImage = new Image();
let slashImage = new Image();
let enemyImage = new Image();
let enemySlashImage = new Image();
let enemyDeadImage = new Image();

let xChange, yChange, squareSize;
xChange = yChange = squareSize = 20;

let food = []; 
let foodMultiplier = 5;
let foodQueue = 0; // add food one at a time

let obstacles = [];
let obstaclesAmount = 50;

let isSwinging = false;

let score = 0;
let health = 5;
let iFrames = 0;

let enemies = [];

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
        {"var": playerImage, "url": "images/CHARACTER_WALK.png"},
        {"var": slashImage, "url": "images/CHARACTER_SLASH.png"},
        {"var": enemyImage, "url": "images/SKELETON_WALK.png"},
        {"var": enemySlashImage, "url": "images/SKELETON_SLASH.png"},
        {"var": enemyDeadImage, "url": "images/SKELETON_DEAD.png"}
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
    
    createEnemies();
    handleAttacking();
    
    // draw player
    context.fillStyle = "blue"
    // context.fillRect(playerHitbox.x, playerHitbox.y, playerHitbox.width, playerHitbox.height)
    if (! isSwinging) {
        context.drawImage(playerImage, player.frameX*player.width, player.frameY*player.height, player.width, player.height,
                        player.x, player.y, player.width, player.height);
    }

    // other objects
    enemyAttack();
    for (let e of enemies) {
        if (e.isDying) {
            context.drawImage(enemyDeadImage, e.deathFrame * e.width, 0, e.width, e.height,
                            e.x, e.y, e.width, e.height);
        } else if (e.isAttacking) {
            context.drawImage(enemySlashImage, e.frameX*e.width, e.frameY*e.height, e.width, e.height,
                            e.x, e.y, e.width, e.height);
        } else {
            context.drawImage(enemyImage, e.frameX*e.width, e.frameY*e.height, e.width, e.height,
                            e.x, e.y, e.width, e.height);
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        if (e.isDying) {
            e.deathCounter++;
            if (e.deathCounter >= 5) { // Controls animation speed
                e.deathCounter = 0;
                e.deathFrame++;
                if (e.deathFrame >= 6) { // Assuming 6 frames in death animation
                    // Remove enemy after animation completes
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

    if (isSwinging) {
        swordHitbox = {
            x: player.x,
            y: player.y,
            size: player.width,
        }

        if (player.frameY === 0) { // up
            swordHitbox.y = player.y - player.height/2;
        }
        else if (player.frameY === 1) { // left
            swordHitbox.x = player.x - player.width/2;
            context.beginPath();
            context.ellipse(swordHitbox.x+swordHitbox.size, swordHitbox.y+player.height/2, swordHitbox.size, swordHitbox.size/2, 0, Math.PI/2, -Math.PI/2);
            context.lineWidth = 5;
            context.strokeStyle = 'gray';
            context.stroke();
        }
        else if (player.frameY === 2) { // down
            swordHitbox.y = player.y + player.height/2;
        }
        else if (player.frameY === 3) { // right
            swordHitbox.x = player.x + player.width/2;
            context.beginPath();
            context.ellipse(swordHitbox.x, swordHitbox.y+player.height/2, swordHitbox.size, swordHitbox.size/2, 0, -Math.PI/2, Math.PI/2);
            context.lineWidth = 5;
            context.strokeStyle = 'gray';
            context.stroke();
        }

        context.fillStyle = "red"
        context.fillRect(swordHitbox.x, swordHitbox.y, swordHitbox.size, swordHitbox.size)
        context.drawImage(slashImage, swordFrame*player.width, player.frameY*player.height, player.width, player.height,
            player.x, player.y, player.width, player.height);

        // if (swordHitbox) {
        //     for (let e of enemies) {
        //         if (e.isDying) {
        //             context.drawImage(enemyDeadImage, e.deathFrame * e.width, 0, e.width, e.height,
        //                             e.x, e.y, e.width, e.height);
                    
        //             e.deathCounter++;
        //             if (e.deathCounter >= 5) {
        //                 e.deathCounter = 0;
        //                 e.deathFrame++;
        //                 if (e.deathFrame >= 6) {
        //                     enemies.splice(enemies.indexOf(e), 1);
        //                 }
        //             }
        //         } else if (e.isAttacking) {
        //             context.drawImage(enemySlashImage, e.frameX*e.width, e.frameY*e.height, e.width, e.height,
        //                             e.x, e.y, e.width, e.height);
        //         } else {
        //             context.drawImage(enemyImage, e.frameX*e.width, e.frameY*e.height, e.width, e.height,
        //                             e.x, e.y, e.width, e.height);
        //         }
        //     }
        // }
        for (let i = enemies.length - 1; i >= 0; i--) {
            let e = enemies[i];
            if (collides(e, swordHitbox) && !e.isDying && !e.isAttacking) {
                e.isDying = true;
                e.deathFrame = 0;
                e.deathCounter = 0;
                score++;
            }
        }
        
        swordFrame = (swordFrame + 1);
        if (swordFrame == 7) {
            isSwinging = false;
            swordFrame = 0;
        }
    }
}

function attack() {
    if (!isSwinging) {
        isSwinging = true;
    }
}

function playerStats() {
    let healthBar = document.querySelector("#health");
    healthBar.innerHTML = "Health: " + health

    let scoreDisplay = document.querySelector("#score");
    scoreDisplay.innerHTML = "Score: " + score
}

function createEnemies() {
    if (enemies.length < 4) {
        let e = {
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
    }

    // for (let e of enemies) {
    //     if (collides(e, swordHitbox) && !e.isDying) {
    //         e.isDying = true;
    //         e.deathFrame = 0;
    //         e.deathCounter = 0;
    //         score++;
    //     }
    // }
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

function enemyAttack() {
    for (let e of enemies) {
        if (e.isAttacking) {
            let enemySwordHitbox = {
                x: e.x,
                y: e.y,
                size: e.width,
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
            
            // context.fillStyle = "green";
            // context.fillRect(enemySwordHitbox.x, enemySwordHitbox.y, enemySwordHitbox.size, enemySwordHitbox.size);
        }
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

function movePlayer() {
    if ((moveLeft || moveRight) && !(moveLeft && moveRight) || (moveUp || moveDown) && !(moveUp && moveDown)) {
        moveCounter ++
        if (moveCounter === 2) {
            moveCounter = 0;
            player.frameX = (player.frameX + 1) % 4;
        }
    }

    if ( !(moveLeft && moveRight) || !(moveUp && moveDown))
        if (moveUp && !(player.y === 0)) {
            player.y -= player.yChange;
            player.frameY = 0;
        }
        if (moveLeft && !(player.x === 0)) {
            player.x -= player.xChange;
            player.frameY = 1;
        }
        if (moveDown && !(player.y + player.width >= canvas.height)) {
            player.y += player.yChange;
            player.frameY = 2;
        }
        if (moveRight && !(player.x + player.width >= canvas.width)) {
            player.x += player.xChange;
            player.frameY = 3;
        }
        playerHitbox = {
            x: player.x+16, 
            y: player.y+12, 
            width: player.width/2, 
            height: player.height-12
        }
}

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

class Enemy {
    constructor (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    move() {

    }
    attack() {

    }

}
