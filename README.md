# SMASH KILLS — Quick Launch & Player Tutorial

SMASH KILLS is a browser-based multiplayer FPS prototype built with Three.js (rendering) and Socket.io (networking). This README explains how to launch the project locally, what the project contains, and how to play (short tutorial).

---

## 1) Quick Launch (Local)

Prerequisites
- Node.js 14+ installed
- A modern browser (Chrome/Edge/Firefox)

Install and run the server
```bash
# from repository root
cd server
npm install
npm start
# server default: http://localhost:3000
```

Open the client
- Option A — via the server static route:
  - Open `http://localhost:3000/client/index.html` in your browser
- Option B — via a simple static server (dev):
  ```bash
  cd client
  npx http-server -p 8080
  # open http://localhost:8080
  ```

Notes
- In production use HTTPS for Pointer Lock and OAuth flows.
- Server logs appear in `server/server.js` console.

---

## 2) What This Project Is

- A small multiplayer FPS foundation demonstrating:
  - First-person camera + Pointer Lock
  - Real-time player synchronization with Socket.io
  - Basic weapon classes and projectiles
  - UI systems (HUD, menus, shop, spin wheel, season pass)
  - Manager-based architecture (GameManager, NetworkManager, WeaponManager, UIManager)

Intended use: prototype gameplay, iterate on mechanics, and integrate assets/server logic.

---

## 3) Quick Controls (Play Tutorial)

Basic inputs
- Click game area: lock pointer
- WASD: move
- Shift: sprint
- Space: jump
- Left click: fire
- Right click: aim
- R: reload
- 1/2/3: switch weapon
- ESC: unlock pointer

Short tutorial (30–60 seconds)
1. Launch server and open the client in two browser windows (or a friend).
2. Click the canvas to lock pointer; use WASD to move and look with mouse.
3. Try Pistol (default): click to shoot. Pistol has infinite ammo and low damage.
4. Find a Rifle pickup or switch to Rifle (automatic high fire-rate). Hold mouse to spray.
5. Pick up RocketLauncher (heavy weapon): it fires projectiles that explode — note: heavy weapons last 30 seconds after pickup, then revert to Pistol.
6. Watch other players' weapon icons/nametags — weapon changes are synchronized across the network.

Gameplay tips
- Aim for head-high targets (camera eye-level ≈ 1.6 units).
- Use sprint + jump to traverse quickly, but avoid overexposing yourself.
- Rocket explosions have splash damage; avoid friendly fire in team modes.

---

## 4) Weapons Overview

- Pistol — infinite ammo, low damage, semi-auto
- Rifle — automatic, high fire-rate, medium damage
- RocketLauncher — consumes rockets, spawns projectile with explosion damage; heavy weapons include a 30s duration when picked up

Implementation notes
- Weapons live in `client/src/managers/Weapon.js` and are managed by `WeaponManager.js`.
- `WeaponManager.fire(origin, direction)` returns either a hitscan shot event or a projectile object.
- When picking up heavy weapons, a duration timer (30s) reverts the player to the default weapon.
- Network events emitted: `weaponChange`, `playerShoot`, `projectileSpawn`.

---

## 5) Running & Development Hooks

- Game loop: `client/src/main.js` → calls `GameManager.update()` and `WeaponManager.update(dt)`
- Input: `CameraController.js` / input handler should call `WeaponManager.fire(origin, direction)` on mouse down
- Networking: `NetworkManager` should forward `weaponChange` and `projectileSpawn` to the server for validation and broadcast

Example: initialize weapon manager on spawn
```javascript
// after player joins and receives playerId
window.WeaponManager.initForPlayer(myPlayerId);
```

Example: firing
```javascript
// origin and direction as Vector3-like objects
window.WeaponManager.fire(origin, direction);
```

---

## 6) Troubleshooting (Common)

- Pointer lock not working: click canvas first; test on HTTPS if needed.
- No players visible: ensure server is running and client connected to correct host/port.
- Weapons not firing: ensure `WeaponManager` is initialized and `fire()` is called from input.

---

## 7) Next Steps (Suggested)

1. Hook `WeaponManager` into input and `GameManager` update loop (I can do this for you).
2. Add server-side validation for `projectileSpawn` and `playerShoot` events.
3. Replace placeholder boxes with glTF player models and add animations.

---

If you'd like, I can: wire `WeaponManager` into `CameraController.js` and `GameManager`, add server event handlers for weapon/projectile validation, or produce a short video demo walkthrough. Which would you prefer next?
