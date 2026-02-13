/* WeaponManager.js
   Manages the player's current weapon, pickups, duration timers, projectile updates,
   and network synchronization of weapon changes so other clients can see what a player holds.
*/
(function () {
    class WeaponManager {
        constructor() {
            this.current = null; // instance of Weapon
            this.defaultWeapon = new Pistol({ owner: null });
            this.projectiles = new Map(); // id -> Projectile
            this.remoteWeapons = {}; // playerId -> { type, expiresAt }
            this.durationTimer = null;

            // network hooks (expects global networkManager with .emit/.on)
            if (window.networkManager && window.networkManager.on) {
                window.networkManager.on('playerWeaponChange', (data) => this._onRemoteWeaponChange(data));
                window.networkManager.on('projectileExploded', (data) => this._onRemoteProjectileExplode(data));
            }
        }

        initForPlayer(playerId) {
            this.playerId = playerId;
            this.setWeapon(this.defaultWeapon);
        }

        setWeapon(weaponInstance, opts = {}) {
            if (!weaponInstance) weaponInstance = this.defaultWeapon;
            weaponInstance.owner = this.playerId || weaponInstance.owner;
            this.current = weaponInstance;

            // handle duration for heavy weapons
            if (weaponInstance.duration && weaponInstance.duration > 0) {
                const expiresAt = Date.now() + weaponInstance.duration * 1000;
                if (this.durationTimer) clearTimeout(this.durationTimer);
                this.durationTimer = setTimeout(() => {
                    // expire weapon and revert to default
                    this.setWeapon(this.defaultWeapon);
                    // notify server about revert
                    this._syncWeaponChange(this.defaultWeapon.name, null);
                }, weaponInstance.duration * 1000);
                this._syncWeaponChange(weaponInstance.name, expiresAt);
            } else {
                if (this.durationTimer) { clearTimeout(this.durationTimer); this.durationTimer = null; }
                this._syncWeaponChange(weaponInstance.name, null);
            }
        }

        pickupWeapon(typeName, opts = {}) {
            // convenience factory
            let instance = null;
            const owner = this.playerId || null;
            switch (typeName) {
                case 'Rifle': instance = new Rifle({ owner, duration: opts.duration ?? null }); break;
                case 'RocketLauncher': instance = new RocketLauncher({ owner, duration: opts.duration ?? 30 }); break;
                case 'Pistol':
                default: instance = new Pistol({ owner }); break;
            }
            this.setWeapon(instance);
        }

        fire(origin, direction) {
            if (!this.current) this.setWeapon(this.defaultWeapon);
            const now = performance.now();
            const result = this.current.fire(now, origin, direction);
            if (!result) return null;

            if (result.projectile) {
                // local projectile management
                const proj = result.projectile;
                this.projectiles.set(proj.id, proj);
                // inform server
                if (window.networkManager && window.networkManager.emit) {
                    window.networkManager.emit('projectileSpawn', { id: proj.id, position: proj.position, velocity: proj.velocity, owner: proj.owner, damage: proj.damage, radius: proj.radius });
                }
                return { projectile: proj };
            } else {
                // hitscan: notify server about a shot so server can validate hits
                if (window.networkManager && window.networkManager.emit) {
                    window.networkManager.emit('playerShoot', { owner: this.playerId, origin, direction, weapon: result.type, damage: result.damage, timestamp: result.timestamp });
                }
                return { hitscan: result };
            }
        }

        update(dt) {
            // update local projectiles
            const toRemove = [];
            for (const [id, proj] of this.projectiles.entries()) {
                proj.update(dt);
                if (proj.exploded) toRemove.push(id);
            }
            for (const id of toRemove) this.projectiles.delete(id);
        }

        _syncWeaponChange(typeName, expiresAt) {
            if (window.networkManager && window.networkManager.emit) {
                window.networkManager.emit('weaponChange', { playerId: this.playerId, weapon: typeName, expiresAt });
            }
        }

        _onRemoteWeaponChange(data) {
            // data: { playerId, weapon, expiresAt }
            if (!data || !data.playerId) return;
            this.remoteWeapons[data.playerId] = { type: data.weapon, expiresAt: data.expiresAt || null };
            // Optionally, update remote player's visual representation here
            // e.g. window.enemyManager && window.enemyManager.setPlayerWeapon(data.playerId, data.weapon)
            if (window.enemyManager && typeof window.enemyManager.setPlayerWeapon === 'function') {
                window.enemyManager.setPlayerWeapon(data.playerId, data.weapon, data.expiresAt || null);
            }
        }

        _onRemoteProjectileExplode(data) {
            // handle explosion visuals from server-reported projectiles
            // data: { id, position, radius, damage, owner }
            if (!data) return;
            // spawn local VFX if desired
            if (window.gameManager && typeof window.gameManager.spawnExplosion === 'function') {
                window.gameManager.spawnExplosion(data.position, data.radius);
            }
        }
    }

    // attach a singleton
    window.WeaponManager = window.WeaponManager || new WeaponManager();
})();
