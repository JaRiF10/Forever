/**
 * Encryption Utility - AES-256-GCM Encryption
 * Provides secure encryption/decryption using Web Crypto API
 */

const CryptoUtil = {
    // Algorithm configuration
    algorithm: {
        name: 'AES-GCM',
        length: 256
    },

    /**
     * Derive a key from password using PBKDF2
     */
    async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        
        const importedKey = await crypto.subtle.importKey(
            'raw',
            data,
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );

        return await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            importedKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    },

    /**
     * Encrypt text with password
     */
    async encrypt(text, password) {
        try {
            // Generate random salt and IV
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const iv = crypto.getRandomValues(new Uint8Array(12));

            // Derive key from password
            const key = await this.deriveKey(password, salt);

            // Encrypt the text
            const encoder = new TextEncoder();
            const data = encoder.encode(text);

            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );

            // Combine salt + IV + encrypted data
            const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.length);
            combined.set(new Uint8Array(encrypted), salt.length + iv.length);

            // Convert to base64
            return btoa(String.fromCharCode.apply(null, combined));
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('Failed to encrypt data');
        }
    },

    /**
     * Decrypt text with password
     */
    async decrypt(encryptedText, password) {
        try {
            // Decode from base64
            const combined = new Uint8Array(
                atob(encryptedText)
                    .split('')
                    .map(c => c.charCodeAt(0))
            );

            // Extract salt, IV, and encrypted data
            const salt = combined.slice(0, 16);
            const iv = combined.slice(16, 28);
            const encrypted = combined.slice(28);

            // Derive key from password
            const key = await this.deriveKey(password, salt);

            // Decrypt
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encrypted
            );

            // Convert back to text
            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Failed to decrypt data - invalid password or corrupted data');
        }
    },

    /**
     * Hash password for comparison
     */
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

console.log('✅ CryptoUtil loaded successfully');
