const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {
    left: false,
    right: false
};

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyA') keys.left = true;
    if (e.code === 'KeyD') keys.right = true;
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyA') keys.left = false;
    if (e.code === 'KeyD') keys.right = false;
});

const player = {
    x: 100,
    y: canvas.height - 150,
    width: 50,
    height:80,
    color: 'white'
};

const MOVE_SPEED = 4;

function update() {
    if (keys.left) {
        player.x -= MOVE_SPEED;
    }
    if (keys.right) {
        player.x += MOVE_SPEED;
    }

    // Keep player within canvas bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ground
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height- 50, canvas.width, 50);

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