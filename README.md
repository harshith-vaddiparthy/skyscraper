# Outskill Dashboard

A free project resource for **Outskill learners** — use this as a starter template, learning reference, or foundation for your own projects.

## What is this?

This is a modern dashboard application built with Next.js 16, React 19, Tailwind CSS, and shadcn/ui components. It includes a sidebar layout, breadcrumb navigation, and a URL converter tool — all pre-wired and ready to go.

**This project is completely free to use.** Clone it, modify it, break it, rebuild it — it's yours to learn from.

## Tech Stack

- **Next.js 16** — App Router with React Server Components
- **React 19** — Latest React with concurrent features
- **Tailwind CSS 4** — Utility-first styling
- **shadcn/ui** — Pre-built accessible UI components
- **TypeScript** — Full type safety
- **Lucide Icons** — Clean icon set

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/harshith-vaddiparthy/skyscraper.git

# Navigate into the project
cd skyscraper

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/convert/    # API route for URL conversion
│   ├── dashboard/      # Dashboard page with sidebar layout
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # Reusable UI components (button, input, sidebar, etc.)
│   ├── app-sidebar.tsx # Application sidebar
│   └── url-converter.tsx # URL converter component
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

## For Outskill Learners

This project is provided as a **free resource** by Outskill. Here are some ways you can use it:

- **Learn** — Read through the code to understand how a modern Next.js app is structured
- **Experiment** — Add new pages, components, or API routes
- **Build** — Use this as a starting point for your own dashboard projects
- **Practice** — Try adding features like authentication, database integration, or new UI components

No strings attached. No attribution required. Just learn and build.

## Deployment

Deploy to any platform that supports Next.js:

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)
- Any Node.js hosting provider

## License

Free to use for learning and personal projects.

---

Made with care for the Outskill community.
