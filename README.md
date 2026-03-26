# SIMS — Smart Inventory Management System

> A real-time, cloud-connected inventory management platform built with React and Supabase.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase) ![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-Styling-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **📊 Live Dashboard** — Real-time stock valuation, inventory trends, and category analytics
- **📦 Inventory Management** — Full CRUD with barcode scanning for fast SKU entry
- **🗓️ Stock Expiry Watch** — Proactively flags items expiring within 30 days
- **🔔 Smart Notifications** — Live bell alerts for low stock and upcoming expirations
- **🔐 Supabase Auth** — Secure sign-up, sign-in, and email verification
- **🌙 Dark Mode** — Persistent light/dark/system theme switching
- **📱 PWA Ready** — Installable on Android and iOS like a native app
- **🌍 Multi-currency** — Configurable regional and currency settings

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Asemeit/SIMS.git
cd SIMS

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase credentials (see below)

# 4. Start the development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase project under **Settings → API**.

---

## 🗄️ Database Setup

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Inventory table
create table inventory (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  sku text unique not null,
  category text default 'General',
  quantity integer default 0,
  min_stock_level integer default 10,
  price decimal not null,
  expiry_date timestamptz,
  status text default 'In Stock',
  created_at timestamptz default now()
);

-- Profiles table
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  email text,
  role text default 'User',
  updated_at timestamptz default now()
);
```

---

## 📱 Mobile / Phone Access

To access the app from your phone on the same Wi-Fi network:

```bash
npm run dev -- --host
```

Then open the **Network URL** (e.g. `http://192.168.x.x:5173`) on your phone's browser.
To install as an app: tap the browser menu → **"Add to Home Screen"**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Charts | Recharts |
| Icons | Lucide React |
| PWA | vite-plugin-pwa |

---

## 📄 License

This project was built as an academic assignment. All rights reserved © 2026 Asemeit.
