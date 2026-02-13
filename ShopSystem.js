// ============================================
// SHOP SYSTEM - In-game Shop & Purchasing
// ============================================

class ShopSystem {
    constructor() {
        this.playerCurrency = {
            coins: 1000,
            gems: 50
        };
        this.inventory = [];
        this.shopItems = [];
        this.setupShopItems();
    }

    /**
     * Setup shop items with prices and details
     */
    setupShopItems() {
        this.shopItems = [
            // Common Skins
            {
                id: 'shop_common_1',
                name: 'Blue Soldier',
                rarity: 'common',
                price: 500,
                currency: 'coins',
                icon: '👤',
                description: 'Classic blue military outfit'
            },
            {
                id: 'shop_common_2',
                name: 'Green Commando',
                rarity: 'common',
                price: 500,
                currency: 'coins',
                icon: '👥',
                description: 'Green tactical commando suit'
            },

            // Rare Skins
            {
                id: 'shop_rare_1',
                name: 'Cyber Ninja',
                rarity: 'rare',
                price: 2500,
                currency: 'coins',
                icon: '🥷',
                description: 'High-tech ninja cyber suit'
            },
            {
                id: 'shop_rare_2',
                name: 'Ice Trooper',
                rarity: 'rare',
                price: 15,
                currency: 'gems',
                icon: '❄️',
                description: 'Frozen ice warrior outfit'
            },

            // Legendary Skins
            {
                id: 'shop_legendary_1',
                name: 'Phoenix Warrior',
                rarity: 'legendary',
                price: 50,
                currency: 'gems',
                icon: '🔥',
                description: 'Legendary phoenix rebirth warrior'
            },

            // Weapon Skins
            {
                id: 'shop_weapon_1',
                name: 'Gold Rifle',
                rarity: 'rare',
                price: 10,
                currency: 'gems',
                icon: '🔫',
                description: 'Shiny golden rifle skin'
            },

            // Cosmetics
            {
                id: 'shop_effect_1',
                name: 'Bloodlust Trail',
                rarity: 'rare',
                price: 5000,
                currency: 'coins',
                icon: '💨',
                description: 'Red blood trail effect'
            }
        ];
    }

    /**
     * Purchase an item
     */
    purchaseItem(itemId) {
        const item = this.shopItems.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return false;
        }

        const playerCur = this.playerCurrency[item.currency];
        if (playerCur < item.price) {
            uiManager.showNotification(
                `Not enough ${item.currency}! Need ${item.price - playerCur} more.`,
                'error'
            );
            return false;
        }

        // Deduct currency
        this.playerCurrency[item.currency] -= item.price;

        // Add to inventory
        this.inventory.push(item);

        console.log(`✓ Purchased: ${item.name}`);
        uiManager.showNotification(`✓ Purchased ${item.name}!`, 'success');
        audioManager.playEffect('purchase');

        // Send purchase to server
        networkManager.emit('purchase', { itemId: item.id });

        return true;
    }

    /**
     * Add currency to player
     */
    addCurrency(amount, type = 'coins') {
        if (!this.playerCurrency[type]) {
            console.warn(`Unknown currency type: ${type}`);
            return;
        }

        this.playerCurrency[type] += amount;
        console.log(`+${amount} ${type}`);
        this.updateCurrencyDisplay();
    }

    /**
     * Update currency display in HUD
     */
    updateCurrencyDisplay() {
        const coinsDisplay = document.getElementById('currency-coins');
        const gemsDisplay = document.getElementById('currency-gems');

        if (coinsDisplay) coinsDisplay.textContent = this.playerCurrency.coins;
        if (gemsDisplay) gemsDisplay.textContent = this.playerCurrency.gems;
    }

    /**
     * Create shop UI HTML
     */
    createShopUI() {
        const shopHTML = `
            <div id="shop-modal" class="modal">
                <div class="modal-content shop-modal">
                    <button class="modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
                    
                    <div class="shop-header">
                        <h2 class="modal-title">🛍️ Item Shop</h2>
                        <div class="shop-currency">
                            <div class="currency-item">
                                <span>💰</span>
                                <span id="shop-coins">${this.playerCurrency.coins}</span>
                            </div>
                            <div class="currency-item">
                                <span>💎</span>
                                <span id="shop-gems">${this.playerCurrency.gems}</span>
                            </div>
                        </div>
                    </div>

                    <div class="shop-tabs">
                        <button class="shop-tab active" onclick="shopSystem.filterByType('skins')">👤 Skins</button>
                        <button class="shop-tab" onclick="shopSystem.filterByType('weapons')">🔫 Weapons</button>
                        <button class="shop-tab" onclick="shopSystem.filterByType('effects')">✨ Effects</button>
                    </div>

                    <div class="shop-items" id="shop-items-container">
                        ${this.createShopItemsHTML()}
                    </div>
                </div>
            </div>
        `;

        return shopHTML;
    }

    /**
     * Create HTML for shop items
     */
    createShopItemsHTML() {
        return this.shopItems.map(item => `
            <div class="shop-item shop-item-${item.rarity}">
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-info">
                    <h3 class="shop-item-name">${item.name}</h3>
                    <p class="shop-item-desc">${item.description}</p>
                    <span class="shop-item-rarity">${item.rarity}</span>
                </div>
                <div class="shop-item-price">
                    <span class="price-amount">${item.price}</span>
                    <span class="price-currency">${item.currency === 'gems' ? '💎' : '💰'}</span>
                </div>
                <button class="btn btn-primary shop-buy-btn" onclick="shopSystem.purchaseItem('${item.id}')">
                    Buy
                </button>
            </div>
        `).join('');
    }

    /**
     * Filter shop by item type
     */
    filterByType(type) {
        // Update active tab
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');

        // Filter items based on type
        let filtered = this.shopItems;
        if (type === 'weapons') {
            filtered = this.shopItems.filter(i => i.id.includes('weapon'));
        } else if (type === 'effects') {
            filtered = this.shopItems.filter(i => i.id.includes('effect'));
        } else {
            filtered = this.shopItems.filter(i => !i.id.includes('weapon') && !i.id.includes('effect'));
        }

        // Update items display
        const container = document.getElementById('shop-items-container');
        if (container) {
            container.innerHTML = filtered.map(item => `
                <div class="shop-item shop-item-${item.rarity}">
                    <div class="shop-item-icon">${item.icon}</div>
                    <div class="shop-item-info">
                        <h3 class="shop-item-name">${item.name}</h3>
                        <p class="shop-item-desc">${item.description}</p>
                        <span class="shop-item-rarity">${item.rarity}</span>
                    </div>
                    <div class="shop-item-price">
                        <span class="price-amount">${item.price}</span>
                        <span class="price-currency">${item.currency === 'gems' ? '💎' : '💰'}</span>
                    </div>
                    <button class="btn btn-primary shop-buy-btn" onclick="shopSystem.purchaseItem('${item.id}')">
                        Buy
                    </button>
                </div>
            `).join('');
        }
    }

    /**
     * Show shop modal
     */
    show() {
        const modal = document.createElement('div');
        modal.innerHTML = this.createShopUI();
        document.body.appendChild(modal.firstElementChild);
        this.updateCurrencyDisplay();
    }

    /**
     * Get player inventory
     */
    getInventory() {
        return this.inventory;
    }

    /**
     * Check if player owns item
     */
    ownsItem(itemId) {
        return this.inventory.some(i => i.id === itemId);
    }
}

const shopSystem = new ShopSystem();
