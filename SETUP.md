# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL database running
- [ ] Git installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/rbac_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
```

**Important:** Replace the placeholder values with your actual database credentials and generate secure random strings for the secrets.

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push
```

### 4. (Optional) Seed Sample Data

```bash
npm run db:seed
```

This will create:

- A test user: `admin@example.com` / `admin123`
- Sample permissions (8 permissions)
- Sample roles (Administrator, Content Editor, Viewer)
- Role-permission assignments

### 5. Start Development Server

```bash
npm run dev
```

### 6. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Login

If you ran the seed script:

- **Email:** `admin@example.com`
- **Password:** `admin123`

If you didn't run the seed script:

1. Click "Don't have an account? Sign up"
2. Create your account
3. Log in with your credentials

## Troubleshooting

### Database Connection Error

- Verify PostgreSQL is running
- Check your `DATABASE_URL` format
- Ensure the database exists

### Module Not Found Errors

- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Run `npm run db:generate`

### Port Already in Use

- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

## Next Steps

- Explore the dashboard
- Create your first permission
- Create your first role
- Assign permissions to roles
- Try the natural language feature!
