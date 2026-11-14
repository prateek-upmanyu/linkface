# LinkinBio — Full Working MVP (Linktree Alternative)

> A modern, mobile-first link-in-bio web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL + Auth)**. Ready for instant deployment on Vercel.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=flat-square&logo=supabase)

---

## ⚡ Core Features

### 1. Dynamic Public Page (`/[username]`)
- **Server-rendered & blazing fast**: Server Component loading profile and links directly with optimized Open Graph meta tags.
- **Mobile-First Experience**: Designed like a native mobile app with animated buttons, tactile feedback, and responsive layout.
- **Atomic Click Tracking**: Opening a link tracks clicks in the background without slowing down navigation.
- **Page Views Counter**: Automatically tracks profile views.
- **Custom 404 Screen**: If a handle does not exist, users are greeted with a branded 404 and a CTA to claim the handle.

### 2. Auto Platform Detection (50+ Platforms)
- Isolated in [`lib/platforms.ts`](file:///c:/Users/khadk/Documents/antigravity\linktree\lib\platforms.ts) for effortless maintenance and expansion.
- Strips `www.` and `m.`, auto-prefixes missing `https://`, and rejects unsafe `javascript:`/`data:` schemes.
- Detects 50+ platforms including:
  - **Socials**: Instagram, YouTube, X/Twitter, Facebook, Threads, TikTok, LinkedIn, Snapchat, Pinterest, Reddit.
  - **Messaging**: WhatsApp (`wa.me`), Telegram (`t.me`), Discord, Twitch, Slack.
  - **Music**: Spotify, Apple Music, SoundCloud, Bandcamp.
  - **Code & Tech**: GitHub, GitLab, Stack Overflow, Product Hunt.
  - **Design & Portfolio**: Figma, Behance, Dribbble, ArtStation.
  - **Publishing**: Medium, Substack, Notion, Hashnode.
  - **Monetization**: Patreon, Buy Me a Coffee, Ko-fi, Gumroad, PayPal, Kickstarter.
  - **Commerce**: Fiverr, Upwork, Etsy, Amazon, Flipkart, Shopify.
  - **Protocols**: Email (`mailto:`), Phone (`tel:`), SMS (`sms:`), Podcasts, Steam.
- **Unknown Links**: Automatically extracts the domain title and fetches the high-resolution Google favicon (`https://www.google.com/s2/favicons?domain=...&sz=64`).

### 3. Interactive Creator Dashboard (`/dashboard`)
- **Live Platform Detection Input**: Shows the platform icon and name dynamically as you type a URL.
- **Drag-and-Drop Reordering**: Built with `@dnd-kit/sortable` for butter-smooth reordering, plus accessible up/down arrow buttons.
- **Inline Editing**: Quick edit title and URL, toggle visibility (eye icon), and delete with confirmation.
- **Profile Customizer**: Update display name, bio (with character counter), and avatar (with custom URL or preset avatars).
- **Sticky Phone Preview**: Real-time interactive phone mockup on desktop showing changes live as you edit.
- **"Copy My Link"**: Fixed header button with instant clipboard copy and visual confirmation.
- **QR Code Generator**: Integrated modal generating vector QR codes with instant PNG download for business cards and merch.

### 4. 5 Curated Themes
Switchable in one click from the dashboard:
1. **Clean Light**: Crisp slate white with modern subtle shadows and dark slate accents.
2. **Onyx Dark**: Deep obsidian dark mode with subtle zinc borders and contrast.
3. **Cosmic Sunset**: Rich violet-to-indigo gradient with frosted glass cards.
4. **Monochrome Outline**: Brutalist high-contrast outline design with zero distractions.
5. **Vibrant Pop**: Energetic pastel aura with warm candy highlights.

### 5. Built-in Analytics
- Profile Page Views.
- Total Links Click Count.
- Click-Through Rate (CTR).
- Visual progress bar breakdown of clicks per individual link.

---

## 🗄️ Database Architecture (Supabase)

The schema is defined in [`supabase/schema.sql`](file:///c:/Users/khadk/Documents/antigravity\linktree\supabase\schema.sql):

- **`profiles`**:
  - `id`: UUID Primary Key references `auth.users(id)` ON DELETE CASCADE.
  - `username`: Unique, lowercase regex-enforced (`^[a-z0-9_]{3,20}$`), blocked reserved words (`admin`, `dashboard`, `settings`, `api`, `login`, etc.).
  - `display_name`, `bio`, `avatar_url`.
  - `theme`: Default `'light'`.
  - `page_views`: Integer counter.
- **`links`**:
  - `id`: UUID Primary Key.
  - `user_id`: UUID references `profiles(id)` ON DELETE CASCADE.
  - `url`, `title`, `platform`, `position`, `is_visible`, `click_count`.
- **Security & RLS Policies**:
  - Anyone can read profiles and visible links (`is_visible = true`).
  - Authenticated users can only insert, update, or delete their own rows (`auth.uid() = user_id`).
  - `increment_link_clicks` & `increment_page_views` are `SECURITY DEFINER` RPC functions allowing safe atomic counter updates without granting direct write access.

---

## 🚀 Quick Start

1. **Clone & install**:
   ```bash
   npm install
   ```
2. **Environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   *(Note: The app comes with an interactive demo mode if run without database keys!)*
3. **Run database script**:
   Copy and run [`supabase/schema.sql`](file:///c:/Users/khadk/Documents/antigravity\linktree\supabase\schema.sql) in your Supabase SQL Editor.
4. **Start the local server**:
   ```bash
   npm run dev
   ```
5. **Open in browser**:
   - Landing page: [http://localhost:3000](http://localhost:3000)
   - Sample profile: [http://localhost:3000/alex](http://localhost:3000/alex)
   - Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

See [`SETUP.md`](file:///c:/Users/khadk/Documents/antigravity\linktree\SETUP.md) for full deployment instructions for Vercel.

---

## 🔮 What to Build Next (Roadmap)

1. **Custom Domain Support (DNS / Vercel API)**:
   - Allow Pro users to map `links.mybrand.com` or `myname.com` using Vercel's Domains Registrar & DNS API.
2. **Link Scheduling & Expiry**:
   - Set a start and end datetime for time-sensitive promotions (e.g. concert tickets, Black Friday sales).
3. **Animated Link Accents**:
   - Add attention-grabbing badges (e.g. "NEW", "LIVE", "50% OFF") or subtle pulsing animations to highlight a priority link.
4. **Email / Newsletter Capture Block**:
   - Add an integrated email input on the public page connected to Mailchimp, ConvertKit, or Supabase for newsletter signups.
5. **Social Icons Header Row**:
   - Display compact icon-only badges above the main link buttons for quick access to primary social accounts (Instagram, X, YouTube, GitHub).
6. **Detailed Geo & Device Analytics**:
   - Capture device type (mobile vs desktop), referrer domain, and country for deeper audience insights.
