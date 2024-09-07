'use strict';

// Import utility functions
import { generateID, findNotebook, findNotebookIndex, findNote, findNoteIndex } from "./guestUtils.js";

// DB Object to store notebooks and notes
let notekeeperDB = {};

// Initialize database, load from local storage if available
const initDB = function () {
  const db = localStorage.getItem('notekeeperDB');
  if (db) {
    notekeeperDB = JSON.parse(db);
  } else {
    notekeeperDB.notebooks = [];
    localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
  }
};

initDB();

// Read data from local storage
const readDB = function () {
  notekeeperDB = JSON.parse(localStorage.getItem('notekeeperDB'));
};

// Write data to local storage
const writeDB = function () {
  localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
};

// CRUD operations for notebooks and notes
export const guestDB = {
  post: {
    // Add a new notebook
    notebook(name) {
      readDB();
      const notebookData = {
        id: generateID(),
        name,
        notes: [],
      };
      notekeeperDB.notebooks.push(notebookData);
      writeDB();
      return notebookData;
    },

    // Add a new note to a specific notebook
    note(notebookId, object) {
      readDB();
      const notebook = findNotebook(notekeeperDB, notebookId);
      const noteData = {
        id: generateID(),
        notebookId,
        ...object,
        postedOn: new Date().getTime(),
      };
      notebook.notes.unshift(noteData);
      writeDB();
      return noteData;
    },
  },

  get: {
    // Get all notebooks
    notebook() {
      readDB();
      return notekeeperDB.notebooks;
    },

    // Get all notes in a specific notebook
    note(notebookId) {
      readDB();
      const notebook = findNotebook(notekeeperDB, notebookId);
      return notebook ? notebook.notes : [];
    },
  },

  update: {
    // Update a notebook's name
    notebook(notebookId, name) {
      readDB();
      const notebook = findNotebook(notekeeperDB, notebookId);
      notebook.name = name;
      writeDB();
      return notebook;
    },

    // Update a note's content
    note(noteId, object) {
      readDB();
      const oldNote = findNote(notekeeperDB, noteId);
      const newNote = Object.assign(oldNote, object);
      writeDB();
      return newNote;
    },
  },

  delete: {
    // Delete a notebook
    notebook(notebookId) {
      readDB();
      const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
      notekeeperDB.notebooks.splice(notebookIndex, 1);
      writeDB();
    },

    // Delete a note from a notebook
    note(notebookId, noteId) {
      readDB();
      const notebook = findNotebook(notekeeperDB, notebookId);
      const noteIndex = findNoteIndex(notebook, noteId);
      notebook.notes.splice(noteIndex, 1);
      writeDB();
      return notebook.notes;
    },
  },
};
