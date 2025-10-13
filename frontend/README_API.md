Frontend API setup

This frontend expects the backend API to be available. By default it uses http://localhost:5000/api.

You can override the base URL by setting VITE_API_BASE in your environment or in an .env file at the frontend root:

VITE_API_BASE=http://localhost:5000/api

Run the frontend (from the `prismaflow-dash` folder):

# install deps
npm install

# dev server
npm run dev

Run the backend (from the `backend` folder):

npm install
npm run start

Notes:
- The AuthProvider stores the JWT token under `authToken` in localStorage.
- Use the demo accounts shown on the login page (admin@example.com / password123).
