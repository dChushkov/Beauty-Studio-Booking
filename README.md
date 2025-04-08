# Makeup Studio Booking Application

A professional makeup studio booking system built with React, TypeScript, and MongoDB.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update the MONGODB_URI in .env file

4. Start the development server:
   ```bash
   # Terminal 1 - Frontend
   npm run dev

   # Terminal 2 - Backend
   npm run server
   ```

5. Open the application in Cursor:
   - Install Cursor from https://cursor.sh
   - Open the project folder in Cursor
   - Start coding with AI assistance!

## Features

- Professional makeup service booking system
- Real-time availability checking
- Beautiful, modern UI with animations
- Multilingual support (English and Bulgarian)
- MongoDB integration for data persistence
- Admin dashboard for booking management

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - i18next

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Zod

## Project Structure

```
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page components
│   ├── i18n/         # Internationalization
│   ├── services/     # API services
│   └── types/        # TypeScript types
├── server/
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── index.ts      # Server entry point
└── README.md
```