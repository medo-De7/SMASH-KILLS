// ============================================
// ENEMY MANAGER - Enemy Spawning & Management
// ============================================

class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = {};
        this.interpolationSpeed = 0.1; // Smoothness of movement
    }

    /**
     * Spawn enemy player as 3D box
     */
    spawnEnemy(playerId, position, playerData) {
        // Create box geometry for player (placeholder)
        const geometry = new THREE.BoxGeometry(0.6, 1.8, 0.6);
        const material = new THREE.MeshLambertMaterial({ 
            color: Math.random() * 0xffffff,
            emissive: 0x111111
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.copy(position);

        // Create a container for the player
        const container = new THREE.Group();
        container.add(mesh);

        // Add a simple head box
        const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const headMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffdbac
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.9;
        head.castShadow = true;
        head.receiveShadow = true;
        container.add(head);

        // Create a nametag
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = '#00ff00';
        ctx.font = 'Bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(playerData.name || `Player_${playerId.substring(0, 5)}`, 128, 45);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const nameTag = new THREE.Sprite(spriteMaterial);
        nameTag.scale.set(2, 0.5, 1);
        nameTag.position.y = 1.2;
        container.add(nameTag);

        container.position.copy(position);

        this.enemies[playerId] = {
            id: playerId,
            mesh: container,
            health: playerData.health || 100,
            position: position.clone(),
            targetPosition: position.clone(),
            rotation: new THREE.Euler(),
            name: playerData.name || `Player_${playerId}`
        };

        this.scene.add(container);
        console.log(`Enemy spawned: ${this.enemies[playerId].name}`);
    }

    /**
     * Update enemy with smooth interpolation
     */
    updateEnemy(playerId, data) {
        if (!this.enemies[playerId]) return;

        const enemy = this.enemies[playerId];
        
        // Update target position
        if (data.position) {
            enemy.targetPosition.copy(data.position);
        }

        // Smoothly interpolate position
        enemy.position.lerp(enemy.targetPosition, this.interpolationSpeed);
        enemy.mesh.position.copy(enemy.position);

        // Update rotation if provided
        if (data.rotation) {
            enemy.mesh.rotation.copy(data.rotation);
        }

        // Update health
        if (data.health !== undefined) {
            enemy.health = data.health;
        }
    }

    /**
     * Remove enemy
     */
    removeEnemy(playerId) {
        if (this.enemies[playerId]) {
            this.scene.remove(this.enemies[playerId].mesh);
            delete this.enemies[playerId];
            console.log(`Enemy removed: ${playerId}`);
        }
    }

    /**
     * Get enemy by ID
     */
    getEnemy(playerId) {
        return this.enemies[playerId];
    }

    /**
     * Get all enemies
     */
    getAllEnemies() {
        return Object.values(this.enemies);
    }

    /**
     * Update all enemies (interpolation loop)
     */
    update(deltaTime) {
        Object.values(this.enemies).forEach(enemy => {
            if (enemy.mesh && enemy.position && enemy.targetPosition) {
                // Smooth interpolation
                enemy.position.lerp(enemy.targetPosition, this.interpolationSpeed);
                enemy.mesh.position.copy(enemy.position);
            }
        });
    }

    /**
     * Get enemy count
     */
    getEnemyCount() {
        return Object.keys(this.enemies).length;
    }

    /**
     * Clear all enemies
     */
    clear() {
        Object.values(this.enemies).forEach(enemy => {
            this.scene.remove(enemy.mesh);
        });
        this.enemies = {};
        console.log('All enemies cleared');
    }

    /**
     * Set interpolation speed (0.0 to 1.0)
     */
    setInterpolationSpeed(speed) {
        this.interpolationSpeed = Helpers.clamp(speed, 0, 1);
    }
}

let enemyManager = null;
