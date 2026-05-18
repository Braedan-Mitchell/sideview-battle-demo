//=================
// Input State
//=================
export const keys = {
    left: false,
    right: false,
    block: false,
    dodge: false,
    attack: false
};

keys.dodgePressed = false;       //true only on the frame the dodge key is pressed

//=================
// Input Listeners
//=================
export function setupInput() {
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyA') keys.left = true;
        if (e.code === 'KeyD') keys.right = true;
        if (e.code === 'KeyJ') keys.attack = true;
        if (e.code === 'KeyK') keys.block = true;
        if (e.code === 'KeyL' && !keys.dodge){
            keys.dodgePressed = true; //only true on the frame the key is pressed
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
}