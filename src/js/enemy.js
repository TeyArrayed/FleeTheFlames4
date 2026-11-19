import {getEndRoomCol, getScreenCols, getScreenRows, getTileSize, SCALE} from "./map.js";
import{getCanvasHeight, getCanvasWidth} from "./main.js";

class Enemy {

constructor (enemyX, enemyY, spriteWidth, spriteHeight, enemySpeed, enemyScale,
        collisionXBegin, collisionXEnd, collisionYBegin, collisionYEnd, state) {
    this.enemyX = enemyX;
    this.enemyY = enemyY;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.enemySpeed = enemySpeed;
    this.enemyScale = enemyScale;
    this.collisionXBegin = collisionXBegin;
    this.collisionXEnd =  collisionXEnd;
    this.collisionYBegin = collisionYBegin;
    this.collisionYEnd = collisionYEnd;
    this.state = state;
    this.direction = 0; //0: down, 1: up, 2: left, 3: right
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.sprite = null;
}

update(deltaTime) {
    // Random movement atm
    if (Math.random() < 0.02) {
        this.direction = Math.floor(Math.random() * 4);
        this.state = 'move';
    }

    //Actual moving
    switch (this.direction) {
        case 0: this.enemyY += this.enemySpeed; break;
        case 1: this.enemyY -= this.enemySpeed; break;
        case 2: this.enemyX -= this.enemySpeed; break;
        case 3: this.enemyX += this.enemySpeed; break;
    }

    //Imprisonment
    if (this.enemyX < 0) this.enemyX = 0;
    if (this.enemyY < 0) this.enemyY = 0;
    if (this.enemyX > getCanvasWidth() - this.spriteWidth * this.enemyScale) this.enemyX = getCanvasWidth() - this.spriteWidth * this.enemyScale;
    if (this.enemyY > getCanvasHeight() - this.spriteHeight * this.enemyScale) this.enemyY = getCanvasHeight() - this.spriteHeight * this.enemyScale;

    //Animation
    this.frameTimer += deltaTime * 16.67;
    if (this.frameTimer > this.animationDuration[this.state][this.currentFrame]) {
        this.frameTimer = 0;
        this.currentFrame = (this.currentFrame + 1) % this.animationLoop[this.state].length;
    }
}

draw(ctx) {
    const frameX = this.animationLoop[this.state][this.currentFrame]; 
    const frameY = this.direction;
    ctx.drawImage(this.sprite,
        frameX * this.spriteWidth, frameY * this.spriteHeight,
        this.spriteWidth, this.spriteHeight,
        this.enemyX, this.enemyY,
        this.spriteWidth * this.enemyScale, this.spriteHeight * this.enemyScale);
}

getCollision() {
    return {
        collisionXStart: this.enemyX + (this.spriteWidth * this.enemyScale / 4),
        collisionXEnd: this.enemyX + (this.spriteWidth * this.enemyScale * (11/12)),
        collisionYStart: this.enemyY + (this.spriteHeight * this.enemyScale * (11/12)),
        collisionYEnd: this.enemyY + (this.spriteHeight * this.enemyScale)
    };
}
}


class Bat extends Enemy {
/*
Bat frame hovering:   150, 75, 250, 75, 150, 75, 250, 75
Bat frame moving:     100, 50, 200, 50, 100, 50, 200, 50
Bat frame attack:     300, 50, 100, 75, 75, 200, 125, 125
Bat frame death:      100, 75, 75, 150, 175, 150, 150, 300 
*/

    constructor (enemyX, enemyY) {
        super(enemyX, enemyY,
            24, 24,
            1, 2,
            2, 22,
            5, 16,
            "idle");
        this.sprite = new Image();
        this.sprite.onload = () => {};
        this.sprite.src = "../img/BatSpriteVASheet.png";

        this.animationLoop = {
            idle: [0, 1, 2, 3, 4, 5, 6, 7],
            move: [0, 1, 2, 3, 4, 5, 6, 7],
            attack: [0, 1, 2, 3, 4, 5, 6, 7],
            death: [0, 1, 2, 3, 4, 5, 6, 7]
        };
        this.animationDuration = {
            idle: [150, 75, 250, 75, 150, 75, 250, 75],
            move: [100, 50, 200, 50, 100, 50, 200, 50],
            attack: [300, 50, 100, 75, 75, 200, 125, 125],
            death: [100, 75, 75, 150, 175, 150, 150, 300]
        };
    }

    draw(ctx) {
        const frameX = this.animationLoop[this.state][this.currentFrame];
        const frameY = this.direction;
        ctx.drawImage(this.sprite,
            frameX * this.spriteWidth, frameY * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            this.enemyX, this.enemyY,
            this.spriteWidth * this.enemyScale, this.spriteHeight * this.enemyScale);
    }
}

class Kobold extends Enemy {
/*
Kobold moving:        150, 100, 100, 100, 150, 100, 100, 100
Kobold attack:        400, 200, 150, 300, 300, 250, 300, 200
Kobold death:         300, 175, 150, 150, 150, 150, 150, 400
*/
    constructor (enemyX, enemyY) {
        super(enemyX, enemyY,
            32, 32,
            1, 3,
            2, 22,
            5, 16,
            "idle");
        this.sprite = new Image();
        this.sprite.onload = () => {};
        this.sprite.src = "../img/KoboldSpriteVASheet.png";

        this.animationLoop = {
            idle: [0],
            move: [0, 1, 2, 3, 4, 5, 6, 7],
            attack: [0, 1, 2, 3, 4, 5, 6, 7],
            death: [0, 1, 2, 3, 4, 5, 6, 7]
        };
        this.animationDuration = {
            idle: [100, 100, 100, 100, 100, 100, 100, 100],
            move: [150, 100, 100, 100, 150, 100, 100, 100],
            attack: [400, 200, 150, 300, 300, 250, 300, 200],
            death: [300, 175, 150, 150, 150, 150, 150, 400]
        };
    }

    draw(ctx) {
        const frameX = this.animationLoop[this.state][this.currentFrame];
        const frameY = this.direction;
        ctx.drawImage(this.sprite,
            frameX * this.spriteWidth, frameY * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            this.enemyX, this.enemyY,
            this.spriteWidth * this.enemyScale, this.spriteHeight * this.enemyScale);
    }
}

//Rarck. yurmy
const MIN_ENEMIES = 1;
const MAX_ENEMIES = 5;

let enemyMap = Array.from({length: 10}, () =>
    Array.from({length: 5}, () => [])
);

/**
 * Creates a random number of enemies between min and max
 * @returns {Enemy[]} Array of enemies
 */
export function createEnemies() {
    let enemies = [];
    const numEnemies = Math.floor(Math.random() * (MAX_ENEMIES - MIN_ENEMIES + 1)) + MIN_ENEMIES;
    const SCREEN_COLS = getScreenCols();
    const SCREEN_ROWS = getScreenRows();
    const TILE_SIZE = getTileSize();
    const PADDING = 2;
    for (let i = 0; i < numEnemies; i++) {
        const x = Math.floor(Math.random() * (SCREEN_COLS - PADDING * 2) + PADDING) * TILE_SIZE * SCALE;
        const y = Math.floor(Math.random() * (SCREEN_ROWS - PADDING * 2) + PADDING) * TILE_SIZE * SCALE;
        const mobClasses = [Bat, Kobold];
        const MobClass = mobClasses[Math.floor(Math.random() * mobClasses.length)];
        enemies.push(new MobClass(x, y));
    }
    return enemies;
}

/**
 * This method rocks.
 * @param {number} row
 * @param {number} col
 * @returns {*[]}
 */
export function getEnemies(row, col) {
    return enemyMap[row][col];
}

export function createEnemyMap() {
    for (let i = 0; i < enemyMap.length; i++) {
        for (let j = 0; j < enemyMap[i].length; j++) {
            if (i === 0 && j === getEndRoomCol()) {
                enemyMap[i][j] = [];
                continue;
            }
            enemyMap[i][j] = createEnemies();
        }
    }
}

export function clearEnemyMap() {
    for (let i = 0; i < enemyMap.length; i++) {
        for (let j = 0; j < enemyMap[i].length; j++) {
            enemyMap[i][j] = [];
        }
    }
}

/**
 * Update all enemies in the current screen
 * @param {number} row
 * @param {number} col
 * @param {number} deltaTime
 */
export function updateEnemies(row, col, deltaTime) {
    const enemies = getEnemies(row, col);
    enemies.forEach(enemy => enemy.update(deltaTime));
}