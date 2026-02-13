// ============================================
// AUTH MANAGER - OAuth Integration (Google/Discord)
// ============================================

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authProvider = null;
        this.accessToken = null;
    }

    /**
     * Setup OAuth configuration
     */
    setupOAuth() {
        // Google OAuth Config
        this.googleConfig = {
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
            redirectUri: `${window.location.origin}/oauth/google/callback`,
            scope: 'profile email',
            authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
        };

        // Discord OAuth Config
        this.discordConfig = {
            clientId: process.env.REACT_APP_DISCORD_CLIENT_ID || 'YOUR_DISCORD_CLIENT_ID',
            redirectUri: `${window.location.origin}/oauth/discord/callback`,
            scope: 'identify email',
            authorizationUrl: 'https://discord.com/api/oauth2/authorize'
        };
    }

    /**
     * Authenticate with Google
     */
    authenticateGoogle() {
        console.log('🔐 Initiating Google Authentication...');
        
        const params = new URLSearchParams({
            client_id: this.googleConfig.clientId,
            redirect_uri: this.googleConfig.redirectUri,
            response_type: 'code',
            scope: this.googleConfig.scope,
            access_type: 'offline',
            prompt: 'consent'
        });

        const authUrl = `${this.googleConfig.authorizationUrl}?${params.toString()}`;
        
        // Mock authentication for now
        this.mockAuthentication('google', {
            id: 'google_' + Math.random().toString(36).substr(2, 9),
            email: 'player@gmail.com',
            name: 'Google Player',
            provider: 'google',
            avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
        });

        // In production, use:
        // window.location.href = authUrl;
    }

    /**
     * Authenticate with Discord
     */
    authenticateDiscord() {
        console.log('🔐 Initiating Discord Authentication...');

        const params = new URLSearchParams({
            client_id: this.discordConfig.clientId,
            redirect_uri: this.discordConfig.redirectUri,
            response_type: 'code',
            scope: this.discordConfig.scope,
            permissions: '0'
        });

        const authUrl = `${this.discordConfig.authorizationUrl}?${params.toString()}`;

        // Mock authentication for now
        this.mockAuthentication('discord', {
            id: 'discord_' + Math.random().toString(36).substr(2, 9),
            email: 'player@discord.com',
            name: 'Discord Player',
            provider: 'discord',
            avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
        });

        // In production, use:
        // window.location.href = authUrl;
    }

    /**
     * Mock authentication for development
     */
    mockAuthentication(provider, userData) {
        this.currentUser = userData;
        this.isAuthenticated = true;
        this.authProvider = provider;
        this.accessToken = 'mock_token_' + Math.random().toString(36).substr(2, 9);

        console.log(`✓ Authenticated with ${provider}:`, userData);

        // Store in session
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('authToken', this.accessToken);

        // Show welcome message
        uiManager.showNotification(`Welcome, ${userData.name}! 👋`, 'success');

        // Update UI
        this.updateAuthUI();

        // Send auth to server
        networkManager.emit('authenticate', {
            provider: provider,
            user: userData,
            token: this.accessToken
        });
    }

    /**
     * Handle OAuth callback
     */
    handleOAuthCallback(code, provider) {
        console.log('Processing OAuth callback...', { code, provider });

        // Send code to backend
        fetch('/api/auth/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, provider })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                this.mockAuthentication(provider, data.user);
            } else {
                console.error('Authentication failed:', data.error);
            }
        })
        .catch(error => {
            console.error('OAuth error:', error);
            uiManager.showNotification('Authentication failed. Please try again.', 'error');
        });
    }

    /**
     * Logout user
     */
    logout() {
        console.log('Logging out...');
        
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authProvider = null;
        this.accessToken = null;

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');

        uiManager.showNotification('Logged out successfully', 'info');
        this.updateAuthUI();
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        if (this.currentUser) return this.currentUser;

        // Try to load from session
        const stored = sessionStorage.getItem('user');
        if (stored) {
            this.currentUser = JSON.parse(stored);
            this.isAuthenticated = true;
            this.accessToken = sessionStorage.getItem('authToken');
        }

        return this.currentUser;
    }

    /**
     * Update auth UI
     */
    updateAuthUI() {
        const authContainer = document.getElementById('auth-container');
        if (!authContainer) return;

        if (this.isAuthenticated && this.currentUser) {
            authContainer.innerHTML = `
                <div class="auth-user-info">
                    <img src="${this.currentUser.avatar}" class="auth-avatar" alt="${this.currentUser.name}">
                    <div class="auth-user-details">
                        <p class="auth-username">${this.currentUser.name}</p>
                        <p class="auth-provider">${this.authProvider}</p>
                    </div>
                    <button class="btn btn-small" onclick="authManager.logout()">Logout</button>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <div class="auth-buttons">
                    <button class="btn btn-secondary" onclick="authManager.authenticateGoogle()">
                        🔵 Google
                    </button>
                    <button class="btn btn-secondary" onclick="authManager.authenticateDiscord()">
                        🟣 Discord
                    </button>
                </div>
            `;
        }
    }

    /**
     * Check if authenticated
     */
    isLoggedIn() {
        return this.isAuthenticated && this.currentUser !== null;
    }

    /**
     * Get auth header for API requests
     */
    getAuthHeader() {
        return {
            'Authorization': `Bearer ${this.accessToken}`
        };
    }

    /**
     * Link account (for existing players)
     */
    linkAccount(provider) {
        console.log(`Linking ${provider} account...`);
        // TODO: Implement account linking logic
    }

    /**
     * Unlink account
     */
    unlinkAccount(provider) {
        console.log(`Unlinking ${provider} account...`);
        // TODO: Implement account unlinking logic
    }
}

const authManager = new AuthManager();
authManager.setupOAuth();
