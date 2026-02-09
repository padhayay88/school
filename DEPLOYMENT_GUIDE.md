# 🌍 Deployment Guide - Works Anywhere/Any Network/Any Country

This guide helps you deploy the School ERP system on any domain, network, or country with proper configuration.

## Table of Contents
1. [Local Development](#local-development)
2. [Production Deployment](#production-deployment)
3. [Multi-Network Setup](#multi-network-setup)
4. [Mobile Optimization](#mobile-optimization)
5. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Git

### Setup

```bash
# Backend setup
cd backend
npm install

# Create .env from template
cp .env .env.local

# Start backend
npm start

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

**Default Credentials:**
- Email: `owner@school.local`
- Password: `ChangeMe123!`

---

## Production Deployment

### 1. Vercel Deployment (Recommended)

#### Backend
```bash
cd backend
vercel deploy --prod
```

Note the deployment URL, e.g., `https://your-backend.vercel.app`

#### Frontend
```bash
cd frontend
vercel env add VITE_API_URL https://your-backend.vercel.app/api
vercel deploy --prod
```

### 2. Alternative Hosting (Heroku, Railway, etc.)

**Backend .env:**
```env
PORT=4000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/school_erp
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
JWT_ACCESS_SECRET=your_super_long_random_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_super_long_random_refresh_secret_here
COOKIE_SECURE=true
OWNER_EMAIL=owner@yourdomain.com
OWNER_PASSWORD=SetStrongPassword123!
```

---

## Multi-Network Setup

### Key Configuration Files

#### Backend: `.env`
```env
# Database (works with MongoDB Atlas for global access)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/school_erp

# Allow requests from any frontend domain
# Format: comma-separated list
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com,https://app.yourdomain.com

# Rate limiting (adjust per deployment)
RATE_LIMIT_MAX=200

# Security - GENERATE RANDOM SECRETS
JWT_ACCESS_SECRET=<generate-random-32-char-string>
JWT_REFRESH_SECRET=<generate-random-32-char-string>

# Cookie security (true for HTTPS/production)
COOKIE_SECURE=true

# Owner account (create on first deployment)
OWNER_EMAIL=owner@school.com
OWNER_PASSWORD=StrongPassword123!
```

### Automatic Domain Detection

The frontend **automatically detects** your deployment domain:

```javascript
// frontend/src/api.js
const getBaseURL = () => {
  if (isDevelopment) {
    return "http://localhost:4000/api";
  }
  // Uses current domain (works on ANY domain)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//api.${hostname}`;
};
```

**How it works:**
- If deployed to `yourdomain.com`, looks for API on `api.yourdomain.com`
- If deployed to `school.example.co.uk`, looks for API on `api.school.example.co.uk`
- If deployed to IP address `192.168.1.100`, looks for API on `api.192.168.1.100`

### DNS Setup (For Same-Domain API)

For the automatic detection to work, set up DNS:

**Option A: Subdomain (Recommended)**
```
A record:  yourdomain.com     → Your server IP
A record:  api.yourdomain.com → Your API server IP
CNAME:     www.yourdomain.com → yourdomain.com
```

**Option B: Path-based (Using reverse proxy)**
Set up Nginx/Apache to route:
- `yourdomain.com/*` → Frontend
- `yourdomain.com/api/*` → Backend

---

## Mobile Optimization

### ✅ Features Included

- **Responsive Design:** Desktop, Tablet, Mobile, Extra Small (320px+)
- **Touch-Friendly:** 44px minimum touch targets
- **Hamburger Menu:** Auto-collapses on mobile
- **Performance:** Optimized CSS, no large images
- **Offline:** Ready for PWA implementation
- **Accessibility:** WCAG compliant

### Testing Mobile

```bash
# Start development server
cd frontend && npm run dev

# Open DevTools (F12 → Ctrl+Shift+M) and test:
# - iPhone 12/13/14/15
# - iPad 
# - Galaxy S21
# - Pixel devices
# - Custom resolution: 320px, 480px, 768px, 1024px
```

---

## Deployment Scenarios

### Scenario 1: Small School (Single Office)
```
├── Backend: Heroku (Free tier)
├── Frontend: Vercel (Free tier)
└── Database: MongoDB Atlas (Free tier)
```
Cost: $0/month initially

### Scenario 2: Growing School (Multiple Campuses)
```
├── Backend: AWS EC2 + RDS
├── Frontend: CloudFlare Pages
├── Database: AWS RDS
└── CDN: CloudFlare
```
Cost: ~$50-100/month

### Scenario 3: Large School (Multiple Countries)
```
├── Backend: Kubernetes (AWS EKS / Google GKE)
├── Frontend: Multi-region CDN (CloudFlare / Akamai)
├── Database: MongoDB Atlas (Global cluster)
└── Monitoring: DataDog / New Relic
```
Cost: $500+/month

---

## Environment Variables Reference

### Backend `.env`

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection | `mongodb://localhost:27017/school_erp` |
| `ALLOWED_ORIGINS` | CORS allowed domains | `https://yourdomain.com` |
| `JWT_ACCESS_SECRET` | API token secret | `super_random_string_32_chars_min` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `another_random_string_32_chars` |
| `JWT_ACCESS_EXPIRES` | Session duration | `15m` |
| `JWT_REFRESH_EXPIRES` | Refresh duration | `7d` |
| `COOKIE_SECURE` | HTTPS only | `true` for production |
| `COOKIE_SAMEALLOCALE` | CSRF protection | `lax` or `strict` |
| `RATE_LIMIT_MAX` | Requests per 10min | `200` |
| `OWNER_EMAIL` | Admin email | `owner@school.com` |
| `OWNER_PASSWORD` | Admin password | `StrongPass123!` |

### Frontend (Automatic Detection)

No `.env` needed! The frontend automatically:
- Detects deployment domain
- Uses correct API endpoint
- Works on any network
- Supports any TLD (.com, .co.uk, .net, etc.)

---

## Creating Owner Account

### Option 1: Using Setup Script
```bash
cd backend
OWNER_EMAIL=owner@school.com OWNER_PASSWORD=SecurePass123! npm run create-owner
```

### Option 2: Using .env
```env
OWNER_EMAIL=owner@school.com
OWNER_PASSWORD=SecurePass123!
```
Then run: `npm run create-owner`

### Option 3: Direct MongoDB
```javascript
// Open MongoDB Atlas console and insert:
db.owners.insertOne({
  email: "owner@school.com",
  passwordHash: "$2a$12$...", // Use bcrypt hash
  tokenVersion: 0,
  createdAt: new Date()
})
```

---

## Network Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| **Slow internet** | Set longer timeout (15s) ✅ Implemented |
| **Offline** | PWA cache (in roadmap) |
| **Blocked ports** | Use standard ports (80, 443) |
| **IP changes** | Use domain names, not IPs |
| **Firewall issues** | Use HTTPS (port 443) |
| **CORS errors** | Add domain to `ALLOWED_ORIGINS` |
| **Different TLDs** | Automatic domain detection ✅ |
| **Subdomains** | Automatic API detection ✅ |

---

## Mobile Version (Responsive)

### Breakpoints Included
```css
/* Desktop */   1024px+
/* Tablet */    768px - 1024px
/* Mobile */    480px - 768px
/* Small */     320px - 480px
/* Landscape */ Any width × landscape
```

### Features by Device

**Mobile (320px-480px)**
- Hamburger menu
- Single column layout
- Touch-friendly buttons (44px)
- Optimized images
- Readable fonts

**Tablet (768px-1024px)**
- Two-column cards
- Sidebar collapse
- Larger touch targets
- Better spacing

**Desktop (1024px+)**
- Full sidebar
- Multi-column grids
- Hover effects
- Full features

---

## Monitoring & Maintenance

### Health Check Endpoint
```bash
curl https://api.yourdomain.com/api/health
# Response: {"status":"ok","timestamp":"2024-02-09..."}
```

### Database Backup
```bash
# MongoDB Atlas: Automated daily snapshots
# Make sure to enable in cluster settings
```

### Performance Monitoring
- Use Vercel Analytics (free)
- Monitor API response times
- Check error rates in logs

---

## Troubleshooting

### "Cannot reach API"
1. Check `ALLOWED_ORIGINS` includes your frontend domain
2. Verify API is running: `curl /api/health`
3. Check firewall allows port 4000 (or your API port)
4. Verify CORS headers in browser console

### "Login fails even with correct password"
1. Re-create owner: `npm run create-owner`
2. Check MongoDB is connected
3. Verify `OWNER_EMAIL` matches login email

### "Works on localhost but not production"
1. Add production domain to `ALLOWED_ORIGINS`
2. Set `COOKIE_SECURE=true` for HTTPS
3. Regenerate JWT secrets (sensitive data)
4. Check environment variables on server

### "Mobile site is slow"
1. Use local API (subdomain): `api.yourdomain.com`
2. Add CDN for static files (Cloudflare)
3. Compress images
4. Use production build: `npm run build`

### "Works in one country but not another"
1. Check DNS propagation: `nslookup yourdomain.com`
2. Verify API is accessible globally
3. Check geo-blocking on server
4. Review network logs in DevTools

---

## Security Checklist

- [ ] Change default JWT secrets to random strings
- [ ] Use HTTPS only (`COOKIE_SECURE=true`)
- [ ] Enable rate limiting (done by default)
- [ ] Add firewall rules to API
- [ ] Regular database backups
- [ ] Monitor failed login attempts
- [ ] Update dependencies: `npm audit fix`
- [ ] Use strong owner password (12+ chars, mixed case)
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Review access logs regularly

---

## Support & Updates

For issues or improvements:
- Check GitHub Issues
- Review logs: `vercel logs` or `docker logs`
- Test locally first before production changes

Last Updated: February 2024
