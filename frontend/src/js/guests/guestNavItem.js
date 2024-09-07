'use strict';

// Import necessary modules
import { Tooltip } from "./guestTooltips.js";
import { activeNotebook, makeElemEditable } from "./guestUtils.js";
import { guestDB } from "./guestDB.js";
import { client } from "./guestClient.js";
import { DeleteConfirmModal } from "./guestModal.js";

const $notePanelTitle = document.querySelector('[data-note-panel-title]');

// Create a navigation item for a notebook
export const NavItem = function (id, name) {

  const $navItem = document.createElement('div');
  $navItem.classList.add('nav-item');
  $navItem.setAttribute('data-notebook', id);

  $navItem.innerHTML = `
    <span class="text text-label-large" data-notebook-field>${name}</span>
    <button class="icon-btn small" aria-label="Edit notebook" data-tooltip="Edit notebook" data-edit-btn>
      <span class="material-symbols-rounded" aria-hidden="true">edit</span>
      <div class="state-layer"></div>
    </button>
    <button class="icon-btn small" aria-label="Delete notebook" data-tooltip="Delete notebook" data-delete-btn>
      <span class="material-symbols-rounded" aria-hidden="true">delete</span>
      <div class="state-layer"></div>
    </button>
    <div class="state-layer"></div>
  `;

  // Initialize tooltips
  const $tooltipElems = $navItem.querySelectorAll('[data-tooltip]');
  $tooltipElems.forEach($elem => Tooltip($elem));

  // Handle notebook selection
  $navItem.addEventListener('click', function () {
    $notePanelTitle.textContent = name;
    activeNotebook.call(this);

    const noteList = guestDB.get.note(this.dataset.notebook);
    client.note.read(noteList);
  });

  // Handle notebook editing
  const $navItemEditBtn = $navItem.querySelector('[data-edit-btn]');
  const $navItemField = $navItem.querySelector('[data-notebook-field]');
  $navItemEditBtn.addEventListener('click', makeElemEditable.bind(null, $navItemField));

  $navItemField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      this.removeAttribute('contenteditable');
      const updatedNotebookData = guestDB.update.notebook(id, this.textContent);
      client.notebook.update(id, updatedNotebookData);
    }
  });

  // Handle notebook deletion
  const $navItemDeleteBtn = $navItem.querySelector('[data-delete-btn]');
  $navItemDeleteBtn.addEventListener('click', function () {
    const modal = DeleteConfirmModal(name);
    modal.open();

    modal.onSubmit(function (isConfirm) {
      if (isConfirm) {
        guestDB.delete.notebook(id);
        client.notebook.delete(id);
      }
      modal.close();
    });
  });

  return $navItem;
}
