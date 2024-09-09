
---

# Notes & Notebooks API + Frontend

## Table of Contents
- [Overview](#overview)
- [Important Notes for Running Locally](#important-notes-for-running-locally)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Auth Routes](#auth-routes)
  - [Note Routes](#note-routes)
  - [Notebook Routes](#notebook-routes)
  - [Password Reset Routes](#password-reset-routes)
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

The **Notes & Notebooks API** combined with a **Frontend** application provides a complete solution for managing notebooks and notes. The backend uses **MongoDB**, **Node.js**, and **JWT** for authentication. The frontend delivers a modern and interactive user experience.

---

## Important Notes for Running Locally

To run the project locally, follow these important steps:

### 1. Create a `.env` File

The project relies on environment variables, so you need to create a `.env` file in the root directory. This file is not included in the repository for security reasons. Here’s the content you should add to the `.env` file:

```plaintext
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
SESSION_SECRET=your_session_secret
API_BASE_URL=http://localhost:4000/api/v1
```

Make sure to replace `your_mongodb_connection_string`, `your_jwt_secret`, and `your_session_secret` with the actual values you want to use.

### 2. Install Required Dependencies

Next, you need to install the necessary dependencies. Run the following commands in your terminal:

```bash
npm install
npm install -g live-server
npm install @sendgrid/mail
```

These commands will install all the required modules for running the project locally.

### 3. Port Configuration and Frontend-Backend Integration

#### Check and Update the Port Number

The backend is configured to run on port `4000` by default. If you need to change this (for example, if another service is using port `4000`), you can update the port number in the `.env` file. Then, restart the server using:

```bash
npm run dev
```

#### Updating Frontend API Base URLs

If you change the port number in the `.env` file, you also need to update the frontend to use the correct API URL. Specifically, change the `API_BASE` variable in the `auth.js`, `db.js` and `dashboard.js` files. It should look something like this:

```js
const API_BASE = 'http://localhost:YOUR_NEW_PORT/api/v1';
```

Make sure to replace `YOUR_NEW_PORT` with the port you’ve set in the `.env` file.

#### Ensure Consistency in the `.env` File

Make sure the `API_BASE_URL` in your `.env` file matches the port number you’ve set. For example:

```plaintext
API_BASE_URL=http://localhost:4000/api/v1
```

If you change the port to something else, update this value to match.

---

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Breachfix/Notetaking.git
   ```

2. **Install dependencies**:
   Run the following commands to install all required dependencies:

   ```bash
   npm install
   npm install -g live-server
   npm install @sendgrid/mail
   ```

3. **Start the backend server**:
   To run the backend, use the command:

   ```bash
   npm run dev
   ```

   This will start the backend server on `http://localhost:4000`.

4. **Start the frontend**:
   To run the frontend, use:

   ```bash
   npm run start
   ```

   This will launch the frontend using **Live Server** or another local server of your choice.

---

## ⚙️ Environment Variables

The application relies on a number of environment variables. You’ll need to create a `.env` file in the root directory with the following values:

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

This API uses **MongoDB** for data storage. You can either set up **MongoDB** locally or use a hosted service like **MongoDB Atlas**. Ensure that you configure the `MONGO_URI` value in the `.env` file correctly.

---

## 🔒 Authentication

The project uses **JWT** for authentication and **Passport.js** for session management. Users need to authenticate (sign up or log in) to use the API for managing notes and notebooks.

---

## 📋 Endpoints

### 🔑 Auth Routes

| Method | Route                             | Description                                |
|--------|------------------------------------|--------------------------------------------|
| `POST` | `/api/v1/auth/signup`              | Register a new user.                       |
| `POST` | `/api/v1/auth/login`               | Log in and receive a token.                |
| `POST` | `/api/v1/auth/logout`              | Log out the user.                          |
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

### 🔑 Password Reset Routes

| Method | Route                         | Description                              |
|--------|-------------------------------|------------------------------------------|
| `POST` | `/api/v1/auth/forgot-password` | Send OTP for password reset via email.   |
| `POST` | `/api/v1/auth/verify-otp`      | Verify the OTP code for password reset.  |
| `PUT`  | `/api/v1/auth/reset-password`  | Reset password after OTP verification.   |
---

## 📓 Frontend - Note Taking App

The frontend provides a clean, modern interface for managing notebooks and notes. It’s built with dynamic JavaScript and uses a responsive design.

---

### 🗂️ Project Structure

Here’s how the project is structured:

```bash
├── css/                    # Stylesheets
├── js/                     # JavaScript files
│   ├── components/         # UI components (Tooltip, Modal, etc.)
│   ├── guests/             # Guest mode utilities (client, database, modal, etc.)
|   ├── PasswordReset/
│   │   ├── otp.js
│   │   ├── reset.js
│   │   └── recovered.js
│   ├── utils.js            # Utility functions
│   ├── client.js           # Client-side interactions for notes and notebooks
│   ├── db.js               # Guest mode database functions
│   ├── main.js             # Main logic
│   └── app.js              # App initialization
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
   - Use modals for creating and editing notes.

3. **Dynamic Greeting & Time**:
   - Display greeting messages based on the time of day.
   - Convert timestamps into a human-readable format, e.g., "5 minutes ago."

---

## 🎨 UI Components

- **NavItem**: Displays notebooks in the sidebar with edit and delete options.
- **Card**: Displays notes as cards with a title, content, and relative time.
- **Modal**: Modal popups for adding or editing notes with validation.

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

### 🔑 Password Reset Examples

#### Forgot Password:
```js
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "johndoe@example.com"
} 
```

#### Verify OTP:
```js
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "email": "johndoe@example.com",
  "otp": "123456"
}
```

#### Reset Password:
```js
PUT /api/v1/auth/reset-password
Content-Type: application/json

{
  
  "newPassword": "newPassword123"
}
```

---

## ✨ Developer

Developed with ❤️ by **Jack Ntihaniraho**. Feel free to explore, contribute, and provide feedback!

---

## License

This project is licensed under the **MIT License**.

---

🌟 **Happy Coding!** 🌟

---
