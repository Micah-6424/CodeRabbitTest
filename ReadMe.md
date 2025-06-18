# Simple Chatroom

A simple chatroom app using Vue.js (frontend) and Express (backend). Messages are stored in a CSV file on the backend—no database required.

## Setup

### 1. Backend
```
cd backend
npm install
node server.js
```

### 2. Frontend
```
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173 and the backend on http://localhost:3001 by default.

Messages are saved in `backend/messages.csv` automatically as users chat.
```@todo```
