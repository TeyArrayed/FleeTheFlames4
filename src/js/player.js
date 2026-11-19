import {isCollidable, getTileSize, getRowIndex, getColIndex, SCALE} from "./map.js";
import {getRockCollision, getRocks} from "./rock.js";

//All of Cedric's information is stored here
//Idle forward, right, left: 1000, 100, 750, 500, 500, 100 - Extend frame 1 by any amount with no consequence
//Idle back: 1500, 50, 2000
//All walking: 150, 300, 150, 300
//Dodging: 125, 125, 150, 125, 125, 500
//Attacking: 250, 150, 75, 250, 75 (Different center positions for each animation.)

let tileSize = getTileSize();

let cedricInfo = {
    x: 16 * tileSize * SCALE,      //x and y here are where we are initially placing Cedric on the canvas.
    y: 14 * tileSize * SCALE,
    height: 32,
    width: 32,
    speed: 6,
    scale: 3,
}

/**
 * Returns the y value of Cedric's feet hitbox.
 * @returns {number} The y value of Cedric's feet hitbox.
 */
export function getCedricY() {
    return cedricInfo.y;
}

export function cedricExit(direction, canvas) {
    switch (direction) {
        case 0: {
            cedricInfo.y = canvas.height - 100;
            break;
        }
        case 1: {
            cedricInfo.x = 100;
            break;
        }
        case 2: {
            cedricInfo.y = 100;
            break;
        }
        case 3: {
            cedricInfo.x = canvas.width - 100;
            break;
        }
        case 4: {
            cedricInfo.x = 16 * tileSize * SCALE;
            cedricInfo.y = 14 * tileSize * SCALE
            break;
        }
    }
}

export function getCedricCollision() {
    return {
        collisionXStart: cedricInfo.x + (cedricInfo.width * cedricInfo.scale * (11/32)),
        collisionXEnd: cedricInfo.x + (cedricInfo.width * cedricInfo.scale * (21/32)),
        collisionYStart: cedricInfo.y + (cedricInfo.height * cedricInfo.scale * (10/11)),
        collisionYEnd: cedricInfo.y + (cedricInfo.height * cedricInfo.scale)
        //Collision: 11/32 - 21/32 (x) and 30/32 (y)
    };
}


let cedricSprite = new Image();
cedricSprite.src = "../img/CedricCompleteSheet.png";
function drawCedric(frameX, frameY, canvasX, canvasY, ctx) {
    ctx.drawImage(cedricSprite,                                                     //Which sprite to draw
        frameX * cedricInfo.width, frameY * cedricInfo.height,                      //Coordinates of the sprite sheet. Select the frame you want by looking at the sprites in the spritesheet and consider each sprite a coordinate
        cedricInfo.width, cedricInfo.height,                                        //Size of the sprite on the sprite sheet
        canvasX, canvasY,                                                           //Position on the canvas
        cedricInfo.width * cedricInfo.scale, cedricInfo.height * cedricInfo.scale); //Size of the sprite on the canvas
}

/**
 * A function to draw Cedric's current position with all required information.
 * @param ctx The canvas context.
 */
export function drawCedricCurrentPos(ctx) {
    drawCedric(idleForwardLoop[loopIndex], currentDirection, cedricInfo.x, cedricInfo.y, ctx);
}

//Sprite Animation Sequences
const idleBackLoop = [0, 1, 2];
const idleBackLoopDuration = [1500, 50, 2000]; 

const walkLoop = [0, 1, 2, 3];
const walkLoopDuration = [150, 300, 150, 300];

const idleForwardLoop = [0, 1, 2, 3, 4, 5];
const idleForwardLoopDuration = [1000, 100, 750, 500, 500, 100]; //The duration of each frame in milliseconds.

let loopIndex = 0;
let timeCount = 0;
let currentDirection = 0; //0 = forward, 1 = back, 2 = right, 3 = left (add 4 to get the same direction walking)
let previousDirection = 0;
function idleAnimation(browserTime) { 
    if (!timeCount) {
        timeCount = browserTime;
    }
    const trueTimeCount = browserTime - timeCount;


    let activeLoop = idleForwardLoop;
    let activeLoopDuration = idleForwardLoopDuration;
    let frameY = currentDirection;

    if (currentDirection === 1) { //Changing animation based on direction facing.
        activeLoop = idleBackLoop;
        activeLoopDuration = idleBackLoopDuration;
        frameY = 1;

    } else if (currentDirection > 3) {
        activeLoop = walkLoop;
        activeLoopDuration = walkLoopDuration;
        frameY = currentDirection;

    } else {
        activeLoop = idleForwardLoop;
        activeLoopDuration = idleForwardLoopDuration;
        frameY = currentDirection;
    
    }

    //This checks if direction has changed and if so, resets the animation.
    if (currentDirection !== previousDirection) {
        loopIndex = 0;
        timeCount = browserTime;
        previousDirection = currentDirection;
    }

    if (trueTimeCount < activeLoopDuration[loopIndex]) { //Regulating the speed of the animation. 
        window.requestAnimationFrame(idleAnimation);    
        return;
    }
    timeCount = browserTime;
    // console.log(currentDirection);

    loopIndex++;    
    if (loopIndex >= activeLoop.length) {
        loopIndex = 0;
    }
}


//Detecting key presses
let keyPresses = {};

window.addEventListener('keydown', keyDownListener, false);
   function keyDownListener(event) {
       keyPresses[event.key] = true;
   }
window.addEventListener('keyup', keyUpListener, false);
   function keyUpListener(event) {
        keyPresses[event.key] = false;
   }

// Moving the player
function moving(deltaTime) {
    if (keyPresses.w) {
        cedricInfo.y -= cedricInfo.speed * deltaTime;
        currentDirection = 5; 
    } else if (previousDirection === 5) {
        currentDirection = 1;
    }
    if (keyPresses.s) {
        cedricInfo.y += cedricInfo.speed * deltaTime;
        currentDirection = 4; 
    } else if (previousDirection === 4) {
        currentDirection = 0;
    }
    if (keyPresses.a) {
        cedricInfo.x -= cedricInfo.speed * deltaTime;
        currentDirection = 7; 
    } else if (previousDirection === 7) {
        currentDirection = 3;
    }
    if (keyPresses.d) {
        cedricInfo.x += cedricInfo.speed * deltaTime;
        currentDirection = 6; 
    } else if (previousDirection === 6) {
        currentDirection = 2;
    }
}

/**
 * Returns true if Cedric's position is overlapping with a collidable tile.
 * @param deltaTime The time since the last frame.
 * @returns {boolean} True if Cedric is colliding with a tile.
 */
function getTileCollision(deltaTime) {
    return (
        isCollidable(getCedricCollision().collisionXStart, getCedricCollision().collisionYStart) ||
        isCollidable(getCedricCollision().collisionXEnd, getCedricCollision().collisionYStart) ||
        isCollidable(getCedricCollision().collisionXStart, getCedricCollision().collisionYEnd) ||
        isCollidable(getCedricCollision().collisionXEnd, getCedricCollision().collisionYEnd)
    );
}

/**
 * Pushes Cedric in the opposite direction of his current movement.
 * @param deltaTime The time since the last frame.
 */
function pushBack(deltaTime) {
    if (keyPresses.w) {
        cedricInfo.y += cedricInfo.speed * deltaTime;
    } else if (keyPresses.s) {
        cedricInfo.y -= cedricInfo.speed * deltaTime;
    }
    if (keyPresses.a) {
        cedricInfo.x += cedricInfo.speed * deltaTime;
    } else if (keyPresses.d) {
        cedricInfo.x -= cedricInfo.speed * deltaTime;
    }
}

function collision(deltaTime) {
    const cedricCollision = getCedricCollision();

    //Rock collision
    getRocks(getRowIndex(), getColIndex()).forEach(rock => {
        const rockCollision = getRockCollision(rock);
        if  (cedricCollision.collisionXEnd > rockCollision.collisionXStart && cedricCollision.collisionXStart < rockCollision.collisionXEnd &&
            cedricCollision.collisionYEnd > rockCollision.collisionYStart && cedricCollision.collisionYStart < rockCollision.collisionYEnd) {
            pushBack(deltaTime);
        }
    });

    //Tile collision
    if (getTileCollision(deltaTime)) {
        pushBack(deltaTime)
    }
}



/**
 *The loop for Cedric. This will be called in main.js.
 * Add anything you want to run in the game from the player.js file to this method.
 */
export function playerLoop(deltaTime, ctx) {
    //Core gameplay functions
    moving(deltaTime);
    collision(deltaTime, SCALE);

    //Player drawing
    idleAnimation(performance.now());
}
