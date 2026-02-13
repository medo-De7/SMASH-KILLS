// ============================================
// POINTER LOCK CONTROLS - FPS Camera Control
// ============================================

class PointerLockControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.isLocked = false;
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.PI_2 = Math.PI / 2;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onPointerlockChange = this.onPointerlockChange.bind(this);
        this.onPointerlockError = this.onPointerlockError.bind(this);

        this.connect();
    }

    connect() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('pointerlockchange', this.onPointerlockChange);
        document.addEventListener('pointerlockerror', this.onPointerlockError);
    }

    onMouseMove(event) {
        if (!this.isLocked) return;

        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this.euler.setFromQuaternion(this.camera.quaternion);
        this.euler.rotateY(-movementX * 0.002);
        this.euler.rotateX(-movementY * 0.002);
        this.euler.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.euler.x));
        this.camera.quaternion.setFromEuler(this.euler);
    }

    onPointerlockChange() {
        this.isLocked = document.pointerLockElement === this.domElement;
        console.log('Pointer lock:', this.isLocked ? 'Locked' : 'Unlocked');
    }

    onPointerlockError() {
        console.error('Pointer lock error');
    }

    lock() {
        this.domElement.requestPointerLock =
            this.domElement.requestPointerLock || this.domElement.mozRequestPointerLock;

        if (this.domElement.requestPointerLock) {
            this.domElement.requestPointerLock();
        }
    }

    unlock() {
        document.exitPointerLock =
            document.exitPointerLock || document.mozExitPointerLock;

        if (document.exitPointerLock) {
            document.exitPointerLock();
        }
    }

    disconnect() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('pointerlockchange', this.onPointerlockChange);
        document.removeEventListener('pointerlockerror', this.onPointerlockError);
    }

    dispose() {
        this.disconnect();
    }
}
