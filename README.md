# File Uploader

A full-stack file management application with cloud storage, hierarchical folder organization, and a dark-themed React UI.

![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)

Live Preview: <https://file-uploader-0.up.railway.app/>

## Tech Stack

**Backend:** Node.js, Express.js, PostgreSQL, Prisma ORM, Passport.js, Supabase Storage, Multer

**Frontend:** React, React Router, Zustand, Tailwind CSS, Vite, Lucide Icons

## Features

- **Authentication** — Email/password registration and login with session-based auth (Passport.js Local Strategy). Sessions persist for 7 days with secure, httpOnly cookies.
- **File Upload & Storage** — Upload files up to 50MB via drag-and-drop or file picker. Files are stored in Supabase cloud storage, organized by user.
- **Folder Hierarchy** — Create, rename, and delete folders with unlimited nesting. Breadcrumb navigation tracks your location in the folder tree.
- **File Management** — Download, rename, move, and delete files. View file details including size, type, and upload date.
- **All Files View** — Browse every file across all folders in a single view.
- **Responsive UI** — Dark-themed interface with grid/list view toggle, mobile-friendly sidebar navigation, toast notifications, and loading skeletons.

## Project Structure

```
file-uploader/
├── backend/
│   ├── config/         # Passport, Supabase, and session configuration
│   ├── db/             # Prisma client and database query modules
│   ├── middleware/      # Authentication and validation middleware
│   ├── prisma/         # Prisma schema and migrations
│   ├── routes/         # Express route handlers (auth, files, folders)
│   └── app.js          # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components (cards, grids, upload zone, sidebar)
│   │   ├── pages/      # Route pages (Dashboard, FolderView, AllFiles, Login, SignUp)
│   │   ├── states/     # Zustand stores (auth, files, folders)
│   │   └── utils/      # Formatting helpers, file icons, toast notifications
│   └── vite.config.js
└── package.json        # Root workspace scripts
```

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- A [Supabase](https://supabase.com) project with a storage bucket

### Environment Variables

**Backend** (`backend/.env`):

```
NODE_ENV=dev
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/file_uploader
SESSION_SECRET=your_session_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
BUCKET_NAME=your_bucket_name
```

**Frontend** (`frontend/.env`):

```
VITE_NODE_ENV=dev
```

### Installation

```bash
# Install all dependencies (backend + frontend)
npm run build

# Or install individually
npm run install:backend
npm run install:frontend
```

### Running

```bash
# Start the backend server
npm start

# Start the frontend dev server (in a separate terminal)
cd frontend && npm start
```

The backend runs on `http://localhost:3000` and the frontend dev server on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sign-up` | Register a new user |
| POST | `/api/login` | Log in |
| GET | `/api/auth/status` | Check auth status |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/folders` | Get root folders |
| GET | `/api/folders/:id` | Get folder contents, path, and size |
| POST | `/api/folders` | Create a folder |
| PUT | `/api/folders/:id` | Rename a folder |
| DELETE | `/api/folders/:id` | Delete a folder and its contents |
| GET | `/api/files` | Get root-level files |
| GET | `/api/files/all` | Get all files |
| GET | `/api/files/:id` | Get file details |
| GET | `/api/files/:id/download` | Download a file |
| POST | `/api/files` | Upload a file |
| PUT | `/api/files/:id` | Rename or move a file |
| DELETE | `/api/files/:id` | Delete a file |

All `/api/folders` and `/api/files` endpoints require authentication.
