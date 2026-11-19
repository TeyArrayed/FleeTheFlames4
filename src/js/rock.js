import {getEndRoomCol, getScreenCols, getScreenRows, getTileSize, SCALE} from "./map.js";

const MIN_ROCKS = 0;
const MAX_ROCKS = 5;

let rockMap = Array.from({length: 10}, () =>
    Array.from({length: 5}, () => null)
);

/**
 * Creates a random number of rocks between the min and max and returns them as an array
 * @returns {*[]} Returns an array of rocks.
 */
export function createRocks() {
    let rocks = [];
    const numRocks = Math.floor(Math.random() * (MAX_ROCKS - MIN_ROCKS + 1)) + MIN_ROCKS;
    let SCREEN_COLS = getScreenCols();
    let SCREEN_ROWS = getScreenRows();
    let TILE_SIZE = getTileSize();
    let PADDING = 2;
    for (let i = 0; i < numRocks; i++) {
        rocks.push({
            x: Math.floor(Math.random() * (SCREEN_COLS - PADDING * 2) + PADDING) * TILE_SIZE * SCALE,
            y: Math.floor(Math.random() * (SCREEN_ROWS - PADDING * 2) + PADDING) * TILE_SIZE * SCALE,
            height: 32,
            width: 32,
            scale: SCALE,
        });
    }
    return rocks;
}

/**
 * This method rocks.
 * @returns {*[]} Returns an array of rocks at a specified location from rockMap.
 */
export function getRocks(row, col) {
    return rockMap[row][col];
}

/**
 * Creates a 2d array of rocks. Aren't rocks just lovely?
 */
export function createRockMap() {
    for (let i = 0; i < rockMap.length; i++) {
        for (let j = 0; j < rockMap[i].length; j++) {
            if (i === 0 && j === getEndRoomCol()) {
                rockMap[i][j] = [];
                continue;
            }
            rockMap[i][j] = createRocks();
        }
    }
}

export function clearRockMap() {
    for (let i = 0; i < rockMap.length; i++) {
        for (let j = 0; j < rockMap[i].length; j++) {
            rockMap[i][j] = [];
        }
    }
}

/**
 * Returns the y value of the rocks hitbox.
 * @param rock The rock to get y value of.
 * @returns {number} The y value of the rocks hitbox.
 */
export function getRockY(rock) {
    return rock.y + (rock.height * rock.scale * (11/12));
}

/**
 * Returns an array of the rock's collision corners.
 * @param rock The rock to get the collision box of.
 * @returns {{collisionXStart, collisionXEnd, collisionYStart, collisionYEnd}} An object containing the rock's collision corners.
 */
export function getRockCollision(rock) {
    return {
        collisionXStart: rock.x + (rock.width * rock.scale / 4),
        collisionXEnd: rock.x + (rock.width * rock.scale * (11/12)),
        collisionYStart: rock.y + (rock.height * rock.scale * (11/12)),
        collisionYEnd: rock.y + (rock.height * rock.scale)
        //Collision: 6/24 - 22/24 (x) and 22/24 (y)
    };
}

let rockSprite = new Image();
rockSprite.src = "../img/TestRock.png";

/**
 * Draws the rock, it's simple enough...
 * @param rock The rock to draw.
 * @param ctx The canvas context.
 */
export function drawRock(rock, ctx) {
    ctx.drawImage(rockSprite,                                                   //Which sprite to draw
        0, 0,                                                                   //Coordinates of the sprite sheet
        rock.width, rock.height,                                        //Size of the sprite on the sprite sheet
        rock.x, rock.y,                                                 //Position on the canvas
        rock.width * rock.scale, rock.height * rock.scale);     //Size of the sprite on the canvas
}
