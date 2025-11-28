# Interview-Plateform: AI-Powered Mock Interview Practice

Interview-Plateform is a comprehensive web application designed to help users practice for technical interviews using a realistic, AI-powered voice agent. It provides a platform for both candidates to hone their skills and for HR professionals to streamline the initial screening process.

## Key Features

### For Candidates

- **Create Custom Interviews**: Tailor mock interviews based on job role, technology stack, experience level, and difficulty.
- **AI Voice Interviews**: Engage in dynamic, conversational interviews powered by the Vapi.ai voice agent.
- **Instant, Detailed Feedback**: Receive comprehensive performance analysis covering problem-solving, system design, communication, technical accuracy, and more.
- **Track Progress**: A personal dashboard visualizes performance metrics, average scores, and skill improvements over time.
- **Interview History**: Review past interviews, including questions asked and feedback received.
- **Leaderboard**: See how you rank against other users on the platform.

### For HR Professionals

- **HR Dashboard**: Get a high-level overview of total users, interviews conducted, and completion rates.
- **User Management**: View and manage all candidates on the platform.
- **Schedule Interviews**: Assign specific mock interviews to candidates with expiration dates.
- **View Reports**: Access detailed feedback and performance reports for every candidate's interview.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/) for components.
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (e.g., [Supabase](https://supabase.com/))
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (with Google OAuth Provider)
- **AI & Voice**:
  - [Google Gemini](https://ai.google.dev/): For generating interview questions and feedback.
  - [Vapi.ai](https://vapi.ai/): For the real-time, conversational voice agent.
- **Data Fetching & State**: [React Query (TanStack Query)](https://tanstack.com/query/latest) for server state management.
- **Data Visualization**: [Recharts](https://recharts.org/) for charts and graphs.
- **Email Notifications**: [Nodemailer](https://nodemailer.com/)

## Project Structure

The project follows the standard Next.js App Router structure.

```
├── app/
│   ├── (auth-pages)/         # Authentication pages (login, signup)
│   ├── (pages)/
│   │   ├── (dashboard-pages)/  # Main application dashboard and layouts
│   │   └── ...
│   ├── api/                    # API routes
│   ├── components/             # Reusable React components
│   ├── dashboard/              # Server Actions for backend logic
│   ├── lib/                    # Utility functions and libraries
│   └── ...
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   └── migrations/           # Database migration history
└── ...
```

## Getting Started

Follow these steps to get the project running locally.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18.18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A PostgreSQL database. You can set one up for free on [Supabase](https://supabase.com/).

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Interview-Plateform.git
cd Interview-Plateform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, fill in the required values in the `.env` file. See the Environment Variables section below for details.

### 4. Run Database Migrations

Apply the database schema to your PostgreSQL database using Prisma.

```bash
npx prisma migrate dev
```

### 5. Run the Development Server

```bash
npm run dev
```

The application should now be running at http://localhost:3000.

## Environment Variables

The following variables are required to run the application. Add them to your `.env` file:

```env
# Google OAuth Credentials (from Google Cloud Console)
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# NextAuth.js Configuration
AUTH_SECRET= # A random string for signing tokens, e.g., `openssl rand -hex 32`
AUTH_TRUST_HOST=true
AUTH_URL=http://localhost:3000

# Database Connection URL (from your PostgreSQL provider)
# Example for Supabase with connection pooling:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres?pgbouncer=true"

# Google Gemini API Key (from Google AI Studio)
GOOGLE_GENERATIVE_AI_API_KEY=

# Vapi.ai API Token (from Vapi dashboard)
NEXT_PUBLIC_VAPI_TOKEN=

# SMTP for sending emails (e.g., using Gmail)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
```

## Future Improvements

- **Real-time Notifications**: Inform users about scheduled interviews or new feedback.
- **Integrated Code Editor**: Allow candidates to solve coding problems in real-time during the interview.
- **Video Recording & Analysis**: Record interview sessions and analyze body language and speech patterns.
- **Company-Specific Tracks**: Create interview preparation tracks tailored to specific companies.
