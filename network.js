// Network Communication with Server via Socket.io

const socket = io();

// Connect to server
socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

// Receive player data from other players
socket.on('playerUpdate', (data) => {
    console.log('Player update:', data);
    // Update other player positions in the scene
});

// Receive kill notifications
socket.on('kill', (data) => {
    console.log(`${data.killer} killed ${data.victim}!`);
    // Update UI with kill notification
});

// Send player position and rotation to server
function sendPlayerData() {
    if (!camera) return;

    socket.emit('playerData', {
        position: camera.position,
        rotation: camera.rotation,
        health: playerHealth,
        ammo: playerAmmo
    });
}

// Disconnect handler
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Send player data periodically
setInterval(sendPlayerData, 100);
