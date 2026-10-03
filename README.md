# FullStack E-Commerce Website

A full-stack e-commerce application with an admin dashboard for managing products and handling user authentication.

## Tech Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT
- Media uploads: ImageKit
- Styling: Tailwind CSS

## Features

- User signup and login flow
- Protected dashboard routes
- Product listing with data from MongoDB
- Add, update, and delete product records
- Product image upload support
- JWT-based access/refresh authentication flow
- Responsive storefront/admin interface

## Project Structure

```text
FullStack-E-comm-website/
├── backend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── .gitignore
└── README.md
```

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v18 or higher recommended)
- npm
- MongoDB database connection

## Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create or update the `.env` file in the `backend` directory with the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
IAMGEKIT_END_POINT=https://ik.imagekit.io/your_instance
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_PUBLIC_KEY=your_public_key
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

## Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend app will usually open at:

```text
http://localhost:5173
```

## Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
```

To run the backend in production mode:

```bash
cd backend
npm start
```

## API Overview

The backend exposes routes for authentication and product management.

### Auth Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Product Routes

- `GET /api/product/`
- `POST /api/product/create`
- `PATCH /api/product/update/:id`
- `POST /api/product/delete/:id`

## Notes

- The project uses a protected admin dashboard flow for authenticated users.
- Product image uploads are handled through ImageKit integration.
- Keep your `.env` values private and do not commit real secrets to version control.

## License

This project is currently unlicensed unless you add a license file for your preferred usage terms.
