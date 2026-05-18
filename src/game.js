import { setupInput } from './core/input.js';
import { GROUND_HEIGHT } from './core/constants.js';
import { Player } from './player/Player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

setupInput();

const player = new Player(100, canvas.height - GROUND_HEIGHT);

let dodgeState = {
    dodgePressed: false,
    dodgeLocked: false,
    dodgeCooldownTimer: 0
};

function update() {
    dodgeState = player.update(dodgeState);
    // Keep player within canvas bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ground
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height- GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);

    // Player
    player.draw(ctx);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();