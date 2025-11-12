# Admin Guide - Birthday Website

## Features Overview

### 1. **User Management**
- **Admin Signup/Login**: Use `admin@example.com` with password `myqueen`
- **Add Users**: Directly add users through Settings panel (email + password)
- **Remove Users**: Only admin can remove users (except themselves)
- **Approve/Reject Signups**: Users who sign up through the signup form need admin approval

### 2. **Search History Tracking** 
- **Automatic Logging**: Every search by any user is automatically logged
- **Hidden from Users**: Users cannot see their own search history or that others' are logged
- **Admin Access**: View all users' last 10 searches in Settings → "All Users Search History"
- **Download All**: Export all users' complete search history as CSV file

### 3. **Adult Content Detection**
- **Automatic Detection**: System detects when users search for 18+ content
- **Admin Flag**: Shows "⚠️ 18+ site detected" next to user name in Current Users list
- **Hidden Alert**: Users don't know they've been flagged
- **Search History Included**: All 18+ searches appear in the downloadable history

### 4. **Download Gate (New Users)**
- **First-Time Access**: New/non-admin users MUST download their search history before accessing the site
- **Security Check**: Triggered automatically on login
- **Verification**: System confirms download completion before granting site access
- **Persistent**: Once downloaded, user can access the site normally

### 5. **Sign Up System**
- **Public Signup**: Users can sign up through the "Sign Up Here" link
- **Pending Requests**: All signup requests appear in Settings (admin only)
- **Approval Workflow**: Admin must approve or reject each request
- **Activation**: Once approved, user can login with their credentials

---

## Admin Dashboard (Settings Page)

### Sections Available to Admin:

1. **Add New User**
   - Directly add users with email and password
   - Users added this way can login immediately

2. **Current Users**
   - List of all approved users
   - Shows location button for each user
   - Shows 18+ flag if detected
   - Remove button to delete users (admin cannot remove themselves)

3. **Pending Signup Requests** ⏳
   - Shows all users requesting to join
   - Each request shows email and date/time
   - Approve button: Accept user and activate their account
   - Reject button: Decline signup request

4. **All Users Search History**
   - View last 10 searches for each user
   - Timestamp for each search
   - Download button to export entire history as CSV

---

## How Search History Works

### For Regular Users:
1. User logs in → downloads search history (one-time)
2. Once downloaded, site becomes accessible
3. All their searches are logged in background
4. They cannot see their own search history
5. They don't know it's being tracked

### For Admin:
1. Admin can login immediately (no download gate)
2. Can view all users' search histories
3. Can download complete history as CSV
4. Can see 18+ detection flags
5. Can manage all user approvals and removals

---

## Data Storage Locations (LocalStorage)

- **users**: Array of all approved users
- **pendingSignups**: Array of signup requests awaiting approval
- **searchHistory**: Object mapping email → array of searches
- **userNotes**: Object mapping email → notes (includes 18+ flag)
- **searchHistoryDownloaded**: Object mapping email → boolean

---

## Features at a Glance

| Feature | Users See | Admin Sees |
|---------|-----------|-----------|
| Search Bar | Yes | Yes |
| Own Search History | No | No |
| Other Users' History | No | Yes |
| 18+ Flag | No | Yes |
| Pending Signups | No | Yes |
| Download History | Required on first login | Optional for download |
| User Removal | Cannot (grayed out for non-admins) | Yes (all users except self) |

---

## Important Notes

✅ **All user activity is tracked and stored locally**
✅ **Search history is logged automatically**
✅ **18+ content is detected and flagged**
✅ **Users cannot opt-out of tracking**
✅ **Only admin can see sensitive information**
✅ **Download gate prevents access until history is captured**
✅ **All data persists in browser's localStorage**
