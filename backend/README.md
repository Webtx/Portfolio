# Portfolio Backend

## Setup

1. Create `.env` from `.env.example`
2. Install deps
3. Run migrations
4. Start dev server

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Auth0

Admin routes require a JWT with the `ADMIN_PERMISSION` in either the `permissions` claim or `scope`.
Set these in `.env`:
- `AUTH0_ISSUER_BASE_URL`
- `AUTH0_AUDIENCE`
- `ADMIN_PERMISSION`

## API

Public base: `/api/public`
Admin base: `/api/admin`

Health: `/health`
