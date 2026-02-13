// Main Server File - Express + Socket.io

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Store connected players
const players = {};
const MAX_PLAYERS = 50;

console.log('🎮 SMASH KILLS Server Starting...');

// Socket.io event handlers
io.on('connection', (socket) => {
    console.log(`✓ Player connected: ${socket.id}`);

    // Store player data
    players[socket.id] = {
        id: socket.id,
        name: 'Player',
        position: { x: 0, y: 2, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        health: 100,
        ammo: 30,
        kills: 0,
        timestamp: Date.now()
    };

    // Send current player list to new player
    const playerList = Object.values(players).map(p => ({
        id: p.id,
        name: p.name,
        position: p.position,
        health: p.health
    }));
    socket.emit('playerList', playerList);

    // Broadcast new player to all others
    socket.broadcast.emit('playerJoined', {
        id: socket.id,
        name: 'Player',
        position: { x: 0, y: 2, z: 0 },
        health: 100
    });

    console.log(`📊 Total players: ${Object.keys(players).length}/${MAX_PLAYERS}`);

    // Handle player data updates (position, rotation, health, ammo)
    socket.on('playerData', (data) => {
        if (players[socket.id]) {
            players[socket.id].position = data.position;
            players[socket.id].rotation = data.rotation;
            players[socket.id].health = data.health;
            players[socket.id].ammo = data.ammo;
            players[socket.id].timestamp = Date.now();

            // Broadcast to all other players
            socket.broadcast.emit('playerUpdate', {
                id: socket.id,
                position: data.position,
                rotation: data.rotation,
                health: data.health,
                ammo: data.ammo
            });
        }
    });

    // Handle player ready/join game
    socket.on('playerReady', (data) => {
        if (players[socket.id]) {
            players[socket.id].name = data.name || 'Player';
            console.log(`👤 Player ready: ${players[socket.id].name}`);
        }
    });

    // Handle damage/hits
    socket.on('hit', (data) => {
        const targetPlayer = players[data.target];
        if (targetPlayer) {
            targetPlayer.health -= data.damage;
            
            if (targetPlayer.health <= 0) {
                targetPlayer.health = 0;
                
                // Broadcast kill event
                io.emit('kill', {
                    killer: socket.id,
                    victim: data.target,
                    killerName: players[socket.id].name,
                    victimName: targetPlayer.name
                });

                // Update killer stats
                if (players[socket.id]) {
                    players[socket.id].kills++;
                }

                // Respawn victim
                setTimeout(() => {
                    if (targetPlayer) {
                        targetPlayer.health = 100;
                        targetPlayer.position = getRandomSpawnPoint();
                        
                        io.emit('playerRespawn', {
                            id: data.target,
                            position: targetPlayer.position,
                            health: 100
                        });
                    }
                }, 3000);
            }
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`✗ Player disconnected: ${socket.id}`);
        delete players[socket.id];
        
        io.emit('playerLeft', socket.id);
        console.log(`📊 Total players: ${Object.keys(players).length}/${MAX_PLAYERS}`);
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error(`⚠ Socket error (${socket.id}):`, error);
    });
});

/**
 * Get random spawn point
 */
function getRandomSpawnPoint() {
    const spawnPoints = [
        { x: 10, y: 2, z: 10 },
        { x: -10, y: 2, z: -10 },
        { x: 10, y: 2, z: -10 },
        { x: -10, y: 2, z: 10 },
        { x: 0, y: 2, z: 10 },
        { x: 0, y: 2, z: -10 }
    ];
    return spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
}

/**
 * Cleanup inactive players (every 30 seconds)
 */
setInterval(() => {
    const now = Date.now();
    const timeout = 30000; // 30 seconds

    Object.keys(players).forEach(playerId => {
        if (now - players[playerId].timestamp > timeout) {
            console.log(`⏱ Removing inactive player: ${playerId}`);
            delete players[playerId];
            io.emit('playerLeft', playerId);
        }
    });
}, 30000);

/**
 * Broadcast server stats (every 10 seconds)
 */
setInterval(() => {
    io.emit('serverStats', {
        playerCount: Object.keys(players).length,
        timestamp: Date.now()
    });
}, 10000);

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 WebSocket ready for connections`);
    console.log(`👥 Max players: ${MAX_PLAYERS}`);
});
