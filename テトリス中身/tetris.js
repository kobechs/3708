const leftCanvas = document.getElementById('leftCanvas');
const rightCanvas = document.getElementById('rightCanvas');
const leftContext = leftCanvas.getContext('2d');
const rightContext = rightCanvas.getContext('2d');

const rightBuffer = document.createElement('canvas');
const leftBuffer = document.createElement('canvas');
rightBuffer.width = rightCanvas.width;
rightBuffer.height = rightCanvas.height;
leftBuffer.width = leftCanvas.width;
leftBuffer.height = leftCanvas.height;

const rightBufferContext = rightBuffer.getContext('2d');
const leftBufferContext = leftBuffer.getContext('2d');

const staticRightBuffer = document.createElement('canvas');
const staticLeftBuffer = document.createElement('canvas');
staticRightBuffer.width = rightCanvas.width;
staticRightBuffer.height = rightCanvas.height;
staticLeftBuffer.width = leftCanvas.width;
staticLeftBuffer.height = leftCanvas.height;

const staticRightContext = staticRightBuffer.getContext('2d');
const staticLeftContext = staticLeftBuffer.getContext('2d');


const rholdBuffer = document.createElement('canvas');
const lholdBuffer = document.createElement('canvas');

rholdBuffer.width = 80;
rholdBuffer.height = 80;
lholdBuffer.width = 80;
lholdBuffer.height = 80;

const rholdBufferContext = rholdBuffer.getContext('2d');
const lholdBufferContext = lholdBuffer.getContext('2d');




//効果音関連
const moveSound = new Audio('se/se1.mp3');
const deleteSound = new Audio('se/se2.mp3');

function playMoveSound() {
    moveSound.pause();
    moveSound.currentTime = 0;
    moveSound.play(); 
}

function playDeleteSound() {
    deleteSound.pause();
    deleteSound.currentTime = 0;
    deleteSound.play();
}

//ミノサイズとフィールド設定
const BLOCK_SIZE = 40;
const ROWS = 24;
const COLS = 10;

const leftField = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
const rightField = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const minoes = [
    { shape: [[1, 1, 1, 1]], color: '#00ffff' }, // I
    { shape: [[1, 1], [1, 1]], color: '#ffff00' }, // O
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#9400d3' }, // T
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#00ff00' }, // S
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#ff0000' }, // Z
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#ffa500' }, // L
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#0000ff' }, // J
    { shape: [[1, 0, 1], [1, 1, 1]], color: '#c70067' }, // 凹
    { shape: [[1, 1, 1], [0, 1, 0], [1, 1, 1]], color: '#b5b5ac' }, // エ
    { shape: [[1, 0, 0], [1, 1, 0], [1, 1, 1]], color: '#434da2' }, // ◣
    { shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], color: '#841a75' }, // 十
    { shape: [[0, 1, 0], [0, 0, 0], [1, 1, 1]], color: '#a22041' }, // ⊥
    { shape: [[0, 1], [1, 0]], color: '#a7d28d' }, // ／
    { shape: [[1, 1, 1]], color: '#808080' }, // －
    { shape: [[1, 1], [1, 0]], color: '#d9aacd' }, // г
    { shape: [[0, 1], [1, 1]], color: '#bee0ce' }, // 」
    { shape: [[1, 0, 1]], color: '#d70035' }, // :
    { shape: [[0, 1, 0], [0, 0, 0], [1, 0, 1]], color: '#c5c56a' }, // ∴
    { shape: [[1, 1]], color: '#00a968' }, // ‐
    { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], color: '#ffffff' }, // ■
    { shape: [[1, 0, 1], [1, 0, 1], [1, 0, 1]], color: '#83ccd2' }, // ⚅
    { shape: [[1, 0, 1], [0, 1, 0], [1, 0, 1]], color: '#ed6d3d' }, // ⚄
    { shape: [[1, 0, 1], [0, 0, 0], [1, 0, 1]], color: '#895b8a' }, // ⚃
    { shape: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], color: '#93ca76' }, // ⚂
    { shape: [[0, 0, 1], [0, 0, 0], [1, 0, 0]], color: '#f8b500' }, // ⚁
    { shape: [[1]], color: '#c9171e' }, // ⚀

];

let currentmino, leftCurrentmino;
let currentX = 4, currentY = 0;
let leftCurrentX = 4, leftCurrentY = 0; 
let dropcheck = 0;
let leftdropcheck = 0;
let dropInterval = 700;
let dropTime = Date.now();
let leftDropTime = Date.now();
let isGameOver = false; 
let isSinglePlayer = true;//一人用モード
let RHp = 120, LHp = 120;
let rholdMino = null; 
let holdUsed = false;
let leftholdMino = null;
let leftholdUsed = false;
let previousRHoldMino = null;
let previousLHoldMino = null;


const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false,
    ArrowUp: false,
    a: false,
    d: false,
    s: false,
    w: false
};

const moveSpeed = 100;//移動速度（ミリ秒）
let lastMoveTime = Date.now();
let lastLeftMoveTime = Date.now();

function clone(mino) {
    return {
        shape: mino.shape.map(row => [...row]),
        color: mino.color
    };
}
function resetmino() {
    currentmino = clone(minoes[Math.floor(Math.random() * minoes.length)]);
    currentX = 4;
    currentY = 0;
    holdUsed = false;
    if (!canMove(currentX, currentY, currentmino.shape)) {
        isGameOver = true; 
        alert("右ゲームオーバー！");
        location.reload();
    }
}



function resetLeftmino() {
    leftCurrentmino = clone(minoes[Math.floor(Math.random() * minoes.length)]);
    leftCurrentX = 4;
    leftCurrentY = 0;
    leftholdUsed = false;
    if (!canMoveLeft(leftCurrentX, leftCurrentY, leftCurrentmino.shape)) {
        isGameOver = true;
        alert("左ゲームオーバー！");
        location.reload();
    }
}

function checkGameOver() {
    if (LHp <= 0) {
        if(leftdropcheck === 1){
        alert("左ゲームオーバー");
        location.reload();}
    } else if (RHp <= 0) {
        if (leftdropcheck === 1){
        alert("右ゲームオーバー");
        location.reload();
        }
    }
}

function resetField() {
    for (let row = 0; row < ROWS; row++) {
        leftField[row].fill(null); // 左フィールドリセット
        rightField[row].fill(null); // 右フィールドリセット
    }
    currentX = 4; 
    currentY = 0; 
    leftCurrentX = 4; 
    leftCurrentY = 0; 
    isGameOver = false; 
}

function drawBlock(x, y, color, context) {
    context.fillStyle = color; 
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = 'black';
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawGrid(context) {
    context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    for (let x = 0; x <= COLS; x++) {
        context.beginPath();
        context.moveTo(x * BLOCK_SIZE, 0);
        context.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        context.stroke();
        
    }
    for (let y = 0; y <= ROWS; y++) {
        context.beginPath();
        context.moveTo(0, y * BLOCK_SIZE);
        context.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
        context.stroke();
    }
}

function drawInitialGrid(context) {
    context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    for (let x = 0; x <= COLS; x++) {
        context.beginPath();
        context.moveTo(x * BLOCK_SIZE, 0);
        context.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        context.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
        context.beginPath();
        context.moveTo(0, y * BLOCK_SIZE);
        context.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
        context.stroke();
    }
}
function drawField(field, context) {
    field.forEach((row, y) => {
        row.forEach((color, x) => {
            if (color) drawBlock(x, y, color, context);
        });
    });
    drawHoldZoneFrame(context);
}

function drawHoldZoneFrame(context) {
    // ホールドゾーンの枠を描画
   // context.strokeStyle = '#FFFFFF'; 
   // context.lineWidth = 1; 
    //context.strokeRect(460, 50, 80, 80); 
}


function drawHoldZone() {
    if (rholdMino === previousRHoldMino) return;
    rholdBufferContext.clearRect(0, 0, rholdBuffer.width, rholdBuffer.height);
    if (rholdMino) {
        const scale = 0.5;
        const offsetX = (rholdBuffer.width - rholdMino.shape[0].length * BLOCK_SIZE * scale) / 2;
        const offsetY = (rholdBuffer.height - rholdMino.shape.length * BLOCK_SIZE * scale) / 2;

        rholdBufferContext.save();
        rholdBufferContext.scale(scale, scale);

        rholdMino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    rholdBufferContext.fillStyle = rholdMino.color;
                    rholdBufferContext.fillRect(
                        (x * BLOCK_SIZE + offsetX / scale),
                        (y * BLOCK_SIZE + offsetY / scale),
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                    rholdBufferContext.strokeStyle = 'black';
                    rholdBufferContext.strokeRect(
                        (x * BLOCK_SIZE + offsetX / scale),
                        (y * BLOCK_SIZE + offsetY / scale),
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                }
            });
        });
        rholdBufferContext.restore();
    }
    const rholdCanvas = document.getElementById('rholdCanvas');
    const holdContext = rholdCanvas.getContext('2d');
    holdContext.clearRect(0, 0, rholdCanvas.width, rholdCanvas.height);
    holdContext.drawImage(rholdBuffer, 0, 0);
    previousRHoldMino = rholdMino;
}




function leftdrawHoldZone() {
    if (leftholdMino === previousLHoldMino) return;
    lholdBufferContext.clearRect(0, 0, lholdBuffer.width, lholdBuffer.height);
    if (leftholdMino) {
        const scale = 0.5;
        const offsetX = (lholdBuffer.width - leftholdMino.shape[0].length * BLOCK_SIZE * scale) / 2;
        const offsetY = (lholdBuffer.height - leftholdMino.shape.length * BLOCK_SIZE * scale) / 2;

        lholdBufferContext.save();
        lholdBufferContext.scale(scale, scale);

        leftholdMino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    lholdBufferContext.fillStyle = leftholdMino.color;
                    lholdBufferContext.fillRect(
                        (x * BLOCK_SIZE + offsetX / scale),
                        (y * BLOCK_SIZE + offsetY / scale),
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                    lholdBufferContext.strokeStyle = 'black';
                    lholdBufferContext.strokeRect(
                        (x * BLOCK_SIZE + offsetX / scale),
                        (y * BLOCK_SIZE + offsetY / scale),
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                }
            });
        });
        lholdBufferContext.restore();
    }
    const lholdCanvas = document.getElementById('lholdCanvas');
    const holdContext = lholdCanvas.getContext('2d');
    holdContext.clearRect(0, 0, lholdCanvas.width, lholdCanvas.height);
    holdContext.drawImage(lholdBuffer, 0, 0);
    previousLHoldMino = leftholdMino;
}


function holdCurrentMino() {
    if (holdUsed) return;

    if (rholdMino) {
        const temp = rholdMino;
        rholdMino = currentmino;
        currentmino = temp;
        currentX = 4;
        currentY = 0;
    } else {
        rholdMino = currentmino;
        resetmino();
    }

    holdUsed = true;
    drawHoldZone();
}

function leftholdCurrentMino() {
    if (leftholdUsed) return;

    if (leftholdMino) {
        const temp = leftholdMino;
        leftholdMino = leftCurrentmino;
        leftCurrentmino = temp;
        leftCurrentX = 4;
        leftCurrentY = 0;
    } else {
        leftholdMino = leftCurrentmino;
        resetLeftmino();
    }

    leftholdUsed = true;
    leftdrawHoldZone();
}



function drawmino(context) {
    if (dropcheck === 1)
    currentmino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) drawBlock(currentX + x, currentY + y, currentmino.color, context);
        });
    });
}

function drawLeftmino(context) {
    if (leftdropcheck === 1)
    leftCurrentmino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) drawBlock(leftCurrentX + x, leftCurrentY + y, leftCurrentmino.color, context);
        });
    });
}




function drop() {
    if (canMove(currentX, currentY + 1, currentmino.shape)) {
        if (dropcheck === 1) {
            currentY++;
        }
    } else {
        currentmino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    rightField[currentY + y][currentX + x] = currentmino.color;
                }
            });
        });
        checkLineClear(rightField); 
        resetmino();
        updateStaticField(rightField, staticRightContext); 
    }
}

function dropLeft() {
    if (canMoveLeft(leftCurrentX, leftCurrentY + 1, leftCurrentmino.shape)) {
        if (leftdropcheck === 1){
        leftCurrentY++;}
    } else {
        leftCurrentmino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    leftField[leftCurrentY + y][leftCurrentX + x] = leftCurrentmino.color;
                }
            });
        });
        checkLineClear(leftField); 
        resetLeftmino();
        updateStaticField(leftField, staticLeftContext);
    }
}

function moveLeft() {
    if (canMove(currentX - 1, currentY, currentmino.shape)) {
        currentX--;
    }
}

function moveRight() {
    if (canMove(currentX + 1, currentY, currentmino.shape)) {
        currentX++;
    }
}

function moveDown() {
    if (canMove(currentX, currentY + 1, currentmino.shape)) {
        currentY++;
    }
}

function moveLeftmino() {
    if (canMoveLeft(leftCurrentX - 1, leftCurrentY, leftCurrentmino.shape)) {
        leftCurrentX--;
    }
}

function moveRightmino() {
    if (canMoveLeft(leftCurrentX + 1, leftCurrentY, leftCurrentmino.shape)) {
        leftCurrentX++;
    }
}

function moveDownmino() {
    if (canMoveLeft(leftCurrentX, leftCurrentY + 1, leftCurrentmino.shape)) {
        leftCurrentY++;
    }
}


function rotate() {
    const rotated = currentmino.shape[0].map((_, index) =>
        currentmino.shape.map(row => row[index]).reverse()
    );

    if (canMove(currentX, currentY, rotated)) {
        currentmino.shape = rotated;
    }
}

function rotateLeftmino() {
    const rotated = leftCurrentmino.shape[0].map((_, index) =>
        leftCurrentmino.shape.map(row => row[index]).reverse()
    );

    if (canMoveLeft(leftCurrentX, leftCurrentY, rotated)) {
        leftCurrentmino.shape = rotated;
    }
}





function canMove(x, y, mino) {
    for (let row = 0; row < mino.length; row++) {
        for (let col = 0; col < mino[row].length; col++) {
            if (mino[row][col]) {
                const newX = x + col;
                const newY = y + row;

                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && rightField[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

//左移動チェック
function canMoveLeft(x, y, mino) {
    for (let row = 0; row < mino.length; row++) {
        for (let col = 0; col < mino[row].length; col++) {
            if (mino[row][col]) {
                const newX = x + col;
                const newY = y + row;

                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && leftField[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}


function checkLineClear(field) {
    let clearedLines = 0;

    for (let row = 0; row < ROWS; row++) {
        if (field[row].every(cell => cell !== null)) {
            clearedLines++;
            field.splice(row, 1);
            field.unshift(Array(COLS).fill(null));
            playDeleteSound();
        }
    }

    if (clearedLines > 0) {
        const damage = 10 + (clearedLines - 1) * 15;

        if (field === rightField) {
           if (leftdropcheck === 1){
            LHp -= damage;             
            updateleftHpDisplay(); 
           }    
        } else if (field === leftField) {
            RHp -= damage;             
            updaterightHpDisplay();    
        }
    }
}

function initStaticDrawings() {
    drawInitialGrid(staticRightContext);
    drawInitialGrid(staticLeftContext);
    drawField(rightField, staticRightContext);//ミノを描画
    drawField(leftField, staticLeftContext);  //ミノを描画
}




function updateStaticField(field, context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);//バッファのクリア
    drawField(field, context);
}


function update() {
    if (!isGameOver) {
        const now = Date.now();
        if (now - dropTime > dropInterval) {
            drop();
            dropTime = now;
            updateStaticField(rightField, staticRightContext);
        }
        if (now - leftDropTime > dropInterval) {
            dropLeft();
            leftDropTime = now;
            updateStaticField(leftField, staticLeftContext);
        }
        rightContext.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
        drawGrid(rightContext); 
        rightContext.drawImage(staticRightBuffer, 0, 0);
        drawmino(rightContext); 

        leftContext.clearRect(0, 0, leftCanvas.width, leftCanvas.height); 
        drawGrid(leftContext);  
        leftContext.drawImage(staticLeftBuffer, 0, 0); 
        drawLeftmino(leftContext); 
    }
}



document.getElementById('kaisiBtn').addEventListener('click', () => {
    isSinglePlayer = true;
    resetField();
    resetmino();
    dropcheck = 1;
    leftCanvas.style.display = 'none'; 
    rightCanvas.style.display = 'block'; 
    rholdCanvas.style.display = 'block'; 
    update();
});

document.getElementById('hutariBtn').addEventListener('click', () => {
    isSinglePlayer = false;
    resetField();
    resetmino();
    resetLeftmino(); 
    dropcheck = 1;
    leftdropcheck = 1;
    leftCanvas.style.display = 'block';
    rightCanvas.style.display = 'block'; 
    rholdCanvas.style.display = 'block'; 
    lholdCanvas.style.display = 'block'; 
    document.getElementById('rholdCanvas').style.left = '1400px';
    update();
    updaterightHpDisplay();
    updateleftHpDisplay();
});


  function updaterightHpDisplay() {
    const display = document.getElementById('RHpDisplay');
    if (dropcheck === 1) {
        display.textContent = `HP: ${RHp}`;
        display.style.display = 'block';
    } else {
        display.style.display = 'none';
    }
    checkGameOver();
}

  function updateleftHpDisplay() {
    const display = document.getElementById('LHpDisplay');
    if (dropcheck === 1) {
      display.textContent = `HP: ${LHp}`;
      display.style.display = 'block';
    } else {
      display.style.display = 'none';
    }
    checkGameOver();
  }

document.addEventListener('keydown', event => {
    if (event.key in keys) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', event => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});


function handleKeys() {
    const now = Date.now();

    if (isSinglePlayer) {
        if (keys.ArrowLeft && now - lastMoveTime > moveSpeed) {
            moveLeft();
            lastMoveTime = now;
        }
        if (keys.ArrowRight && now - lastMoveTime > moveSpeed) {
            moveRight();
            lastMoveTime = now;
        }
        if (keys.ArrowDown && now - lastMoveTime > moveSpeed) {
            moveDown();
            lastMoveTime = now;
        }
        if (keys.ArrowUp && now - lastMoveTime > moveSpeed) {
            playMoveSound();
            rotate();
            lastMoveTime = now;
        }
        document.addEventListener('keydown', event => {
            if (event.code === 'ControlRight') {
                holdCurrentMino();
            }
        });
        
    } else {
        if (keys.a && now - lastLeftMoveTime > moveSpeed) {
            moveLeftmino();
            lastLeftMoveTime = now;
        }
        if (keys.d && now - lastLeftMoveTime > moveSpeed) {
            moveRightmino();
            lastLeftMoveTime = now;
        }
        if (keys.s && now - lastLeftMoveTime > moveSpeed) {
            moveDownmino();
            lastLeftMoveTime = now;
        }
        if (keys.w && now - lastLeftMoveTime > moveSpeed) {
            playMoveSound();
            rotateLeftmino();
            lastLeftMoveTime = now;
        }
        document.addEventListener('keydown', event => {
            if (event.key === 'g') {
                leftholdCurrentMino();
            }
        });
        if (keys.ArrowLeft && now - lastMoveTime > moveSpeed) {
            moveLeft();
            lastMoveTime = now;
        }
        if (keys.ArrowRight && now - lastMoveTime > moveSpeed) {
            moveRight();
            lastMoveTime = now;
        }
        if (keys.ArrowDown && now - lastMoveTime > moveSpeed) {
            moveDown();
            lastMoveTime = now;
        }
        if (keys.ArrowUp && now - lastMoveTime > moveSpeed) {
            playMoveSound();
            rotate();
            lastMoveTime = now;
        }
        document.addEventListener('keydown', event => {
            if (event.code === 'ControlRight') {
                holdCurrentMino();
            }
        });
    }
}


function gameLoop() {
    handleKeys();
    update();
    requestAnimationFrame(gameLoop);
}

//開始
initStaticDrawings();
update();
resetmino();
resetLeftmino();
gameLoop();