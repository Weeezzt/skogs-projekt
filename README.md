# 🌲 Allmänningsskog Web Platform

A modern platform for **Sorsele Övre Allmänningsskog** and **Tärna-Stensele Allmänningsskog**.
The site provides news, meeting documents, forestry insights, hunting & fishing information, and more — built to serve community members in northern Sweden.

![Screenshot](public/preview.png)

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) + TypeScript + Tailwind CSS
- **Database:** PostgreSQL via [Prisma ORM](https://www.prisma.io/)
- **Auth:** [NextAuth.js](https://next-auth.js.org/) with Google/GitHub providers
- **Storage:** S3-compatible bucket for documents & media
- **Deployment:**

  - Primary: [VAIA Cloud](https://vaia.se/) (standalone build)
  - Secondary: [Render](https://render.com/) (for testing/fallback)

- **Infra:** GitHub Actions → auto-deploy to VAIA

---

## 📁 Features

### ✅ Public Information

- 📰 News & announcements per organization
- 📄 Meeting documents (with upload & folder support)
- 🎣 Fishing licenses, lakes, and species info
- 🦌 Hunting areas & maps
- 🌲 Forestry & environmental information

### 👥 Multi-Organization Support

- Each route is scoped by `/[orgname]` (`/sorsele`, `/tarna`)
- All database queries use `organizationId`

### 🔒 Admin Tools

- Secure login via OAuth (Google/GitHub)
- Upload PDFs & files into folders (with drag & drop support)
- Create and manage news posts (with Markdown editor + live preview)
- Attach documents directly to news items

### 🌍 Bilingual Support _(coming soon)_

- Pages are structured to allow Swedish + English side-by-side

---

## 🚀 Getting Started (Local Dev)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR-USERNAME/allmanningsskog.git
cd allmanningsskog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file with:

```env
DATABASE_URL="postgresql://user:password@host:5432/db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"
GOOGLE_CLIENT_ID="xxx"
GOOGLE_CLIENT_SECRET="xxx"
GITHUB_ID="xxx"
GITHUB_SECRET="xxx"

AWS_ACCESS_KEY_ID="xxx"
AWS_SECRET_ACCESS_KEY="xxx"
```

### 4. Set up database

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🏗 Deployment

### VAIA Cloud (production)

- Builds with `next build --standalone`
- Files from `.next/standalone`, `.next/static`, and `public/` copied to `/var/www/html/`
- Start command:

  ```bash
  HOSTNAME=0.0.0.0 PORT=${PORT:-3000} node /var/www/html/server.js
  ```

- Environment variables set in VAIA panel

### Render (fallback/testing)

- Uses same standalone build
- Start with:

  ```bash
  PORT=${PORT} node server.js
  ```

---

## 📌 Roadmap

- 🌍 Full bilingual content (Swedish/English)
- 🔎 Advanced document search & filters
- 📱 Improved mobile upload UX
- 🗺 Interactive hunting/fishing maps

---
