# SMASH KILLS - FPS Game Documentation

## 🎮 Features Implemented

### ✅ Three.js FPS Scene Setup
- **PerspectiveCamera** configured at eye level (1.6 units height)
- **Scene lighting** with HemisphereLight for realistic outdoor lighting
- **GridHelper** for visual reference on the game map
- **Ground plane** with proper physics and rendering

### ✅ PointerLockControls Integration
- **Mouse locking** for FPS aiming and camera rotation
- **Smooth camera rotation** based on mouse movement
- **Escape key** to unlock pointer
- **Click to lock** - click on game window to lock pointer

### ✅ Player Spawning & Rendering
- **3D Box placeholders** for other players
- **Nametags above players** using canvas textures
- **Colored boxes** for visual distinction
- **Head geometry** for better player representation
- **Dynamic player spawning** when server sends newPlayer event

### ✅ Smooth Interpolation
- **Linear interpolation** for smooth movement between updates
- **Configurable interpolation speed** (0.0 - 1.0)
- **Position smoothing** to eliminate jittery network movements
- **Rotation synchronization** for player orientation

---

## 📁 Project Structure

```
client/
├── index.html                          # Main HTML file
├── style.css                           # Global styles & HUD
├── package.json
├── src/
│   ├── main.js                         # Entry point & game loop
│   ├── config/
│   │   └── constants.js                # Game constants
│   ├── utils/
│   │   └── helpers.js                  # Utility functions
│   ├── managers/
│   │   ├── GameManager.js              # Scene setup (Three.js)
│   │   ├── CameraController.js         # FPS camera control
│   │   ├── PointerLockControls.js      # Pointer lock implementation
│   │   ├── InputManager.js             # Keyboard/mouse input
│   │   ├── AudioManager.js             # Sound effects
│   │   ├── AssetManager.js             # Asset loading
│   │   └── NetworkManager.js           # Socket.io events
│   ├── components/
│   │   ├── Player/
│   │   │   └── PlayerController.js     # Local player logic
│   │   ├── Weapon/
│   │   │   └── WeaponSystem.js         # Weapon mechanics
│   │   ├── Enemy/
│   │   │   └── EnemyManager.js         # (ENHANCED) Enemy spawning & interpolation
│   │   └── UI/
│   │       └── UIManager.js            # UI/HUD management
│   └── scenes/
│       └── MainScene.js                # Map/environment setup
├── assets/
│   ├── models/                         # 3D models (.glb, .gltf)
│   ├── textures/                       # Textures & skins
│   ├── sounds/                         # Audio effects
│   └── animations/                     # Animation files

server/
├── server.js                           # Main server with Socket.io
├── src/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── utils/
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

1. **Install server dependencies:**
```bash
cd server
npm install
```

2. **Install client dependencies (optional, for development):**
```bash
cd client
npm install
```

3. **Start the server:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

4. **Open the client:**
```
http://localhost:3000
```

---

## 🎯 Key Code Example: Three.js FPS Scene

### Scene Setup (GameManager.js)
```javascript
setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 500, 1000);
}

setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
        75,                                // FOV
        window.innerWidth / window.innerHeight,
        0.1,  // near
        1000   // far
    );
    this.camera.position.set(0, 1.6, 5); // Eye level height
}

setupLighting() {
    // HemisphereLight for better outdoor lighting
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x545454, 0.8);
    this.scene.add(hemisphereLight);
    // ... more lighting
}

setupGround() {
    // Ground plane
    const ground = new THREE.Mesh(...);
    this.scene.add(ground);
    
    // GridHelper for visual reference
    const gridHelper = new THREE.GridHelper(200, 40, 0x444444, 0x222222);
    this.scene.add(gridHelper);
}
```

### PointerLockControls (PointerLockControls.js)
```javascript
connect() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerlockChange);
}

onMouseMove(event) {
    if (!this.isLocked) return;
    
    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    
    this.euler.rotateY(-movementX * 0.002);
    this.euler.rotateX(-movementY * 0.002);
    this.camera.quaternion.setFromEuler(this.euler);
}

lock() {
    this.domElement.requestPointerLock();
}
```

### Enemy Spawning & Interpolation (EnemyManager.js)
```javascript
spawnEnemy(playerId, position, playerData) {
    // Create 3D box for other players
    const geometry = new THREE.BoxGeometry(0.6, 1.8, 0.6);
    const material = new THREE.MeshLambertMaterial({ 
        color: Math.random() * 0xffffff 
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // ... add head, nametag, etc.
    
    this.enemies[playerId] = {
        mesh: container,
        position: position.clone(),
        targetPosition: position.clone(),
        // ... store other data
    };
}

updateEnemy(playerId, data) {
    const enemy = this.enemies[playerId];
    
    // Update target (from network)
    enemy.targetPosition.copy(data.position);
    
    // Smooth interpolation
    enemy.position.lerp(enemy.targetPosition, this.interpolationSpeed);
    enemy.mesh.position.copy(enemy.position);
}

update(deltaTime) {
    // Interpolation loop in main game loop
    Object.values(this.enemies).forEach(enemy => {
        enemy.position.lerp(enemy.targetPosition, this.interpolationSpeed);
        enemy.mesh.position.copy(enemy.position);
    });
}
```

---

## 🌐 Network Events

### Client → Server
- **playerData**: Send position, rotation, health, ammo
- **playerReady**: Mark player as ready
- **hit**: Report hit/damage on target

### Server → Client
- **playerList**: List of current players
- **playerJoined**: New player connected
- **playerUpdate**: Other player's position update
- **playerLeft**: Player disconnected
- **kill**: Kill notification
- **playerRespawn**: Player respawned

---

## ⚙️ Configuration

### Game Constants (src/config/constants.js)
```javascript
const GAME_CONSTANTS = {
    PLAYER_SPEED: 0.15,
    PLAYER_HEALTH: 100,
    WEAPON_FIRE_RATE: 100,
    WEAPON_RANGE: 100,
    HUD_UPDATE_INTERVAL: 100,
    PLAYER_UPDATE_INTERVAL: 100,
    MAX_PLAYERS: 50,
};
```

### Interpolation Speed (EnemyManager.js)
```javascript
// Range: 0.0 (no interpolation) to 1.0 (instant update)
this.interpolationSpeed = 0.1; // Default smooth movement
```

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| **W/A/S/D** | Move forward/left/backward/right |
| **Space** | Jump |
| **Shift** | Sprint |
| **Left Click** | Fire weapon |
| **Right Click** | Aim |
| **R** | Reload |
| **Click Game** | Lock pointer |
| **Escape** | Unlock pointer |

---

## 🔧 Customization

### Change Interpolation Speed
```javascript
// In EnemyManager constructor
this.interpolationSpeed = 0.15; // Faster interpolation

// Or dynamically
enemyManager.setInterpolationSpeed(0.2);
```

### Modify Player Colors
```javascript
// In EnemyManager.spawnEnemy()
const material = new THREE.MeshLambertMaterial({ 
    color: 0x0000ff // Custom color (blue)
});
```

### Adjust GridHelper Size
```javascript
// In GameManager.setupGround()
const gridHelper = new THREE.GridHelper(
    300,      // size
    60,       // divisions
    0x444444, // color1
    0x222222  // color2
);
```

---

## 🚨 Troubleshooting

### Pointer Lock Not Working
- Check browser compatibility (Chrome, Firefox, Safari 13+)
- Click on game window to activate
- Check browser console for errors

### Stuttering/Jittering Movement
- Adjust `interpolationSpeed` in EnemyManager
- Check network latency
- Ensure `PLAYER_UPDATE_INTERVAL` is appropriate

### Scene Not Rendering
- Check `camera.position` is set correctly
- Verify renderer is attached to DOM
- Check browser console for Three.js errors

---

## 📊 Performance Tips

1. **Interpolation**: Tune `interpolationSpeed` based on network latency
2. **Player Count**: Monitor FPS with many players
3. **Asset Optimization**: Compress 3D models and textures
4. **Network**: Update rate of 100ms is good balance

---

## 🔗 Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Socket.io Guide](https://socket.io/docs/)
- [WebGL Best Practices](https://www.khronos.org/webgl/)
- [FPS Game Development](https://www.gamedev.net/)

---

**Version**: 1.0.0  
**Last Updated**: February 2026
