# Notes & Notebooks API + Frontend

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Auth Routes](#auth-routes)
  - [Note Routes](#note-routes)
  - [Notebook Routes](#notebook-routes)
- [Frontend](#frontend)
  - [Project Structure](#project-structure)
  - [Core Functionalities](#core-functionalities)
  - [UI Components](#ui-components)
- [Example Requests](#example-requests)
  - [Auth Examples](#auth-examples)
  - [Note Examples](#note-examples)
  - [Notebook Examples](#notebook-examples)
- [Developer](#developer)
- [License](#license)

## Overview

The **Notes & Notebooks API** combined with a **Frontend** application provides a complete solution for managing notebooks and notes. The backend is powered by **MongoDB**, **Node.js**, and **JWT** for authentication. The frontend is designed for a smooth, interactive user experience using modern web development techniques.

---

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo-url.git
   cd your-repo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:4000` and the frontend can be accessed using **Live Server** or your preferred local server.

---

## ⚙️ Environment Variables

Create a `.env` file at the root directory with the following environment variables:

```plaintext
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
SENDGRID_API_KEY=your_sendgrid_api_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

---

## 🗄️ Database Configuration

The API uses **MongoDB**. You can either run MongoDB locally or use **MongoDB Atlas**. Set up your `MONGO_URI` in the `.env` file accordingly.

---

## 🔒 Authentication

The API uses **JWT** for token-based authentication and **Passport.js** for session management. Users must authenticate to access the API and manage notebooks and notes.

---

## 📋 Endpoints

### 🔑 Auth Routes

| Method | Route                             | Description                                |
|--------|------------------------------------|--------------------------------------------|
| `POST` | `/api/v1/auth/signup`              | Register a new user.                       |
| `POST` | `/api/v1/auth/login`               | Login and receive a token.                 |
| `POST` | `/api/v1/auth/logout`              | Logout the user.                           |
| `POST` | `/api/v1/auth/forgot-password`     | Request a password reset link.             |
| `PUT`  | `/api/v1/auth/reset-password/:token` | Reset a password using a token.           |
| `POST` | `/api/v1/auth/verify-token`        | Verify the validity of a token.            |

### 🗒️ Note Routes

| Method | Route                           | Description                                |
|--------|----------------------------------|--------------------------------------------|
| `POST` | `/api/v1/notes`                 | Create a new note.                         |
| `GET`  | `/api/v1/notes`                 | Get all notes for the logged-in user.      |
| `GET`  | `/api/v1/notes/:id`             | Get a specific note by its ID.             |
| `PUT`  | `/api/v1/notes/:id`             | Update a note by its ID.                   |
| `DELETE`| `/api/v1/notes/:id`            | Delete a note by its ID.                   |

### 📚 Notebook Routes

| Method | Route                                   | Description                                   |
|--------|-----------------------------------------|-----------------------------------------------|
| `GET`  | `/api/v1/notebooks`                     | Get all notebooks for the logged-in user.     |
| `POST` | `/api/v1/notebooks`                     | Create a new notebook.                        |
| `PUT`  | `/api/v1/notebooks/:notebookId`         | Update a notebook by its ID.                  |
| `DELETE`| `/api/v1/notebooks/:notebookId`        | Delete a notebook and its associated notes.   |
| `GET`  | `/api/v1/notebooks/:notebookId/notes`   | Get all notes within a specific notebook.     |

---

## 📓 Frontend - Note Taking App

The frontend provides a clean and interactive interface for managing notebooks and notes. It leverages modern JavaScript for dynamic and responsive behavior.

---

### 🗂️ Project Structure

```bash
├── css/                    # Stylesheets
├── js/                     # JavaScript files
│   ├── components/         # UI components (Tooltip, Modal, etc.)
│   ├── guests/             # Guest mode utilities (client, database, modal, etc.)
│   ├── utils.js            # Utility functions (e.g., event listeners, formatting)
│   ├── client.js           # Client-side interactions for notes and notebooks
│   ├── db.js               # Guest mode database functions
│   ├── main.js             # Main logic
│   └── app.js              # App initialization and event listeners
├── index.html              # Landing page
├── dashboard.html          # Dashboard view
└── readme.md               # This file
```

---

## 🔧 Core Functionalities

1. **Notebook Management**:
   - Create, edit, and delete notebooks from the sidebar.
   - Inline editing of notebook names.

2. **Note Management**:
   - Create, edit, and delete notes.
   - Modal popup for note creation and editing.

3. **Dynamic Greeting & Time**:
   - Displays greeting messages based on the time of day.
   - Converts timestamps into a human-readable format (e.g., "5 minutes ago").

---

## 🎨 UI Components

### **NavItem** - For Notebook Navigation
- Displays notebooks in the sidebar with edit and delete options.

### **Card** - For Notes
- Displays notes as cards with title, content, and relative time.

### **Modal** - For Note Creation/Editing
- Provides a modal for adding or editing notes with validation.

---

## 🔥 Example Requests

### 🔑 Auth Examples

1. **Signup**:
   ```bash
   POST /api/v1/auth/signup
   Content-Type: application/json

   {
     "username": "johnDoe",
     "email": "johndoe@example.com",
     "password": "password123"
   }
   ```

2. **Login**:
   ```bash
   POST /api/v1/auth/login
   Content-Type: application/json

   {
     "email": "johndoe@example.com",
     "password": "password123"
   }
   ```

### 🗒️ Note Examples

1. **Create Note**:
   ```bash
   POST /api/v1/notes
   Content-Type: application/json
   Authorization: Bearer <token>

   {
     "title": "My First Note",
     "content": "This is the content of the note.",
     "notebookId": "<notebookId>"
   }
   ```

---

## ✨ Developer

Developed with ❤️ by **Jack Ntihaniraho**. Feel free to explore, contribute, and provide feedback!

---

## License

This project is licensed under the **MIT License**.

---

## 🛠️ Required Dependencies

Make sure you have the following installed to run the project:

```json
{
  "name": "notetaking",
  "version": "1.0.0",
  "description": "",
  "main": "backend/server.js",
  "scripts": {
    "dev": "nodemon backend/server.js",
    "start": "live-server frontend/",
    "run": "node backend/models/updateNotes.js"
  },
  "keywords": [],
  "author": "",
  "type": "module",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.7.5",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "ejs": "^3.1.10",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "mongoose": "^8.6.1",
    "nodemailer": "^6.9.15",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

---

🌟 **Happy Coding!** 🌟
