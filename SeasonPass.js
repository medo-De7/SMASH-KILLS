// ============================================
// SEASON PASS - Battle Pass / Progress System
// ============================================

class SeasonPass {
    constructor() {
        this.currentSeason = 1;
        this.seasonStartDate = new Date();
        this.seasonEndDate = new Date(this.seasonStartDate.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
        
        this.playerLevel = 1;
        this.playerExp = 0;
        this.maxExpPerLevel = 1000;
        
        this.kills = 0;
        this.targetKills = 100; // Target kills for season
        
        this.rewards = [];
        this.claimedRewards = [];
        this.setupRewards();
    }

    /**
     * Setup season pass rewards
     */
    setupRewards() {
        this.rewards = [
            {
                id: 'sp_reward_1',
                level: 1,
                name: 'Common Skin',
                icon: '👤',
                type: 'skin',
                rarity: 'common'
            },
            {
                id: 'sp_reward_2',
                level: 5,
                name: '500 Coins',
                icon: '💰',
                type: 'currency',
                amount: 500
            },
            {
                id: 'sp_reward_3',
                level: 10,
                name: 'Rare Weapon Skin',
                icon: '🔫',
                type: 'weapon',
                rarity: 'rare'
            },
            {
                id: 'sp_reward_4',
                level: 15,
                name: 'Emote Pack',
                icon: '😂',
                type: 'cosmetic'
            },
            {
                id: 'sp_reward_5',
                level: 20,
                name: '10 Gems',
                icon: '💎',
                type: 'currency',
                amount: 10
            },
            {
                id: 'sp_reward_6',
                level: 25,
                name: 'Legendary Skin',
                icon: '👑',
                type: 'skin',
                rarity: 'legendary'
            },
            {
                id: 'sp_reward_7',
                level: 30,
                name: '1000 Coins',
                icon: '🤑',
                type: 'currency',
                amount: 1000
            },
            {
                id: 'sp_reward_8',
                level: 50,
                name: 'Season Title',
                icon: '🏆',
                type: 'title'
            }
        ];
    }

    /**
     * Add kills from server data
     */
    addKills(count) {
        this.kills += count;
        console.log(`Kills: ${this.kills}/${this.targetKills}`);
        this.updateSeasonProgress();
    }

    /**
     * Add experience points
     */
    addExp(amount) {
        this.playerExp += amount;

        // Level up
        while (this.playerExp >= this.maxExpPerLevel) {
            this.playerExp -= this.maxExpPerLevel;
            this.levelUp();
        }

        this.updateSeasonProgress();
    }

    /**
     * Level up player
     */
    levelUp() {
        this.playerLevel++;
        console.log(`🎉 Level Up! New Level: ${this.playerLevel}`);
        uiManager.showNotification(`🎉 Level ${this.playerLevel}!`, 'success');

        // Check for rewards
        this.checkRewards();
    }

    /**
     * Check if player can claim any rewards
     */
    checkRewards() {
        this.rewards.forEach(reward => {
            if (
                reward.level <= this.playerLevel &&
                !this.claimedRewards.includes(reward.id)
            ) {
                this.claimReward(reward);
            }
        });
    }

    /**
     * Claim reward
     */
    claimReward(reward) {
        this.claimedRewards.push(reward.id);

        console.log(`✓ Reward Claimed: ${reward.name}`);
        uiManager.showNotification(`🎁 Reward Unlocked: ${reward.name}`, 'success');

        // Apply reward
        if (reward.type === 'currency' && reward.amount) {
            shopSystem.addCurrency(reward.amount, 'coins');
        }

        audioManager.playEffect('levelup');
    }

    /**
     * Get progress percentage
     */
    getProgressPercentage() {
        const expPercentage = (this.playerExp / this.maxExpPerLevel) * 100;
        return Math.min(100, expPercentage);
    }

    /**
     * Get season progress (kills)
     */
    getSeasonKillsPercentage() {
        return Math.min(100, (this.kills / this.targetKills) * 100);
    }

    /**
     * Get time remaining in season
     */
    getTimeRemaining() {
        const now = new Date();
        const msRemaining = this.seasonEndDate - now;
        
        if (msRemaining <= 0) return { days: 0, hours: 0, minutes: 0 };

        const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));

        return {
            days: daysRemaining,
            hours: hoursRemaining,
            minutes: minutesRemaining
        };
    }

    /**
     * Update season progress display
     */
    updateSeasonProgress() {
        const progressBar = document.getElementById('season-passes-progress-bar');
        const progressText = document.getElementById('season-pass-progress-text');

        if (progressBar) {
            progressBar.style.width = `${this.getProgressPercentage()}%`;
        }

        if (progressText) {
            progressText.textContent = `Level ${this.playerLevel} (${Math.floor(this.playerExp)}/${this.maxExpPerLevel} XP)`;
        }

        // Update kills progress
        const killsBar = document.getElementById('season-pass-kills-bar');
        if (killsBar) {
            killsBar.style.width = `${this.getSeasonKillsPercentage()}%`;
        }
    }

    /**
     * Create season pass UI
     */
    createSeasonPassUI() {
        const timeRemaining = this.getTimeRemaining();

        const passHTML = `
            <div id="season-pass-modal" class="modal">
                <div class="modal-content season-pass-modal">
                    <button class="modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
                    
                    <h2 class="modal-title">⚔️ Season ${this.currentSeason} Battle Pass</h2>
                    
                    <div class="season-info">
                        <div class="season-time">
                            <span class="time-label">Time Remaining:</span>
                            <span class="time-value">${timeRemaining.days}d ${timeRemaining.hours}h</span>
                        </div>
                    </div>

                    <div class="season-progress-section">
                        <h3>📊 Your Progress</h3>
                        
                        <div class="progress-item">
                            <div class="progress-label">
                                <span>Current Level</span>
                                <span class="progress-value">${this.playerLevel}</span>
                            </div>
                            <div class="progress-bar">
                                <div id="season-passes-progress-bar" class="progress-fill" style="width: ${this.getProgressPercentage()}%"></div>
                            </div>
                            <div class="progress-text" id="season-pass-progress-text">Level ${this.playerLevel} (${Math.floor(this.playerExp)}/${this.maxExpPerLevel} XP)</div>
                        </div>

                        <div class="progress-item">
                            <div class="progress-label">
                                <span>Season Kills</span>
                                <span class="progress-value">${this.kills}/${this.targetKills}</span>
                            </div>
                            <div class="progress-bar">
                                <div id="season-pass-kills-bar" class="progress-fill" style="width: ${this.getSeasonKillsPercentage()}%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="season-reward-section">
                        <h3>🎁 Rewards</h3>
                        <div class="season-rewards">
                            ${this.rewards.map(reward => `
                                <div class="reward-item ${this.playerLevel >= reward.level ? 'reward-unlocked' : 'reward-locked'}">
                                    <div class="reward-icon">${reward.icon}</div>
                                    <div class="reward-name">${reward.name}</div>
                                    <div class="reward-level">Lv. ${reward.level}</div>
                                    ${this.playerLevel >= reward.level ? 
                                        '<span class="reward-badge">✓ Unlocked</span>' : 
                                        '<span class="reward-badge">Locked</span>'
                                    }
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return passHTML;
    }

    /**
     * Show season pass modal
     */
    show() {
        const modal = document.createElement('div');
        modal.innerHTML = this.createSeasonPassUI();
        document.body.appendChild(modal.firstElementChild);
    }

    /**
     * Get rewards available at specific level
     */
    getRewardsForLevel(level) {
        return this.rewards.filter(r => r.level <= level && !this.claimedRewards.includes(r.id));
    }
}

const seasonPass = new SeasonPass();
