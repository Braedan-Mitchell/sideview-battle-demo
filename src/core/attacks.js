export const GROUND_COMBO = {
    STARTER: {
        id: 'ground_starter',
        name: 'Ground Starter',

        // Core damage stats
        ATK: 1.0,
        MAG: null,
        MGATK: 0,
        MULT: 1.0,

        // Crit
        CRIT_RATE: 0.05,
        CRIT_DMG: 1.5,

        // Knockback/control
        KBK: 2,
        STAGGER: 5,
        LAUNCH: 0,
        JUGGLE: 0,

        // Speed (relative to base)
        SPD: 1.0,

        // I-frames
        IFRAMES: null,

        // Meter gain
        SPECIAL_GAIN: 5,
        MAGIC_GAIN: 3,

        // Hitbox data
        hitbox: {
            width: 50,
            height: 40,
            offsetX: 30,
            offsetY: -40
        },

        // Animation data
        activeFrames: [6, 12],
        cancelWindow: [10, 20],
        totalDuration: 24
    },

    FOLLOWUP: {
        id: 'ground_followup',
        name: 'Ground Follow-up',
        ATK: 1.2,
        MAG: null,
        MGATK: 0,
        MULT: 1.0,
        CRIT_RATE: 0.05,
        CRIT_DMG: 1.5,
        KBK: 3,
        STAGGER: 7,
        LAUNCH: 0,
        JUGGLE: 0,
        SPD: 1.0,
        IFRAMES: null,
        SPECIAL_GAIN: 6,
        MAGIC_GAIN: 4,
        hitbox: {
            width: 60,
            height: 45,
            offsetX: 35,
            offsetY: -45
        },
        activeFrames: [7, 14],
        cancelWindow: [12, 24],
        totalDuration: 28
    },

    FINISHER: {
        id: 'ground_finisher',
        name: 'Ground Finisher',
        ATK: 1.0,
        MAG: null,
        MGATK: 0,
        MULT: 1.5,   // big finisher multiplier
        CRIT_RATE: 0.08,
        CRIT_DMG: 1.7,
        KBK: 6,
        STAGGER: 12,
        LAUNCH: 0,
        JUGGLE: 0,
        SPD: 1.0,
        IFRAMES: null,
        SPECIAL_GAIN: 8,
        MAGIC_GAIN: 5,
        hitbox: {
            width: 70,
            height: 50,
            offsetX: 40,
            offsetY: -50
        },
        activeFrames: [10, 18],
        cancelWindow: [16, 30],
        totalDuration: 34
    }
}