// ============================================
// MAIN SCENE - Level/Map Setup
// ============================================

class MainScene {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Initialize the main game scene/map
     */
    init() {
        this.setupEnvironment();
        this.spawnPoints = this.getSpawnPoints();
    }

    /**
     * Setup environment
     */
    setupEnvironment() {
        // Create buildings, obstacles, etc.
        this.createBuilding(5, 3, 0, 0xff0000);
        this.createBuilding(-5, 3, 0, 0x0000ff);
    }

    /**
     * Create building geometry
     */
    createBuilding(x, height, z, color) {
        const geometry = new THREE.BoxGeometry(5, height, 5);
        const material = new THREE.MeshLambertMaterial({ color: color });
        const building = new THREE.Mesh(geometry, material);
        building.castShadow = true;
        building.receiveShadow = true;
        building.position.set(x, height / 2, z);
        this.scene.add(building);
    }

    /**
     * Get spawn points for players
     */
    getSpawnPoints() {
        return [
            new THREE.Vector3(10, 2, 10),
            new THREE.Vector3(-10, 2, -10),
            new THREE.Vector3(10, 2, -10),
            new THREE.Vector3(-10, 2, 10),
            new THREE.Vector3(0, 2, 10),
            new THREE.Vector3(0, 2, -10),
        ];
    }

    /**
     * Get random spawn point
     */
    getRandomSpawnPoint() {
        return this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
    }
}

let mainScene = null;
