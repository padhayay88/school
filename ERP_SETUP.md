# School ERP Setup (Owner-Only)

This ERP is private and owner-only. There are no public pages, student logins, or parent access.

## 1) Database
1. Create database `school_erp` in MySQL.
2. Import schema: backend/sql/schema.sql

## 2) Backend
1. Copy backend/.env.example to backend/.env
2. Update DB credentials and JWT secrets.
3. Set owner credentials in .env:
   - OWNER_EMAIL
   - OWNER_PASSWORD
4. Install dependencies:
   - npm install
5. Create owner account:
   - npm run create-owner
6. Start API server:
   - npm run dev

API runs at http://localhost:4000

## 3) Frontend
1. Install dependencies:
   - npm install
2. Start app:
   - npm run dev

Frontend runs at http://localhost:5173

## 4) Security Notes
- Use strong JWT secrets and owner password.
- Keep the ERP behind authentication only.
- If you want zero public site exposure, do not serve the old PHP pages or host the ERP on a dedicated virtual host/port.

## 5) Default Pages (Owner Only)
- Dashboard: /dashboard
- Students: /students
- Teachers: /teachers
- Fees: /fees
- Reports: /reports
