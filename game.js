const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {
    left: false,
    right: false,
    block: false,
    dodge: false,
    attack: false
};

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyA') keys.left = true;
    if (e.code === 'KeyD') keys.right = true;
    if (e.code === 'KeyJ') keys.attack = true;
    if (e.code === 'KeyK') keys.block = true;
    if (e.code === 'KeyL') keys.dodge = true;
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyA') keys.left = false;
    if (e.code === 'KeyD') keys.right = false;
    if (e.code === 'KeyJ') keys.attack = false;
    if (e.code === 'KeyK') keys.block = false;
    if (e.code === 'KeyL') keys.dodge = false;
});

const player = {
    x: 100,
    y: canvas.height - 150,
    width: 50,
    height:80,
    color: 'white',
};

    player.attackTimer = 0;
    const ATTACK_DURATION = 200;

const PLAYER_STATE = {
    IDLE: 'idle',
    MOVING: 'moving',
    BLOCKING: 'blocking',
    DODGING: 'dodging',
    ATTACKING: 'attacking'
}

player.state =PLAYER_STATE.IDLE;

const MOVE_SPEED = 4;

function update() {
    let isMoving = false;

    //movement
    if (keys.left) {
        player.x -= MOVE_SPEED;
        isMoving = true;
    }
    if (keys.right) {
        player.x += MOVE_SPEED;
        isMoving = true;
    }

    // Keep player within canvas bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    //attack timer countdown
    if (player.attackTimer > 0) {
        player.attackTimer -= 16; //approx 60 fps
        if (player.attackTimer <= 0) {
            player.attackTimer = 0;
        }
    }

    //state priority
    if (player.attackTimer > 0) {
        player.state = PLAYER_STATE.ATTACKING;
    }
    else if (keys.attack) {
        player.attackTimer = ATTACK_DURATION;
        player.state = PLAYER_STATE.ATTACKING;
    }
    else if (keys.dodge) {
        player.state = PLAYER_STATE.DODGING;
    }
    else if (keys.block) {
        player.state = PLAYER_STATE.BLOCKING;
    }
    else if (isMoving) {
        player.state = PLAYER_STATE.MOVING;
    }
    else {
        player.state = PLAYER_STATE.IDLE;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ground
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height- 50, canvas.width, 50);

    //state
    if (player.state === PLAYER_STATE.IDLE) player.color = 'white';
    else if (player.state === PLAYER_STATE.MOVING) player.color = 'lightgreen';
    else if (player.state === PLAYER_STATE.BLOCKING) player.color = 'lightblue';
    else if (player.state === PLAYER_STATE.DODGING) player.color = 'green';
    else if (player.state === PLAYER_STATE.ATTACKING) player.color = 'red';
    //player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y - player.height, player.width, player.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();