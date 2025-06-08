# 🌲 Allmänningsskog Web Platform

A modern, bilingual website for Sorsele Övre Allmänningsskog and Tärna-Stensele Allmänningsskog — built to inform, engage, and support community members in northern Sweden. The platform includes news, documents, hunting/fishing info, nature & forestry insights, and more.

![Screenshot](public/preview.png)

---

## 🛠 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes hosted on [Vercel](https://vercel.com/)
- **Database:** PostgreSQL via [Prisma ORM](https://www.prisma.io/)
- **Deployment:** Vercel
- **Assets:** Markdown content, PDFs, and JSON data (for early mock data)

---

## 📁 Features

### ✅ Public Information Pages

- 📰 News & Announcements (per organization)
- 📄 Meeting Documents & Files
- 🎣 Fishing Licenses & Lake Info
- 🦌 Hunting Area Maps
- 🌱 Forestry & Environmental Info

### 🧭 Multi-Organization Support

Each route and database query is scoped by organization (`/sorsele`, `/stensele`) using dynamic routing and `organizationId` in the DB.

### 🌍 Bilingual Support (Coming soon)

Pages are being structured to support Swedish and English content side-by-side.

---

## 🚀 Getting Started

### 1. Clone the repo

````bash
git clone https://github.com/YOUR-USERNAME/allmanningsskog.git
cd allmanningsskog


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
````

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
