# Jurni Waitlist App

A production-ready waitlist web application for Jurni, built with Next.js and connected to CockroachDB.

## Features

- **Modern UI**: Clean, responsive design with organized CSS files
- **Form Validation**: Comprehensive form validation and error handling
- **Database Integration**: Direct connection to CockroachDB cluster
- **Production Ready**: Optimized for Vercel deployment
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: CockroachDB (PostgreSQL compatible)
- **Styling**: Custom CSS with CSS Variables
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ 
- CockroachDB cluster access
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the environment example file and configure your database connection:

```bash
cp env.example .env
```

Edit `.env` with your CockroachDB credentials:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Alternative individual connection parameters
DB_HOST=your-cockroachdb-host
DB_PORT=26257
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password
DB_SSL_MODE=require

# App Configuration
NEXT_PUBLIC_APP_NAME=Jurni Waitlist
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

The application will automatically create the required table on first run. The `interests` table includes:

- `id`: UUID primary key
- `email`: Unique email address
- `first_name`: First name
- `last_name`: Last name
- `role`: One of: investor, employer, applicant
- `heard_about`: How they heard about Jurni
- `specific_interest`: Optional text field
- `created_at`: Timestamp

### 4. Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build & Deploy

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   └── interests/     # Waitlist API endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.css           # Page-specific styles
│   └── page.tsx           # Main page
├── components/             # React components
│   ├── Hero.tsx           # Hero section
│   ├── Hero.css           # Hero styles
│   ├── WaitlistForm.tsx   # Main form component
│   └── WaitlistForm.css   # Form styles
├── lib/                    # Utility libraries
│   ├── database.ts        # Database connection
│   └── models.ts          # Database models & queries
├── env.example            # Environment variables template
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## API Endpoints

### POST /api/interests

Submit a new interest to the waitlist.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "applicant",
  "heardAbout": "Social media",
  "specificInterest": "Looking for remote opportunities"
}
```

**Success Response (201):**
```json
{
  "message": "Successfully joined the waitlist!",
  "id": "uuid-here"
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "Please fill in all required fields",
  "details": "First name, last name, email, role, and how you heard about us are required"
}
```

**409 Conflict:**
```json
{
  "error": "This email is already registered",
  "details": "Please use a different email address or contact us if you need help"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Unable to process your request",
  "details": "Please try again later or contact support if the problem persists"
}
```

## Form Fields

The waitlist form collects:

1. **First Name** (required)
2. **Last Name** (required)
3. **Email Address** (required, unique)
4. **Role** (required): investor, employer, or applicant
5. **How did you hear about us?** (required)
6. **What specifically are you looking for?** (optional)

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

The application is optimized for Vercel with:
- Edge runtime compatibility
- Optimized build process
- Automatic HTTPS
- Global CDN

## Customization

### Styling
- Modify CSS variables in `app/globals.css`
- Component-specific styles are in separate CSS files
- Responsive design included

### Database
- Modify the `interests` table schema in `lib/models.ts`
- Add new fields as needed
- Update validation logic in the API route

## Troubleshooting

### Database Connection Issues
- Verify CockroachDB credentials
- Check SSL configuration
- Ensure network access to database

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## License

This project is proprietary to Jurni.

## Support

For technical support, contact the development team.
