/**
 * Authentication System
 * Handles password setup and login
 */

const Auth = {
    isAuthenticated: false,
    passwordHash: null,
    sessionPassword: null,

    /**
     * Initialize authentication
     */
    async init() {
        console.log('🔐 Initializing authentication...');
        
        // Check if password exists in storage
        try {
            const storedHash = localStorage.getItem('birthday_password_hash');
            
            if (storedHash) {
                this.passwordHash = storedHash;
                this.showLoginScreen();
            } else {
                this.showSetupScreen();
            }
        } catch (error) {
            console.error('Auth init error:', error);
            this.showSetupScreen();
        }
    },

    /**
     * Show password setup screen for first time
     */
    showSetupScreen() {
        console.log('📝 Showing setup screen');
        const root = document.getElementById('root');
        
        root.innerHTML = `
            <div class="auth-overlay">
                <div class="auth-container">
                    <div class="auth-header">
                        <h1>🎂 Welcome!</h1>
                        <p>Set up your birthday website password</p>
                    </div>
                    <form class="auth-form" id="setup-form">
                        <div class="form-group">
                            <label for="setup-password">Create Password</label>
                            <input type="password" id="setup-password" placeholder="Enter a strong password" required minlength="6">
                            <small>Use at least 6 characters</small>
                        </div>
                        <div class="form-group">
                            <label for="setup-confirm">Confirm Password</label>
                            <input type="password" id="setup-confirm" placeholder="Confirm your password" required minlength="6">
                        </div>
                        <button type="submit" class="auth-btn">Create & Continue 💕</button>
                        <div id="setup-message"></div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('setup-form').addEventListener('submit', (e) => this.handleSetup(e));
    },

    /**
     * Show login screen
     */
    showLoginScreen() {
        console.log('🔓 Showing login screen');
        const root = document.getElementById('root');
        
        root.innerHTML = `
            <div class="auth-overlay">
                <div class="auth-container">
                    <div class="auth-header">
                        <h1>🎂 Welcome Back!</h1>
                        <p>Enter your password to unlock</p>
                    </div>
                    <form class="auth-form" id="login-form">
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" placeholder="Enter your password" required>
                        </div>
                        <button type="submit" class="auth-btn">Unlock 💕</button>
                        <div id="login-message"></div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
    },

    /**
     * Handle password setup
     */
    async handleSetup(event) {
        event.preventDefault();
        
        const password = document.getElementById('setup-password').value;
        const confirm = document.getElementById('setup-confirm').value;
        const messageDiv = document.getElementById('setup-message');

        if (password !== confirm) {
            messageDiv.className = 'error-message';
            messageDiv.textContent = '❌ Passwords do not match!';
            return;
        }

        if (password.length < 6) {
            messageDiv.className = 'error-message';
            messageDiv.textContent = '❌ Password must be at least 6 characters';
            return;
        }

        try {
            // Hash the password
            const hash = await CryptoUtil.hashPassword(password);
            
            // Store hash
            localStorage.setItem('birthday_password_hash', hash);
            
            // Store session password
            sessionStorage.setItem('birthday_session_password', password);
            
            this.isAuthenticated = true;
            this.sessionPassword = password;
            this.passwordHash = hash;

            messageDiv.className = 'success-message';
            messageDiv.textContent = '✅ Password set successfully! Loading website...';

            // Hide loading screen and load app
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
                if (typeof BirthdayApp !== 'undefined') {
                    BirthdayApp.init();
                }
            }, 1000);

        } catch (error) {
            console.error('Setup error:', error);
            messageDiv.className = 'error-message';
            messageDiv.textContent = '❌ Error setting up password: ' + error.message;
        }
    },

    /**
     * Handle login
     */
    async handleLogin(event) {
        event.preventDefault();
        
        const password = document.getElementById('login-password').value;
        const messageDiv = document.getElementById('login-message');

        try {
            // Hash the entered password
            const hash = await CryptoUtil.hashPassword(password);
            
            // Compare with stored hash
            if (hash !== this.passwordHash) {
                messageDiv.className = 'error-message';
                messageDiv.textContent = '❌ Incorrect password!';
                return;
            }

            // Store session password
            sessionStorage.setItem('birthday_session_password', password);
            
            this.isAuthenticated = true;
            this.sessionPassword = password;

            messageDiv.className = 'success-message';
            messageDiv.textContent = '✅ Login successful! Loading website...';

            // Hide loading screen and load app
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
                if (typeof BirthdayApp !== 'undefined') {
                    BirthdayApp.init();
                }
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            messageDiv.className = 'error-message';
            messageDiv.textContent = '❌ Login error: ' + error.message;
        }
    },

    /**
     * Get the current session password
     */
    getPassword() {
        if (this.sessionPassword) {
            return this.sessionPassword;
        }
        return sessionStorage.getItem('birthday_session_password');
    },

    /**
     * Logout
     */
    logout() {
        this.isAuthenticated = false;
        this.sessionPassword = null;
        sessionStorage.removeItem('birthday_session_password');
        this.showLoginScreen();
    }
};

console.log('✅ Auth module loaded successfully');
