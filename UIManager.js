// ============================================
// UI MANAGER - User Interface Management
// ============================================

class UIManager {
    constructor() {
        this.uiContainer = document.getElementById('ui-container');
        this.hudContainer = document.getElementById('hud-container');
        this.currentScreen = null;
    }

    /**
     * Show main menu
     */
    showMainMenu() {
        this.uiContainer.innerHTML = `
            <div id="main-menu" class="menu">
                <div class="main-menu-content">
                    <h1 class="menu-title">⚔️ SMASH KILLS</h1>
                    <p class="menu-subtitle">Multiplayer FPS Battle</p>
                    
                    <div id="auth-container" class="auth-section">
                        <div class="auth-buttons">
                            <button class="btn btn-secondary" onclick="authManager.authenticateGoogle()">
                                🔵 Login with Google
                            </button>
                            <button class="btn btn-secondary" onclick="authManager.authenticateDiscord()">
                                🟣 Login with Discord
                            </button>
                        </div>
                    </div>
                    
                    <div class="menu-buttons">
                        <button class="menu-button btn-pulse" onclick="uiManager.startGame()">
                            🎮 PLAY NOW
                        </button>
                        <button class="menu-button" onclick="shopSystem.show()">
                            🛍️ SHOP
                        </button>
                        <button class="menu-button" onclick="spinWheel.show()">
                            🎡 SPIN WHEEL
                        </button>
                        <button class="menu-button" onclick="seasonPass.show()">
                            ⚔️ BATTLE PASS
                        </button>
                        <button class="menu-button" onclick="uiManager.showSettings()">
                            ⚙️ SETTINGS
                        </button>
                    </div>
                    
                    <div class="menu-footer">
                        <p class="version-text">v1.0.0 - Build 2026</p>
                    </div>
                </div>
            </div>
        `;
        this.currentScreen = 'menu';
        authManager.updateAuthUI();
    }

    /**
     * Show HUD during gameplay
     */
    showHUD() {
        this.hudContainer.innerHTML = `
            <div class="hud-top">
                <div class="health-bar hud-item">
                    <div class="health-label">❤️ HEALTH</div>
                    <div class="progress-bar">
                        <div id="health-progress" class="progress-fill" style="width: 100%; background-color: #e74c3c;"></div>
                    </div>
                    <div class="health-value" id="health-value">100</div>
                </div>
                
                <div class="ammo-counter hud-item">
                    <div class="ammo-label">🔫 AMMO</div>
                    <div class="ammo-value" id="ammo-value">30/120</div>
                </div>
                
                <div class="multiplier-counter hud-item" id="kill-multiplier" style="display: none;">
                    <div class="multiplier-label">⚡ STREAK</div>
                    <div class="multiplier-value" id="multiplier-value">x1</div>
                </div>
            </div>
            
            <div class="hud-center">
                <div class="crosshair"></div>
            </div>
            
            <div class="hud-bottom">
                <div class="stats-left">
                    <div class="kills-counter hud-item">
                        <div class="kills-label">💀 KILLS</div>
                        <div class="kills-value" id="kills-value">0</div>
                    </div>
                    <div class="deaths-counter hud-item">
                        <div class="deaths-label">⚰️ DEATHS</div>
                        <div class="deaths-value" id="deaths-value">0</div>
                    </div>
                </div>
                
                <div class="stats-right">
                    <div class="score-display hud-item">
                        <div class="score-label">⭐ SCORE</div>
                        <div class="score-value" id="score-value">0</div>
                    </div>
                    <div class="players-display hud-item">
                        <div class="players-label">👥 PLAYERS</div>
                        <div class="players-value" id="players-value">1</div>
                    </div>
                </div>
            </div>
            
            <div class="hud-corner-top-right">
                <div class="currency-display">
                    <div class="currency-item">
                        <span>💰</span>
                        <span id="currency-coins">1000</span>
                    </div>
                    <div class="currency-item">
                        <span>💎</span>
                        <span id="currency-gems">50</span>
                    </div>
                </div>
                <button class="btn btn-small" onclick="uiManager.showEscapeMenu()">ESC MENU</button>
            </div>
            
            <div class="minimap-container">
                <div id="minimap-container" class="minimap">
                    <canvas id="minimap" width="150" height="150"></canvas>
                </div>
            </div>
            
            <div class="season-pass-widget">
                <div class="season-header">Season 1 Pass</div>
                <div class="progress-bar">
                    <div id="season-passes-progress-bar" class="progress-fill" style="width: 0%;"></div>
                </div>
                <div class="season-level">Lv <span id="season-level">1</span></div>
            </div>
        `;
        this.currentScreen = 'hud';
    }

    /**
     * Show escape menu during gameplay
     */
    showEscapeMenu() {
        const menuHTML = `
            <div id="escape-menu-modal" class="modal">
                <div class="modal-content escape-menu-modal">
                    <h2>GAME MENU</h2>
                    <div class="escape-menu-buttons">
                        <button class="btn btn-primary" onclick="document.getElementById('escape-menu-modal').parentElement.remove()">
                            Continue
                        </button>
                        <button class="btn btn-secondary" onclick="shopSystem.show()">
                            🛍️ Shop
                        </button>
                        <button class="btn btn-secondary" onclick="seasonPass.show()">
                            ⚔️ Battle Pass
                        </button>
                        <button class="btn btn-secondary" onclick="uiManager.showSettings()">
                            ⚙️ Settings
                        </button>
                        <button class="btn btn-secondary" onclick="uiManager.showMainMenu(); gameManager.changeState('menu')">
                            🏠 Main Menu
                        </button>
                    </div>
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.innerHTML = menuHTML;
        document.body.appendChild(modal.firstElementChild);
    }

    /**
     * Update HUD values
     */
    updateHUD(stats) {
        const healthValue = document.getElementById('health-value');
        const ammoValue = document.getElementById('ammo-value');
        const killsValue = document.getElementById('kills-value');
        const scoreValue = document.getElementById('score-value');
        const playersValue = document.getElementById('players-value');
        const seasonLevel = document.getElementById('season-level');
        const healthProgress = document.getElementById('health-progress');

        if (healthValue) healthValue.textContent = Math.ceil(stats.health || 0);
        if (ammoValue) ammoValue.textContent = `${stats.ammo || 0}/${stats.maxAmmo || 0}`;
        if (killsValue) killsValue.textContent = stats.kills || 0;
        if (scoreValue) scoreValue.textContent = stats.score || 0;
        if (playersValue) playersValue.textContent = stats.players || 1;
        if (seasonLevel) seasonLevel.textContent = seasonPass.playerLevel;
        if (healthProgress) {
            const healthPercent = Math.max(0, Math.min(100, (stats.health / 100) * 100));
            healthProgress.style.width = healthPercent + '%';
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        this.hudContainer.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, GAME_CONSTANTS.NOTIFICATION_DURATION);
    }

    /**
     * Show kill notification
     */
    showKillNotification(killerName, victimName, weapon = 'rifle') {
        const notification = document.createElement('div');
        notification.className = 'kill-notification';
        notification.innerHTML = `
            <span class="kill-killer">${killerName}</span>
            <span class="kill-icon">💥</span>
            <span class="kill-victim">${victimName}</span>
        `;
        this.hudContainer.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    /**
     * Show settings
     */
    showSettings() {
        const settingsHTML = `
            <div id="settings-modal" class="modal">
                <div class="modal-content settings-modal">
                    <button class="modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
                    
                    <h2 class="modal-title">⚙️ Settings</h2>
                    
                    <div class="settings-section">
                        <h3>Audio</h3>
                        <div class="setting-item">
                            <label>Master Volume</label>
                            <input type="range" min="0" max="100" value="${audioManager.masterVolume * 100}" 
                                onchange="audioManager.setMasterVolume(this.value/100)">
                        </div>
                        <div class="setting-item">
                            <label>Effects Volume</label>
                            <input type="range" min="0" max="100" value="${audioManager.effectsVolume * 100}" 
                                onchange="audioManager.setEffectsVolume(this.value/100)">
                        </div>
                        <div class="setting-item">
                            <label>Music Volume</label>
                            <input type="range" min="0" max="100" value="${audioManager.musicVolume * 100}" 
                                onchange="audioManager.setMusicVolume(this.value/100)">
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Gameplay</h3>
                        <div class="setting-item">
                            <label>Mouse Sensitivity</label>
                            <input type="range" min="1" max="10" value="5">
                        </div>
                        <div class="setting-item">
                            <label>Field of View (FOV)</label>
                            <input type="range" min="60" max="120" value="75">
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Graphics</h3>
                        <div class="setting-item">
                            <label>Quality</label>
                            <select>
                                <option>Low</option>
                                <option selected>Medium</option>
                                <option>High</option>
                                <option>Ultra</option>
                            </select>
                        </div>
                    </div>

                    <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" 
                        onclick="this.parentElement.parentElement.remove()">Save Settings</button>
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.innerHTML = settingsHTML;
        document.body.appendChild(modal.firstElementChild);
    }

    /**
     * Start game
     */
    startGame() {
        this.uiContainer.innerHTML = '';
        this.showHUD();
        gameManager.changeState('playing');
        cameraController.controls.lock();
        console.log('🎮 Game started!');
    }

    /**
     * Clear UI
     */
    clear() {
        this.uiContainer.innerHTML = '';
        this.hudContainer.innerHTML = '';
    }
}

const uiManager = new UIManager();
