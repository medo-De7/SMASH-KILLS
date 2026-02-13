// ============================================
// ASSET MANAGER - Loads and Manages Assets
// ============================================

class AssetManager {
    constructor() {
        this.models = {};
        this.textures = {};
        this.sounds = {};
        this.isLoading = false;
    }

    /**
     * Load 3D model
     */
    async loadModel(name, path) {
        try {
            const loader = new THREE.GLTFLoader();
            const gltf = await new Promise((resolve, reject) => {
                loader.load(path, resolve, undefined, reject);
            });
            this.models[name] = gltf.scene;
            console.log(`Model loaded: ${name}`);
            return gltf.scene;
        } catch (error) {
            console.error(`Error loading model ${name}:`, error);
        }
    }

    /**
     * Load texture
     */
    async loadTexture(name, path) {
        try {
            const loader = new THREE.TextureLoader();
            const texture = await new Promise((resolve, reject) => {
                loader.load(path, resolve, undefined, reject);
            });
            this.textures[name] = texture;
            console.log(`Texture loaded: ${name}`);
            return texture;
        } catch (error) {
            console.error(`Error loading texture ${name}:`, error);
        }
    }

    /**
     * Load audio
     */
    loadSound(name, path) {
        const audio = new Audio(path);
        this.sounds[name] = audio;
        console.log(`Sound loaded: ${name}`);
        return audio;
    }

    /**
     * Get asset by name
     */
    getModel(name) {
        return this.models[name];
    }

    getTexture(name) {
        return this.textures[name];
    }

    getSound(name) {
        return this.sounds[name];
    }

    /**
     * Play sound
     */
    playSound(name, volume = 1.0) {
        const sound = this.sounds[name];
        if (sound) {
            sound.volume = volume;
            sound.currentTime = 0;
            sound.play();
        }
    }
}

const assetManager = new AssetManager();
