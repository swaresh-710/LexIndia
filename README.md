# LexIndia 🇮🇳⚖️

LexIndia is a modern, full-stack Legal Case Management System designed to help legal professionals, advocates, and law firms efficiently manage their practice. Built with the latest web technologies, it offers a fast, secure, and user-friendly interface to manage clients, cases, documents, and case notes.

## 🚀 Key Features

- **User Authentication:** Secure login and registration system for legal professionals.
- **Client Management:** Maintain detailed records of clients including contact information and specific notes.
- **Case Tracking:** Manage cases with statuses (OPEN, CLOSED, ARCHIVED), categorize by type (Criminal, Civil), and link to specific courts.
- **Document Management:** Keep track of documents related to specific cases (supports cloud storage URLs).
- **Notes & OCR Integration:** Add detailed notes to cases, including support for tagging notes generated via Optical Character Recognition (OCR).
- **Modern Dashboard UI:** An intuitive, responsive interface built with Tailwind CSS and Radix UI components.

## 💻 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) primitives + Custom UI via `class-variance-authority` and `clsx`
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Authentication:** Custom Auth with `bcrypt` / `jsonwebtoken` and `NextAuth`

## 📂 Project Structure

```bash
lex-india/
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database models (User, Client, Case, Document, Note)
├── public/               # Static assets
└── src/
    ├── app/              # Next.js App Router pages and layouts
    │   ├── (dashboard)/  # Main authenticated application dashboard
    │   ├── layout.tsx    # Root layout
    │   └── page.tsx      # Landing/Home page
    ├── components/       # Reusable React components
    │   ├── layout/       # Layout components (Sidebar, Topbar, etc.)
    │   └── ui/           # Core UI components (Buttons, Inputs, etc.)
    └── lib/              # Utility functions and shared libraries
```

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database server running

### Installation Steps

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd lex-india
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and configure your PostgreSQL database connection string and other secrets:
   ```env
   # Example .env file
   DATABASE_URL="postgresql://user:password@localhost:5432/lexindia_db?schema=public"
   ```

4. **Initialize the Database**
   Generate the Prisma client and push the schema to your database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database Schema Overview

The application utilizes a relational database structure defined via Prisma:
- **`User`**: Represents the lawyer/advocate using the system.
- **`Client`**: Clients represented by the user.
- **`Case`**: Legal matters tied to specific clients and the user.
- **`Document`**: References to files associated with a case.
- **`Note`**: Case-specific notes, with metadata for OCR processing.

## 📜 Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint to catch syntax and stylistic issues.

## 🤝 Contribution Guidelines

Contributions, issues, and feature requests are welcome! Feel free to check the issues page and submit pull requests.

## 📄 License

This project is proprietary and intended for internal use unless specified otherwise.
