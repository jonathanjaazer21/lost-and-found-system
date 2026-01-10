# Lost and Found System

A modern web application for managing lost and found items with real-time notifications built with React, Firebase, and DaisyUI.

## Features

- User authentication (login/register)
- Report lost items with description, photo URL, and contact info
- View all lost items with status filtering (unclaimed/claimed)
- Admin role can update item status
- Email notifications to registered receivers when new items are reported
- Mobile-responsive UI with DaisyUI components
- Real-time data sync with Firestore

## Tech Stack

- React 18.3
- React Router v7 (with server-side actions)
- TypeScript
- Tailwind CSS + DaisyUI
- Vite
- Firebase Authentication
- Firestore Database
- Nodemailer (server-side email via RRv7 actions)

## Project Structure

```
src/
  app/
    routes/         # Route components
    loaders/        # React Router v7 loaders
    actions/        # React Router v7 actions
    layouts/        # Route layouts (protected, public)
  features/         # Domain features (lost-items)
  components/       # Reusable UI components
  ui/               # DaisyUI-based primitives
  services/
    firebase/       # Firebase SDK initialization
    auth/           # Auth service
    firestore/      # Firestore data access
    email/          # Email notification service
  context/          # React contexts (AuthContext)
  types/            # TypeScript types
  main.tsx
  router.tsx
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Firebase project with Firestore and Authentication enabled
- Google account with App Password for SMTP

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd laf-system
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

5. Configure your Firebase credentials in `.env`:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password

3. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Deploy the security rules from `firestore.rules`

4. Create initial collections:

**users collection:**
```json
{
  "uid": "user_id",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "timestamp"
}
```

**receivers collection:**
```json
{
  "emails": ["receiver1@example.com", "receiver2@example.com"]
}
```

### Email Configuration

Email notifications are sent server-side via React Router v7 actions using Nodemailer.

#### Development Mode (Default)

Emails use **Ethereal Email** test accounts automatically:
- No SMTP configuration needed
- Emails are captured (not sent)
- Preview URLs shown in console
- See `DEVELOPMENT.md` for details

#### Production Mode

To send real emails:

1. Set `NODE_ENV=production` in `.env`
2. Configure Gmail SMTP:
   - Enable 2-Factor Authentication
   - Generate App Password (Google Account > Security > 2-Step Verification > App passwords)
   - Add to `.env`:
     - `SMTP_USER` - Your Gmail address
     - `SMTP_PASS` - The generated app password

### Running the Application

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

Email notifications are sent server-side through React Router v7 actions.

## Usage

### User Registration

1. Navigate to `/register`
2. Create an account with email and password
3. You'll be redirected to the dashboard

### Reporting a Lost Item

1. Login to your account
2. Fill out the lost item form:
   - Description (required)
   - Mobile Number (optional)
   - Photo URL (optional)
3. Submit the form
4. All registered receivers will be notified via email

### Viewing Lost Items

- All items are displayed on the dashboard
- Filter by status: All, Unclaimed, Claimed
- View item details including photos

### Admin Features

Users with `role: "admin"` in Firestore can:
- Update item status (unclaimed ↔ claimed)

To make a user admin:
1. Go to Firestore console
2. Find the user document in `users` collection
3. Change `role` field to `"admin"`

## Security

### Firestore Security Rules

The application enforces security at multiple levels:

1. **Firestore Rules** (primary): Defined in `firestore.rules`
   - Users can read all lost items
   - Authenticated users can create items
   - Only admins can delete items
   - Status updates restricted to admins or via service

2. **Service Layer** (secondary): Business logic validation

3. **UI Layer**: User experience only, not trusted

### Best Practices

- Never commit `.env` file
- Never log sensitive data
- All authorization enforced server-side
- Input validation on both client and server

## Architecture

This project follows strict architectural guidelines defined in:

- `AGENT.md` - Senior developer behavior & quality standards
- `STACK_DESIGN.md` - Technology stack architecture
- `STRUCTURE_DESIGN.md` - System & project structure
- `CONTRIBUTING.md` - Development workflow & rules

### Key Principles

- Separation of concerns
- No Firebase calls in UI components
- Services own all data access
- Auth handled centrally via AuthContext
- Email notifications isolated in service layer

## Development

### Development Tools

**React Grab** is included for copying JSX from the browser:
- Press **Ctrl+C + Click** (Cmd+C + Click on Mac) on any element to copy its JSX
- JSX is automatically copied to your clipboard
- Only enabled in development mode
- See `DEVELOPMENT.md` for full guide

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Type Check

TypeScript is configured with strict mode. The project will not build with type errors.

### Email Notifications

Email notifications are handled server-side in React Router v7 actions:
- When a lost item is created, the action fetches receivers from Firestore
- Sends emails directly using Nodemailer
- No separate API server needed - everything runs in the RRv7 action handler

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and workflow.

## License

MIT
