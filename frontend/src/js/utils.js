

'use strict';


/**
 * Attaches an event listener to a collection of DOM elements.
 *
 * @param {Array<HTMLElement>} $elements - An array of DOM elements to attach the event listener to.
 * @param {string} eventType - The type of event to listen for (e.g., 'click', 'mouseover').
 * @param {Function} callback - The function to be executed when the event occurs.
 */

const addEventOnElements = function ($elements, eventType, callback) {
  $elements.forEach($element => $element.addEventListener(eventType, callback));
}


/**
 * Generates a greeting message based on the current hour of the day.
 *
 * @param {number} currentHour - The current hour (0-23) to determine the appropriate greeting.
 * @returns {string} A greeting message with a salutation corresponding to the time of day.
 */
const getGreetingMsg = function (currentHour) {
  let greeting = '';

  if (currentHour < 5) {
    greeting = 'Night';
  } else if (currentHour < 12) {
    greeting = 'Morning';
  } else if (currentHour < 15) {
    greeting = 'Noon';
  } else if (currentHour < 17) {
    greeting = 'Afternoon';
  } else if (currentHour < 20) {
    greeting = 'Evening';
  } else {
    greeting = 'Night';
  }

  return `Good ${greeting}`;
}



let /** {HTMLElement | undefined} */ $lastActiveNavItem;

/**
 * Activates a navigation item by adding the 'active' class and deactivates the previously active item.
 */
const activeNotebook = function () {
  $lastActiveNavItem?.classList.remove('active');
  this.classList.add('active'); // this: $navItem
  $lastActiveNavItem = this; // this: $navItem
}


/**
 * Makes a DOM element editable by setting the 'contenteditable' attribute to true and focusing on it.
 *
 * @param {HTMLElement} $element - The DOM element to make editable.
 */
const makeElemEditable = function ($element) {
  $element.setAttribute('contenteditable', true);
  $element.focus();
}


/**
 * Generates a unique ID based on the current timestamp.
 *
 * @returns {string} A string representation of the current timestamp.
 */
const generateID = function () {
  return new Date().getTime().toString();
}



/**
 * Finds a notebook in database by its ID.
 *
 * @param {Object} db - The database containing the notebooks.
 * @param {string} notebookId - The ID of the notebook to find.
 * @returns {Object | undefined} The found notebook object, or undefined if not found.
 */
const findNotebook = function (db, notebookId) {
  return db.notebooks.find(notebook => notebook.id === notebookId);
}


/**
 * Finds the index of a notebook in an array of notebooks based on its ID.
 *
 * @param {Object} db - The object containing an array of notebooks.
 * @param {string} notebookId - The ID of the notebook to find.
 * @returns {number} The index of the found notebook, or -1 if not found.
 */
const findNotebookIndex = function (db, notebookId) {
  return db.notebooks.findIndex(item => item.id === notebookId);
}


/**
 * Converts a timestamp in milliseconds to a human-readable relative time string.
 *
 * @param {number} millisecond - The timestamp in milliseconds to convert.
 * @returns {string} A string representing the relative time (e.g., "Just now," "5 min ago," "3 hours ago," "2 days ago").
 */
const getRelativeTime = function (milliseconds) {
  const currentTime = new Date().getTime();
  const differenceInMilliseconds = currentTime - milliseconds;

  const minute = Math.floor(differenceInMilliseconds / 1000 / 60);
  const hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);

  if (minute < 1) {
    return 'Just now';
  } else if (minute < 60) {
    return `${minute} minute${minute !== 1 ? 's' : ''} ago`;
  } else if (hour < 24) {
    return `${hour} hour${hour !== 1 ? 's' : ''} ago`;
  } else {
    return `${day} day${day !== 1 ? 's' : ''} ago`;
  }
};



/**
 * Finds a specific note by its ID within a database of notebooks and their notes.
 *
 * @param {Object} db - The database containing notebooks and notes.
 * @param {string} noteId - The ID of the note to find.
 * @returns {Object | undefined} The found note object, or undefined if not found.
 */
const findNote = (db, noteId) => {
  let note;
  for (const notebook of db.notebooks) {
    note = notebook.notes.find(note => note.id === noteId);
    if (note) break;
  }
  return note;
}


/**
 * Finds the index of a note in a notebook's array of notes based on its ID.
 *
 * @param {Object} notebook - The notebook object containing an array of notes.
 * @param {string} noteId - The ID of the note to find.
 * @returns {number} The index of the found note, or -1 if not found.
 */
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

export async function fetchNotes(notebookId) {
  try {
    const response = await fetch(`http://localhost:4000/api/v1/notebooks/${notebookId}/notes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.success) {
      console.log('Fetched notes:', data.notes);
      return data.notes;
    } else {
      console.error('Failed to fetch notes.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

export async function updateNoteById(notebookId, noteId, updatedNoteData) {
  if (!noteId || !updatedNoteData ) {
    console.error('Error: Notebook ID, Note ID, or updated note data is undefined.');
    return null;
  }

  try {
    const response = await fetch(`http://localhost:4000/api/v1/notebooks/${notebookId}/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNoteData),
    });

    const data = await response.json();

    if (!response.ok || !data.note) {
      console.error(`Failed to update note with ID: ${noteId}`, data.message || 'Unknown error');
      return null;
    }

    return data.note;

  } catch (error) {
    console.error('Error updating note:', error);
    return null;
  }
}

