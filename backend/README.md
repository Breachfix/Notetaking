# 📝 Notes & Notebooks API

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
- [Example Requests](#example-requests)
  - [Auth Examples](#auth-examples)
  - [Note Examples](#note-examples)
  - [Notebook Examples](#notebook-examples)
- [Conclusion](#conclusion)
- [Developer](#developer)

## Overview

The **Notes & Notebooks API** is designed to help users manage their notes and notebooks with ease. This API uses **MongoDB** for the backend, and **JWT** for authentication, ensuring a secure and scalable note-taking system.

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

The server will run on `http://localhost:4000` by default.

## ⚙️ Environment Variables

Create a `.env` file at the root directory of your project with the following environment variables:

```plaintext
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
SENDGRID_API_KEY=your_sendgrid_api_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## 🗄️ Database Configuration

This API uses **MongoDB**. You can set it up using either a local instance or **MongoDB Atlas** (cloud-based). Update the `MONGO_URI` in your `.env` file with your connection string.

---

## 🔒 Authentication

The API uses **JWT** for authentication and **Passport.js** for handling user sessions.

- **Token-based authentication** is used for the API.
- Users must be authenticated to access protected routes (notes and notebooks).
- Features include signup, login, and password recovery.

---

## 📋 Endpoints

### 🔑 Auth Routes

| HTTP Method | Route                             | Description                                |
|-------------|------------------------------------|--------------------------------------------|
| `POST`      | `/api/v1/auth/signup`              | Register a new user.                       |
| `POST`      | `/api/v1/auth/login`               | Login and get a token.                     |
| `POST`      | `/api/v1/auth/logout`              | Logout the user.                           |
| `POST`      | `/api/v1/auth/forgot-password`     | Request a password reset link.             |
| `PUT`       | `/api/v1/auth/reset-password/:token` | Reset the user's password with a token. |
| `POST`      | `/api/v1/auth/verify-token`        | Verify if the provided token is valid.     |

### 🗒️ Note Routes

| HTTP Method | Route                           | Description                                |
|-------------|----------------------------------|--------------------------------------------|
| `POST`      | `/api/v1/notes`                 | Create a new note.                         |
| `GET`       | `/api/v1/notes`                 | Retrieve all notes of the logged-in user.  |
| `GET`       | `/api/v1/notes/:id`             | Get a specific note by its ID.             |
| `PUT`       | `/api/v1/notes/:id`             | Update a note by its ID.                   |
| `DELETE`    | `/api/v1/notes/:id`             | Delete a note by its ID.                   |
| `GET`       | `/api/v1/notes/note/:noteTitle` | Get a note by its title.                   |

### 📚 Notebook Routes

| HTTP Method | Route                                   | Description                                   |
|-------------|-----------------------------------------|-----------------------------------------------|
| `GET`       | `/api/v1/notebooks`                     | Retrieve all notebooks of the logged-in user. |
| `POST`      | `/api/v1/notebooks`                     | Create a new notebook.                        |
| `PUT`       | `/api/v1/notebooks/:notebookId`         | Update a notebook by its ID.                  |
| `DELETE`    | `/api/v1/notebooks/:notebookId`         | Delete a notebook and its associated notes.   |
| `GET`       | `/api/v1/notebooks/:notebookId/notes`   | Get all notes in a specific notebook.         |
| `POST`      | `/api/v1/notebooks/:notebookId/notes`   | Add a new note to a specific notebook.        |
| `PUT`       | `/api/v1/notebooks/:notebookId/notes/:noteId` | Update a note in a specific notebook.  |
| `DELETE`    | `/api/v1/notebooks/:notebookId/notes/:noteId` | Delete a note from a notebook.         |

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

---

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

2. **Get All Notes**:
   ```bash
   GET /api/v1/notes
   Authorization: Bearer <token>
   ```

3. **Update Note**:
   ```bash
   PUT /api/v1/notes/:id
   Content-Type: application/json
   Authorization: Bearer <token>

   {
     "title": "Updated Note Title",
     "content": "Updated note content."
   }
   ```

4. **Delete Note**:
   ```bash
   DELETE /api/v1/notes/:id
   Authorization: Bearer <token>
   ```

---

### 📚 Notebook Examples

1. **Create Notebook**:
   ```bash
   POST /api/v1/notebooks
   Content-Type: application/json
   Authorization: Bearer <token>

   {
     "name": "My First Notebook"
   }
   ```

2. **Get All Notebooks**:
   ```bash
   GET /api/v1/notebooks
   Authorization: Bearer <token>
   ```

3. **Get Notes in a Notebook**:
   ```bash
   GET /api/v1/notebooks/:notebookId/notes
   Authorization: Bearer <token>
   ```

4. **Update Notebook**:
   ```bash
   PUT /api/v1/notebooks/:notebookId
   Content-Type: application/json
   Authorization: Bearer <token>

   {
     "name": "Updated Notebook Name"
   }
   ```

---

## ✨ Developer

Developed with ❤️ by **Jack Ntihaniraho**. This API is designed to be simple, scalable, and secure for managing notes and notebooks. Feel free to contribute, report bugs, or reach out for any queries!

---

🌟 **Happy Coding!** 🌟

---

### 📜 License

This project is licensed under the **MIT License**.

---

### 📬 Contact

- **Email**: jack@breachfix.com
- **GitHub**: [Jack Ntihaniraho](https://github.com/Breachfix)

