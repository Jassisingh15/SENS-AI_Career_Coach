# AI Career Coach

An AI-powered career guidance platform built with Next.js. Get personalized industry insights, track your professional growth, and receive AI-driven recommendations to help you make smarter career decisions.

## Features

- 🔐 **Secure Authentication** — User sign-up, sign-in, and session management powered by Clerk
- 🎯 **Personalized Onboarding** — Capture your industry, experience, bio, and skills to tailor your experience
- 📊 **AI-Generated Industry Insights** — Salary ranges, demand levels, growth rates, key trends, and recommended skills generated via AI and cached per industry
- 🔄 **Auto-Refreshing Data** — Industry insights are automatically updated on a weekly cycle
- 🗄️ **Persistent User Profiles** — All user and industry data stored in PostgreSQL via Prisma ORM
- ⚡ **Background Jobs** — Scheduled and event-driven tasks handled with Inngest

## Tech Stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Framework       | [Next.js 15](https://nextjs.org/) (App Router) |
| Authentication  | [Clerk](https://clerk.com/)                    |
| Database        | [PostgreSQL](https://www.postgresql.org/)      |
| ORM             | [Prisma](https://www.prisma.io/)               |
| AI Insights     | [Groq API](https://groq.com/)                  |
| Background Jobs | [Inngest](https://www.inngest.com/)            |
| Styling         | Tailwind CSS                                   |

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (local or hosted, e.g. [Neon](https://neon.tech/), [Supabase](https://supabase.com/))
- A [Clerk](https://clerk.com/) account for authentication
- A [Groq](https://groq.com/) API key for AI-generated insights

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Jassisingh15/ai-career-coach.git
   cd ai-career-coach
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ai_career_coach"

   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here

   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
ai-career-coach/
├── actions/          # Server actions (user updates, onboarding, dashboard data)
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components (Header, etc.)
├── lib/              # Utility functions, Prisma client, checkUser helper
├── prisma/           # Prisma schema and migrations
└── public/           # Static assets
```

## Deployment

This project is designed to deploy seamlessly on [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Import the repository into Vercel
3. Add all environment variables from `.env` into your Vercel project settings
4. Use a hosted PostgreSQL provider (e.g. Neon or Supabase) for production
5. Switch to Clerk **production** keys and add your deployed domain to Clerk's allowed origins

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or issue.

## License

This project is licensed under the MIT License.
