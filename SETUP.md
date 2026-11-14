# LinkinBio MVP — Step-by-Step Setup Guide

This guide walks you through setting up Supabase, running the app locally, and deploying it to Vercel.

---

## 1. Supabase Setup (5 Minutes)

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, choose an organization, and give your project a name (e.g. `linkinbio`).
3. Set a strong database password and select a region close to your users.

### Step 2: Run the SQL Schema
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the file [`supabase/schema.sql`](file:///c:/Users/khadk/Documents/antigravity/linktree/supabase/schema.sql) in this repository.
4. Copy its contents, paste them into the Supabase SQL editor, and click **Run**.
5. This creates:
   - `profiles` table with username uniqueness, format regex, and reserved keyword protection.
   - `links` table with user references and visibility flags.
   - Row Level Security (RLS) policies allowing public read and authenticated user CRUD.
   - `increment_link_clicks` and `increment_page_views` atomic RPC functions.
   - Trigger to automatically generate a profile when a new user signs up.

### Step 3: Configure Authentication
1. Go to **Authentication** -> **Providers** in Supabase.
2. **Email**: Ensure Email provider is enabled. (Optional: Disable "Confirm email" in development under Auth -> Providers -> Email).
3. **Google (Optional)**:
   - Enable Google provider.
   - Add your Google OAuth Client ID and Secret (from Google Cloud Console).
   - Add your redirect URL: `https://<your-project-id>.supabase.co/auth/v1/callback` and `http://localhost:3000/auth/callback`.

### Step 4: Get API Credentials
1. Go to **Project Settings** -> **API**.
2. Copy:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon public key** (`eyJhbGciOi...`)

---

## 2. Run Locally

### Step 1: Clone & Install Dependencies
```bash
git clone <your-repo>
cd linktree
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** If you run the project without setting `.env.local`, LinkinBio will automatically launch in **Interactive Demo Mode** with pre-seeded data (`/alex`) so you can explore the dashboard and phone preview right away!

### Step 3: Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- Landing page: [http://localhost:3000](http://localhost:3000)
- Sample public page: [http://localhost:3000/alex](http://localhost:3000/alex)
- Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 3. Deploy to Vercel

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: complete LinkinBio MVP"
git push origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Framework Preset will be automatically detected as **Next.js**.

### Step 3: Add Environment Variables in Vercel
In the **Environment Variables** section during project import (or in Project Settings -> Environment Variables), add:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
- `NEXT_PUBLIC_APP_URL`: Your production Vercel URL (e.g. `https://your-project.vercel.app`)

### Step 4: Add Production Redirect URL to Supabase
1. In your Supabase dashboard, go to **Authentication** -> **URL Configuration**.
2. Set **Site URL** to `https://your-project.vercel.app`.
3. Add `https://your-project.vercel.app/auth/callback` to **Redirect URLs**.
4. Click **Save**.

Your LinkinBio web application is now deployed live in production!

---

## 4. Verification Checklist

- [x] Sign up with email or Google
- [x] Username availability check: tries handles live, rejects reserved words (`admin`, `dashboard`, `settings`, etc.)
- [x] Add link with auto platform detection (try pasting `youtube.com/@channel`, `instagram.com/user`, `open.spotify.com/...`, `wa.me/...`)
- [x] Edit title, toggle visibility (hide/show), delete link
- [x] Drag to reorder links (updates order on public page)
- [x] Switch between 5 themes (`light`, `dark`, `gradient`, `minimal`, `colorful`)
- [x] Public profile at `/[username]` opens in new tab and tracks clicks atomically
- [x] Analytics tab displays Total Page Views, Link Clicks, and Click-Through Rate (CTR)
- [x] QR Code modal generates scannable code and downloads crisp PNG
