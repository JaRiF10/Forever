# My Sayang Backend - Full-Stack Setup Guide

A production-ready Express + MongoDB backend for the My Sayang birthday app with Time Capsules, Voice Memos, and Mood Timeline features.

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js >= 14
- MongoDB (local or Atlas cloud instance)
- npm or yarn

### Local Development Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
MONGO_URI=mongodb://localhost:27017/my-sayang
JWT_SECRET=your-super-secret-key-change-this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
STORAGE_TYPE=local
```

3. **Start MongoDB locally** (if using local)
```bash
# Windows (if installed via WSL or Docker)
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. **Start the server**
```bash
npm dev
# or for production: npm start
```

Server runs at `http://localhost:5000`

### Cloud Setup (MongoDB Atlas)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/my-sayang?retryWrites=true&w=majority`
3. Update `.env`:
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/my-sayang?retryWrites=true&w=majority
```

## 📚 API Endpoints

### Authentication

**Register**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass",
  "name": "John Doe"
}

# Response
{
  "user": { "_id", "email", "name", "createdAt" },
  "token": "eyJhbGc..."
}
```

**Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass"
}

# Response (same as register)
{
  "user": { ... },
  "token": "eyJhbGc..."
}
```

**Get Current User**
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Time Capsules

**Create Capsule**
```bash
POST /api/capsules
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Anniversary Message",
  "content": "I love you so much...",
  "unlockAt": "2025-12-25T00:00:00Z",
  "recipientId": "optional-user-id"
}

# Response
{
  "_id": "...",
  "authorId": "...",
  "title": "Anniversary Message",
  "content": "I love you so much...",
  "unlockAt": "2025-12-25T00:00:00Z",
  "isOpened": false,
  "createdAt": "2025-11-12T..."
}
```

**List Capsules**
```bash
GET /api/capsules
Authorization: Bearer <token>

# Returns array of capsules (locked and unlocked)
```

**Get Capsule** (with unlock guard)
```bash
GET /api/capsules/:id
Authorization: Bearer <token>

# If locked (unlockAt > now):
{
  "_id": "...",
  "title": "...",
  "isLocked": true,
  "daysRemaining": 42,
  "unlockAt": "2025-12-25T..."
}

# If unlocked:
{
  "_id": "...",
  "title": "...",
  "content": "full content here",
  "isOpened": true,
  "openedAt": "2025-11-15T..."
}
```

**Update Capsule** (only if locked)
```bash
PATCH /api/capsules/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Title",
  "content": "Updated content",
  "unlockAt": "2025-12-26T00:00:00Z"
}
```

**Delete Capsule**
```bash
DELETE /api/capsules/:id
Authorization: Bearer <token>
```

### Voice Memos

**Upload Voice Memo**
```bash
POST /api/voice/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Fields:
  - audio: (file, .webm or .mp3)
  - lengthSeconds: 45
  - tags: "funny,cute,love"
  - isPublic: true

# Response
{
  "_id": "...",
  "userId": "...",
  "url": "/uploads/voice/1234567890-abc123.webm",
  "lengthSeconds": 45,
  "tags": ["funny", "cute", "love"],
  "createdAt": "2025-11-12T..."
}
```

**Get All Voice Memos**
```bash
GET /api/voice
Authorization: Bearer <token>

# Returns array of user's voice memos
```

**Get Voice Memo**
```bash
GET /api/voice/:id
Authorization: Bearer <token>
```

**Update Voice Memo**
```bash
PATCH /api/voice/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "tags": "updated,tags",
  "isPublic": false,
  "transcript": "optional transcribed text"
}
```

**Delete Voice Memo**
```bash
DELETE /api/voice/:id
Authorization: Bearer <token>
```

### Moods

**Create Mood Entry**
```bash
POST /api/moods
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-11-12",
  "mood": "happy",
  "intensity": 5,
  "note": "Had a great day together",
  "tags": ["blessed", "grateful"],
  "isPublic": false
}

# Moods: happy, sad, excited, angry, loved, blessed, grateful
```

**Get Moods** (with date range)
```bash
GET /api/moods?startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <token>

# Returns moods sorted by date (newest first)
```

**Get Mood Entry**
```bash
GET /api/moods/:id
Authorization: Bearer <token>
```

**Update Mood**
```bash
PATCH /api/moods/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "mood": "loved",
  "intensity": 4,
  "note": "Updated note"
}
```

**Delete Mood**
```bash
DELETE /api/moods/:id
Authorization: Bearer <token>
```

## 🔐 Authentication Flow

1. User registers/logs in → receives JWT token
2. Token stored in frontend localStorage
3. Include token in every API request:
```javascript
fetch('/api/capsules', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```
4. Token expires after 30 days (configurable)

## 📁 Project Structure

```
backend/
├── server.js              # Main Express app
├── package.json           # Dependencies
├── .env.example           # Environment template
├── models/
│   ├── User.js           # User schema + password hashing
│   ├── TimeCapsule.js    # Time capsule with TTL
│   ├── Voice.js          # Voice memo metadata
│   └── Mood.js           # Mood entry with mood types
├── routes/
│   ├── auth.js           # Register, login, get me
│   ├── capsules.js       # CRUD + unlock guard
│   ├── voice.js          # Upload, list, delete
│   └── moods.js          # Mood CRUD
├── middleware/
│   ├── auth.js           # JWT verification
│   └── errorHandler.js   # Global error handling
└── uploads/              # Local file storage (auto-created)
    └── voice/
```

## 🚢 Deployment

### Deploy to Render (recommended for free tier)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Create Render app**
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Select the `backend` directory as root

3. **Environment variables** (in Render dashboard)
   - Add all `.env` variables
   - Set `NODE_ENV=production`

4. **Start command**: `npm start`

### Deploy to Heroku

```bash
heroku create my-sayang-api
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

### Deploy to AWS/DigitalOcean

Use EC2/Droplet + PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

## 📊 Database Models

### User
- email (unique)
- password (hashed)
- name
- avatar (URL)
- location
- createdAt, updatedAt

### TimeCapsule
- authorId (ref: User)
- recipientId (optional ref: User)
- title
- content (string)
- attachments (array of { filename, url, uploadedAt })
- unlockAt (Date)
- isOpened (Boolean)
- openedAt (optional Date)
- createdAt, updatedAt
- **TTL Index**: Removes documents 90 days after opening (optional)

### Voice
- userId (ref: User)
- filename
- url
- mimeType
- lengthSeconds
- transcript (optional)
- isPublic
- tags (array)
- createdAt, updatedAt

### Mood
- userId (ref: User)
- date (Date)
- mood (enum: happy, sad, excited, angry, loved, blessed, grateful)
- intensity (1-5)
- note (string)
- attachments (array)
- tags (array)
- isPublic
- createdAt, updatedAt
- **Index**: userId + date for fast queries

## 🔧 Optional Features

### File Storage Upgrade (S3)

Replace `multer diskStorage` with S3:
```javascript
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const upload = multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: (req, file, cb) => {
        cb(null, `voice/${Date.now()}.webm`);
    }
});
```

### Background Jobs (BullMQ)

For complex tasks (transcription, notifications):
```bash
npm install bull redis
```

Then use Bull queues in server.js.

### Email Notifications

Use SendGrid or Nodemailer:
```bash
npm install nodemailer
```

Send reminder emails before capsule unlocks.

## ✅ Testing

### Postman Collection

Import this into Postman:
```json
{
  "info": { "name": "My Sayang API" },
  "auth": { "type": "bearer", "bearer": [{"key": "token", "value": "{{jwt_token}}"}] },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/auth/register",
        "body": { "mode": "raw", "raw": "{\"email\": \"test@example.com\", \"password\": \"pass123\"}" }
      }
    }
  ]
}
```

### cURL Examples

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Create Capsule
curl -X POST http://localhost:5000/api/capsules \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello","unlockAt":"2025-12-25T00:00:00Z"}'
```

## 🐛 Troubleshooting

**MongoDB connection fails**
- Ensure MongoDB is running: `mongod` or Docker
- Check MONGO_URI in .env
- For Atlas: whitelist your IP address

**CORS errors**
- Set FRONTEND_URL to match your frontend's origin
- Check that credentials: true is set in fetch

**Upload fails**
- Check `uploads/` directory exists and is writable
- Ensure multer file size limits are appropriate

**Token expired**
- Frontend should store token and include in all requests
- Implement token refresh endpoint (optional)

## 📞 Support & Updates

For issues, check:
- Server logs: `NODE_ENV=development npm dev`
- MongoDB connection: `mongo "mongodb://localhost:27017"`
- Network requests: Browser DevTools → Network tab

---

**Next Steps:**
1. ✅ Backend running locally
2. ⬜ Frontend integration (update Index.html to use API)
3. ⬜ Deploy to Render + Mongo Atlas
4. ⬜ Add Voice Recorder UI in frontend
5. ⬜ Add Mood Timeline UI in frontend

