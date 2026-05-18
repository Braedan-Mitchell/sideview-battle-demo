import { PLAYER_STATE } from '../core/state.js';
import {
    MOVE_SPEED,
    ATTACK_DURATION,
    DODGE_DURATION,
    DODGE_DISTANCE
} from '../core/constants.js';

import { keys } from '../core/input.js';

//=================
// Player Class
//=================
export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = 40;
        this.height = 70;
        this.color = 'white';

        // Dodge
        this.isDodging = false;
        this.dodgeTimer = 0;
        this.dodgeDirection = 0;
        this.isInvincible = false;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.lastDashAmount = 0;

        // Attack
        this.attackTimer = 0;

        // State
        this.state = PLAYER_STATE.IDLE;
    }

    update(dodgeState) {
    // Cooldown
    if (dodgeState.dodgeCooldownTimer > 0) {
        dodgeState.dodgeCooldownTimer -= 16;
        if (dodgeState.dodgeCooldownTimer < 0) dodgeState.dodgeCooldownTimer = 0;
    }

    // Movement speed
    let currentSpeed = MOVE_SPEED;
    if (this.state === PLAYER_STATE.ATTACKING) {
        currentSpeed = MOVE_SPEED * 0.4;
    }

    // Start dodge
    if (!this.isDodging && keys.dodgePressed && !dodgeState.dodgeLocked && dodgeState.dodgeCooldownTimer <= 0) {
        keys.dodgePressed = false;
        dodgeState.dodgeLocked = true;

        this.isDodging = true;
        this.dodgeTimer = DODGE_DURATION;
        this.isInvincible = true;

        if (keys.left) this.dodgeDirection = -1;
        else if (keys.right) this.dodgeDirection = 1;
        else this.dodgeDirection = 0;
    }

    // Dodge behavior
    if (this.isDodging) {
        const t = 1 - (this.dodgeTimer / DODGE_DURATION);

        if (this.dodgeDirection !== 0) {
            const easeOut = 1 - (1 - t) * (1 - t);
            const dashAmount = easeOut * DODGE_DISTANCE * this.dodgeDirection;

            this.x += dashAmount - (this.lastDashAmount || 0);
            this.lastDashAmount = dashAmount;

            this.rotation = t * 360;
            this.scaleX = 1;
            this.scaleY = 1;
        } else {
            if (t < 0.5) {
                this.scaleX = 1 + t * 0.3;
                this.scaleY = 1 - t * 0.3;
            } else {
                this.scaleX = 1 + (1 - t) * 0.3;
                this.scaleY = 1 - (1 - t) * 0.3;
            }
            this.rotation = 0;
        }

        this.dodgeTimer -= 16;
        if (this.dodgeTimer <= 0) {
            this.isDodging = false;
            this.isInvincible = false;
            this.rotation = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.lastDashAmount = 0;

            // Unlock dodge after cooldown
            dodgeState.dodgeCooldownTimer = 150;
            dodgeState.dodgeLocked = false;
        }
    }

    // Movement
    let isMoving = false;
    if (keys.left) {
        this.x -= currentSpeed;
        isMoving = true;
    }
    if (keys.right) {
        this.x += currentSpeed;
        isMoving = true;
    }

    // Attack timer
    if (this.attackTimer > 0) {
        this.attackTimer -= 16;
        if (this.attackTimer < 0) this.attackTimer = 0;
    }

    // State priority
    if (this.attackTimer > 0) {
        this.state = PLAYER_STATE.ATTACKING;
    }
    else if (keys.attack) {
        this.attackTimer = ATTACK_DURATION;
        this.state = PLAYER_STATE.ATTACKING;
    }
    else if (this.isDodging) {
        this.state = PLAYER_STATE.DODGING;
    }
    else if (keys.block) {
        this.state = PLAYER_STATE.BLOCKING;
    }
    else if (isMoving) {
        this.state = PLAYER_STATE.MOVING;
    }
    else {
        this.state = PLAYER_STATE.IDLE;
    }

    return dodgeState;
}


    draw(ctx) {
        // Color by state
        if (this.state === PLAYER_STATE.IDLE) this.color = 'white';
        else if (this.state === PLAYER_STATE.MOVING) this.color = 'lightgreen';
        else if (this.state === PLAYER_STATE.BLOCKING) this.color = 'lightblue';
        else if (this.state === PLAYER_STATE.DODGING) {
            this.color = this.isInvincible ? 'orange' : 'darkorange';
        }
        else if (this.state === PLAYER_STATE.ATTACKING) this.color = 'red';

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y - this.height/ 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scaleX, this.scaleY);

        ctx.fillStyle = this.color || 'white';
        ctx.fillRect(-this.width / 2, -this.height /2, this.width, this.height);

        ctx.restore();
        console.log('drawing player at', this.x, this.y);
    }
}