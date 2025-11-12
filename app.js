/**
 * Main Birthday Website Application
 * Handles all features: diary, gallery, notes, wishes, etc.
 */

const BirthdayApp = {
    currentPage: 'home',
    currentDiaryId: null,

    /**
     * Initialize the app
     */
    async init() {
        console.log('🎂 Initializing Birthday App...');
        
        try {
            await DataStore.init();
            this.render();
            this.setupEventListeners();
            this.updateCountdown();
            setInterval(() => this.updateCountdown(), 1000);
            
            console.log('✅ Birthday App initialized successfully');
            
            // Hide loading screen
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        } catch (error) {
            console.error('App initialization error:', error);
        }
    },

    /**
     * Main render function
     */
    render() {
        const root = document.getElementById('root');
        
        root.innerHTML = `
            <div class="app-container">
                <!-- Navigation Bar -->
                <nav class="navbar">
                    <div class="navbar-content">
                        <div class="navbar-brand">🎂 Birthday Website</div>
                        <div class="navbar-menu">
                            <a class="nav-link ${this.currentPage === 'home' ? 'active' : ''}" onclick="BirthdayApp.goToPage('home')">🏠 Home</a>
                            <a class="nav-link ${this.currentPage === 'diary' ? 'active' : ''}" onclick="BirthdayApp.goToPage('diary')">📔 Diary</a>
                            <a class="nav-link ${this.currentPage === 'notes' ? 'active' : ''}" onclick="BirthdayApp.goToPage('notes')">📝 Notes</a>
                            <a class="nav-link ${this.currentPage === 'wishes' ? 'active' : ''}" onclick="BirthdayApp.goToPage('wishes')">🎁 Wishes</a>
                            <a class="nav-link ${this.currentPage === 'gallery' ? 'active' : ''}" onclick="BirthdayApp.goToPage('gallery')">🖼️ Gallery</a>
                            <a class="nav-link ${this.currentPage === 'draw' ? 'active' : ''}" onclick="BirthdayApp.goToPage('draw')">✏️ Draw</a>
                            <button class="nav-btn" onclick="Auth.logout()">🚪 Logout</button>
                        </div>
                    </div>
                </nav>

                <!-- Main Content -->
                <div class="main-content">
                    ${this.getPageContent()}
                </div>
            </div>
        `;
    },

    /**
     * Get page content based on current page
     */
    getPageContent() {
        switch(this.currentPage) {
            case 'home':
                return this.getHomePage();
            case 'diary':
                return this.getDiaryPage();
            case 'notes':
                return this.getNotesPage();
            case 'wishes':
                return this.getWishesPage();
            case 'gallery':
                return this.getGalleryPage();
            case 'draw':
                return this.getDrawPage();
            default:
                return this.getHomePage();
        }
    },

    /**
     * Home page content
     */
    getHomePage() {
        return `
            <section class="section active">
                <div class="hero">
                    <h1 class="hero-title">🎂 Happy Birthday 💕</h1>
                    <p class="hero-subtitle">A special website created just for you</p>
                    
                    <div class="countdown">
                        <div class="countdown-title">Birthday Countdown</div>
                        <div class="countdown-grid">
                            <div class="countdown-item">
                                <div class="countdown-value" id="days">0</div>
                                <div class="countdown-label">Days</div>
                            </div>
                            <div class="countdown-item">
                                <div class="countdown-value" id="hours">0</div>
                                <div class="countdown-label">Hours</div>
                            </div>
                            <div class="countdown-item">
                                <div class="countdown-value" id="minutes">0</div>
                                <div class="countdown-label">Minutes</div>
                            </div>
                            <div class="countdown-item">
                                <div class="countdown-value" id="seconds">0</div>
                                <div class="countdown-label">Seconds</div>
                            </div>
                        </div>
                    </div>

                    <div class="card" style="margin-top: 40px;">
                        <h2 style="color: var(--primary); margin-bottom: 20px;">✨ Welcome to Your Special Space ✨</h2>
                        <p style="color: #555; line-height: 1.6; font-size: 16px;">
                            This website is a secure, personal space where you can:
                        </p>
                        <ul style="margin-top: 15px; line-height: 2; color: #555;">
                            <li>📔 Write daily diary entries about your feelings and memories</li>
                            <li>📝 Keep special notes and reminders</li>
                            <li>🎁 Create a wishes list for your birthday</li>
                            <li>🖼️ Store and organize photos</li>
                            <li>✏️ Create artistic drawings</li>
                            <li>🔐 Everything is encrypted and protected with your password</li>
                        </ul>
                    </div>
                </div>
            </section>
        `;
    },

    /**
     * Diary page
     */
    async getDiaryPage() {
        const entries = await DataStore.getDiaryEntries();
        
        let entriesHTML = '';
        
        if (entries.length > 0) {
            entries.reverse().forEach(entry => {
                const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                entriesHTML += `
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                            <div>
                                <h3 style="color: var(--primary); margin-bottom: 5px;">${entry.title || 'Untitled'}</h3>
                                <small style="color: #888;">${date}</small>
                            </div>
                            <button class="btn btn-primary" style="padding: 8px 12px; font-size: 12px;" onclick="BirthdayApp.deleteDiaryEntry(${entry.id})">🗑️ Delete</button>
                        </div>
                        <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${entry.content}</p>
                    </div>
                `;
            });
        }

        return `
            <section class="section active">
                <h2 style="color: var(--primary); margin-bottom: 30px;">📔 My Diary</h2>
                
                <div class="card" style="margin-bottom: 30px;">
                    <h3 style="color: var(--secondary); margin-bottom: 15px;">✍️ Write New Entry</h3>
                    <form id="diary-form">
                        <div class="form-group">
                            <label for="diary-title">Title (Optional)</label>
                            <input type="text" id="diary-title" placeholder="Give your entry a title..." style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; font-family: inherit;">
                        </div>
                        <div class="form-group">
                            <label for="diary-content">What's on your mind?</label>
                            <textarea id="diary-content" placeholder="Write your thoughts here..." style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; min-height: 200px; font-family: inherit;" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">💾 Save Entry</button>
                    </form>
                </div>

                <h3 style="color: var(--secondary); margin-bottom: 20px;">Previous Entries</h3>
                ${entries.length > 0 ? entriesHTML : '<p style="color: #888;">No diary entries yet. Start writing!</p>'}
            </section>
        `;
    },

    /**
     * Notes page
     */
    async getNotesPage() {
        const notes = await DataStore.getNotes();
        
        let notesHTML = '';
        
        if (notes.length > 0) {
            notes.reverse().forEach(note => {
                notesHTML += `
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <h3 style="color: var(--primary);">${note.text}</h3>
                            <button class="btn btn-primary" style="padding: 8px 12px; font-size: 12px;" onclick="BirthdayApp.deleteNote(${note.id})">🗑️ Delete</button>
                        </div>
                    </div>
                `;
            });
        }

        return `
            <section class="section active">
                <h2 style="color: var(--primary); margin-bottom: 30px;">📝 Special Notes</h2>
                
                <div class="card" style="margin-bottom: 30px;">
                    <h3 style="color: var(--secondary); margin-bottom: 15px;">✨ Add New Note</h3>
                    <form id="notes-form">
                        <div class="form-group">
                            <label for="note-text">Your Note</label>
                            <textarea id="note-text" placeholder="Write a special note..." style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; min-height: 100px; font-family: inherit;" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">💾 Save Note</button>
                    </form>
                </div>

                <h3 style="color: var(--secondary); margin-bottom: 20px;">Your Notes</h3>
                ${notes.length > 0 ? notesHTML : '<p style="color: #888;">No notes yet. Create one!</p>'}
            </section>
        `;
    },

    /**
     * Wishes page
     */
    async getWishesPage() {
        const wishes = await DataStore.getWishes();
        
        let wishesHTML = '';
        
        if (wishes.length > 0) {
            wishes.reverse().forEach(wish => {
                wishesHTML += `
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <h3 style="color: var(--primary);">${wish.text}</h3>
                            <button class="btn btn-primary" style="padding: 8px 12px; font-size: 12px;" onclick="BirthdayApp.deleteWish(${wish.id})">🗑️ Delete</button>
                        </div>
                    </div>
                `;
            });
        }

        return `
            <section class="section active">
                <h2 style="color: var(--primary); margin-bottom: 30px;">🎁 Birthday Wishes</h2>
                
                <div class="card" style="margin-bottom: 30px;">
                    <h3 style="color: var(--secondary); margin-bottom: 15px;">🌟 Add a Wish</h3>
                    <form id="wishes-form">
                        <div class="form-group">
                            <label for="wish-text">Your Birthday Wish</label>
                            <textarea id="wish-text" placeholder="What do you wish for your birthday?" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; min-height: 100px; font-family: inherit;" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">✨ Add Wish</button>
                    </form>
                </div>

                <h3 style="color: var(--secondary); margin-bottom: 20px;">Your Wishes</h3>
                ${wishes.length > 0 ? wishesHTML : '<p style="color: #888;">No wishes yet. Add one!</p>'}
            </section>
        `;
    },

    /**
     * Gallery page
     */
    async getGalleryPage() {
        const images = await DataStore.getGalleryImages();
        
        let galleryHTML = '';
        
        if (images.length > 0) {
            images.reverse().forEach(image => {
                galleryHTML += `
                    <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                        <img src="${image.data}" style="width: 100%; height: 250px; object-fit: cover;">
                        ${image.caption ? `<p style="padding: 10px; background: white; margin: 0; color: #555;">${image.caption}</p>` : ''}
                        <button class="btn btn-primary" style="position: absolute; top: 10px; right: 10px; padding: 8px 12px; font-size: 12px;" onclick="BirthdayApp.deleteGalleryImage(${image.id})">🗑️</button>
                    </div>
                `;
            });
        }

        return `
            <section class="section active">
                <h2 style="color: var(--primary); margin-bottom: 30px;">🖼️ Photo Gallery</h2>
                
                <div class="card" style="margin-bottom: 30px;">
                    <h3 style="color: var(--secondary); margin-bottom: 15px;">📸 Upload Photo</h3>
                    <form id="gallery-form">
                        <div class="form-group">
                            <label for="gallery-image">Select Image</label>
                            <input type="file" id="gallery-image" accept="image/*" required style="padding: 10px;">
                        </div>
                        <div class="form-group">
                            <label for="gallery-caption">Caption (Optional)</label>
                            <input type="text" id="gallery-caption" placeholder="Add a caption..." style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; font-family: inherit;">
                        </div>
                        <button type="submit" class="btn btn-primary">📤 Upload</button>
                    </form>
                </div>

                <h3 style="color: var(--secondary); margin-bottom: 20px;">Your Gallery</h3>
                ${images.length > 0 ? `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">${galleryHTML}</div>` : '<p style="color: #888;">No photos yet. Upload one!</p>'}
            </section>
        `;
    },

    /**
     * Drawing page
     */
    getDrawPage() {
        return `
            <section class="section active">
                <h2 style="color: var(--primary); margin-bottom: 30px;">✏️ Drawing Canvas</h2>
                
                <div class="card">
                    <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                        <button class="btn btn-primary" style="padding: 10px 15px; font-size: 12px;" onclick="BirthdayApp.changeDrawColor('#000000')">⚫ Black</button>
                        <button class="btn btn-primary" style="padding: 10px 15px; font-size: 12px; background: linear-gradient(135deg, #ff6b9d, #c44569);" onclick="BirthdayApp.changeDrawColor('#ff6b9d')">💕 Pink</button>
                        <button class="btn btn-primary" style="padding: 10px 15px; font-size: 12px; background: linear-gradient(135deg, #ffc3a0, #ff9a76);" onclick="BirthdayApp.changeDrawColor('#ffc3a0')">🧡 Orange</button>
                        <button class="btn btn-primary" style="padding: 10px 15px; font-size: 12px;" onclick="BirthdayApp.clearCanvas()">🗑️ Clear</button>
                        <button class="btn btn-primary" style="padding: 10px 15px; font-size: 12px;" onclick="BirthdayApp.saveDrawing()">💾 Save</button>
                    </div>
                    
                    <canvas id="drawing-canvas" width="800" height="500" style="border: 2px solid var(--primary); border-radius: 8px; background: white; cursor: crosshair; display: block; margin: 0 auto; max-width: 100%; height: auto;"></canvas>
                </div>
            </section>
        `;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Diary form
        const diaryForm = document.getElementById('diary-form');
        if (diaryForm) {
            diaryForm.addEventListener('submit', (e) => this.saveDiaryEntry(e));
        }

        // Notes form
        const notesForm = document.getElementById('notes-form');
        if (notesForm) {
            notesForm.addEventListener('submit', (e) => this.saveNote(e));
        }

        // Wishes form
        const wishesForm = document.getElementById('wishes-form');
        if (wishesForm) {
            wishesForm.addEventListener('submit', (e) => this.saveWish(e));
        }

        // Gallery form
        const galleryForm = document.getElementById('gallery-form');
        if (galleryForm) {
            galleryForm.addEventListener('submit', (e) => this.uploadGalleryImage(e));
        }

        // Setup drawing canvas
        this.setupDrawingCanvas();
    },

    /**
     * Save diary entry
     */
    async saveDiaryEntry(event) {
        event.preventDefault();
        
        const title = document.getElementById('diary-title').value;
        const content = document.getElementById('diary-content').value;

        if (!content.trim()) {
            alert('Please write something!');
            return;
        }

        try {
            await DataStore.addDiaryEntry({ title, content });
            alert('✅ Diary entry saved!');
            this.goToPage('diary');
        } catch (error) {
            alert('Error saving diary entry: ' + error.message);
        }
    },

    /**
     * Delete diary entry
     */
    async deleteDiaryEntry(id) {
        if (confirm('Are you sure you want to delete this entry?')) {
            await DataStore.deleteDiaryEntry(id);
            this.goToPage('diary');
        }
    },

    /**
     * Save note
     */
    async saveNote(event) {
        event.preventDefault();
        
        const text = document.getElementById('note-text').value;

        if (!text.trim()) {
            alert('Please write something!');
            return;
        }

        try {
            await DataStore.addNote({ text });
            alert('✅ Note saved!');
            this.goToPage('notes');
        } catch (error) {
            alert('Error saving note: ' + error.message);
        }
    },

    /**
     * Delete note
     */
    async deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            await DataStore.deleteNote(id);
            this.goToPage('notes');
        }
    },

    /**
     * Save wish
     */
    async saveWish(event) {
        event.preventDefault();
        
        const text = document.getElementById('wish-text').value;

        if (!text.trim()) {
            alert('Please write something!');
            return;
        }

        try {
            await DataStore.addWish({ text });
            alert('✅ Wish saved!');
            this.goToPage('wishes');
        } catch (error) {
            alert('Error saving wish: ' + error.message);
        }
    },

    /**
     * Delete wish
     */
    async deleteWish(id) {
        if (confirm('Are you sure you want to delete this wish?')) {
            await DataStore.deleteWish(id);
            this.goToPage('wishes');
        }
    },

    /**
     * Upload gallery image
     */
    async uploadGalleryImage(event) {
        event.preventDefault();
        
        const file = document.getElementById('gallery-image').files[0];
        const caption = document.getElementById('gallery-caption').value;

        if (!file) {
            alert('Please select an image!');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                await DataStore.addGalleryImage({
                    data: e.target.result,
                    caption: caption
                });
                alert('✅ Image uploaded!');
                this.goToPage('gallery');
            };
            reader.readAsDataURL(file);
        } catch (error) {
            alert('Error uploading image: ' + error.message);
        }
    },

    /**
     * Delete gallery image
     */
    async deleteGalleryImage(id) {
        if (confirm('Are you sure you want to delete this image?')) {
            await DataStore.deleteGalleryImage(id);
            this.goToPage('gallery');
        }
    },

    /**
     * Setup drawing canvas
     */
    setupDrawingCanvas() {
        const canvas = document.getElementById('drawing-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let drawColor = '#000000';

        // Set canvas size
        const container = canvas.parentElement;
        canvas.width = Math.min(container.clientWidth - 40, 800);

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.strokeStyle = drawColor;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();

            lastX = x;
            lastY = y;
        });

        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        canvas.addEventListener('mouseleave', () => {
            isDrawing = false;
        });

        this.drawContext = ctx;
        this.drawCanvas = canvas;
        this.drawColor = drawColor;
    },

    /**
     * Change drawing color
     */
    changeDrawColor(color) {
        this.drawColor = color;
        console.log('Drawing color changed to:', color);
    },

    /**
     * Clear canvas
     */
    clearCanvas() {
        if (this.drawContext && this.drawCanvas) {
            this.drawContext.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        }
    },

    /**
     * Save drawing
     */
    async saveDrawing() {
        if (this.drawCanvas) {
            const imageData = this.drawCanvas.toDataURL('image/png');
            await DataStore.addDrawing({ imageData });
            alert('✅ Drawing saved!');
        }
    },

    /**
     * Go to page
     */
    goToPage(page) {
        this.currentPage = page;
        this.render();
        this.setupEventListeners();
        window.scrollTo(0, 0);
    },

    /**
     * Update countdown timer
     */
    updateCountdown() {
        const birthdayDate = new Date('2025-11-20').getTime();
        const now = new Date().getTime();
        const distance = birthdayDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
            if (secondsEl) secondsEl.textContent = seconds;
        }
    }
};

console.log('✅ BirthdayApp module loaded successfully');
