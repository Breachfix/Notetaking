'use strict';

// Import necessary modules
import { Tooltip } from "./guestTooltips.js";
import { getRelativeTime } from "./guestUtils.js";
import { DeleteConfirmModal, NoteModal } from "./guestModal.js";
import { guestDB } from "./guestDB.js";
import { client } from "./guestClient.js";

// Create a card element for a note
export const Card = function (noteData) {

  const { id, title, text, postedOn, notebookId } = noteData;

  const $card = document.createElement('div');
  $card.classList.add('card');
  $card.setAttribute('data-note', id);

  $card.innerHTML = `
    <h3 class="card-title text-title-medium">${title}</h3>
    <p class="card-text text-body-large">${text}</p>
    <div class="wrapper">
      <span class="card-time text-label-large">${getRelativeTime(postedOn)}</span>
      <button class="icon-btn large" aria-label="Delete note" data-tooltip="Delete note" data-delete-btn>
        <span class="material-symbols-rounded" aria-hidden="true">delete</span>
        <div class="state-layer"></div>
      </button>
    </div>
    <div class="state-layer"></div>
  `;

  // Initialize tooltip
  Tooltip($card.querySelector('[data-tooltip]'));

  // Open modal for note details and editing
  $card.addEventListener('click', function () {
    const modal = NoteModal(title, text, getRelativeTime(postedOn));
    modal.open();

    modal.onSubmit(function (noteData) {
      const updatedData = guestDB.update.note(id, noteData);
      client.note.update(id, updatedData);
      modal.close();
    });
  });

  // Delete note functionality
  const $deleteBtn = $card.querySelector('[data-delete-btn]');
  $deleteBtn.addEventListener('click', function (event) {
    event.stopImmediatePropagation();

    const modal = DeleteConfirmModal(title);
    modal.open();

    modal.onSubmit(function (isConfirm) {
      if (isConfirm) {
        const existedNotes = guestDB.delete.note(notebookId, id);
        client.note.delete(id, existedNotes.length);
      }
      modal.close();
    });
  });

  return $card;
}
