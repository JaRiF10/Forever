/**
 * Storage Manager - Handles encrypted data storage
 * All data is encrypted before storing in localStorage
 */

const DataStore = {
    storageKey: 'birthday_app_data',

    /**
     * Initialize storage
     */
    async init() {
        console.log('💾 Initializing data storage...');
        await this.loadData();
    },

    /**
     * Load all data from storage
     */
    async loadData() {
        try {
            const encrypted = localStorage.getItem(this.storageKey);
            if (encrypted) {
                const password = Auth.getPassword();
                const decrypted = await CryptoUtil.decrypt(encrypted, password);
                return JSON.parse(decrypted);
            }
            return this.getDefaultData();
        } catch (error) {
            console.error('Load data error:', error);
            return this.getDefaultData();
        }
    },

    /**
     * Save all data to storage
     */
    async saveData(data) {
        try {
            const password = Auth.getPassword();
            if (!password) {
                console.error('No password available for encryption');
                return false;
            }
            
            const json = JSON.stringify(data);
            const encrypted = await CryptoUtil.encrypt(json, password);
            localStorage.setItem(this.storageKey, encrypted);
            console.log('✅ Data saved successfully');
            return true;
        } catch (error) {
            console.error('Save data error:', error);
            return false;
        }
    },

    /**
     * Get default data structure
     */
    getDefaultData() {
        return {
            diaries: [],
            notes: [],
            wishes: [],
            gallery: [],
            drawings: [],
            settings: {
                theme: 'light',
                notifications: true
            }
        };
    },

    /**
     * Add diary entry
     */
    async addDiaryEntry(entry) {
        const data = await this.loadData();
        data.diaries.push({
            ...entry,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        await this.saveData(data);
        return data.diaries[data.diaries.length - 1];
    },

    /**
     * Get all diary entries
     */
    async getDiaryEntries() {
        const data = await this.loadData();
        return data.diaries || [];
    },

    /**
     * Update diary entry
     */
    async updateDiaryEntry(id, updates) {
        const data = await this.loadData();
        const index = data.diaries.findIndex(d => d.id === id);
        if (index !== -1) {
            data.diaries[index] = { ...data.diaries[index], ...updates };
            await this.saveData(data);
            return data.diaries[index];
        }
        return null;
    },

    /**
     * Delete diary entry
     */
    async deleteDiaryEntry(id) {
        const data = await this.loadData();
        data.diaries = data.diaries.filter(d => d.id !== id);
        await this.saveData(data);
    },

    /**
     * Add note
     */
    async addNote(note) {
        const data = await this.loadData();
        data.notes.push({
            ...note,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        await this.saveData(data);
        return data.notes[data.notes.length - 1];
    },

    /**
     * Get all notes
     */
    async getNotes() {
        const data = await this.loadData();
        return data.notes || [];
    },

    /**
     * Delete note
     */
    async deleteNote(id) {
        const data = await this.loadData();
        data.notes = data.notes.filter(n => n.id !== id);
        await this.saveData(data);
    },

    /**
     * Add wish
     */
    async addWish(wish) {
        const data = await this.loadData();
        data.wishes.push({
            ...wish,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        await this.saveData(data);
        return data.wishes[data.wishes.length - 1];
    },

    /**
     * Get all wishes
     */
    async getWishes() {
        const data = await this.loadData();
        return data.wishes || [];
    },

    /**
     * Delete wish
     */
    async deleteWish(id) {
        const data = await this.loadData();
        data.wishes = data.wishes.filter(w => w.id !== id);
        await this.saveData(data);
    },

    /**
     * Add gallery image
     */
    async addGalleryImage(imageData) {
        const data = await this.loadData();
        data.gallery.push({
            ...imageData,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        await this.saveData(data);
        return data.gallery[data.gallery.length - 1];
    },

    /**
     * Get all gallery images
     */
    async getGalleryImages() {
        const data = await this.loadData();
        return data.gallery || [];
    },

    /**
     * Delete gallery image
     */
    async deleteGalleryImage(id) {
        const data = await this.loadData();
        data.gallery = data.gallery.filter(g => g.id !== id);
        await this.saveData(data);
    },

    /**
     * Add drawing
     */
    async addDrawing(drawingData) {
        const data = await this.loadData();
        data.drawings.push({
            ...drawingData,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        await this.saveData(data);
        return data.drawings[data.drawings.length - 1];
    },

    /**
     * Get all drawings
     */
    async getDrawings() {
        const data = await this.loadData();
        return data.drawings || [];
    },

    /**
     * Save settings
     */
    async saveSettings(settings) {
        const data = await this.loadData();
        data.settings = { ...data.settings, ...settings };
        await this.saveData(data);
    },

    /**
     * Get settings
     */
    async getSettings() {
        const data = await this.loadData();
        return data.settings || {};
    }
};

console.log('✅ DataStore module loaded successfully');
