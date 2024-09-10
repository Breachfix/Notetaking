'use strict';

import { getRelativeTime } from '../utils.js'; 

const $overlay = document.createElement('div');
$overlay.classList.add('overlay', 'modal-overlay');

/**
 * Creates and manages a modal for adding or editing notes.
 *
 * @param {string} [title='Untitled'] - The default title for the note.
 * @param {string} [content='Add your note...'] - The default content for the note.
 *  The creation time of the note. If provided, displays the relative time.
 * @returns {Object} - An object containing functions to open the modal, close the modal, and handle note submissions.
 */
const NoteModal = function (title = 'Untitled', content = 'Add your note...', createdAt = null) {
  const $modal = document.createElement('div');
  $modal.classList.add('modal');

// Check if createdAt is valid and only show time if it exists
let time = '';
if (createdAt) {
  const date = new Date(createdAt);
  if (!isNaN(date.getTime())) {
    // Only calculate relative time if the date is valid
    time = getRelativeTime(date.getTime());
  } else {
    console.error(`Invalid date passed for createdAt: ${createdAt}`);
  }
}

// No need to log or handle the case where createdAt is not provided (i.e., for new notes)

console.log(`Displaying time in modal: ${time}`); // Debugging the final time to display


  $modal.innerHTML = `
    <button class="icon-btn large" aria-label="Close modal" data-close-btn>
      <span class="material-symbols-rounded" aria-hidden="true">close</span>
      <div class="state-layer"></div>
    </button>
    <input type="text" placeholder="Untitled" value="${title}" class="modal-title text-title-medium" data-note-field>
    <textarea placeholder="Take a note..." class="modal-text text-body-large custom-scrollbar" data-note-field>${content}</textarea>

    <div class="modal-footer">
      <span class="time text-label-large">${time}</span>
      <button class="btn text" data-submit-btn>
        <span class="text-label-large">Save</span>
        <div class="state-layer"></div>
      </button>
    </div>
  `;

  const $submitBtn = $modal.querySelector('[data-submit-btn]');
  $submitBtn.disabled = true;

  const [$titleField, $contentField] = $modal.querySelectorAll('[data-note-field]');

  const enableSubmit = function () {
    $submitBtn.disabled = !$titleField.value && !$contentField.value;
  };

  $contentField.addEventListener('keyup', enableSubmit);
  $titleField.addEventListener('keyup', enableSubmit);

  const open = function () {
    document.body.appendChild($modal);
    document.body.appendChild($overlay);
    $titleField.focus();
  };

  const close = function () {
    if ($modal.parentNode) {
      document.body.removeChild($modal);
    }
    if ($overlay.parentNode) {
      document.body.removeChild($overlay);
    }
  };

  const $closeBtn = $modal.querySelector('[data-close-btn]');
  $closeBtn.addEventListener('click', close);

  const onSubmit = function (callback) {
    $submitBtn.addEventListener('click', function () {
      const noteData = {
        title: $titleField.value,
        content: $contentField.value
      };

      // Validate content
      if (!noteData.content || noteData.content.trim() === '') {
        alert('Content is required to create a note.');
        return;
      }

      callback(noteData);
    });
  };

  return { open, close, onSubmit };
};

/**
 * Creates and manages a modal for confirming the deletion of an item.
 *
 * @param {string} title - The title of the item to be deleted.
 * @returns {Object} - An object containing functions to open the modal, close the modal, and handle confirmation.
 */
const DeleteConfirmModal = function (title) {
  const $modal = document.createElement('div');
  $modal.classList.add('modal');

  $modal.innerHTML = `
    <h3 class="modal-title text-title-medium">
      Are you sure you want to delete <strong>"${title}"</strong>?
    </h3>
    <div class="modal-footer">
      <button class="btn text" data-action-btn="false">
        <span class="text-label-large">Cancel</span>
        <div class="state-layer"></div>
      </button>
      <button class="btn fill" data-action-btn="true">
        <span class="text-label-large">Delete</span>
        <div class="state-layer"></div>
      </button>
    </div>
  `;

  const open = function () {
    document.body.appendChild($modal);
    document.body.appendChild($overlay);
  };

  const close = function () {
    if ($modal.parentNode) {
      document.body.removeChild($modal);
    }
    if ($overlay.parentNode) {
      document.body.removeChild($overlay);
    }
  };

  const $actionBtns = $modal.querySelectorAll('[data-action-btn]');

  // Handle submit for confirming or canceling deletion
  const onSubmit = function (callback) {
    $actionBtns.forEach($btn => $btn.addEventListener('click', function () {
      const isConfirm = this.dataset.actionBtn === 'true';
      callback(isConfirm);
      close();
    }));
  };

  return { open, close, onSubmit };
};

export { DeleteConfirmModal, NoteModal };
