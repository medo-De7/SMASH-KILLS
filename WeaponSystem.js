// ============================================
// WEAPON SYSTEM - Weapon Management
// ============================================

class WeaponSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.weapons = {};
        this.currentWeapon = null;
        this.isReloading = false;
        this.lastShotTime = 0;
    }

    /**
     * Register weapon
     */
    registerWeapon(name, config) {
        this.weapons[name] = {
            name: name,
            damage: config.damage || GAME_CONSTANTS.PLAYER_BASE_DAMAGE,
            fireRate: config.fireRate || GAME_CONSTANTS.WEAPON_FIRE_RATE,
            reloadTime: config.reloadTime || GAME_CONSTANTS.WEAPON_RELOAD_TIME,
            range: config.range || GAME_CONSTANTS.WEAPON_RANGE,
            ammo: config.ammo || 30,
            maxAmmo: config.maxAmmo || 120,
            type: config.type || 'rifle'
        };
    }

    /**
     * Equip weapon
     */
    equipWeapon(name) {
        if (this.weapons[name]) {
            this.currentWeapon = name;
            console.log(`Equipped: ${name}`);
        }
    }

    /**
     * Fire weapon
     */
    fire() {
        if (!this.currentWeapon || this.isReloading) return false;

        const now = Date.now();
        if (now - this.lastShotTime < this.weapons[this.currentWeapon].fireRate) {
            return false;
        }

        const weapon = this.weapons[this.currentWeapon];
        if (weapon.ammo <= 0) {
            this.reload();
            return false;
        }

        weapon.ammo--;
        this.lastShotTime = now;

        audioManager.playEffect('gunshot');
        this.createMuzzleFlash();
        this.performRaycast();

        return true;
    }

    /**
     * Reload weapon
     */
    reload() {
        if (this.isReloading || !this.currentWeapon) return;

        this.isReloading = true;
        const reloadTime = this.weapons[this.currentWeapon].reloadTime;

        setTimeout(() => {
            const weapon = this.weapons[this.currentWeapon];
            weapon.ammo = weapon.maxAmmo;
            this.isReloading = false;
            audioManager.playEffect('reload');
            console.log(`Reloaded: ${this.currentWeapon}`);
        }, reloadTime);
    }

    /**
     * Create muzzle flash effect
     */
    createMuzzleFlash() {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const flash = new THREE.Mesh(geometry, material);
        
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        flash.position.copy(this.camera.position).addScaledVector(direction, 1);
        
        this.scene.add(flash);

        setTimeout(() => this.scene.remove(flash), 100);
    }

    /**
     * Perform raycast for hitting
     */
    performRaycast() {
        const raycaster = new THREE.Raycaster();
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        raycaster.set(this.camera.position, direction);

        // Get distance calculation for hit detection
        const weapon = this.weapons[this.currentWeapon];
        networkManager.reportHit(null, weapon.damage);
    }

    /**
     * Get current ammo
     */
    getCurrentAmmo() {
        if (!this.currentWeapon) return 0;
        return this.weapons[this.currentWeapon].ammo;
    }

    /**
     * Get max ammo
     */
    getMaxAmmo() {
        if (!this.currentWeapon) return 0;
        return this.weapons[this.currentWeapon].maxAmmo;
    }
}

let weaponSystem = null;
