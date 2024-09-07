# 📓 Frontend - Note Taking App

Welcome to the **Frontend** of the Note Taking App. This README will guide you through the setup, structure, and functionality of the frontend portion of the project. The app provides a smooth and interactive interface for managing notebooks and notes. Let's dive in! 🚀

---

## 🗂️ Project Structure

The frontend of this project consists of several key components that work together to provide a seamless experience. Here's an overview of the structure:

```bash
├── css/                    # Contains all the stylesheets
├── js/                     # Contains all JavaScript files
│   ├── components/         # Reusable UI components like Tooltip, Modal, etc.
│   ├── guests/             # Guest mode utilities like client, database, modal, etc.
│   ├── utils.js            # Utility functions like addEventOnElements, getRelativeTime, etc.
│   ├── client.js           # Client-side interactions with the UI for notes and notebooks
│   ├── db.js               # Database interaction functions (mock DB for guests)
│   ├── main.js             # Main logic that ties everything together
│   └── app.js              # Initialization of the app and event listeners
├── index.html              # Main HTML file
├── dashboard.html          # Dashboard view after login
└── readme.md               # You're reading this now!
```

---

## 🎨 UI Components

This app is built using various reusable UI components that make development modular and easier to maintain. Below is a quick glance at the major components:

### 1. **NavItem** - For Notebook Navigation

The **NavItem** component renders a notebook as a navigation item with options to edit, delete, and select it to display its notes.

**Key Features:**
- Activate notebook on click.
- Inline editing of notebook name.
- Delete functionality with confirmation modal.

### 2. **Card** - For Notes

The **Card** component displays individual notes with options to edit, delete, and view the note. The note's title, content, and relative timestamp are dynamically updated.

**Key Features:**
- Edit and save notes directly from the card.
- Delete note with confirmation.
- Dynamic timestamp that updates as time passes.

### 3. **Modal** - For Creating/Editing Notes

The **NoteModal** component allows the creation and editing of notes in a modal window, providing a clean, distraction-free environment for note-taking.

**Key Features:**
- Input fields for title and content.
- Save button activates only when content is provided.
- Works for both creating and editing notes.

---

## 🚀 Setup & Installation

Follow these steps to get the frontend running on your local machine.

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/notetaking-app.git
```

### 2. **Navigate to the Frontend Directory**

```bash
cd notetaking-app/frontend
```

### 3. **Install Dependencies**

Although this is a frontend project, make sure you have installed any necessary dependencies for live-server (if using).

```bash
npm install
```

### 4. **Start the Frontend Server**

You can run the app using any local development server. If you’re using **Live Server** for VSCode:

1. Right-click `index.html` and select **Open with Live Server**.

Or use any static server tool you prefer.

### 5. **Access the App**

Once the server is up, open your browser and go to:

```bash
http://localhost:5500  # or your configured port
```

---

## 🔧 Core Functionalities

Here’s a breakdown of some important features and how they function.

### 1. **Sidebar Navigation (Notebooks)**

The sidebar shows a list of notebooks. You can:
- **Create a Notebook**: Clicking the "+" button in the sidebar opens a field to name the new notebook. Once saved, it appears in the sidebar.
- **Edit a Notebook**: Hovering over a notebook displays an edit button that allows inline renaming.
- **Delete a Notebook**: Clicking the trash icon opens a confirmation modal to confirm deletion.

### 2. **Note Management**

Within each notebook, you can manage notes easily:
- **Create a Note**: Click the "Create Note" button to open the note modal. Once the note is saved, it appears in the notebook.
- **Edit a Note**: Clicking on a note opens the modal where you can edit its content.
- **Delete a Note**: Click the trash icon on the note card to delete it. A confirmation modal ensures you don't delete notes accidentally.

### 3. **Tooltips**

Hovering over icons such as the edit and delete buttons shows a tooltip explaining the action.

### 4. **Dynamic Greeting Message**

Based on the time of day, the app greets the user with a relevant message like "Good Morning" or "Good Evening".

---

## ⚙️ Utility Functions

Several utility functions power the app and provide seamless interactions:

- **addEventOnElements**: A helper function to easily attach event listeners to multiple elements.
- **getRelativeTime**: Converts a timestamp into a human-readable format like "5 minutes ago" or "2 days ago".
- **activeNotebook**: Handles the logic to mark the currently active notebook in the sidebar.
- **makeElemEditable**: Allows inline editing of elements by toggling the `contenteditable` attribute.

---

## 🖼️ Screenshots

### **1. Dashboard View**

![Dashboard](https://via.placeholder.com/800x400.png?text=Dashboard+Screenshot)

### **2. Note Modal**

![Note Modal](https://via.placeholder.com/800x400.png?text=Note+Modal+Screenshot)

---

## 🛠️ Future Improvements

- **Search Feature**: A global search across notebooks and notes.
- **Rich Text Editor**: Enhance the note-taking experience with more formatting options.
- **Collaborative Notes**: Share notebooks with others for collaboration in real-time.

---

## 📝 Conclusion

The frontend of the Note Taking App provides a user-friendly interface for managing notebooks and notes. With modular components, clear utilities, and a responsive design, it makes note-taking an enjoyable experience.

Feel free to explore and contribute!

🌟 **Happy Coding!** 🌟

---

### Contributors

- **Your Name** - Developer

### License

This project is licensed under the MIT License.

---

### Links

- [Live Demo](#) (if hosted)
- [Backend Repo](#) (if separate repo for backend)