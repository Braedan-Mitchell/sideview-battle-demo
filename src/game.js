//=================
// Canvas Setup
//=================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


//=================
// Dodge Input Edge Trigger + Cooldown
//=================
let dodgePressed = false;       //true only on the frame the dodge key is pressed
let dodgeLocked = false;        //prevents mashing dodge
let dodgeCooldownTimer = 0;     //post-dodge cooldown timer
const DODGE_COOLDOWN = 150;


//=================
// Input State
//=================
const keys = {
    left: false,
    right: false,
    block: false,
    dodge: false,
    attack: false
};


//=================
// Input Listeners
//=================
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyA') keys.left = true;
    if (e.code === 'KeyD') keys.right = true;
    if (e.code === 'KeyJ') keys.attack = true;
    if (e.code === 'KeyK') keys.block = true;
    if (e.code === 'KeyL' && !keys.dodge){
        dodgePressed = true; //only true on the frame the key is pressed
    }
    if (e.code === 'KeyL') keys.dodge = true;
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyA') keys.left = false;
    if (e.code === 'KeyD') keys.right = false;
    if (e.code === 'KeyJ') keys.attack = false;
    if (e.code === 'KeyK') keys.block = false;
    if (e.code === 'KeyL') keys.dodge = false;
});

//=================
// Constants
//=================
const GROUND_HEIGHT = 50;
const MOVE_SPEED = 4;

const ATTACK_DURATION = 200;

const DODGE_DURATION = 350;
const DODGE_DISTANCE = 80; 


//=================
// Player State Enum
//=================
const PLAYER_STATE = {
    IDLE: 'idle',
    MOVING: 'moving',
    BLOCKING: 'blocking',
    DODGING: 'dodging',
    ATTACKING: 'attacking'
};


//=================
// Player Object (will become a class)
//=================
const player = {
    x: 100,
    y: canvas.height - GROUND_HEIGHT,
    width: 40,
    height: 70,
    color: 'white',

    // Dodge
    isDodging: false,
    dodgeTimer: 0,
    dodgeDirection: 0, // -1 left, 0 spot dodge, +1 right
    isInvincible: false,
    rotation: 0, // for spin animation
    scaleX: 1,
    scaleY: 1,
    lastDashAmount: 0,

    //Attack
    attackTimer: 0,

    // State
    state: PLAYER_STATE.IDLE
};


//=================
// Update loop
//=================
function update() {

    // Dodge cooldown countdown
    if (dodgeCooldownTimer > 0){
        dodgeCooldownTimer -= 16;
        if (dodgeCooldownTimer <0) dodgeCooldownTimer = 0;
    }

    // Slow movement during attack
    let currentSpeed = MOVE_SPEED;
    if (player.state === PLAYER_STATE.ATTACKING) {
        currentSpeed = MOVE_SPEED * 0.4; // 40% speed during attack
    }

    // Start dodge
    if (!player.isDodging && dodgePressed && !dodgeLocked && dodgeCooldownTimer <= 0) {
        dodgePressed = false; //consumes press
        dodgeLocked = true; //locks until dodge is finished
        // Initiate dodge
        player.isDodging = true;
        player.dodgeTimer = DODGE_DURATION;
        player.isInvincible = true;

        //determines dodge direction
        if (keys.left) player.dodgeDirection = -1;
        else if (keys.right) player.dodgeDirection = 1;
        else player.dodgeDirection = 0; // spot dodge
    }

    // Dodge logic
    if (player.isDodging) {
        const t = 1 - (player.dodgeTimer / DODGE_DURATION);
        // t goes from 0 to 1 during the dodge duration

        // directional dodge
        if (player.dodgeDirection !== 0) {
            // Ease out movement
            const easeOut = 1 - (1 -t) * (1 - t); // quadratic ease out
            const dashAmount = easeOut * DODGE_DISTANCE * player.dodgeDirection;

            player.x += dashAmount - (player.lastDashAmount || 0);
            player.lastDashAmount = dashAmount;

            //spin
            player.rotation = t * 360;
            player.scaleX = 1;
            player.scaleY = 1;
        }

        //spot dodge
        else{
            //shrink and grow
            if (t < 0.5) {
                // first half: squish horizontally
                player.scaleX = 1 + t * 0.3;
                player.scaleY = 1 - t * 0.3;
            } else {
                // second half: return to normal
                player.scaleX = 1 + (1 - t) * 0.3;
                player.scaleY = 1 - (1 - t) * 0.3;
            }

            player.rotation = 0;
        }

        // countdown
        player.dodgeTimer -= 16;
        if (player.dodgeTimer <= 0) {
            player.isDodging = false;
            player.isInvincible = false;
            player.rotation = 0;
            player.scaleX = 1;
            player.scaleY = 1;
            player.lastDashAmount = 0;

            dodgeCooldownTimer = DODGE_COOLDOWN; //start cooldown
            dodgeLocked = false; //unlock dodge after finishing
        }
    }

    // movement
    let isMoving = false;

    if (keys.left) {
        player.x -= currentSpeed;
        isMoving = true;
    }
    if (keys.right) {
        player.x += currentSpeed;
        isMoving = true;
    }

    // Keep player within canvas bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    //attack timer countdown
    if (player.attackTimer > 0) {
        player.attackTimer -= 16; //approx 60 fps
        if (player.attackTimer <= 0) player.attackTimer = 0;
    }

    //state priority
    if (player.attackTimer > 0) {
        player.state = PLAYER_STATE.ATTACKING;
    }
    else if (keys.attack) {
        player.attackTimer = ATTACK_DURATION;
        player.state = PLAYER_STATE.ATTACKING;
    }

    else if (player.isDodging) {
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


//=================
// Draw loop
//=================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ground
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height- 50, canvas.width, 50);

    //state colors
    if (player.state === PLAYER_STATE.IDLE) player.color = 'white';
    else if (player.state === PLAYER_STATE.MOVING) player.color = 'lightgreen';
    else if (player.state === PLAYER_STATE.BLOCKING) player.color = 'lightblue';
    else if (player.state === PLAYER_STATE.DODGING) {
        player.color = player.isInvincible ? 'orange' : 'darkorange';
    }
    else if (player.state === PLAYER_STATE.ATTACKING) player.color = 'red';

    // draw player
    ctx.save();
    // Move to player center
    ctx.translate(player.x + player.width / 2, player.y - player.height / 2);
    // Apply rotation
    ctx.rotate(player.rotation * Math.PI / 180);
    // Apply squash/stretch
    ctx.scale(player.scaleX, player.scaleY);
    // Draw centered rectangle
    ctx.fillStyle = player.color;
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);

    ctx.restore();
}


//=================
// Main Game Loop
//=================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();