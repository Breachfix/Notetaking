import { addEventOnElements, getGreetingMsg, activeNotebook, makeElemEditable } from "../js/guests/guestUtils.js";
import { Tooltip } from "../js/guests/guestTooltips.js";
import { guestDB } from "../js/guests/guestDB.js"; // Ensure guestDB is used
import { client } from "../js/guests/guestClient.js";
import {DeleteConfirmModal, NoteModal } from "../js/guests/guestModal.js";

// Sidebar toggle
const $sidebar = document.querySelector('[data-sidebar]');
const $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
const $overlay = document.querySelector('[data-sidebar-overlay]');
const token = localStorage.getItem('jwt-token');

// Sidebar toggle functionality
const toggleSidebar = function () {
  $sidebar.classList.toggle('active');
  $overlay.classList.toggle('active');
};

// Apply sidebar toggle on toggler elements
addEventOnElements($sidebarTogglers, 'click', toggleSidebar);

// Close sidebar when overlay is clicked
$overlay.addEventListener('click', toggleSidebar);

// If token is found, redirect to dashboard and stop further execution
if (token) {
  window.location.href = '/Frontend/dashboard.html'; // Assuming you have a dashboard.html
} else {
  document.addEventListener('DOMContentLoaded', () => {
    // Tooltip initialization
    const $tooltipElems = document.querySelectorAll('[data-tooltip]');
    $tooltipElems.forEach($elem => Tooltip($elem));

    // Greeting message
    const $greetElem = document.querySelector('[data-greeting]');
    const currentHour = new Date().getHours();
    $greetElem.textContent = getGreetingMsg(currentHour);

    // Current date display
    const $currentDateElem = document.querySelector('[data-current-date]');
    $currentDateElem.textContent = new Date().toDateString().replace(' ', ', ');

    // Notebook creation
    const $sidebarList = document.querySelector('[data-sidebar-list]');
    const $addNotebookBtn = document.querySelector('[data-add-notebook]');

    // Show notebook creation field in the sidebar
    const showNotebookField = function () {
      const $navItem = document.createElement('div');
      $navItem.classList.add('nav-item');

      $navItem.innerHTML = `
        <span class="text text-label-large" data-notebook-field></span>
        <div class="state-layer"></div>
      `;

      $sidebarList.appendChild($navItem);
      const $navItemField = $navItem.querySelector('[data-notebook-field]');

      // Activate the new created notebook and deactivate the last one
      activeNotebook.call($navItem);

      // Make notebook field editable and focus
      makeElemEditable($navItemField);

      // When user presses 'Enter', create the notebook
      $navItemField.addEventListener('keydown', createNotebook);
    };

    $addNotebookBtn.addEventListener('click', showNotebookField);

    // Create new notebook and store it in the guestDB
    const createNotebook = function (event) {
      if (event.key === 'Enter' && this.textContent.trim()) {
        const notebookData = guestDB.post.notebook(this.textContent || 'Untitled');
        
        // Ensure the notebook has a unique ID
        if (!notebookData || !notebookData.id) {
          console.error("Error creating notebook: Notebook ID is undefined.");
          return;
        }
    
        this.parentElement.remove();
    
        // Render the new notebook in the UI
        client.notebook.create(notebookData);
    
        // Refresh the sidebar list with new notebooks
        renderExistedNotebook();
      }
    };
    

    // Render existing notebooks from guestDB
    const renderExistedNotebook = function () {
      const notebookList = guestDB.get.notebook(); // Fetch notebooks from guestDB
      $sidebarList.innerHTML = ''; 
      client.notebook.read(notebookList);
    };

    renderExistedNotebook();

    // Create a new note
    const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

    addEventOnElements($noteCreateBtns, 'click', function () {
      const modal = NoteModal();
      modal.open();

      modal.onSubmit(noteObj => {
        const activeNotebookId = document.querySelector('[data-notebook].active')?.dataset.notebook;

        if (activeNotebookId) {
          const noteData = guestDB.post.note(activeNotebookId, noteObj); // Save note in guestDB
          if (noteData && noteData.id) {
            client.note.create(noteData); // Ensure the note is created with a valid ID
            modal.close();
            renderExistedNote(); // Refresh the note list after adding a new note
          } else {
            console.error("Error creating note: Note ID is undefined.");
          }
        } else {
          console.error("No active notebook selected.");
        }
      });
    });

    // Render existing notes in the active notebook
    const renderExistedNote = function () {
      const activeNotebookId = document.querySelector('[data-notebook].active')?.dataset.notebook;

      if (activeNotebookId) {
        const noteList = guestDB.get.note(activeNotebookId); // Fetch notes from guestDB
        if (noteList && Array.isArray(noteList)) {
          client.note.read(noteList);
        } else {
          console.error("Error fetching notes: Invalid note list.");
        }
      }
    };

    renderExistedNote();

    // Event delegation for editing and deleting notes
    document.addEventListener('click', function (event) {
      // Handle note editing
      if (event.target.matches('[data-edit-btn]')) {
        const noteId = event.target.closest('.note-item').dataset.noteId;
        const notebookId = document.querySelector('[data-notebook].active').dataset.notebook;

        if (noteId && notebookId) {
          const note = guestDB.get.note(notebookId).find(note => note.id === noteId);
          if (!note) {
            console.error("Note not found for editing.");
            return;
          }
          const modal = NoteModal(note);
          modal.open();

          modal.onSubmit(updatedNoteObj => {
            guestDB.update.note(noteId, updatedNoteObj); // Update note in guestDB
            renderExistedNote(); // Refresh notes after editing
            modal.close();
          });
        }
      }

      // Handle note deletion
      if (event.target.matches('[data-delete-btn]')) {
        const noteId = event.target.closest('.note-item').dataset.noteId;
        const notebookId = document.querySelector('[data-notebook].active').dataset.notebook;

        if (noteId && notebookId) {
          guestDB.delete.note(notebookId, noteId); // Delete note from guestDB
          renderExistedNote(); // Refresh notes after deletion
        }
      }
    });
  });
}
