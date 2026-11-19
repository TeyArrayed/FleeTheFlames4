//Initialize Variables--------------------------------------------------------------------------------------------------

//Credits to https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
//For help with declaring a 2d array
const TILE_SIZE = 16;
export const SCALE = 3;
const EXIT_SIDE_SIZE = 2;
const SCREEN_ROWS = 18;
const SCREEN_COLS = 32;

let endRoomRow = 0;
let endRoomCol = 2;

let screen = Array.from({length: SCREEN_ROWS}, () =>
    Array.from({length: SCREEN_COLS}, () => 0)
);

let areaMap = Array.from({length: 10}, () =>
    Array.from({length: 5}, () => null)
);

let exitMap = Array.from({length: 10}, () =>
    Array.from({length: 5}, () => [-1, -1, -1, -1])
);

let isMapCreated = false;

let screenWidth = screen.length - 1;
let screenHeight = screen[0].length - 1;

let mapGridWidth = areaMap.length - 1;
let mapGridHeight = areaMap[0].length - 1;

//Player Location in the grid, this will change when the player moves screens
let rowIndex = 2;
let colIndex = 9;

let barrenFloor = new Image()
barrenFloor.src = "../img/tiles/barrenFloor.png";
let barrenWall = new Image()
barrenWall.src = "../img/tiles/barrenWall.png";
let volcanoFloor = new Image()
volcanoFloor.src = "../img/tiles/volcanoFloor.png";
let volcanoWall = new Image()
volcanoWall.src = "../img/tiles/volcanoWall.png";
let jungleFloor = new Image()
jungleFloor.src = "../img/tiles/jungleFloor.png";
let jungleWall = new Image()
jungleWall.src = "../img/tiles/jungleWall.png"
let castleFloor = new Image()
castleFloor.src = "../img/tiles/castleFloor.png";
let castleWall = new Image()
castleWall.src = "../img/tiles/castleWall.png";

let tileKey = new Map();
tileKey.set(0, barrenFloor);
tileKey.set(1, barrenWall);
tileKey.set(2, volcanoFloor);
tileKey.set(3, volcanoWall);
tileKey.set(4, jungleFloor);
tileKey.set(5, jungleWall);
tileKey.set(6, castleFloor);
tileKey.set(7, castleWall);

let collisionKey = new Map();
collisionKey.set(1, true);
collisionKey.set(3, true);
collisionKey.set(5, true);
collisionKey.set(7, true);

//Functions-------------------------------------------------------------------------------------------------------------

//-----Exported Variables-----
export function getScreenRows() {
    return SCREEN_ROWS
}
export function getScreenCols() {
    return SCREEN_COLS
}
export function getTileSize() {
    return TILE_SIZE;
}
export function getRowIndex() {
    return rowIndex;
}
export function getColIndex() {
    return colIndex;
}

//-----Map Data Creation-----
/**
 * Changes the value of isMapCreated back to false, allowing createAreaMap to run
 * again with new numbers.
 */
export function changeMapCreation() {
    isMapCreated = false;
}

/**
 * Resets the screen to be a blank canvas of the inputted tile.
 * @param tileNumber The number for the type of tile.
 */
function resetScreen(tileNumber) {
    for (let i = 0; i < screen.length; i++) {
        for (let j = 0; j < screen[i].length; j++) {
            screen[i][j] = tileNumber;
        }
    }
}

/**
 * Sets the entire border of the screen to the specified number.
 * @param tileNumber The number for the type of tile.
 */
function createBorders(tileNumber) {
    for (let i = 0; i < screen.length; i++) {
        for (let j = 0; j < screen[i].length; j++) {
            if (i === 0 || i === screen.length-1 || j === 0 || j === screen[i].length-1) {
                screen[i][j] = tileNumber;
            }
        }
    }
}

/**
 * Creates random numbers and exits to the screen at the specified locations
 * @param tileNumber The number for the type of tile.
 * @param areaExitAllowed A boolean that determines if an exit will be created for the area.
 */
function createScreenExits(tileNumber, areaExitAllowed) {
    //KEY
    //Top = 0
    //Right = 1
    //Down = 2
    //Left = 3
    //No Exit = -1

    let exits = [-1, -1, -1, -1];
    const EXIT_PADDING = EXIT_SIDE_SIZE + 1;

    //Top
    if (rowIndex === endRoomRow && colIndex === endRoomCol && areaExitAllowed === true) {
        exits[0] = Math.floor(SCREEN_COLS/2);
        createExit(exits[0], 0, tileNumber);
    }
    else if (rowIndex > 0 && exitMap[rowIndex - 1][colIndex][2] !== -1) {
        exits[0] = exitMap[rowIndex - 1][colIndex][2];
        createExit(exits[0], 0, tileNumber);
    }
    else if (rowIndex > 0) {
        let randomTop = Math.floor(Math.random() * (screen[0].length - EXIT_PADDING * 2)) + EXIT_PADDING;
        exits[0] = randomTop;
        createExit(randomTop, 0, tileNumber);
    }
    //Right
    if (colIndex < mapGridHeight && exitMap[rowIndex][colIndex + 1][3] !== -1) {
        exits[1] = exitMap[rowIndex][colIndex + 1][3];
        createExit(exits[1], 1, tileNumber);
    }
    else if (colIndex < mapGridHeight) {
        let randomRight = Math.floor(Math.random() * (screen.length - EXIT_PADDING * 2)) + EXIT_PADDING;
        exits[1] = randomRight;
        createExit(randomRight, 1, tileNumber);
    }
    //Bottom
    if (rowIndex < mapGridWidth && exitMap[rowIndex + 1][colIndex][0] !== -1) {
        exits[2] = exitMap[rowIndex + 1][colIndex][0];
        createExit(exits[2], 2, tileNumber);
    }
    else if (rowIndex < mapGridWidth) {
        let randomBottom = Math.floor(Math.random() * (screen[0].length - EXIT_PADDING * 2)) + EXIT_PADDING;
        exits[2] = randomBottom;
        createExit(randomBottom, 2, tileNumber);
    }
    //Left
    if (colIndex > 0 && exitMap[rowIndex][colIndex - 1][1] !== -1) {
        exits[3] = exitMap[rowIndex][colIndex - 1][1];
        createExit(exits[3], 3, tileNumber);
    }
    else if (colIndex > 0) {
        let randomLeft = Math.floor(Math.random() * (screen.length - EXIT_PADDING * 2)) + EXIT_PADDING;
        exits[3] = randomLeft;
        createExit(randomLeft, 3, tileNumber);
    }
    exitMap[rowIndex][colIndex] = exits;
}

/**
 * Changes the number on the specified side at the specified location.
 * @param specifiedLocation The specified location to change tiles.
 * @param side The side that the change is on, start at 0 for top and go clockwise up until 3 for left.
 * @param tileNumber The number for the type of tile.
 */
function createExit(specifiedLocation, side, tileNumber) {
    //console.log("exit being created  at: " + specifiedLocation);
    switch(side) {
        case 0: {
            screen[0][specifiedLocation] = tileNumber;
            for (let i = 0; i <= EXIT_SIDE_SIZE; i++) {
                screen[0][specifiedLocation + i] = tileNumber;
            }
            for (let i = 0; i <= EXIT_SIDE_SIZE; i++) {
                screen[0][specifiedLocation - i] = tileNumber;
            }
            break;
        }
        case 1: {
            screen[specifiedLocation][screenHeight] = tileNumber;
            for (let i = 0; i <= EXIT_SIDE_SIZE; i++) {
                screen[specifiedLocation + i][screenHeight] = tileNumber;
            }
            for (let i = 0; i <= EXIT_SIDE_SIZE; i++) {
                screen[specifiedLocation - i][screenHeight] = tileNumber;
            }
            break;
        }
        case 2: {
            screen[screenWidth][specifiedLocation] = tileNumber;
            for (let i = 0; i <= EXIT_SIDE_SIZE; i++) {
                screen[screenWidth][specifiedLocation + i] = tileNumber;
            }
            for (let i = 0; i <= EXIT_SIDE_SIZE; i++) {
                screen[screenWidth][specifiedLocation - i] = tileNumber;
            }
            break;
        }
        case 3: {
            screen[specifiedLocation][0] = tileNumber;
            for (let i = 0; i <= EXIT_SIDE_SIZE; i++) {
                screen[specifiedLocation + i][0] = tileNumber;
            }
            for (let i = 0; i <= EXIT_SIDE_SIZE; i++) {
                screen[specifiedLocation - i][0] = tileNumber;
            }
            break;
        }
        default: {
            break;
        }
    }
}

/**
 * Generates a random number for the exit room column.
 */
function generateEndRoomCol() {
    endRoomCol = Math.floor(Math.random() * (mapGridHeight + 1));
}

/**
 * Returns the exit room column.
 * @returns {number}
 */
export function getEndRoomCol() {
    return endRoomCol;
}

/**
 *Calls the other methods to create the area map. After this method is called once, it will not work again.
 * @param backgroundTile The tile used for the background of the map.
 * @param wallTile The tile used for the walls of the map.
 * @param areaExitAllowed A boolean that determines if an exit will be created for the area.
 */
export function createAreaMap(backgroundTile, wallTile, areaExitAllowed) {
    if (isMapCreated) {
        return;
    }
    generateEndRoomCol();
    for (let i = 0; i < areaMap.length; i++) {
        rowIndex = i;
        for (let j = 0; j < areaMap[i].length; j++) {
            colIndex = j;
            screen = Array.from({length: SCREEN_ROWS}, () => new Array(SCREEN_COLS).fill(0));
            resetScreen(backgroundTile);
            createBorders(wallTile);
            createScreenExits(backgroundTile, areaExitAllowed);
            //I had help from claude for this specific row line
            areaMap[rowIndex][colIndex] = screen.map(row => [...row]);
        }
    }
    isMapCreated = true;
    resetRoomIndex();
}

/**
 * Returns a boolean if a specific tile has collision.
 * @param x The x-coordinate of the tile.
 * @param y The y-coordinate of the tile.
 * @returns {boolean} True if the tile is collidable, false otherwise.
 */
export function isCollidable(x, y) {
    const scaledTile = TILE_SIZE * SCALE;
    const row = Math.floor(y / scaledTile);
    const col = Math.floor(x / scaledTile);
    const current_room = areaMap[rowIndex][colIndex];
    return collisionKey.get(current_room[row]?.[col]) === true;
}

//-----Map Drawing and Screen Changing-----

/**
 * Resets the room index to the initial values.
 */
function resetRoomIndex() {
    rowIndex = 9;
    colIndex = 2;
}

/**
 * Draws the map according to the corresponding area map screen.
 */
export function drawMap(ctx) {
    const current_room = areaMap[rowIndex][colIndex];
    let scaledTile = TILE_SIZE * SCALE;
    for (let i = 0; i < current_room.length; i++) {
        for (let j = 0; j < current_room[i].length; j++) {
            // let tileImage = new Image();
            ctx.drawImage(tileKey.get(current_room[i][j]), j * scaledTile, i * scaledTile, scaledTile, scaledTile)
        }
    }
}

export function changeScreen(direction) {
    switch(direction) {
        case 0: {
            if (rowIndex > 0) {
                console.log("going up to " + rowIndex,colIndex)
                rowIndex = Math.max(0, rowIndex - 1);
            }
            break;
        }
        case 1: {
            if (colIndex < mapGridHeight) {
                console.log("going right to " + rowIndex,colIndex)
                colIndex = Math.min(mapGridHeight, colIndex + 1);
            }
            break;
        }
        case 2: {
            if (rowIndex < mapGridWidth) {
                console.log("going down to " + rowIndex,colIndex)
                rowIndex = Math.min(mapGridWidth, rowIndex + 1);
            }
            break;
        }
        case 3: {
            if (colIndex > 0) {
                console.log("going left to " + rowIndex,colIndex)
                colIndex = Math.max(0, colIndex - 1);
            }
            break;
        }
    }
}