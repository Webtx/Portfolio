# Portfolio

## Deploy Checklist

This repo has two apps:
- `frontend` (Next.js)
- `backend` (Express + Prisma)

Deploy backend first, then frontend.

## 1) Backend setup

1. Copy env template:
   - `backend/.env.example` -> `backend/.env`
2. Fill required values:
   - `DATABASE_URL`
   - `AUTH0_ISSUER_BASE_URL`
   - `AUTH0_AUDIENCE`
   - `ADMIN_PERMISSION`
   - `CORS_ORIGIN` (comma-separated allowed)
   - `CLOUDINARY_URL`
3. Run:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start
```

## 2) Frontend setup

1. Copy env template:
   - `frontend/.env.example` -> `frontend/.env`
2. Fill required values:
   - `AUTH0_DOMAIN`
   - `AUTH0_CLIENT_ID`
   - `AUTH0_CLIENT_SECRET`
   - `AUTH0_SECRET`
   - `APP_BASE_URL` (your frontend URL)
   - `AUTH0_AUDIENCE` (must match backend)
   - `NEXT_PUBLIC_API_URL` (your backend URL + `/api`)
3. Run:
```bash
cd frontend
npm install
npm run build
npm run start
```

## 3) Auth0 app settings

Set these to your frontend URL:
- Allowed Callback URLs: `https://YOUR_FRONTEND_DOMAIN/auth/callback`
- Allowed Logout URLs: `https://YOUR_FRONTEND_DOMAIN`
- Allowed Web Origins: `https://YOUR_FRONTEND_DOMAIN`
