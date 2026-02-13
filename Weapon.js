/* Weapon.js
   Defines weapon classes used by the client.
   Exposes: Weapon (base), Pistol, Rifle, RocketLauncher, Projectile
*/
(function () {
    class Weapon {
        constructor(options = {}) {
            this.name = options.name || 'Weapon';
            this.damage = options.damage || 1;
            this.fireRate = options.fireRate || 1; // shots per second
            this.isAutomatic = !!options.isAutomatic;
            this.ammo = options.ammo ?? null; // null = infinite
            this.lastShot = 0;
            this.owner = options.owner || null; // player id or object
            this.duration = options.duration || null; // seconds, null = permanent
        }

        canFire(now = performance.now()) {
            const since = (now - this.lastShot) / 1000;
            return since >= 1 / this.fireRate && (this.ammo === null || this.ammo > 0);
        }

        fire(now = performance.now(), origin = null, direction = null) {
            if (!this.canFire(now)) return null;
            this.lastShot = now;
            if (this.ammo !== null && this.ammo > 0) this.ammo -= 1;
            // Base weapon does hitscan; subclasses override as needed
            return {
                type: this.name,
                damage: this.damage,
                origin,
                direction,
                owner: this.owner,
                timestamp: now,
            };
        }
    }

    class Pistol extends Weapon {
        constructor(options = {}) {
            super(Object.assign({ name: 'Pistol', damage: 10, fireRate: 2.5, isAutomatic: false, ammo: null, duration: null }, options));
        }
    }

    class Rifle extends Weapon {
        constructor(options = {}) {
            super(Object.assign({ name: 'Rifle', damage: 8, fireRate: 10, isAutomatic: true, ammo: null, duration: null }, options));
        }
    }

    // Simple projectile class for RocketLauncher
    class Projectile {
        constructor(options = {}) {
            this.id = options.id || `proj_${Math.random().toString(36).slice(2, 9)}`;
            this.position = options.position ? options.position.clone ? options.position.clone() : { x: options.position.x, y: options.position.y, z: options.position.z } : { x: 0, y: 0, z: 0 };
            this.velocity = options.velocity || { x: 0, y: 0, z: 0 };
            this.speed = options.speed || 40;
            this.radius = options.radius || 5; // explosion radius
            this.damage = options.damage || 120;
            this.owner = options.owner || null;
            this.lifetime = options.lifetime || 6; // seconds
            this.age = 0;
            this.exploded = false;
            this.onExplode = options.onExplode || function () {};
            this.sceneObject = null; // optional THREE.Mesh for visuals
        }

        update(dt) {
            if (this.exploded) return;
            this.age += dt;
            // simple Euler integration
            this.position.x += this.velocity.x * this.speed * dt;
            this.position.y += this.velocity.y * this.speed * dt;
            this.position.z += this.velocity.z * this.speed * dt;
            if (this.sceneObject && this.sceneObject.position) {
                this.sceneObject.position.set(this.position.x, this.position.y, this.position.z);
            }
            if (this.age >= this.lifetime) {
                this.explode();
            }
        }

        explode() {
            if (this.exploded) return;
            this.exploded = true;
            // call callback to apply damage / show VFX
            try { this.onExplode({ position: this.position, radius: this.radius, damage: this.damage, owner: this.owner, id: this.id }); } catch (e) {}
            // remove visuals if present
            if (this.sceneObject && this.sceneObject.parent) {
                this.sceneObject.parent.remove(this.sceneObject);
            }
        }
    }

    class RocketLauncher extends Weapon {
        constructor(options = {}) {
            super(Object.assign({ name: 'RocketLauncher', damage: 120, fireRate: 0.6, isAutomatic: false, ammo: 3, duration: 30 }, options));
        }

        fire(now = performance.now(), origin = null, direction = null) {
            if (!this.canFire(now)) return null;
            this.lastShot = now;
            if (this.ammo !== null && this.ammo > 0) this.ammo -= 1;

            // create a projectile
            const velocity = { x: direction.x, y: direction.y, z: direction.z };
            const proj = new Projectile({ position: origin, velocity, damage: this.damage, owner: this.owner, radius: 6 });
            return { type: this.name, projectile: proj, owner: this.owner, timestamp: now };
        }
    }

    // Expose classes to global scope so other scripts can use them
    window.Weapon = Weapon;
    window.Pistol = Pistol;
    window.Rifle = Rifle;
    window.RocketLauncher = RocketLauncher;
    window.Projectile = Projectile;
})();
