# Backend Quick Start Guide

## Prerequisites
- **Node.js** (v14+) — [Download](https://nodejs.org/)
- **MongoDB** — Either:
  - **Docker**: `docker run -d -p 27017:27017 --name mongodb mongo:latest`
  - **Local**: [Download MongoDB Community](https://www.mongodb.com/try/download/community)

## Step 1: Install Dependencies
```bash
cd backend
npm install
```

## Step 2: Start MongoDB
**Option A - Docker (Recommended):**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B - Local MongoDB:**
```bash
# Windows: Make sure MongoDB is installed and mongod is in PATH
mongod
```

## Step 3: Start Backend Server
```bash
npm dev
```

You should see:
```
✅ Server is running on port 5000
✅ MongoDB connected: mongodb://localhost:27017/my-sayang
```

## Step 4: Run Tests (New Terminal)
```bash
cd backend

# Option A - Windows PowerShell:
.\test.ps1

# Option B - Any terminal:
node test-api.js
```

## Expected Test Output
```
✓ 1. Health Check
✓ 2. Register User
✓ 3. Login User
✓ 4. Get Current User
✓ 5. Create Time Capsule
✓ 6. List Time Capsules
✓ 7. Get Locked Capsule
✓ 8. Update Time Capsule
✓ 9. Create Mood
✓ 10. List Moods
✓ 11. Unauthorized Access
✓ 12. Delete Time Capsule

All tests passed! ✅
```

## Troubleshooting

### "Server not running" Error
- Make sure `npm dev` is still running in another terminal
- Check that port 5000 is not in use: `netstat -ano | findstr :5000`

### "MongoDB connection failed"
- Docker not running: `docker start mongodb` or restart with command above
- Local MongoDB not running: Start `mongod`
- Check connection string in `.env` — should be `mongodb://localhost:27017/my-sayang`

### "Module not found" Error
- Run `npm install` again
- Delete `node_modules` folder and run `npm install` fresh

### Port Already In Use
- Change PORT in `.env` (default 5000)
- Or kill process: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

## API Endpoints Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ✗ | Create new user |
| POST | `/api/auth/login` | ✗ | Login & get JWT token |
| GET | `/api/auth/me` | ✓ | Get current user |
| POST | `/api/capsules` | ✓ | Create time capsule |
| GET | `/api/capsules` | ✓ | List user's capsules |
| GET | `/api/capsules/:id` | ✓ | Get specific capsule (locked/unlocked) |
| PATCH | `/api/capsules/:id` | ✓ | Update capsule |
| DELETE | `/api/capsules/:id` | ✓ | Delete capsule |
| POST | `/api/moods` | ✓ | Create mood entry |
| GET | `/api/moods` | ✓ | List user's moods |
| POST | `/api/voice/upload` | ✓ | Upload voice memo |
| GET | `/api/voice` | ✓ | List voice memos |

## Next Steps
1. ✅ **Get server running** — `npm dev` in one terminal
2. ✅ **Run tests** — `.\test.ps1` or `node test-api.js` in another
3. ✅ **All tests pass?** — Backend is ready!
4. → **Integrate frontend** — Update `Index.html` to use API endpoints instead of localStorage
5. → **Deploy** — Push to Render (backend) + Vercel (frontend)

## Contact
Questions? Check `README.md` for detailed API documentation.
