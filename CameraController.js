// ============================================
// CAMERA CONTROLLER - FPS Camera Setup
// ============================================

class CameraController {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        this.controls = new PointerLockControls(camera, renderer.domElement);
        this.cameraHeight = 1.6; // Eye level height
    }

    /**
     * Initialize camera
     */
    init() {
        console.log('Initializing CameraController...');
        
        // Lock pointer on click
        this.renderer.domElement.addEventListener('click', () => {
            this.controls.lock();
        });
    }

    /**
     * Update camera position based on player
     */
    updatePosition(playerPosition) {
        // Camera stays at player position + eye height
        const targetPos = new THREE.Vector3(
            playerPosition.x,
            playerPosition.y + this.cameraHeight,
            playerPosition.z
        );

        this.camera.position.lerp(targetPos, 0.1);
    }

    /**
     * Get camera forward direction
     */
    getForwardDirection() {
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        return forward;
    }

    /**
     * Get camera right direction
     */
    getRightDirection() {
        const forward = this.getForwardDirection();
        const right = new THREE.Vector3();
        right.crossVectors(this.camera.up, forward).normalize();
        return right;
    }

    /**
     * Get camera up direction
     */
    getUpDirection() {
        return this.camera.up;
    }

    /**
     * Get camera euler angles
     */
    getRotation() {
        const euler = new THREE.Euler();
        euler.setFromQuaternion(this.camera.quaternion);
        return {
            x: euler.x,
            y: euler.y,
            z: euler.z
        };
    }

    /**
     * Check if pointer is locked
     */
    isPointerLocked() {
        return this.controls.isLocked;
    }

    /**
     * Get camera data for network transmission
     */
    getCameraData() {
        return {
            position: this.camera.position.clone(),
            rotation: this.getRotation()
        };
    }
}

let cameraController = null;
