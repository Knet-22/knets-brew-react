# Knet's Brew — React Edition

Full rebuild of the Knet's Brew PHP project as a modern React (Vite) single-page app backed by Supabase (PostgreSQL + Auth + Storage) and deployed on Cloudflare Pages.

**Stack:** React 18 · Vite · React Router · Supabase · Cloudflare Pages

> **Note:** the BrewMate chatbot from the original PHP version has been removed in this React build to keep the migration tight and avoid API costs. Everything else from the original — orders, admin, products, staff, notifications — is fully ported.

---

## What's Included

### Guest side (public, no login)
- **Home** — premium rare-coffee landing page (Black Ivory, Kopi Luwak, Panama Geisha, Blue Mountain)
- **Menu** — category-filtered grid with live stock display, low-stock warnings, rare-coffee badges
- **Order** — cart review + checkout (pickup/delivery, cash/GCash/card)
- **Order Success** — confirmation with order code
- **Track Order** — look up by code, see status progress

### Admin / Staff side (login required) at `/admin/login`
- **Dashboard** — total orders, active orders, today's & total revenue, low-stock alerts, top products
- **Orders** — search, filter by status/date, view full details, update status (received → preparing → ready → out for delivery → completed/cancelled)
- **Products** *(admin only)* — full CRUD with image uploads to Supabase Storage, add-stock helper, availability toggle
- **Staff** *(admin only)* — add, edit, deactivate, delete staff accounts
- **Profile** — edit own name/username, change password
- **Notifications** (top-right bell) — auto-polls every 30 seconds for new orders & status changes

### Roles
- `admin` — full access
- `staff` — dashboard, orders, profile only

---

## Setup — Local Development

### 1. Install Node.js
You need **Node 18+**. Get it from [nodejs.org](https://nodejs.org/).

### 2. Install dependencies
```bash
npm install
```

### 3. Create a Supabase project
1. Sign up at [supabase.com](https://supabase.com/) (free tier is enough)
2. Create a new project — pick **Southeast Asia (Singapore)** region (closest to PH)
3. Save the DB password somewhere safe
4. Wait ~2 minutes for it to provision

### 4. Run the database schema
1. Supabase → **SQL Editor** → **New query**
2. Open `supabase-schema.sql` from this project, copy ALL contents, paste in
3. Click **Run**
4. Should see "Success. No rows returned." — all 5 tables created, 18 products seeded.

### 5. Create the admin & staff login accounts
The SQL added placeholder rows but they can't sign in yet. Create the real Auth users:

1. Supabase → **Authentication → Users** → **Add user → Create new user**
2. **Admin:**
   - Email: `admin@knetsbrew.ph`
   - Password: `admin123` (or your choice — remember it!)
   - ✅ Check **Auto Confirm User**
3. **Staff:**
   - Email: `staff@knetsbrew.ph`
   - Password: `staff123`
   - ✅ Auto Confirm User

The app matches Auth users → staff table by email automatically.

### 6. Get your API credentials
1. **Project Settings → API Keys**
2. Copy the **Project URL** and the **anon public** key

### 7. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_SUPABASE_URL=https://abcd1234.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 8. Run the dev server
```bash
npm run dev
```
Open `http://localhost:5173`.

---

## Deploy to Cloudflare Pages

### 1. Push to GitHub
1. Create a **public** repository on [github.com](https://github.com/)
2. Don't add README/gitignore (we have them)
3. In a terminal in this folder:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/knets-brew-react.git
git push -u origin main
```

### 2. Connect to Cloudflare Pages
1. Sign up at [cloudflare.com](https://cloudflare.com/) (free, no card)
2. **Workers & Pages → Create application → Pages → Connect to Git**
3. Select your `knets-brew-react` repo
4. **Build settings:**
   - Framework preset: **None** (or Vite if available)
   - Build command: `npm run build`
   - Build output directory: `dist`
5. **Environment variables (CRITICAL):**
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
6. **Save and Deploy**

After ~2-3 minutes your site is live at `https://knets-brew-react.pages.dev`.

### 3. (Optional) Connect a custom domain
1. Cloudflare Pages → your project → **Custom domains** → **Set up a custom domain**
2. Enter your domain
3. Follow the DNS setup instructions
4. SSL auto-provisions in 1-5 minutes

---

## Default Login

After running the schema and creating the Auth users:

| Role  | Email                 | Password |
|-------|-----------------------|----------|
| Admin | admin@knetsbrew.ph    | admin123 |
| Staff | staff@knetsbrew.ph    | staff123 |

**Change these in production.** Login → Profile → Change Password.

---

## Project Structure

```
knets-brew-react/
├── public/
│   └── _redirects                # SPA routing for Cloudflare Pages
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Public nav
│   │   ├── Footer.jsx
│   │   └── AdminLayout.jsx       # Admin sidebar + notification bell + auth guard
│   ├── context/
│   │   ├── CartContext.jsx       # Cart state + localStorage
│   │   └── AuthContext.jsx       # Supabase Auth + staff lookup
│   ├── lib/
│   │   └── supabase.js           # Supabase client + helpers
│   ├── pages/
│   │   ├── Home.jsx, Menu.jsx, Order.jsx
│   │   ├── OrderSuccess.jsx, Track.jsx, NotFound.jsx
│   │   └── admin/
│   │       ├── Login.jsx, Dashboard.jsx, Orders.jsx
│   │       ├── Products.jsx, Staff.jsx, Profile.jsx
│   ├── styles/
│   │   ├── global.css            # Design system + public pages
│   │   └── admin.css             # Admin shared styles
│   ├── App.jsx                   # Router
│   └── main.jsx                  # Entry point
├── .env.example
├── index.html
├── package.json
├── supabase-schema.sql
└── vite.config.js
```

---

## Adding New Staff Later

1. **In admin panel** → Staff → Add Staff → enter info (creates DB row)
2. **In Supabase** → Authentication → Users → Add user → use the SAME email → Auto Confirm User
3. They can now sign in.

---

## Updating Your Site

The Cloudflare Pages setup includes auto-deploy from GitHub:

```bash
# edit files
git add .
git commit -m "describe what changed"
git push
```

Cloudflare detects the push and auto-rebuilds in 2-3 minutes.

For database changes (new products, edits), use the admin panel — no deploy needed.

For env variable changes, update them in Cloudflare → Settings → Variables → then **Retry deployment**.

---

## Notes

- **Row Level Security** is enabled on all tables. Public has read-only access for the guest flow; authenticated users (logged-in staff) get full access.
- **Storage bucket** for product images is public-readable (anyone can view URLs) but only authenticated users can upload/delete.
- **Cart** is local to each browser (localStorage), not stored in the database until checkout.
- **Notifications** poll every 30 seconds — fine for a school project. For production, upgrade to Supabase Realtime subscriptions.
- **Happy Hour discount** (15% off, 2-5pm weekdays) is shown on the homepage as marketing but NOT auto-applied at checkout. Staff applies it manually when fulfilling. To auto-apply, add logic in `Order.jsx` checking `new Date().getHours()` against 14-17 and weekday.

---

## Knet's Brew Branding

- **Cafe name:** Knet's Brew
- **Location:** Ulbujan, Calape, Bohol
- **Phone:** +63 966 364 0516
- **Hours:** Mon–Fri 8am-10pm · Sat–Sun 9am-11pm
- **Happy Hour:** Daily 2pm–5pm, 15% off
- **Student discount:** 10% off with valid ID

Edit these in:
- `src/components/Footer.jsx` — contact info, hours
- `src/pages/Home.jsx` — hero copy, about section
