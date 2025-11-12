# 🎂 My Sayang - Full Stack Setup Guide

Complete production-ready birthday app with Time Capsules, Voice Memos, Moods, Drawing, and more!

## 📋 What You Have

### Frontend (SPA)
- **File**: `Index.html` + `draw.html`
- **Features**: Login/Signup, Diary (Calendar), Notes, Gallery, Wishes, Drawing (Collaborative), Timer, Settings
- **Storage**: Currently localStorage (will integrate with backend)
- **Drawing Server**: `server.js` for WebRTC signaling + HTTP serving

### Backend (Node/Express)
- **Location**: `backend/` folder
- **Database**: MongoDB (local or Atlas)
- **Auth**: JWT tokens
- **Features**: 
  - Time Capsules (with unlock guard & scheduling)
  - Voice Memos (file upload & storage)
  - Mood Timeline (with date ranges)
  - User management
  - Automatic job scheduling (node-cron)

### Drawing Server (Standalone)
- **File**: `server.js` (in project root)
- **Purpose**: Serves frontend + provides WebRTC signaling for collaborative drawing
- **Port**: 3000

---

## 🚀 Complete Setup (Start-to-Finish)

### Phase 1: Drawing + Frontend (5 min)

**Terminal 1 - Start Frontend Server**
```powershell
cd 'C:\Users\jarif\Downloads\My sayang'
npm install
npm start
# Opens: http://localhost:3000
```

**Test**:
- Open http://localhost:3000/Index.html
- Click Drawing (opens draw.html in new tab)
- Try drawing in two tabs (same room)

### Phase 2: Backend Setup (10 min)

**Install MongoDB** (choose one):

Option A: Docker (easiest)
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
# MongoDB runs on localhost:27017
```

Option B: MongoDB Atlas (cloud, free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/my-sayang`

**Terminal 2 - Setup Backend**
```powershell
cd 'C:\Users\jarif\Downloads\My sayang\backend'

# Run setup script (Windows)
.\setup.bat

# Or manually:
npm install
copy .env.example .env
# Edit .env with your MongoDB URI
```

**Terminal 2 - Start Backend**
```powershell
npm dev
# Runs on http://localhost:5000
```

**Test Backend**:
```powershell
# In another PowerShell:
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"pass123"}'

# You should get: { "user": {...}, "token": "..." }
```

### Phase 3: Frontend-Backend Integration (ongoing)

The frontend currently uses localStorage. To connect to backend:

**Update Index.html**:
```javascript
// In getLoginPage() or setupLoginForm(), replace localStorage with API calls:

// OLD (localStorage):
// localStorage.setItem('currentUserEmail', email);

// NEW (API):
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('jwt_token', data.token);
localStorage.setItem('currentUserEmail', data.user.email);
```

I can help with this integration next!

---

## 📁 Project Structure

```
My sayang/
├── Index.html                   # Main SPA (login, diary, notes, etc.)
├── draw.html                    # Drawing page (linked from Index.html)
├── server.js                    # Drawing + static file server (Node/Express)
├── package.json                 # Frontend dependencies
├── .env                         # Frontend config (if needed)
│
└── backend/                     # Production backend
    ├── server.js               # Express app (MongoDB, JWT, APIs)
    ├── package.json
    ├── .env                    # Backend config (MongoDB URI, JWT_SECRET)
    ├── .env.example
    ├── setup.bat               # Windows setup script
    ├── README.md               # Detailed API docs
    │
    ├── models/
    │   ├── User.js             # User schema + password hashing
    │   ├── TimeCapsule.js      # Time capsule with TTL
    │   ├── Voice.js            # Voice memo metadata
    │   └── Mood.js             # Mood timeline
    │
    ├── routes/
    │   ├── auth.js             # /api/auth/* (register, login, me)
    │   ├── capsules.js         # /api/capsules/* (CRUD)
    │   ├── voice.js            # /api/voice/* (upload, list, delete)
    │   └── moods.js            # /api/moods/* (CRUD)
    │
    ├── middleware/
    │   ├── auth.js             # JWT verification
    │   └── errorHandler.js     # Global error handling
    │
    └── uploads/                # Local file storage (auto-created)
        └── voice/              # Voice memo files
```

---

## 🎯 Quick Command Reference

### Frontend (Drawing + SPA)
```powershell
# Development (hot-reload)
npm dev

# Production
npm start

# Server runs on port 3000 or configured PORT
```

### Backend
```powershell
cd backend

# Setup (first time)
.\setup.bat              # Windows

# Development (with auto-reload)
npm dev

# Production
npm start

# Server runs on port 5000 or configured PORT
```

---

## 🔑 Key Configuration Files

### `.env` (Backend)
```env
MONGO_URI=mongodb://localhost:27017/my-sayang
# or: mongodb+srv://user:pass@cluster.mongodb.net/my-sayang

JWT_SECRET=your-super-secret-key-change-this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
STORAGE_TYPE=local
```

---

## ✅ Checklist: Local Development

- [ ] Node.js installed (`node --version`)
- [ ] Frontend server running on http://localhost:3000
- [ ] Drawing server running on http://localhost:3000 (same server)
- [ ] MongoDB running (Docker or local)
- [ ] Backend server running on http://localhost:5000
- [ ] Can register/login on backend: `curl -X POST http://localhost:5000/api/auth/register ...`
- [ ] Can create capsule: `curl -X POST http://localhost:5000/api/capsules ... -H "Authorization: Bearer <token>"`

---

## 🚀 Deployment Roadmap

### Current State (Local)
- ✅ Frontend runs on http://localhost:3000
- ✅ Backend runs on http://localhost:5000
- ✅ MongoDB local or Atlas
- ✅ Drawing works with WebRTC signaling

### Next Steps (Production)

1. **Frontend**: Deploy to Vercel or Netlify
   - Push to GitHub
   - Connect to Vercel/Netlify
   - Set `REACT_APP_API_URL=https://api.mysayang.com`

2. **Backend**: Deploy to Render or Heroku
   - Push to GitHub
   - Create Render/Heroku app
   - Set env vars (MONGO_URI, JWT_SECRET)
   - Deploy branch auto-builds

3. **Database**: Use MongoDB Atlas (free tier available)
   - Create cluster
   - Whitelist backend IP
   - Get connection string

4. **Drawing**: Keep running on same frontend or separate WebRTC box
   - Can be serverless (Firebase, Vercel functions)

---

## 🧪 Testing APIs (Postman)

1. **Register User**
   ```
   POST http://localhost:5000/api/auth/register
   Body: {
     "email": "user@example.com",
     "password": "pass123",
     "name": "John"
   }
   ```

2. **Get Token** from response, use in next requests:
   ```
   Authorization: Bearer <token>
   ```

3. **Create Capsule**
   ```
   POST http://localhost:5000/api/capsules
   Headers: Authorization: Bearer <token>
   Body: {
     "title": "Our Anniversary",
     "content": "I love you!",
     "unlockAt": "2025-12-25T00:00:00Z"
   }
   ```

4. **Get Capsules**
   ```
   GET http://localhost:5000/api/capsules
   Headers: Authorization: Bearer <token>
   ```

---

## 📞 Common Issues

**"Cannot connect to MongoDB"**
- Ensure Docker/mongod is running
- Check MONGO_URI in .env
- Atlas: whitelist your IP

**"CORS error when calling backend from frontend"**
- Ensure FRONTEND_URL in backend .env is correct
- Check that both servers are running

**"Port already in use"**
- Change PORT in .env
- Or kill process: `netstat -ano | findstr :3000` (Windows)

**"npm: command not found"**
- Install Node.js: https://nodejs.org

---

## 🎁 What's Included

### Features (Implemented)
- ✅ User Auth (Register/Login)
- ✅ Time Capsules (create, lock, unlock, delete)
- ✅ Voice Memos (upload, playback, delete)
- ✅ Mood Timeline (date range, tags, intensity)
- ✅ Diary with Calendar
- ✅ Notes
- ✅ Gallery (image uploads)
- ✅ Collaborative Drawing (WebRTC)
- ✅ Settings
- ✅ Wishes/To-Do list

### Features (Can Add Later)
- 🔲 Letter to Future Us (versioning)
- 🔲 Love Map (Mapbox)
- 🔲 Love Jar (random compliments)
- 🔲 Promise Tracker (Kanban)
- 🔲 Dream Board (Pinterest-style)
- 🔲 Forever Playlist (Spotify integration)
- 🔲 Legacy Mode (archive everything)
- 🔲 AI Memory Keeper (chatbot)

---

## 📚 Next Steps

1. **Get backend running locally** (follow Phase 1-2 above)
2. **Test API endpoints** with Postman or cURL
3. **Integrate frontend** (replace localStorage with API calls)
4. **Deploy to production** (Vercel + Render + Mongo Atlas)
5. **Add more features** (features 4-12)

---

**Ready to start? Pick a terminal and run:**
```powershell
cd 'C:\Users\jarif\Downloads\My sayang\backend'
npm dev
```

Questions? Check `backend/README.md` for detailed API docs.

Happy coding! 🎉

