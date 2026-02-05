# RBAC Management Tool

A fully functional internal tool for managing Role-Based Access Control (RBAC) built with Next.js, TypeScript, and PostgreSQL.

## 🎯 What is RBAC?

**RBAC (Role-Based Access Control) for Kids:**
Imagine a school where teachers can grade papers, students can submit homework, and janitors can clean classrooms. RBAC is like giving each person a special badge that shows what they're allowed to do. Instead of checking every person individually, we just look at their badge (role) and know their permissions!

## ✨ Features

- **User Authentication**: Secure login/signup system with JWT tokens and password hashing
- **Permission Management**: Full CRUD operations for system permissions
- **Role Management**: Create, update, and delete roles
- **Permission Assignment**: Visually assign permissions to roles with an intuitive interface
- **Natural Language Configuration**: Modify RBAC settings using plain English commands
- **Modern UI**: Beautiful, responsive interface built with Shadcn UI and Tailwind CSS
- **Search & Filter**: Quickly find permissions and roles
- **Real-time Updates**: See changes reflected immediately across the application

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd RBAC
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/rbac_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # (Optional) Seed database with sample data
   npm run db:seed
   ```

5. **Create a test user** (optional - you can also use signup)

   You can create a test user directly in the database or use the signup feature in the app.

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Test Credentials

For testing purposes, you can use these credentials after creating a user:

**Email:** `admin@example.com`  
**Password:** `admin123`

> **Note:** You'll need to create this user first using the signup feature, or you can create it directly in the database.

### Creating Test User via Signup

1. Go to the login page
2. Click "Don't have an account? Sign up"
3. Enter:
   - Email: `admin@example.com`
   - Password: `admin123` (minimum 6 characters)
4. Click "Sign Up"
5. You'll be prompted to log in with your new credentials

## 📁 Project Structure

```
RBAC/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── permissions/  # Permission CRUD
│   │   ├── roles/        # Role CRUD
│   │   └── natural-language/ # Natural language processing
│   ├── dashboard/        # Main dashboard page
│   └── page.tsx          # Login page
├── components/
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── permissions/     # Permission management
│   ├── roles/           # Role management
│   ├── natural-language/ # Natural language config
│   └── ui/              # Reusable UI components
├── lib/
│   ├── auth.ts          # Authentication utilities
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # Utility functions
├── prisma/
│   └── schema.prisma    # Database schema
└── README.md
```

## 🗄️ Database Schema

The application uses the following tables:

- **users**: User accounts with email and hashed passwords
- **roles**: System roles (e.g., Administrator, Editor)
- **permissions**: Individual permissions (e.g., can_edit_articles)
- **role_permissions**: Junction table linking roles to permissions
- **user_roles**: Junction table linking users to roles

## 🎨 Usage Guide

### Managing Permissions

1. Navigate to the **Permissions** tab
2. Click **Create Permission** to add a new permission
3. Enter a name (e.g., `can_edit_articles`) and optional description
4. Use the search bar to find existing permissions
5. Click the edit or delete icons to modify permissions

### Managing Roles

1. Navigate to the **Roles** tab
2. Click **Create Role** to add a new role
3. Enter a name (e.g., `Content Editor`) and optional description
4. View the number of permissions and users assigned to each role

### Assigning Permissions to Roles

1. Navigate to the **Assign Permissions** tab
2. Select a role from the left panel
3. Toggle permissions on/off in the right panel
4. Click **Save Changes** to apply

### Natural Language Configuration

1. Navigate to the **Natural Language** tab
2. Type a command in plain English, for example:
   - `"Give the role 'Administrator' the permission to 'delete users'"`
   - `"Create a new permission called 'publish content'"`
   - `"Create a new role called 'Content Editor'"`
   - `"Remove permission 'edit articles' from role 'Viewer'"`
3. Click the send button or press Enter
4. View command history below

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **UI Library**: Shadcn UI (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 🔒 Security & Backend Features

- Password hashing with bcrypt
- JWT-based authentication (stateless token-based sessions)
- Protected API routes with role-based access control
- Schema-based input validation using Zod on critical endpoints
- In-memory rate limiting per IP + route (e.g., login, signup, RBAC mutations)
- SQL injection prevention (via Prisma)

## 📝 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Authenticate user

### Permissions

- `GET /api/permissions` - Get all permissions
- `POST /api/permissions` - Create permission
- `GET /api/permissions/[id]` - Get permission by ID
- `PUT /api/permissions/[id]` - Update permission
- `DELETE /api/permissions/[id]` - Delete permission

### Roles

- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create role
- `GET /api/roles/[id]` - Get role by ID
- `PUT /api/roles/[id]` - Update role
- `DELETE /api/roles/[id]` - Delete role
- `GET /api/roles/[id]/permissions` - Get role permissions
- `POST /api/roles/[id]/permissions` - Assign permissions to role

### Natural Language

- `POST /api/natural-language` - Process natural language command

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set:

- `DATABASE_URL` - Your production database URL
- `JWT_SECRET` - A strong, random secret key
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - A strong, random secret key

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check your `DATABASE_URL` in `.env`
- Verify database credentials

### Authentication Issues

- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token is being sent in API requests

### Build Errors

- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Run `npm run db:generate`

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and TypeScript
