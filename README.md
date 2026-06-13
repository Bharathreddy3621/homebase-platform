# homebase-platform

A full-stack home rental platform for browsing listings, saving favourites, and managing host properties.

## Project Structure

- `backend/` - Express API, file uploads, and MongoDB session/storage logic
- `frontend/` - React + Vite app for browsing homes, favourites, bookings, and host management

## Features

- Guest and host authentication flows
- Browse homes and open detailed listing pages
- Save and remove favourites
- Host listing management for add, edit, and delete
- House rules PDF uploads and static image handling
- React frontend served from the backend build when available

## Setup

1. Install dependencies in both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Create your local environment file from the example and fill in real values:

```bash
Copy-Item .env.example .env
```

3. Build the frontend for production serving:

```bash
cd frontend
npm run build
```

4. Start the backend:

```bash
cd backend
npm start
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string used by the backend
- `SESSION_SECRET` - Express session secret
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Optional MySQL settings used by legacy helpers

## Notes

- Generated folders such as `frontend/dist` and dependency folders are ignored in git.
- The app stores uploaded images in `backend/uploads/` and house rules PDFs in `backend/houseRules/`.
- If `frontend/dist/index.html` exists, the backend serves the React app automatically.
