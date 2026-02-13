// ============================================
// PLAYER CONTROLLER - Local Player Logic
// ============================================

class PlayerController {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.mesh = null;
        this.health = GAME_CONSTANTS.PLAYER_HEALTH;
        this.ammo = 30;
        this.kills = 0;
        this.velocity = new THREE.Vector3();
        this.isGrounded = false;
    }

    /**
     * Initialize player mesh
     */
    init() {
        const geometry = new THREE.CapsuleGeometry(0.5, 1.8, 8, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
        this.mesh.position.copy(this.camera.position);
    }

    /**
     * Update player based on input
     */
    update(deltaTime) {
        this.handleMovement(deltaTime);
        this.updatePosition();
    }

    /**
     * Handle player movement
     */
    handleMovement(deltaTime) {
        const movement = inputManager.getMovementVector();
        
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(this.camera.up, forward).normalize();

        const speed = inputManager.isSprinting() ? 
            GAME_CONSTANTS.PLAYER_SPEED * 1.5 : 
            GAME_CONSTANTS.PLAYER_SPEED;

        const moveVector = new THREE.Vector3();
        moveVector.addScaledVector(forward, movement.z * speed);
        moveVector.addScaledVector(right, movement.x * speed);

        this.camera.position.add(moveVector.multiplyScalar(deltaTime));

        // Update mesh position to follow camera
        if (this.mesh) {
            this.mesh.position.copy(this.camera.position);
        }
    }

    /**
     * Update player position (sync with mesh)
     */
    updatePosition() {
        if (this.mesh) {
            this.mesh.position.copy(this.camera.position);
        }
    }

    /**
     * Reduce health
     */
    takeDamage(damage) {
        this.health -= damage;
        if (this.health < 0) this.health = 0;
        console.log(`Player health: ${this.health}`);
    }

    /**
     * Add ammo
     */
    addAmmo(amount) {
        this.ammo += amount;
    }

    /**
     * Use ammo
     */
    useAmmo(amount) {
        this.ammo = Math.max(0, this.ammo - amount);
    }

    /**
     * Add kill
     */
    addKill() {
        this.kills++;
        this.health = Math.min(this.health + 10, GAME_CONSTANTS.PLAYER_HEALTH);
    }

    /**
     * Reset player
     */
    reset() {
        this.health = GAME_CONSTANTS.PLAYER_HEALTH;
        this.ammo = 30;
    }
}

let playerController = null;
