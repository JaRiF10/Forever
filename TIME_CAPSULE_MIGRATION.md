# Time Capsule Feature: localStorage → Backend Migration Guide

## 📋 Current State (Option A - Prototype)

**Status:** ✅ **Production-like localStorage prototype** in `Index.html`

### Features Implemented:
- ✅ Create capsule with title, message, unlock date & time
- ✅ Split view: Locked (🔒) and Unlocked (🔓) capsules
- ✅ Auto-lock/unlock based on current time
- ✅ Smooth animations (fadeIn, slideUp, slideInLeft, slideInRight, bounce)
- ✅ Character counter (max 2000 chars)
- ✅ Copy-to-clipboard for opened capsules
- ✅ Better date/time formatting
- ✅ Countdown timer (days/hours remaining)
- ✅ Form validation (future dates, min length, etc.)
- ✅ Persistent storage in localStorage
- ✅ Pre-filled tomorrow as default unlock date

### Data Structure (localStorage key: `timeCapsules`):
```json
[
  {
    "id": "1234567890",
    "authorId": "user@email.com",
    "title": "Our Anniversary",
    "content": "Happy anniversary my love! ...",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "unlockAt": "2025-06-15T12:00:00.000Z",
    "isOpened": false,
    "openedAt": null,
    "recipientId": null
  }
]
```

---

## 🔄 Migration Steps (Option B - Backend Integration)

### Phase 1: Backend API Endpoints

The backend (`/backend/server.js`) already has these endpoints ready:

#### Create Capsule
```bash
POST /api/capsules
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Our Anniversary",
  "content": "Happy anniversary my love!",
  "unlockAt": "2025-06-15T12:00:00.000Z",
  "recipientId": null
}

Response (201):
{
  "_id": "507f1f77bcf86cd799439011",
  "authorId": "user@email.com",
  "title": "Our Anniversary",
  "content": "Happy anniversary my love!",
  "unlockAt": "2025-06-15T12:00:00.000Z",
  "isOpened": false,
  "openedAt": null,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

#### List User's Capsules
```bash
GET /api/capsules
Authorization: Bearer <token>

Response (200):
[
  { /* capsule objects */ }
]
```

#### Get Specific Capsule (with unlock guard)
```bash
GET /api/capsules/:id
Authorization: Bearer <token>

Response (200):
{
  "isLocked": false,
  "unlockAt": "2025-06-15T12:00:00.000Z",
  "content": "Full content only if unlocked",
  "title": "Our Anniversary",
  ...
}

// If locked, content is hidden:
{
  "isLocked": true,
  "unlockAt": "2025-06-15T12:00:00.000Z",
  "content": "[LOCKED - Available after June 15]",
  ...
}
```

#### Update Capsule (if locked)
```bash
PATCH /api/capsules/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}

Response (200): Updated capsule object
```

#### Delete Capsule
```bash
DELETE /api/capsules/:id
Authorization: Bearer <token>

Response (204): No content
```

---

### Phase 2: Frontend Code Updates

#### Step 1: Add API Base URL to .env
```javascript
// In Index.html, add at top:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

#### Step 2: Replace localStorage calls in `getTimeCapsulePage()`

**BEFORE (localStorage):**
```javascript
getTimeCapsulePage() {
    const capsules = JSON.parse(localStorage.getItem('timeCapsules') || '[]');
    // ... rest of code
}
```

**AFTER (API):**
```javascript
getTimeCapsulePage() {
    // [MIGRATION NOTE] Replace with API call
    const token = localStorage.getItem('authToken');
    const capsules = await this.fetchCapsules(token);
    // ... rest of code
}

async fetchCapsules(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/capsules`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch capsules:', error);
        return [];
    }
}
```

#### Step 3: Replace form submission in `setupCapsuleListeners()`

**BEFORE (localStorage):**
```javascript
const capsules = JSON.parse(localStorage.getItem('timeCapsules') || '[]');
const capsule = { id, authorId, title, content, createdAt, unlockAt };
capsules.push(capsule);
localStorage.setItem('timeCapsules', JSON.stringify(capsules));
```

**AFTER (API):**
```javascript
const token = localStorage.getItem('authToken');
const response = await fetch(`${API_BASE_URL}/api/capsules`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: title || 'Untitled Capsule',
        content,
        unlockAt: unlockAt.toISOString(),
        recipientId: null
    })
});

if (response.ok) {
    const newCapsule = await response.json();
    alert(`✅ Capsule created!`);
} else {
    alert('❌ Failed to create capsule');
}
```

#### Step 4: Replace delete in `deleteCapsule()`

**BEFORE (localStorage):**
```javascript
deleteCapsule(id) {
    let capsules = JSON.parse(localStorage.getItem('timeCapsules') || '[]');
    capsules = capsules.filter(c => c.id !== id);
    localStorage.setItem('timeCapsules', JSON.stringify(capsules));
}
```

**AFTER (API):**
```javascript
async deleteCapsule(id) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/api/capsules/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        alert('✅ Capsule deleted');
        this.goToPage('capsule');
    } else {
        alert('❌ Failed to delete capsule');
    }
}
```

#### Step 5: Replace mark-as-opened in `showCapsuleContent()`

**BEFORE (localStorage):**
```javascript
if (idx !== -1 && !capsules[idx].isOpened) {
    capsules[idx].isOpened = true;
    capsules[idx].openedAt = new Date().toISOString();
    localStorage.setItem('timeCapsules', JSON.stringify(capsules));
}
```

**AFTER (API):**
```javascript
const token = localStorage.getItem('authToken');
await fetch(`${API_BASE_URL}/api/capsules/${id}`, {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isOpened: true })
});
```

---

## 🧪 Unit Test Plan

### Test Suite: Time Capsule Prototype

#### Test 1: Create Capsule
```javascript
// localStorage
const before = JSON.parse(localStorage.getItem('timeCapsules') || '[]').length;
// User fills form and submits
const after = JSON.parse(localStorage.getItem('timeCapsules') || '[]').length;
assert(after === before + 1, "Capsule should be added to localStorage");
assert(capsule.title === "Test", "Title should be saved");
assert(capsule.content.length > 0, "Content should be saved");
assert(capsule.authorId === currentUser, "Author should be current user");
```

#### Test 2: Lock/Unlock Logic
```javascript
const now = new Date();
const futureDate = new Date(now.getTime() + 24*60*60*1000); // tomorrow
const capsule = {
    title: "Test",
    content: "Test content",
    unlockAt: futureDate.toISOString(),
    createdAt: now.toISOString()
};

const locked = capsule.unlockAt > now.toISOString();
assert(locked === true, "Capsule should be locked when unlockAt is in future");

capsule.unlockAt = new Date(now.getTime() - 1000).toISOString(); // 1 sec ago
const unlocked = capsule.unlockAt <= now.toISOString();
assert(unlocked === true, "Capsule should be unlocked when unlockAt is in past");
```

#### Test 3: Form Validation
```javascript
// Test empty content
const valid1 = content.trim().length >= 5;
assert(valid1 === false, "Content < 5 chars should fail");

// Test future date
const unlockDate = new Date(now.getTime() - 1000); // past
const valid2 = unlockDate > now;
assert(valid2 === false, "Past unlock date should fail");

// Test max length
const longContent = "a".repeat(2001);
assert(longContent.length > 2000, "Should truncate to 2000 chars");
```

#### Test 4: UI Rendering
```javascript
// Test locked capsules appear in "Locked" section
const lockedCapsule = /* capsule with future unlockAt */;
const lockedSection = document.querySelector('h3:contains("🔒 Locked")');
assert(lockedSection, "Locked section should exist");

// Test unlocked capsules appear in "Unlocked" section
const unlockedCapsule = /* capsule with past unlockAt */;
const unlockedSection = document.querySelector('h3:contains("🔓 Unlocked")');
assert(unlockedSection, "Unlocked section should exist");

// Test countdown timer
const daysLeft = Math.ceil((unlockDate - now) / (1000*60*60*24));
assert(daysLeft >= 0, "Days left should be non-negative");
```

#### Test 5: Modal Animation
```javascript
// Test fadeIn animation
const modal = document.querySelector('[style*="animation"]');
assert(modal.style.animation.includes('fadeIn'), "Modal should fade in");

// Test slideUp animation
assert(modal.style.animation.includes('slideUp'), "Modal content should slide up");
```

#### Test 6: Delete Functionality
```javascript
const before = JSON.parse(localStorage.getItem('timeCapsules') || '[]');
App.deleteCapsule(capsule.id);
const after = JSON.parse(localStorage.getItem('timeCapsules') || '[]');
assert(after.length === before.length - 1, "Capsule should be removed");
```

#### Test 7: Copy to Clipboard
```javascript
const content = "Test message";
navigator.clipboard.writeText(content);
const clipboardContent = await navigator.clipboard.readText();
assert(clipboardContent === content, "Clipboard should contain message");
```

---

## 📊 Backend Models (Already Created)

### TimeCapsule Schema (MongoDB)
```javascript
{
  _id: ObjectId,
  authorId: "user@email.com",
  recipientId: null, // For future "share capsule" feature
  title: String,
  content: String,
  attachments: [{ filename, url, mimeType }], // Future enhancement
  unlockAt: Date,
  isOpened: Boolean,
  openedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  
  // TTL Index: Auto-delete 90 days after opening
  expireAt: Date
}
```

---

## 🚀 Deployment Checklist

### Local Development
- [ ] MongoDB running (`docker run -d -p 27017:27017 mongo:latest`)
- [ ] Backend running (`npm dev` in /backend)
- [ ] Frontend running (open `Index.html` in browser)
- [ ] Test capsule CRUD operations

### Production
- [ ] Deploy backend to Render/Heroku
- [ ] Deploy frontend to Vercel/Netlify
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables set (.env)
- [ ] JWT secret updated (not dev-secret-key)
- [ ] CORS configured for production domain

---

## 💡 Future Enhancements

1. **Recipients** - Share capsule with another user (recipientId field)
2. **Attachments** - Add photos/videos to capsule
3. **Scheduled Notifications** - Email when capsule unlocks
4. **Collaborative Capsules** - Multiple users add to one capsule
5. **Expiration** - Auto-delete after opening (TTL index ready)
6. **Encryption** - Encrypt sensitive content
7. **Backup** - Download capsule as JSON/PDF
8. **Public Gallery** - Share unlocked capsules anonymously

---

## 📝 Code Comments in Index.html

All migration points are marked with:
```javascript
// [MIGRATION NOTE] Replace ... with API call to ...
```

Search for `MIGRATION NOTE` to find all places that need updating.

---

## ✅ Testing Commands

### Postman (API Testing)
```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "email": "test@example.com",
  "password": "Test123!",
  "name": "Test User"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "Test123!"
}
# Copy token from response

# Create Capsule
POST http://localhost:5000/api/capsules
Authorization: Bearer <token>
{
  "title": "Test Capsule",
  "content": "This is a test message",
  "unlockAt": "2025-12-31T23:59:59.000Z",
  "recipientId": null
}

# Get Capsules
GET http://localhost:5000/api/capsules
Authorization: Bearer <token>

# Get Specific Capsule
GET http://localhost:5000/api/capsules/<capsule_id>
Authorization: Bearer <token>

# Delete Capsule
DELETE http://localhost:5000/api/capsules/<capsule_id>
Authorization: Bearer <token>
```

### CLI Testing
```bash
cd backend
npm test  # Runs Jest test suite (if configured)
node test-api.js  # Manual API test
./test.ps1  # PowerShell test (Windows)
```

---

## 📞 Support

For backend API details, see:
- `/backend/README.md` — Full API documentation
- `/backend/routes/capsules.js` — Route implementation
- `/backend/models/TimeCapsule.js` — Database schema

For frontend details, search for `Time Capsule` in `Index.html`.
