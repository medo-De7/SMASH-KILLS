// ============================================
// NETWORK MANAGER - Socket.io Communication
// ============================================

class NetworkManager {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.playerId = null;
    }

    /**
     * Initialize network connection
     */
    connect() {
        this.socket = io(GAME_CONSTANTS.SERVER_URL);

        this.socket.on('connect', () => {
            this.connected = true;
            this.playerId = this.socket.id;
            console.log('Connected to server:', this.playerId);
            this.emit('playerReady', { name: 'Player' });
        });

        this.socket.on('playerList', (players) => {
            console.log('Players in game:', players);
            // Spawn existing players
            players.forEach(player => {
                if (player.id !== this.playerId) {
                    this.handleNewPlayer(player);
                }
            });
        });

        // Handle new player joining
        this.socket.on('playerJoined', (player) => {
            console.log('Player joined:', player);
            if (player.id !== this.playerId) {
                this.handleNewPlayer(player);
            }
        });

        // Handle player updates with interpolation
        this.socket.on('playerUpdate', (data) => {
            this.handlePlayerUpdate(data);
        });

        // Handle player disconnection
        this.socket.on('playerLeft', (playerId) => {
            console.log('Player left:', playerId);
            this.handlePlayerLeft(playerId);
        });

        this.socket.on('hit', (data) => {
            console.log('Hit detected:', data);
        });

        this.socket.on('disconnect', () => {
            this.connected = false;
            console.log('Disconnected from server');
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }

    /**
     * Handle new player spawn
     */
    handleNewPlayer(player) {
        if (enemyManager) {
            enemyManager.spawnEnemy(player.id, player.position || new THREE.Vector3(0, 0, 0), player);
        }
    }

    /**
     * Handle player disconnection
     */
    handlePlayerLeft(playerId) {
        if (enemyManager) {
            enemyManager.removeEnemy(playerId);
        }
    }

    /**
     * Emit event to server
     */
    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    /**
     * Listen for event from server
     */
    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    /**
     * Send player data
     */
    sendPlayerData(data) {
        this.emit('playerData', {
            position: data.position,
            rotation: data.rotation,
            health: data.health,
            ammo: data.ammo
        });
    }

    /**
     * Report hit
     */
    reportHit(targetId, damage) {
        this.emit('hit', {
            shooter: this.playerId,
            target: targetId,
            damage: damage,
            type: 'bullet'
        });
    }

    /**
     * Handle player update from server
     */
    handlePlayerUpdate(data) {
        if (data.id !== this.playerId) {
            // Update other player's position
        }
    }

    /**
     * Disconnect from server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

const networkManager = new NetworkManager();
