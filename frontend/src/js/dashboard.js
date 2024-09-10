import {
  addEventOnElements,
  getGreetingMsg,
  activeNotebook,
  makeElemEditable,
  updateNoteById
  
} from "./utils.js";
import { Tooltip } from "./components/Tooltip.js";
import { Card } from './components/Card.js';
import { client } from "./client.js";
import { NoteModal } from "./components/Modal.js";
import { db, dbInitPromise } from './db.js';

document.addEventListener('DOMContentLoaded', async function () {
  const API_BASE = 'http://localhost:4000/api/v1';
  const token = localStorage.getItem('jwt-token');
  const DEFAULT_SHARED_NOTEBOOK_ID = 'shared';

  const sidebarList = document.querySelector('[data-sidebar-list]');
  const notePanel = document.querySelector('[data-note-panel]');
  const notePanelTitle = document.querySelector('[data-note-panel-title]');
  const createNoteBtn = document.querySelectorAll('[data-note-create-btn]');
  const addNotebookBtn = document.querySelector('[data-add-notebook]');
  const greeting = document.querySelector('[data-greeting]');
  const currentDateElem = document.querySelector('[data-current-date]');
  const $sidebar = document.querySelector('[data-sidebar]');
  const $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
  const $overlay = document.querySelector('[data-sidebar-overlay]');
  const logoutBtn = document.querySelector('[data-logout-btn]'); 
  const DEFAULT_NOTEBOOK_ID = '64f8ca5ff1bdfb6a4c8b4567'; 
  const allNotesBtn = document.querySelector('[data-all-notes-btn]');
  const emptyNotesTemplate = `
<div class="empty-notes">
  <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>

  <div class="text-headline-small">No notes</div>
</div>
`;
if (allNotesBtn) {
  allNotesBtn.addEventListener('click', () => {
    fetchAllNotes();
  });
}
  

  // Toggle sidebar
  addEventOnElements($sidebarTogglers, 'click', function () {
    $sidebar.classList.toggle('active');
    $overlay.classList.toggle('active');
  });

  let activeNotebookId = null;

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      // Remove the token and other user data from localStorage
      localStorage.removeItem('jwt-token');
      localStorage.removeItem('username');
      
      // Redirect to the login page
      window.location.href = 'login.html';
    });
  }

  await dbInitPromise;

  // Verify token
  async function verifyToken() {
    try {
      const response = await fetch(`${API_BASE}/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Token verification failed: ${response.status} ${response.statusText}. Response: ${await response.text()}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      loadDashboard();
      
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('jwt-token');
      localStorage.removeItem('username');
      window.location.href = 'login.html';
    }
  }

  function loadDashboard() {
    displayGreeting();
    displayCurrentDate();
    fetchNotebooks();
   
  }

  // Fetch notebooks
  async function fetchNotebooks() {
    try {
      const response = await fetch(`${API_BASE}/notebooks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notebooks');
      }

      const data = await response.json();
      renderNotebooks(data.notebooks); // After fetching, render the notebooks
    } catch (error) {
      console.error('Error fetching notebooks:', error);
    }
  }
  async function fetchNotesInNotebook(notebookId) {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/notebooks/${notebookId}/notes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.success) {
        throw new Error('Failed to fetch notes.');
      }
  
      console.log('Fetched notes:', data.notes);
      
      // Ensure that data.notes is always an array
      return Array.isArray(data.notes) ? data.notes : [];
  
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }
  
  
// Function to render notes on the UI
// Function to render notes on the UI
// function renderNotes(notes = [], isAllNotes = false) {
//   // Ensure notes is an array before proceeding
//   if (!Array.isArray(notes)) {
//     console.error('Error: Notes is not an array', notes);
//     return;
//   }

//   notePanel.innerHTML = emptyNotesTemplate; // Clear the note panel before rendering

//   if (notes.length > 0) {
//     notes.forEach(note => {
//       const noteItem = Card(note, isAllNotes ? null : note.notebookId); // If it's "All Notes," don't pass notebookId

//       if (noteItem) {
//         // Enable delete and edit for all notes, whether viewing "All Notes" or specific notebooks
//         const deleteBtn = noteItem.querySelector('[data-delete-btn]');
//         if (deleteBtn) {
//           deleteBtn.addEventListener('click', () => deleteNoteById(note._id));
//         }

//         notePanel.appendChild(noteItem); // Append the note item to the note panel
//       }
//     });
//   } else {
//     notePanel.innerHTML = '<p>No notes available.</p>'; // Show a message if there are no notes
//   }
// }
function renderNotes(notes = [], options = { isAllNotes: false, emptyMessage: 'No notes available', notebookId: null }) {
  // Ensure notes is an array before proceeding
  if (!Array.isArray(notes)) {
    console.error('Error: Notes is not an array', notes);
    return;
  }

  // Clear the note panel before rendering
  notePanel.innerHTML = " "

  // Check if there are no notes to render
  if (notes.length === 0) {
    // If there are no notes, show the empty message or template
    notePanel.innerHTML = emptyNotesTemplate
    return; // Exit early since there are no notes to render
  }

  // If there are notes, render them
  notes.forEach(note => {
    const noteItem = Card(note, options.isAllNotes ? null : (note.notebookId || options.notebookId)); // Pass notebookId unless it's "All Notes"
    
    if (noteItem) {
      const deleteBtn = noteItem.querySelector('[data-delete-btn]');
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteNoteById(note._id)); // Attach delete functionality
      }
      
      notePanel.appendChild(noteItem); // Append the note item to the note panel
    }
  });
}





  // Fetch notes for a specific notebook
  async function fetchNotes(notebookId) {
    if (!notebookId) {
      console.error('Notebook ID is required to fetch notes.');
      return [];
    }
  
    try {
      const notes = await fetchNotesInNotebook(notebookId); // Fetch notes for the given notebook
      renderNotes(notes, false); // Render notes, indicating these are not "All Notes"
  
      // Ensure createNoteBtn exists before trying to set its display property
      if (createNoteBtn && createNoteBtn.length > 0) {
        createNoteBtn.forEach(btn => btn.style.display = ''); // Show the "Add Note" button for multiple buttons
      } else if (createNoteBtn) {
        createNoteBtn.style.display = ''; // Show the "Add Note" button for a single button
      } else {
        console.error('createNoteBtn is undefined or not found.');
      }
      
      // Fetch notes from the backend
      const response = await fetch(`http://localhost:4000/api/v1/notebooks/${notebookId}/notes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.success) {
        console.error(`Failed to fetch notes for notebook ID "${notebookId}":`, data);
        return [];
      }
  
      return data.notes;
  
    } catch (error) {
      console.error(`Error fetching notes for notebook ID "${notebookId}":`, error);
      return [];
    }
  }
  


function renderNotebooks(notebooks) {
    const sidebarList = document.querySelector('[data-sidebar-list]');
    const notePanelTitle = document.querySelector('[data-note-panel-title]');
    sidebarList.innerHTML = '';
  
    notebooks.forEach(notebook => {
      const notebookItem = document.createElement('div');
      notebookItem.classList.add('nav-item');
      notebookItem.setAttribute('data-notebook', notebook._id);
  
      notebookItem.innerHTML = `
        <span class="text text-label-large" data-notebook-field>${notebook.name}</span>
        <button class="icon-btn small" data-edit-btn>
          <span class="material-symbols-rounded">edit</span>
        </button>
        <button class="icon-btn small" data-delete-btn>
          <span class="material-symbols-rounded">delete</span>
        </button>
      `;
  
      // Click event to set active notebook and fetch its notes
      notebookItem.addEventListener('click', function () {
        activeNotebookId = notebook._id;
        console.log('Active Notebook ID set to:', activeNotebookId);
        notePanelTitle.textContent = notebook.name;
        fetchNotes(activeNotebookId);
  
        // Remove "active" class from other notebooks
        const allNotebookItems = document.querySelectorAll('.nav-item');
        allNotebookItems.forEach(item => item.classList.remove('active'));
  
        // Add "active" class to the clicked notebook
        notebookItem.classList.add('active');
      });
  
      // Attach edit button event
      notebookItem.querySelector('[data-edit-btn]').addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent triggering the notebook click
        const notebookNameElem = notebookItem.querySelector('[data-notebook-field]');
        notebookNameElem.setAttribute('contenteditable', true);
        notebookNameElem.focus(); // Focus on the element to start editing
  
        notebookNameElem.addEventListener('blur', function () {
          const newName = notebookNameElem.textContent.trim();
          if (newName && newName !== notebook.name) {
            editNotebook(notebook._id, newName); // Call the editNotebook function
          }
        });
      });
  
      // Attach delete button event
      notebookItem.querySelector('[data-delete-btn]').addEventListener('click', function (event) {
        event.stopPropagation();
        if (confirm('Are you sure you want to delete this notebook?')) {
          deleteNotebook(notebook._id); // Call the deleteNotebook function
        }
      });
  
      sidebarList.appendChild(notebookItem);
    });
  }
  
  

  // Open note modal for creating or editing
// Open the modal for creating or editing a note
async function openNoteModal(note = {}) {
  const modal = NoteModal(note.title || 'Untitled', note.content || '', note.createdAt || null);
  modal.open();

  modal.onSubmit(async noteObj => {
    if (!noteObj.content || noteObj.content.trim() === '') {
      alert('Content is required to create a note.');
      return;
    }

   
    const notebookId = activeNotebookId || DEFAULT_NOTEBOOK_ID;

    if (!note._id) {
      const noteData = await createNoteInNotebook(notebookId, noteObj); // Pass activeNotebookId
      if (noteData) {
        client.note.create(noteData);
      } else {
        console.error('Error: Note creation failed.');
      }
    } else {
      const updatedNote = await updateNoteById(note._id, noteObj, notebookId);
      if (updatedNote) {
        client.note.update(note._id, updatedNote);
      } else {
        console.error('Error: Note update failed.');
      }
    }
    modal.close();
  });
}



  // Editing a notebook
  async function editNotebook(notebookId, newName) {
    try {
      const response = await fetch(`${API_BASE}/notebooks/${notebookId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName })
      });

      if (response.ok) {
        fetchNotebooks();
      } else {
        console.error('Failed to update notebook');
      }
    } catch (error) {
      console.error('Error updating notebook:', error);
    }
  }

  // Deleting a notebook
  async function deleteNotebook(notebookId) {
    try {
      const response = await fetch(`${API_BASE}/notebooks/${notebookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchNotebooks();
      } else {
        console.error('Failed to delete notebook');
      }
    } catch (error) {
      console.error('Error deleting notebook:', error);
    }
  }

// Creating a notebook and returning the created notebook ID
async function createNotebook() {
  const notebookName = prompt('Enter notebook name:');
  if (notebookName) {
    try {
      const response = await fetch(`${API_BASE}/notebooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: notebookName })
      });

      const data = await response.json();

      if (response.ok) {
        // Fetch the updated list of notebooks
        fetchNotebooks();
        
        // Return the created notebook's ID
        return data.notebook._id;
      } else {
        alert('Failed to create notebook: ' + (data.message || 'Unknown error'));
        return null;
      }
    } catch (error) {
      console.error('Error creating notebook:', error);
      return null;
    }
  }
}

  // Display greeting
  function displayGreeting() {
    const hour = new Date().getHours();
    if (greeting) {
      greeting.textContent = getGreetingMsg(hour);
    }
  }

  // Display current date
  function displayCurrentDate() {
    const today = new Date();
    if (currentDateElem) {
      currentDateElem.textContent = today.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }


// Create note in a notebook
async function createNoteInNotebook(notebookId, noteObj) {
  if (!notebookId) {
    console.error('Notebook ID is required.');
    return null;
  }

  if (!noteObj.content || noteObj.content.trim() === '') {
    alert('Content is required to create a note.');
    return null;
  }

  try {
    const response = await fetch(`http://localhost:4000/api/v1/notebooks/${notebookId}/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...noteObj,  // Destructure the rest of the note object
        notebookId  // Ensure notebookId is explicitly included here
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('Failed to create note:', data.message || 'Unknown error');
      return null;
    }

    console.log('Note created successfully:', data.note);
    return data.note;

  } catch (error) {
    console.error('Error creating note in notebook:', error.message || error);
    return null;
  }
}






  // Delete note by ID
  async function deleteNoteById(noteId) {
    if (!noteId) {
      console.error('Error: Note ID is undefined.');
      return false;
    }

    const success = await db.delete.note(activeNotebookId, noteId);
    if (success) {
      fetchNotes(activeNotebookId); // Refresh notes after deletion
    } else {
      console.error(`Error: Failed to delete note with ID: ${noteId}`);
    }
  }

   // Function to share the note
   async function fetchSharedNotes() {
    try {
      const response = await fetch(`${API_BASE}/notes/shared`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.ok && data.sharedNotes) {
        console.log('Fetched shared notes:', data.sharedNotes);
        notePanelTitle.textContent = 'Shared Notes';
        renderNotes(data.sharedNotes, { emptyMessage: 'No shared notes found' });
      } else {
        console.error('Failed to fetch shared notes:', data.message);
      }
    } catch (error) {
      console.error('Error fetching shared notes:', error);
    }
  }
  
  


  // Fetch shared notes when the page loads
  fetchSharedNotes();
 
  

  // Fetch all notes from all notebooks
  async function fetchAllNotes() {
    try {
      const response = await fetch(`${API_BASE}/notebooks/${DEFAULT_NOTEBOOK_ID}/notes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (data.success) {
        console.log('Fetched all notes from default notebook:', data.notes);
  
        // Set the title for the note panel
        notePanelTitle.textContent = 'All Notes from Default Notebook';
  
        renderNotes(data.notes, true); // Render notes from the default notebook
  
        // Hide the "Add Note" button when viewing "All Notes"
        if (createNoteBtn) {
          createNoteBtn.forEach(btn => btn.style.display = 'none');
        }
      } else {
        console.error('Failed to fetch notes from default notebook.');
      }
    } catch (error) {
      console.error('Error fetching notes from default notebook:', error);
    }
  }
  


  // Add event listeners for creating a notebook and opening the note modal
  addNotebookBtn?.addEventListener('click', createNotebook);
  addEventOnElements(createNoteBtn, 'click', () => openNoteModal());

  // Verify the token and load the dashboard
  verifyToken();
  
});



