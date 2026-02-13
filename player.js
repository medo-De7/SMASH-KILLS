// Player Movement and Controls

const keys = {};
const playerSpeed = 0.15;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function updatePlayerMovement() {
    if (!camera) return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).normalize();

    // W - Forward
    if (keys['w'] || keys['W']) {
        camera.position.addScaledVector(forward, playerSpeed);
    }

    // S - Backward
    if (keys['s'] || keys['S']) {
        camera.position.addScaledVector(forward, -playerSpeed);
    }

    // A - Left
    if (keys['a'] || keys['A']) {
        camera.position.addScaledVector(right, -playerSpeed);
    }

    // D - Right
    if (keys['d'] || keys['D']) {
        camera.position.addScaledVector(right, playerSpeed);
    }

    // Space - Jump
    if (keys[' ']) {
        // Jump logic here
    }
}

// Update player position in animation loop
// Call updatePlayerMovement() in the animate function
