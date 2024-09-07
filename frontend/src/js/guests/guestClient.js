'use strict';

// Import necessary modules
import { NavItem } from "./guestNavItem.js";
import { activeNotebook } from "./guestUtils.js";
import { Card } from "./guestCard.js";

const $sidebarList = document.querySelector('[data-sidebar-list]');
const $notePanelTitle = document.querySelector('[data-note-panel-title]');
const $notePanel = document.querySelector('[data-note-panel]');
const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');
const emptyNotesTemplate = `
<div class="empty-notes">
  <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>
  <div class="text-headline-small">No notes</div>
</div>
`;

// Enable or disable "Create Note" buttons
const disableNoteCreateBtns = function (isThereAnyNotebook) {
  $noteCreateBtns.forEach($item => {
    $item[isThereAnyNotebook ? 'removeAttribute' : 'setAttribute']('disabled', '');
  });
}

// Manage UI for notebooks and notes
export const client = {

  notebook: {

    // Create a new notebook in the UI
    create(notebookData) {
      const $navItem = NavItem(notebookData.id, notebookData.name);
      $sidebarList.appendChild($navItem);
      activeNotebook.call($navItem);
      $notePanelTitle.textContent = notebookData.name;
      $notePanel.innerHTML = emptyNotesTemplate;
      disableNoteCreateBtns(true);
    },

    // Display a list of notebooks
    read(notebookList) {
      disableNoteCreateBtns(notebookList.length);
      notebookList.forEach((notebookData, index) => {
        const $navItem = NavItem(notebookData.id, notebookData.name);
        if (index === 0) {
          activeNotebook.call($navItem);
          $notePanelTitle.textContent = notebookData.name;
        }
        $sidebarList.appendChild($navItem);
      });
    },

    // Update a notebook in the UI
    update(notebookId, notebookData) {
      const $oldNotebook = document.querySelector(`[data-notebook="${notebookId}"`);
      const $newNotebook = NavItem(notebookData.id, notebookData.name);
      $notePanelTitle.textContent = notebookData.name;
      $sidebarList.replaceChild($newNotebook, $oldNotebook);
      activeNotebook.call($newNotebook);
    },

    // Delete a notebook from the UI
    delete(notebookId) {
      const $deletedNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
      const $activeNavItem = $deletedNotebook.nextElementSibling ?? $deletedNotebook.previousElementSibling;
      if ($activeNavItem) {
        $activeNavItem.click();
      } else {
        $notePanelTitle.innerHTML = '';
        $notePanel.innerHTML = '';
        disableNoteCreateBtns(false);
      }
      $deletedNotebook.remove();
    }

  },

  note: {

    // Create a new note card in the UI
    create(noteData) {
      if (!$notePanel.querySelector('[data-note]')) $notePanel.innerHTML = '';
      const $card = Card(noteData);
      $notePanel.prepend($card);
    },

    // Display a list of notes in the UI
    read(noteList) {
      if (noteList.length) {
        $notePanel.innerHTML = '';
        noteList.forEach(noteData => {
          const $card = Card(noteData);
          $notePanel.appendChild($card);
        });
      } else {
        $notePanel.innerHTML = emptyNotesTemplate;
      }
    },

    // Update a note in the UI
    update(noteId, noteData) {
      const $oldCard = document.querySelector(`[data-note="${noteId}"]`);
      const $newCard = Card(noteData);
      $notePanel.replaceChild($newCard, $oldCard);
    },

    // Delete a note from the UI
    delete(noteId, isNoteExists) {
      document.querySelector(`[data-note="${noteId}"]`).remove();
      if (!isNoteExists) $notePanel.innerHTML = emptyNotesTemplate;
    }

  }

}
