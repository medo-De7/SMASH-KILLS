// UI - Menus, HUD, Shop, Spin Wheel

let playerHealth = 100;
let playerAmmo = 30;
let playerKills = 0;

function initUI() {
    showMainMenu();
}

function showMainMenu() {
    const uiContainer = document.getElementById('ui-container');
    uiContainer.innerHTML = `
        <div id="main-menu">
            <h1>SMASH KILLS</h1>
            <button onclick="startGame()">ابدأ اللعبة</button>
            <button onclick="openShop()">المتجر</button>
            <button onclick="showSettings()">الإعدادات</button>
        </div>
    `;
}

function startGame() {
    const uiContainer = document.getElementById('ui-container');
    uiContainer.innerHTML = `
        <div class="hud">
            <div class="health-bar">
                الصحة: <span id="health-value">${playerHealth}</span>
            </div>
            <div class="ammo-counter">
                الذخيرة: <span id="ammo-value">${playerAmmo}</span>
            </div>
            <div class="player-count">
                القتلى: <span id="kills-value">${playerKills}</span>
            </div>
        </div>
    `;
}

function openShop() {
    alert('المتجر في المرحلة التالية...');
    // Shop logic here
}

function showSettings() {
    alert('الإعدادات في المرحلة التالية...');
    // Settings logic here
}

function updateHUD() {
    const healthValue = document.getElementById('health-value');
    const ammoValue = document.getElementById('ammo-value');
    const killsValue = document.getElementById('kills-value');

    if (healthValue) healthValue.textContent = playerHealth;
    if (ammoValue) ammoValue.textContent = playerAmmo;
    if (killsValue) killsValue.textContent = playerKills;
}

// Initialize UI when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}
