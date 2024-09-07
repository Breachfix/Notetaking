'use strict';

import { Tooltip } from "./Tooltip.js";
import { getRelativeTime } from "../utils.js";
import { DeleteConfirmModal, NoteModal } from "./Modal.js";
import { db } from "../db.js";
import { client } from "../client.js"; // Ensure client is used to update UI
import { fetchNotes, updateNoteById } from '../utils.js';

/**
 * Creates an HTML card element representing a note based on provided note data.
 *
 * @param {Object} noteData - Data representing the note to be displayed in the card.
 * @param {string} notebookId - The ID of the notebook this note belongs to.
 * @returns {HTMLElement|null} - The generated card element, or null if noteData is invalid.
 */
export const Card = function (noteData, notebookId) {
  if (!noteData) {
    console.error('Error: Invalid note data provided to Card component.');
    return null;
  }

  const { _id: id, title = 'Untitled', content = 'No content available', createdAt } = noteData;

  if (!id) {
    console.error('Error: Note ID is undefined.');
    return null;
  }

  const postedOn = new Date(createdAt).getTime();

  const $card = document.createElement('div');
  $card.classList.add('card');
  $card.setAttribute('data-note', id);

  $card.innerHTML = `
    <h3 class="card-title text-title-medium">${title}</h3>
    <p class="card-text text-body-large">${content}</p>
    <div class="wrapper">
      <span class="card-time text-label-large">${getRelativeTime(postedOn)}</span>
      <button class="icon-btn large" aria-label="Delete note" data-tooltip="Delete note" data-delete-btn>
        <span class="material-symbols-rounded" aria-hidden="true">delete</span>
        <div class="state-layer"></div>
      </button>
    </div>
    <div class="state-layer"></div>
  `;

  Tooltip($card.querySelector('[data-tooltip]'));

  // Click handler for opening the modal and editing the note
  $card.addEventListener('click', function () {
    const modal = NoteModal(title, content, getRelativeTime(createdAt));
    modal.open();

    // Attach the submit handler after the modal is opened
    modal.onSubmit(async function (updatedNoteData) {
      if (!updatedNoteData || !updatedNoteData.content) {
        console.error('Error: Invalid updated note data.');
        return;
      }
  
      try {
        // Pass notebookId to the updateNoteById function
        const updatedNote = await updateNoteById(notebookId, id, updatedNoteData);
  
        if (!updatedNote) {
          throw new Error('Note update failed.');
        }
  
        // Update the note in the UI with the new data
        $card.querySelector('.card-title').textContent = updatedNote.title || 'Untitled';
        $card.querySelector('.card-text').textContent = updatedNote.content || 'No content available';
  
        // Optionally, refetch notes if needed to ensure full sync
        fetchNotes(notebookId);

        // Update the client UI to reflect the change (Using client)
        client.note.update(id, updatedNote);
      } catch (error) {
        console.error('Error while updating note:', error);
      }
  
      modal.close();
    });
  });

  // Add click handler for deleting the note
  const $deleteBtn = $card.querySelector('[data-delete-btn]');
  $deleteBtn.addEventListener('click', function (event) {
    event.stopImmediatePropagation();

    const modal = DeleteConfirmModal(title);
    modal.open();

    modal.onSubmit(async function (isConfirm) {
      if (isConfirm) {
        if (!id || !notebookId) {
          console.error('Error: Note ID or notebook ID is undefined.');
          return;
        }

        try {
          // Ensure both noteId and notebookId are passed and valid
          const success = await db.delete.note(notebookId, id);
          if (success) {
            console.log(`Note with ID "${id}" deleted successfully.`);

            // Remove the note from the UI
            $card.remove();

            // Update client UI after deletion
            client.note.delete(id);
          } else {
            console.error(`Failed to delete note with ID: ${id}`);
          }
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      }
      modal.close();
    });
  });

  return $card;
};
