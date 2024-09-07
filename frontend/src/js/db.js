'use strict';

import { generateID } from "./utils.js";

// Find a notebook by ID from local storage
export const findNotebook = (db, notebookId) => {
  return db.notebooks.find(notebook => notebook.id === notebookId);
};

// Find a note within a notebook by ID
export const findNote = (notebook, noteId) => {
  if (!notebook || !Array.isArray(notebook.notes)) {
    console.error("Notebook or notes array is undefined.");
    return null;
  }
  return notebook.notes.find(note => note._id === noteId || note.id === noteId);
};

// Find a note index within a notebook
export const findNoteIndex = (notebook, noteId) => {
  if (!notebook || !Array.isArray(notebook.notes)) {
    console.error("Notebook or notes array is undefined.");
    return -1;
  }
  return notebook.notes.findIndex(note => note._id === noteId);
};

// Initialize the database
let notekeeperDB = {};

// Initialize database from server
const initDB = async function () {
  try {
    const response = await fetch('http://localhost:4000/api/v1/notebooks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    notekeeperDB.notebooks = data.notebooks || [];
    console.log('Fetched notebooks from server:', notekeeperDB.notebooks);
  } catch (error) {
    console.error('Error fetching data from server:', error);
  }
};

const dbInitPromise = initDB();

const writeDB = function () {
  console.log('Authenticated user; database changes are synced with the server.');
};

// Main `db` object that contains functions to handle notebooks and notes
export const db = {
  get: {
    // Fetch notebooks
    notebook() {
      return fetch('http://localhost:4000/api/v1/notebooks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => data.notebooks || [])
        .catch(error => {
          console.error('Error fetching notebooks from server:', error);
          return [];
        });
    },
    // Fetch notes in a notebook
    note(notebookId) {
      return fetch(`http://localhost:4000/api/v1/notebooks/${notebookId}/notes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => data.notes || [])
        .catch(error => {
          console.error(`Error fetching notes for notebook ID "${notebookId}":`, error);
          return [];
        });
    }
  },
  post: {
    // Create a new notebook
    notebook(name) {
      return fetch('http://localhost:4000/api/v1/notebooks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
        .then(response => response.json())
        .then(data => data.notebook || null)
        .catch(error => {
          console.error('Error creating notebook on server:', error);
          return null;
        });
    },
    // Create a new note in a notebook
    note(notebookId, object) {
      return fetch(`http://localhost:4000/api/v1/notebooks/${notebookId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notebookId, ...object }),
      })
        .then(response => response.json())
        .then(data => data.note)
        .catch(error => {
          console.error('Error creating note on server:', error);
          return null;
        });
    }
  },
  put: {
    // Update a note in a notebook
    note(notebookId, noteId, updatedNoteData) {
      return fetch(`http://localhost:4000/api/v1/notebooks/${notebookId}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNoteData),
      })
        .then(response => response.json())
        .then(data => data.note)
        .catch(error => {
          console.error('Error updating note on server:', error);
          return null;
        });
    }
  },
  getSingle: {
    // Fetch a single note by its ID
    note(notebookId, noteId) {
      return fetch(`http://localhost:4000/api/v1/notebooks/${notebookId}/notes/${noteId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => data.note)
        .catch(error => {
          console.error(`Error fetching note with ID "${noteId}":`, error);
          return null;
        });
    }
  },
  delete: {
    // Delete a note by its ID
    note(notebookId, noteId) {
      return fetch(`http://localhost:4000/api/v1/notebooks/${notebookId}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            console.log(`Note with ID "${noteId}" deleted successfully from the server.`);
            return true;
          }
          throw new Error(`Failed to delete note with ID "${noteId}" on server.`);
        })
        .catch(error => {
          console.error('Error deleting note on server:', error);
          return false;
        });
    }
  }
};

export { dbInitPromise };
