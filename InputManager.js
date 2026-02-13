// ============================================
// INPUT MANAGER - Handles Player Input
// ============================================

class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0, leftClick: false, rightClick: false };
        this.setupKeyboardListeners();
        this.setupMouseListeners();
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.handleKeyDown(e);
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.handleKeyUp(e);
        });
    }

    setupMouseListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.leftClick = true;
            if (e.button === 2) this.mouse.rightClick = true;
        });

        document.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.leftClick = false;
            if (e.button === 2) this.mouse.rightClick = false;
        });

        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    handleKeyDown(event) {
        // Can be overridden for specific key handling
    }

    handleKeyUp(event) {
        // Can be overridden for specific key handling
    }

    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }

    getMovementVector() {
        const movement = { x: 0, z: 0 };
        if (this.isKeyPressed('w')) movement.z += 1;
        if (this.isKeyPressed('s')) movement.z -= 1;
        if (this.isKeyPressed('a')) movement.x -= 1;
        if (this.isKeyPressed('d')) movement.x += 1;
        return movement;
    }

    isJumping() {
        return this.isKeyPressed(' ');
    }

    isSprinting() {
        return this.isKeyPressed('shift');
    }

    isFiring() {
        return this.mouse.leftClick;
    }

    isAiming() {
        return this.mouse.rightClick;
    }
}

const inputManager = new InputManager();
