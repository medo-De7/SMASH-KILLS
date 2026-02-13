// ============================================
// CONSTANTS - Global Game Configuration
// ============================================

const GAME_CONSTANTS = {
    // Game Settings
    GAME_NAME: 'SMASH KILLS',
    VERSION: '1.0.0',
    
    // Server
    SERVER_URL: 'http://localhost:3000',
    
    // Player Settings
    PLAYER_SPEED: 0.15,
    PLAYER_HEALTH: 100,
    PLAYER_BASE_DAMAGE: 10,
    
    // Weapon Settings
    WEAPON_RELOAD_TIME: 2000,
    WEAPON_FIRE_RATE: 100,
    WEAPON_RANGE: 100,
    
    // Game Balance
    KILL_REWARD: 100,
    HEADSHOT_MULTIPLIER: 2.5,
    
    // UI
    HUD_UPDATE_INTERVAL: 100,
    NOTIFICATION_DURATION: 3000,
    
    // Network
    PLAYER_UPDATE_INTERVAL: 100,
    MAX_PLAYERS: 50,
};

Object.freeze(GAME_CONSTANTS);
