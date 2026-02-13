// ============================================
// SPIN WHEEL - Loot/Skin Randomizer
// ============================================

class SpinWheel {
    constructor() {
        this.isSpinning = false;
        this.skins = [];
        this.probabilities = {};
        this.setupSkins();
    }

    /**
     * Setup available skins with rarity and probabilities
     */
    setupSkins() {
        this.skins = [
            // Common Skins (70%)
            { id: 'common_1', name: 'Blue Soldier', rarity: 'common', color: '#3498db', chance: 0.20 },
            { id: 'common_2', name: 'Green Commando', rarity: 'common', color: '#2ecc71', chance: 0.20 },
            { id: 'common_3', name: 'Red Fighter', rarity: 'common', color: '#e74c3c', chance: 0.15 },
            { id: 'common_4', name: 'White Knight', rarity: 'common', color: '#ecf0f1', chance: 0.15 },

            // Rare Skins (25%)
            { id: 'rare_1', name: 'Cyber Ninja', rarity: 'rare', color: '#9b59b6', chance: 0.12 },
            { id: 'rare_2', name: 'Ice Trooper', rarity: 'rare', color: '#1abc9c', chance: 0.13 },

            // Legendary Skins (5%)
            { id: 'legendary_1', name: 'Phoenix Warrior', rarity: 'legendary', color: '#f39c12', chance: 0.05 },
        ];

        // Build probability table
        this.probabilities = {};
        this.skins.forEach(skin => {
            this.probabilities[skin.id] = skin.chance;
        });
    }

    /**
     * Spin the wheel and get a random skin
     * Returns skin based on probability distribution
     */
    spin() {
        if (this.isSpinning) {
            console.warn('Wheel is already spinning!');
            return null;
        }

        this.isSpinning = true;
        const random = Math.random();
        let cumulativeProbability = 0;

        // Find skin based on cumulative probability
        for (const skin of this.skins) {
            cumulativeProbability += skin.chance;
            if (random <= cumulativeProbability) {
                console.log(`🎡 Spin Result: ${skin.name} (${skin.rarity})`);
                return skin;
            }
        }

        return this.skins[this.skins.length - 1]; // Fallback to last skin
    }

    /**
     * Animate the spin wheel UI
     * Returns promise that resolves when animation completes
     */
    animateSpin() {
        return new Promise((resolve) => {
            const wheel = document.getElementById('spin-wheel-container');
            if (!wheel) {
                this.isSpinning = false;
                resolve(null);
                return;
            }

            // Random rotation
            const rotations = Math.floor(Math.random() * 5) + 5; // 5-10 full rotations
            const randomDegree = Math.random() * 360;
            const totalDegree = rotations * 360 + randomDegree;

            // Apply rotation animation
            wheel.style.transition = 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            wheel.style.transform = `rotate(${totalDegree}deg)`;

            // Get result after animation
            setTimeout(() => {
                const result = this.spin();
                this.isSpinning = false;
                
                if (result) {
                    this.showSpinResult(result);
                }
                
                resolve(result);
            }, 3000);
        });
    }

    /**
     * Display spin result in a pop-up
     */
    showSpinResult(skin) {
        const resultContainer = document.createElement('div');
        resultContainer.className = `spin-result spin-result-${skin.rarity}`;
        resultContainer.innerHTML = `
            <div class="spin-result-content">
                <div class="spin-result-icon" style="background-color: ${skin.color}"></div>
                <h2 class="spin-result-name">${skin.name}</h2>
                <p class="spin-result-rarity">${skin.rarity.toUpperCase()}</p>
                <button onclick="this.parentElement.parentElement.remove()" class="spin-result-button">Claim</button>
            </div>
        `;
        document.body.appendChild(resultContainer);

        // Play reward sound
        audioManager.playEffect('reward');

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (resultContainer.parentElement) {
                resultContainer.remove();
            }
        }, 5000);
    }

    /**
     * Get all skins by rarity
     */
    getSkinsByRarity(rarity) {
        return this.skins.filter(skin => skin.rarity === rarity);
    }

    /**
     * Create wheel UI
     */
    createWheelUI() {
        const wheelHTML = `
            <div id="spin-wheel-modal" class="modal">
                <div class="modal-content spin-wheel-modal">
                    <button class="modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
                    
                    <h2 class="modal-title">🎡 Mystery Spin Wheel</h2>
                    <p class="modal-subtitle">Try your luck! Win amazing skins</p>
                    
                    <div class="spin-wheel-container">
                        <div id="spin-wheel-container" class="spin-wheel">
                            ${this.skins.map((skin, index) => `
                                <div class="spin-segment" style="
                                    transform: rotate(${(index / this.skins.length) * 360}deg);
                                    background-color: ${skin.color}20;
                                    border-color: ${skin.color};
                                ">
                                    <span class="spin-label">${skin.name}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="spin-pointer"></div>
                    </div>
                    
                    <div class="spin-stats">
                        <div class="stat-item">
                            <span class="stat-label">Common</span>
                            <span class="stat-value">70%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Rare</span>
                            <span class="stat-value">25%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Legendary</span>
                            <span class="stat-value">5%</span>
                        </div>
                    </div>
                    
                    <button id="spin-button" class="btn btn-primary spin-button" onclick="spinWheel.animateSpin()">
                        🎢 SPIN NOW
                    </button>
                </div>
            </div>
        `;

        return wheelHTML;
    }

    /**
     * Show spin wheel modal
     */
    show() {
        const modal = document.createElement('div');
        modal.innerHTML = this.createWheelUI();
        document.body.appendChild(modal.firstElementChild);
    }
}

const spinWheel = new SpinWheel();
