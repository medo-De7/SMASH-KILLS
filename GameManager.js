// ============================================
// GAME MANAGER - Main Game Controller
// ============================================

class GameManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.gameState = 'menu'; // menu, loading, playing, paused, gameover
        this.players = {};
        this.localPlayerId = null;
        this.gameTime = 0;
        this.clock = new THREE.Clock();
    }

    /**
     * Initialize game manager
     */
    async init() {
        console.log('Initializing GameManager...');
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.setupGround();
        this.setupEventListeners();
        await this.loadAssets();
        this.startGameLoop();
    }

    /**
     * Setup Three.js scene
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        this.scene.fog = new THREE.Fog(0x87ceeb, 500, 1000);
    }

    /**
     * Setup camera
     */
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);
    }

    /**
     * Setup renderer
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        document.getElementById('game-container').appendChild(this.renderer.domElement);
    }

    /**
     * Setup lighting
     */
    setupLighting() {
        // HemisphereLight for better outdoor lighting
        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x545454, 0.8);
        this.scene.add(hemisphereLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
    }

    /**
     * Setup ground
     */
    setupGround() {
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90ee90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add GridHelper for visual reference
        const gridHelper = new THREE.GridHelper(200, 40, 0x444444, 0x222222);
        gridHelper.position.y = 0.01;
        this.scene.add(gridHelper);
    }

    /**
     * Load assets
     */
    async loadAssets() {
        // Load models, textures, sounds here
        console.log('Assets loaded');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Start game loop
     */
    startGameLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    /**
     * Update game state
     */
    update() {
        const deltaTime = this.clock.getDelta();
        this.gameTime += deltaTime;

        if (this.gameState === 'playing') {
            // Update game logic
        }
    }

    /**
     * Change game state
     */
    changeState(newState) {
        this.gameState = newState;
        console.log(`Game state changed to: ${newState}`);
    }

    /**
     * Add object to scene
     */
    addToScene(object) {
        this.scene.add(object);
    }

    /**
     * Remove object from scene
     */
    removeFromScene(object) {
        this.scene.remove(object);
    }
}

const gameManager = new GameManager();
