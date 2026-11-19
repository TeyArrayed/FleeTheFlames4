import {getCedricY, drawCedricCurrentPos, getCedricCollision, cedricExit, playerLoop} from "./player.js";
import {createAreaMap, drawMap, changeScreen, getRowIndex, getColIndex, getEndRoomCol, changeMapCreation} from "./map.js";
import {drawRock, getRocks, createRockMap, clearRockMap} from "./rock.js";
import {getEnemies, createEnemyMap, clearEnemyMap, updateEnemies} from "./enemy.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const pauseScreen = document.getElementById("pauseScreen");
const settingsScreen = document.getElementById("settingsScreen");

ctx.imageSmoothingEnabled = false;

const idealFPS = 60;
const idealFrameTime = 1000 / idealFPS;

//-----The Game Parts-----
let isPaused = false;

//Credits to https://stackoverflow.com/questions/13996267/loop-forever-and-provide-delta-time
//for DeltaTime stuff
let previousTime = 0;

let areaIndex = 0;
let areaTileArray = [
    [0, 1],
    [2, 3],
    [4, 5],
    [6, 7]
];

export function getCanvasWidth(){
    return canvas.width;
}

export function getCanvasHeight(){
    return canvas.height;
}

/**
 *The main game loop. It is called once at the bottom of this file. Congratulations, you figured it out.
 */
function gameLoop() {
    let currentTime = Date.now();
    const deltaTime = (currentTime - previousTime) / idealFrameTime;
    previousTime = currentTime;

    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        playerLoop(deltaTime, ctx);
        updateEnemies(getRowIndex(), getColIndex(), deltaTime);
        checkOutOfBounds();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

/**
 *This function uses the painter's algorithm to draw the game with things having a lower y value being in the back.
 */
function draw() {
    //Credits to https://www.geeksforgeeks.org/dsa/painters-algorithm-in-computer-graphics/ for the painter's algorithm.
    //Also credits to https://www.freecodecamp.org/news/what-does-the-hashrocket-symbol-mean-in-javascript for the hashrocket.
    drawMap(ctx);

    const objects = [
        {y: getCedricY(), draw: () => drawCedricCurrentPos(ctx) },
    ];
    getRocks(getRowIndex(), getColIndex()).forEach(rock => objects.push({y: rock.y, draw: () => drawRock(rock, ctx)}));
    getEnemies(getRowIndex(), getColIndex()).forEach(enemy => objects.push({y: enemy.enemyY, draw: () => enemy.draw(ctx)}));

    //This is the painter's algorithm. It creates a list of objects then sorts them in order of their y value.
    objects.sort((a, b) => a.y - b.y);
    objects.forEach(obj => obj.draw());
}

function checkOutOfBounds() {
    let c = getCedricCollision();
    if (c.collisionYStart < 0 && getColIndex() === getEndRoomCol() && getRowIndex() === 0) {
        cedricExit(4, canvas);
        changeMapCreation();
        areaIndex++;
        if (areaIndex < 3) {
            createRockMap();
            createEnemyMap();
            createAreaMap(areaTileArray[areaIndex][0], areaTileArray[areaIndex][1], true);
        }
        else {
            clearRockMap();
            clearEnemyMap();
            createAreaMap(areaTileArray[areaIndex][0], areaTileArray[areaIndex][1], false);
        }
        return;
    }
    if (c.collisionYStart < 0) {
        cedricExit(0, canvas);
        changeScreen(0);
    } else if (c.collisionXEnd > canvas.width) {
        cedricExit(1, canvas);
        changeScreen(1);
    } else if (c.collisionYEnd > canvas.height) {
        cedricExit(2, canvas);
        changeScreen(2);
    } else if (c.collisionXStart < 0) {
        cedricExit(3, canvas);
        changeScreen(3);
    }
}
//-----Event Listeners-----
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        isPaused = !isPaused;
        console.log("isPaused:", isPaused);
        if (isPaused) {
            pauseScreen.style.display = "block";
        } else {
            pauseScreen.style.display = "none";
        }
    }
});

//Resume button
pauseScreen.addEventListener("click", (event) => {
    if (event.target.id === "resumeButton") {
        isPaused = false;
        pauseScreen.style.display = "none";
    }
});

//Settings button
pauseScreen.addEventListener("click", (event) => {
    if (event.target.id === "settingsButton") {
        pauseScreen.style.display = "none";
        settingsScreen.style.display = "block";
    }
})

//Back button
settingsScreen.addEventListener("click", (event) => {
    if (event.target.id === "backButton") {
        pauseScreen.style.display = "block";
        settingsScreen.style.display = "none";
    }
})

//-----Running the Game-----
createAreaMap(areaTileArray[areaIndex][0], areaTileArray[areaIndex][1], true);
createRockMap();
createEnemyMap();

gameLoop();