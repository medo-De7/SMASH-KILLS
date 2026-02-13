// Game Logic - Hit Detection, Scoring, Game Rules

class GameLogic {
    constructor() {
        this.players = {};
        this.gameState = 'waiting'; // waiting, active, ended
    }

    // Calculate distance between two points (for hit detection)
    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // Check if shot hit target
    checkHit(shooterPos, targetPos, maxRange = 100) {
        const distance = this.calculateDistance(shooterPos, targetPos);
        return distance <= maxRange;
    }

    // Apply damage to player
    applyDamage(playerId, damage) {
        if (this.players[playerId]) {
            this.players[playerId].health -= damage;
            if (this.players[playerId].health <= 0) {
                this.players[playerId].health = 0;
                return true; // Player is dead
            }
        }
        return false;
    }

    // Record kill
    recordKill(killerId, victimId) {
        if (this.players[killerId]) {
            this.players[killerId].kills++;
            this.players[killerId].money += 100; // Reward for kill
        }
    }

    // Respawn player
    respawnPlayer(playerId) {
        if (this.players[playerId]) {
            this.players[playerId].health = 100;
            this.players[playerId].position = this.getRandomSpawnPoint();
        }
    }

    // Get random spawn point
    getRandomSpawnPoint() {
        return {
            x: (Math.random() - 0.5) * 50,
            y: 5,
            z: (Math.random() - 0.5) * 50
        };
    }

    // Update game time
    updateGameTime() {
        // Game timing logic
    }
}

module.exports = GameLogic;
