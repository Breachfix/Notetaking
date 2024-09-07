'use strict';

// Attach an event listener to multiple elements
const addEventOnElements = function ($elements, eventType, callback) {
  $elements.forEach($element => $element.addEventListener(eventType, callback));
}

// Generate greeting based on the current hour
const getGreetingMsg = function (currentHour) {
  const greeting = 
    currentHour < 5 ? 'Night' :
    currentHour < 12 ? 'Morning' : 
    currentHour < 15 ? 'Noon' :
    currentHour < 17 ? 'Afternoon' : 
    currentHour < 20 ? 'Evening' :
    'Night';
  
  return `Good ${greeting}`;
}

let $lastActiveNavItem;

// Activate a notebook in the navigation
const activeNotebook = function () {
  $lastActiveNavItem?.classList.remove('active');
  this.classList.add('active');
  $lastActiveNavItem = this;
}

// Make a DOM element editable
const makeElemEditable = function ($element) {
  $element.setAttribute('contenteditable', true);
  $element.focus();
}

// Generate a unique ID
const generateID = function () {
  return new Date().getTime().toString();
}

// Find a notebook by ID in the database
const findNotebook = function (guestDB, notebookId) {
  return guestDB.notebooks.find(notebook => notebook.id === notebookId);
}

// Find the index of a notebook by ID
const findNotebookIndex = function (guestDB, notebookId) {
  return guestDB.notebooks.findIndex(item => item.id === notebookId);
}

// Convert timestamp to relative time
const getRelativeTime = function (milliseconds) {
  const currentTime = new Date().getTime();
  const minute = Math.floor((currentTime - milliseconds) / 1000 / 60);
  const hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);

  return minute < 1 ? 'Just now' : 
         minute < 60 ? `${minute} min ago` : 
         hour < 24 ? `${hour} hour ago` : `${day} day ago`;
}

// Find a specific note by ID
const findNote = (guestDB, noteId) => {
  let note;
  for (const notebook of guestDB.notebooks) {
    note = notebook.notes.find(note => note.id === noteId);
    if (note) break;
  }
  return note;
}

// Find the index of a note by ID
const findNoteIndex = function (notebook, noteId) {
  return notebook.notes.findIndex(note => note.id === noteId);
}

export {
  addEventOnElements,
  getGreetingMsg,
  activeNotebook,
  makeElemEditable,
  generateID,
  findNotebook,
  findNotebookIndex,
  getRelativeTime,
  findNote,
  findNoteIndex
}
