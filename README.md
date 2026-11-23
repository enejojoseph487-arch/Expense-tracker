# Expense Manager (MERN)

Simple expense manager with user and admin roles.

- **Frontend:** React (Vite), Tailwind CSS, react-router-dom, axios, react-icons
- **Backend:** Node, Express, MongoDB (Mongoose), JWT auth

## Quick start (one command for both apps)

```bash
npm run install:all      # installs root, server and client dependencies
npm run dev              # starts API (5000) and client (5173) together
```

Make sure MongoDB is running first. `.env` files are included with local defaults; change `JWT_SECRET` and the admin password before deploying.

## Run it (step by step)

You need Node 18+ and a running MongoDB (local or Atlas).

**1. Backend**

```bash
cd server
cp .env.example .env     # then edit MONGO_URI and JWT_SECRET
npm install
npm run dev              # http://localhost:5000
```

An admin account is created on first start from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

**2. Frontend** (new terminal)

```bash
cd client
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # http://localhost:5173
```

## Project structure

```
expense-manager/
├── package.json        # root scripts: install:all, dev, build, lint
├── client/             # React + Vite
│   ├── public/         # favicon and static files
│   ├── eslint.config.js
│   └── src/ (api, components, context, pages, utils.js)
└── server/             # Express + MongoDB
    ├── config/ middleware/ models/ routes/
    └── server.js
```

## How it works

- Anyone can **register** (always as a `user`). The **admin** is the seeded account.
- After login, users go to `/dashboard` and admins go to `/admin`. Visiting the wrong one redirects you back.
- **User dashboard:** add, edit and delete your own expenses, plus totals.
- **Admin dashboard:** totals, spending by category, all users (delete), all expenses (delete).

## API

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/auth/me` | logged in |
| GET / POST | `/api/expenses` | user (own data) |
| PUT / DELETE | `/api/expenses/:id` | user (own data) |
| GET | `/api/admin/stats`, `/users`, `/expenses` | admin |
| DELETE | `/api/admin/users/:id`, `/expenses/:id` | admin |

## Reusable components (`client/src/components`)

`Input`, `Select`, `Button`, `Card`, `StatCard`, `Alert`, `Navbar`, `ProtectedRoute`, `ExpenseForm`, `ExpenseTable`.

Currency is set in one place: `client/src/utils.js`.
