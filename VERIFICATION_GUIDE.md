# 🔍 Network & Mobile verification Guide

Quick commands to verify your setup works on any network.

## Quick Health Checks

### 1. Backend Status
```bash
# Check if backend is running
curl http://localhost:4000/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-02-09T..."}
```

### 2. CORS Configuration
```bash
# Test CORS headers
curl -H "Origin: http://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:4000/api/auth/login -v

# Look for: Access-Control-Allow-Origin header
```

### 3. Database Connection
```bash
# Check MongoDB connection in backend logs
npm start

# Should show: "MongoDB connected successfully"
```

### 4. API Connectivity
```bash
# Test login endpoint
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@school.local","password":"ChangeMe123!"}'

# Should return: {"owner":{...},"accessToken":"..."}
```

---

## Network Testing

### Testing on Different Networks

#### Same Computer
```bash
# Terminal 1
npm start

# Terminal 2
npm run dev

# Browser: http://localhost:5173
```

#### LAN (Same Office/Building)
```bash
# Find IP address
ipconfig (Windows)
ifconfig (Mac/Linux)
# Example: 192.168.1.100

# Visit from another computer:
http://192.168.1.100:5173
```

#### Different Network (Mobile Hotspot)
```bash
# Phone creates hotspot
# Connect computer to phone WiFi
# Use phone's IP as entry point
```

#### Production Domain
```bash
# Test DNS resolution
ping yourdomain.com
nslookup yourdomain.com

# Test API accessibility
curl https://api.yourdomain.com/api/health

# Should return: {"status":"ok"}
```

---

## Mobile Device Testing

### iPhone (iOS)
```
1. Connect to same WiFi as development server
2. Find computer IP: ipconfig
3. Safari → http://192.168.X.X:5173
4. Check:
   - Navigation menu works
   - Forms are usable
   - No horizontal scrolling
   - Text is readable
```

### Android
```
1. Connect to same WiFi as development server
2. Find computer IP: ipconfig
3. Chrome → http://192.168.X.X:5173
4. Check:
   - Hamburger menu opens/closes
   - Buttons are tappable
   - Layout is vertical
   - Loading is fast
```

### Tablet
```
1. Same as phone
2. Also check:
   - Two-column layouts appear
   - Cards arrange properly
   - Tables scroll horizontally
```

---

## Browser DevTools Testing

### Mobile Simulation
```
1. Open DevTools (F12)
2. Click Device Toolbar (Ctrl+Shift+M)
3. Select device:
   - iPhone 12: 390×844
   - iPad: 768×1024
   - Galaxy S21: 360×800
   - Pixel 6: 412×915
4. Test navigation and forms
```

### Network Simulation
```
1. DevTools → Network tab
2. Click throttling (Fast 3G, Slow 3G)
3. Reload page
4. Check if loads properly on slow network
```

### Responsive Testing
```
1. DevTools → Device Toolbar
2. Drag to change width
3. Watch CSS media queries trigger
4. Should look good at any width
```

---

## Configuration Verification

### Backend .env Check
```bash
# Should have these variables:
✓ PORT=4000
✓ MONGO_URI=<valid-connection>
✓ ALLOWED_ORIGINS=<your-domains>
✓ JWT_ACCESS_SECRET=<random-string>
✓ JWT_REFRESH_SECRET=<random-string>
✓ COOKIE_SECURE=false (dev) or true (prod)
✓ OWNER_EMAIL=<email>
✓ OWNER_PASSWORD=<password>
```

### Frontend check
```bash
# Should auto-detect API URL
# DevTools → Network tab
# Check API calls go to correct endpoint

# Should show:
GET /api/auth/login 200 OK
GET /api/dashboard 200 OK
```

---

## Login Verification

### Test Login Flow
```
1. Go to http://localhost:5173
2. Click "Admin Dashboard" or "Owner Login"
3. Enter:
   Email: owner@school.local
   Password: ChangeMe123!
4. Should redirect to /dashboard
5. Should show navigation menu
6. Should be able to logout
```

### Test Login on Mobile
```
1. Phone browser → http://192.168.X.X:5173
2. Tap "Owner Login"
3. Check form is usable
4. Submit login
5. Should show dashboard
6. Check hamburger menu works
```

---

## Common Issues & Fixes

### Issue: "API is unreachable"
```bash
# Check 1: Backend running?
curl http://localhost:4000/api/health

# Check 2: Correct origin?
grep ALLOWED_ORIGINS backend/.env

# Check 3: Firewall blocking?
# Windows: Allow port in Windows Defender Firewall
# Mac: System Prefs > Security & Privacy
# Linux: sudo ufw allow 4000
```

### Issue: "Login fails"
```bash
# Check 1: Owner exists?
npm run create-owner

# Check 2: Email matches?
# Make sure you typed email correctly

# Check 3: MongoDB connected?
# Check backend logs: "MongoDB connected successfully"
```

### Issue: "Mobile menu not working"
```bash
# Check 1: CSS loaded?
DevTools > Sources > app.css (should exist)

# Check 2: Hard refresh?
Ctrl+Shift+R or Cmd+Shift+R

# Check 3: Console errors?
DevTools > Console (should be empty)
```

### Issue: "Works locally but not on domain"
```bash
# Check 1: Domain in ALLOWED_ORIGINS?
ALLOWED_ORIGINS=https://yourdomain.com

# Check 2: Using HTTPS?
curl https://yourdomain.com (not http)

# Check 3: DNS working?
nslookup yourdomain.com
ping yourdomain.com
```

---

## Performance Checklist

### Expectations
- [ ] Page loads in <2 seconds
- [ ] Login responds in <500ms
- [ ] Menu appears instantly
- [ ] No console errors
- [ ] No network errors
- [ ] Images load properly
- [ ] Mobile works on 3G

### If Slow
```
1. Check network: DevTools > Network
2. See which request is slow
3. Check backend logs
4. Open Lighthouse (DevTools > F12)
5. Follow recommendations
```

---

## Deployment Verification

### After Deploying to Production

```bash
# 1. Test health endpoint
curl https://yourdomain.com/api/health

# 2. Test login
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@yourdomain.com","password":"YourPassword"}'

# 3. Check frontend loads
curl https://yourdomain.com | grep -i "School ERP"

# 4. Test on mobile
# Visit https://yourdomain.com on phone
# Test login
# Test menu
# Test navigation

# 5. Check SSL certificate
curl -I https://yourdomain.com
# Should show: HTTP/2 200 (or 301 redirect)
```

---

## Logs & Debugging

### Backend Logs
```bash
# Start backend with verbose logging
npm start

# Should show:
✓ "MongoDB connected successfully"
✓ "ERP backend listening on port 4000"
✓ API requests logged with method and endpoint
✓ Any errors in red
```

### Frontend Logs
```bash
# Open DevTools on frontend page
F12 → Console tab

# Should show:
✓ No errors (no red messages)
✓ Successful API calls
✓ Network requests 200 OK

# Common errors to avoid:
✗ "Cannot read property of undefined"
✗ "CORS error"
✗ "Cannot reach API"
```

---

## Database Verification

### MongoDB Check
```bash
# If using local MongoDB
mongo

# Inside mongo shell
show dbs                    # List databases
use school_erp              # Switch to database
db.owners.find()            # Check owners exist
db.students.find()          # Check students exist
exit                        # Exit

# MongoDB Atlas
# Login to MongoDB Atlas console
# Select cluster → Collections
# Should see: owners, students, teachers, etc.
```

---

## Final Deployment Ready Checklist

- [ ] Backend starts without errors
- [ ] Frontend shows no console errors
- [ ] Can login with correct credentials
- [ ] Can access dashboard
- [ ] Mobile menu works (hamburger)
- [ ] Mobile layout looks good
- [ ] Can logout
- [ ] Health endpoint works: /api/health
- [ ] Database is connected
- [ ] JWT secrets are changed from defaults
- [ ] ALLOWED_ORIGINS configured correctly
- [ ] COOKIE_SECURE set to true (production)
- [ ] Owner password is strong (12+ chars)
- [ ] No hardcoded secrets in code
- [ ] Tested on real mobile device
- [ ] Tested on at least 2 browsers
- [ ] Certificate valid (HTTPS)
- [ ] Backups are enabled

---

## Quick Reference Commands

```bash
# Development
npm start                                    # Start backend
npm run dev                                  # Start frontend

# Deployment
npm run build                                # Production build
npm run create-owner                         # Create admin account
vercel deploy --prod                         # Deploy to Vercel

# Testing
curl http://localhost:4000/api/health        # Check backend
curl https://yourdomain.com/api/health       # Check production

# Logs
npm start 2>&1 | tee backend.log            # Save logs to file
journalctl -u school-erp -f                 # View systemd logs
```

---

Ready to launch! 🚀

Last Updated: February 9, 2024
