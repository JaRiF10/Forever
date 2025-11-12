# Local signaling + static server for My Sayang drawing

This repository contains a tiny Node.js server that serves the app files (including `draw.html`) and provides a WebSocket-based signaling endpoint for WebRTC. Running this locally fixes the common "doesn't work online" issues caused by using file:// pages and manual signaling.

Quick start (PowerShell):

1. Install dependencies

```powershell
cd 'C:\Users\jarif\Downloads\My sayang'
npm install
```

2. Start the server

```powershell
npm start
# server runs at http://localhost:3000
```

3. Open the drawing page in two browser windows/devices and join the same room

- Visit: http://localhost:3000/draw.html
- Enter a room id (any short string) in both windows and click Connect.
- The older client in the room will create an offer automatically and the peers should connect. When the data channel opens, collaborative drawing will sync.

Notes & troubleshooting
- The server uses Google's public STUN server to help with NAT traversal: `stun:stun.l.google.com:19302`.
- For real-world, cross-network usage you'd want a hosted server and possibly TURN for symmetric NATs.
- If the peers fail to connect, try opening devtools (F12) and look for console logs. Also ensure both clients loaded the page from http://localhost:3000 (not file://).
# 🎂 Birthday Website - FIXED VERSION

## ✅ What's Fixed

1. **Loading Screen Now Works!** ✅
   - Changed white text to dark text for visibility
   - Added pinkish background (#ffe0ec) for better contrast
   - Loading screen now properly hides when website initializes
   - Added bouncing birthday cake emoji 🎂

2. **Better Visual Hierarchy** ✅
   - Dark text on light backgrounds throughout
   - Pinkish backgrounds for special elements
   - Clear navigation and sections

3. **Website Now Runs Properly** ✅
   - Fixed initialization sequence
   - All scripts load correctly
   - Smooth transition from loading to app

## 🚀 How to Run

### Option 1: Double-Click (Easiest)
1. Navigate to: `c:\Users\jarif\Downloads\birthday-website-FIXED\`
2. Double-click `index.html`
3. Website opens in your default browser

### Option 2: Right-Click Menu
1. Right-click on `index.html`
2. Select "Open with" → Choose your browser

### Option 3: Drag & Drop
1. Open your web browser (Chrome, Firefox, Edge, Safari)
2. Drag `index.html` into the browser window

## 📝 First Time Setup

When you open the website:
1. You'll see a loading screen with cake emoji 🎂 (now visible!)
2. After loading, you'll see **"Welcome! Set up your password"** screen
3. Create a strong password (at least 6 characters)
4. Confirm the password
5. Click **"Create & Continue"**
6. Website loads with all features!

## 🔐 Security Notes

- ✅ Your password is hashed using SHA-256
- ✅ All your data (diaries, notes, photos) is encrypted with AES-256
- ✅ Everything is stored locally in your browser only
- ✅ No data is sent to any server
- ✅ Only you can access this website

## 📂 File Structure

```
birthday-website-FIXED/
├── index.html              ← Main website file
├── js/
│   └── app.js             ← All website features
├── utils/
│   ├── encryption.js      ← Security system
│   ├── auth.js            ← Password system
│   └── storage.js         ← Data storage
```

## 🎂 Features Included

1. **🏠 Home Page**
   - Beautiful countdown timer to birthday
   - Welcome message
   - Feature overview

2. **📔 Diary**
   - Write daily diary entries
   - Save memories and thoughts
   - Organized by date

3. **📝 Special Notes**
   - Create important notes
   - Quick reminders
   - Easy to manage

4. **🎁 Birthday Wishes**
   - List your birthday wishes
   - Keep dreams organized
   - Share your desires

5. **🖼️ Photo Gallery**
   - Upload and store photos
   - Add captions
   - Organized display

6. **✏️ Drawing Canvas**
   - Draw with colors
   - Save artwork
   - Express yourself

## 🎨 Colors Used

- **Pink**: #ff6b9d (primary)
- **Deep Red**: #c44569 (secondary)
- **Light Pink**: #ffe0ec (backgrounds - for contrast!)
- **Yellow**: #ffeaa7 (page background)

## ✨ Animation & Features

- Bouncing cake emoji on loading screen
- Smooth page transitions
- Spinning countdown timer
- Color options for drawing
- Responsive on mobile phones
- Works offline!

## 🆘 Troubleshooting

### Website still shows loading screen
- Wait 5 seconds - the loading screen will auto-hide
- Check browser console for errors (F12 key)

### Can't see the password setup screen
- Try refreshing the page (Ctrl+F5)
- Clear browser cache
- Try a different browser

### Photos/Drawings not saving
- Make sure you have cookies enabled
- Don't use private/incognito mode
- Try a different browser

### Forgot your password
- Delete browser data for this website
- Or use a different browser
- Next time, set a password you remember!

## 📱 Mobile Friendly

- Website works on phones!
- Touch-friendly buttons
- Responsive layout
- All features work on mobile

## 💡 Tips

1. **Save Often** - Click "Save" buttons after writing
2. **Use Strong Passwords** - Mix numbers, letters, symbols
3. **Back Up Photos** - Download your gallery images sometimes
4. **Try All Features** - Explore the drawing, notes, wishes!

## 🎯 Browser Support

Works on:
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Any modern browser

## 🎉 You're All Set!

Your birthday website is ready to use. It's now:
- ✅ **Fixed** - No more loading issues
- ✅ **Secure** - Password protected and encrypted
- ✅ **Beautiful** - With birthday cake emoji and pink backgrounds
- ✅ **Complete** - All features working

**Happy Birthday! 🎂💕**

---

Created with ❤️ just for you!
