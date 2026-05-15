const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2D');
const player = {
    x: 100,
    y: canvas.height - 150,
    width: 50,
    height:80,
    color: 'white'
};

function update() {

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