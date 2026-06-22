# M.S. Union Catalog App

A minimal Next.js app that pulls your product catalog from Supabase and displays it in a filterable grid. No AI features yet — this is the foundation to confirm the data layer works in a real browser before building the chatbot/visualization features on top.

## 1. Install Node.js (if you don't have it)

Download from https://nodejs.org (the LTS version). This gives you `node` and `npm` on your computer.

## 2. Install dependencies

Open a terminal, navigate into this folder, and run:

```
npm install
```

This downloads React, Next.js, and the Supabase client library into a `node_modules` folder.

## 3. Set up your environment variables

1. Copy `.env.local.example` to a new file called `.env.local`
2. Go to your Supabase project -> Project Settings -> API
3. Copy your "Project URL" and "anon public" key into `.env.local`

`.env.local` is already in `.gitignore` so it will never get pushed to GitHub — that's intentional, since it's fine for this anon key to be in your frontend code (it's public by design), but it's still good practice to keep it out of version control as a habit.

## 4. Run it locally

```
npm run dev
```

Then open http://localhost:3000 in your browser. You should see your real product catalog, pulled live from Supabase, with category filter buttons at the top.

## 5. Push to GitHub

```
git init
git add .
git commit -m "Initial catalog app"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

## 6. Deploy with Vercel

1. Go to vercel.com -> New Project -> Import your GitHub repo
2. When prompted for environment variables, add the same two from your `.env.local`
3. Deploy — you'll get a live URL

## Project structure

```
app/
  layout.js       - root HTML wrapper
  page.js         - the catalog page (fetches data from Supabase)
  globals.css     - all styling
components/
  CatalogGrid.jsx - filtering + grid display (client-side interactivity)
lib/
  supabaseClient.js - Supabase connection + image URL helper
```
