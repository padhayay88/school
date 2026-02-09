# Vercel Deployment Configuration Guide

## Step-by-Step Vercel Setup

### Step 1: Deploy Backend to Vercel

```bash
cd backend
vercel deploy --prod
```

**Note the backend URL:**
- Should look like: `https://your-project-api.vercel.app` or `https://school-erp-backend.vercel.app`
- Copy this URL - you'll need it in Step 3

### Step 2: Set Environment Variables on Vercel (Backend)

Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables

Add these variables:

```
Name: MONGO_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/school_erp
```

```
Name: ALLOWED_ORIGINS
Value: https://your-frontend.vercel.app,https://your-custom-domain.com,http://localhost:5173,http://localhost:5174
```

```
Name: JWT_ACCESS_SECRET
Value: your_random_secret_key_here_min_32_chars
```

```
Name: JWT_REFRESH_SECRET
Value: your_random_refresh_secret_here_min_32_chars
```

```
Name: OWNER_EMAIL
Value: owner@school.com
```

```
Name: OWNER_PASSWORD
Value: YourSecurePassword123!
```

```
Name: COOKIE_SECURE
Value: true
```

**Then redeploy:** `vercel deploy --prod`

### Step 3: Create Owner Account on Production

After setting environment variables, create the owner account:

```bash
cd backend
# Make sure .env has OWNER_EMAIL and OWNER_PASSWORD set

# Option A: Using Vercel CLI
vercel env pull
npm run create-owner

# Option B: Using MongoDB Atlas directly
# Go to MongoDB Atlas → Collections
# Insert owner document manually (see below)
```

### Step 4: Deploy Frontend to Vercel

```bash
cd frontend
vercel deploy --prod
```

### Step 5: Set Frontend Environment Variables on Vercel

Go to Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

```
Name: VITE_API_URL
Value: https://your-backend.vercel.app/api
```

Replace `your-backend.vercel.app` with your actual backend URL from Step 1

**Important:** After adding this, redeploy:
```bash
cd frontend
vercel deploy --prod
```

---

## Vercel URL Patterns & CORS Setup

### If your deployment URLs are:
- Frontend: `https://my-school.vercel.app`
- Backend: `https://my-school-api.vercel.app`

### Then set in backend ALLOWED_ORIGINS:
```
https://my-school.vercel.app,https://my-school-api.vercel.app
```

### And set in frontend VITE_API_URL:
```
https://my-school-api.vercel.app/api
```

---

## MongoDB Atlas Setup (Required for Production)

If you don't have MongoDB Atlas yet:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. In Database → Collections, create database: `school_erp`
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/school_erp`
6. Use this as `MONGO_URI` in Vercel environment variables

---

## Manual Owner Account Creation

If `npm run create-owner` doesn't work, create manually:

1. Go to MongoDB Atlas → Your Cluster → Collections
2. Find or create database: `school_erp`
3. Create collection: `owners`
4. Insert document (click "Insert Document"):

```json
{
  "email": "owner@school.com",
  "passwordHash": "$2a$12$vFnSR.3q7nxE9A/GJ/w4WO3eXfpMlU.vP3ZKmH8E0LjJvX7dU8mKK",
  "tokenVersion": 0,
  "createdAt": new ISODate("2024-02-09T00:00:00Z"),
  "updatedAt": new ISODate("2024-02-09T00:00:00Z")
}
```

Use this hashed password: `ChangeMe123!`
- Login with: `owner@school.com` / `ChangeMe123!`

---

## Testing After Deployment

### 1. Test Backend Health
```bash
curl https://your-backend.vercel.app/api/health

# Should return: {"status":"ok"...}
```

### 2. Test Login
```bash
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@school.com","password":"ChangeMe123!"}'

# Should return: {"owner":{...},"accessToken":"..."}
```

### 3. Visit Frontend & Login
```
1. Go to: https://your-frontend.vercel.app
2. Click "Owner Login"
3. Enter:
   Email: owner@school.com
   Password: ChangeMe123!
4. Should see Dashboard
```

---

## Troubleshooting

### Error: "Login failed. Please check your credentials. (401)"

**Solution 1:** Owner account doesn't exist
```bash
# Create it:
cd backend
# Set .env with OWNER_EMAIL and OWNER_PASSWORD
npm run create-owner

# Vercel alternative:
vercel env pull
npm run create-owner
```

**Solution 2:** ALLOWED_ORIGINS not set
```
Check backend Environment Variables on Vercel
Should include your frontend URL: https://your-frontend.vercel.app
After updating, redeploy backend
```

**Solution 3:** VITE_API_URL not set or wrong
```
Check frontend Environment Variables on Vercel
Should be your backend URL: https://your-backend.vercel.app/api
After updating, redeploy frontend
```

### Error: "Cannot reach API"

```bash
# Check backend is running
curl https://your-backend.vercel.app/api/health

# Check CORS headers
curl -H "Origin: https://your-frontend.vercel.app" \
  https://your-backend.vercel.app/api/auth/login -v

# Look for: Access-Control-Allow-Origin header
```

### Error: "MongoDB connection failed"

```
Check MONGO_URI in Vercel backend Environment Variables
Format must be: mongodb+srv://user:pass@cluster.mongodb.net/db
Check MongoDB Atlas - IP whitelist allows Vercel IPs (usually 0.0.0.0/0)
```

### "Strange characters in password" error

If your password has special characters, URL-encode them:
- `@` → `%40`
- `!` → `%21`
- `#` → `%23`

Example: `password@123` → `password%40123`

---

## Environment Variables Checklist

**Backend needs:**
- [ ] MONGO_URI
- [ ] ALLOWED_ORIGINS (includes frontend URL)
- [ ] JWT_ACCESS_SECRET
- [ ] JWT_REFRESH_SECRET
- [ ] OWNER_EMAIL
- [ ] OWNER_PASSWORD
- [ ] COOKIE_SECURE (true for production)

**Frontend needs:**
- [ ] VITE_API_URL (your backend URL)

---

## Quick Copy-Paste Template

**Backend .env template for Vercel:**
```
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/school_erp
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-custom-domain.com
JWT_ACCESS_SECRET=generate_random_string_here_minimum_32_chars
JWT_REFRESH_SECRET=another_random_string_here_minimum_32_chars
COOKIE_SECURE=true
OWNER_EMAIL=owner@school.com
OWNER_PASSWORD=StrongPassword123!
```

**Frontend environment variable for Vercel:**
```
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## After Successful Deployment

1. ✅ Backend responds to health checks
2. ✅ Owner login works
3. ✅ Dashboard loads
4. ✅ Mobile menu works
5. ✅ Can logout

Then you're ready for production! 🎉
