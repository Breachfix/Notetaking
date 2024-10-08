'use strict';

// Create overlay for modal
const $overlay = document.createElement('div');
$overlay.classList.add('overlay', 'modal-overlay');

// Create and manage note modal
const NoteModal = function (title = 'Untitled', text = 'Add your note...', time = '') {
  const $modal = document.createElement('div');
  $modal.classList.add('modal');

  $modal.innerHTML = `
    <button class="icon-btn large" aria-label="Close modal" data-close-btn>
      <span class="material-symbols-rounded" aria-hidden="true">close</span>
      <div class="state-layer"></div>
    </button>

    <input type="text" placeholder="Untitled" value="${title}" class="modal-title text-title-medium" data-note-field>
    <textarea placeholder="Take a note..." class="modal-text text-body-large custom-scrollbar" data-note-field>${text}</textarea>

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

  const [$titleField, $textField] = $modal.querySelectorAll('[data-note-field]');

  // Enable submit button if title or text is filled
  const enableSubmit = function () {
    $submitBtn.disabled = !$titleField.value && !$textField.value;
  }

  $textField.addEventListener('keyup', enableSubmit);
  $titleField.addEventListener('keyup', enableSubmit);

  // Open modal
  const open = function () {
    document.body.appendChild($modal);
    document.body.appendChild($overlay);
    $titleField.focus();
  }

  // Close modal
  const close = function () {
    document.body.removeChild($modal);
    document.body.removeChild($overlay);
  }

  const $closeBtn = $modal.querySelector('[data-close-btn]');
  $closeBtn.addEventListener('click', close);

  // Handle note submission
  const onSubmit = function (callback) {
    $submitBtn.addEventListener('click', function () {
      const noteData = {
        title: $titleField.value,
        text: $textField.value
      }
      callback(noteData);
    });
  }

  return { open, close, onSubmit }
}

// Create and manage delete confirmation modal
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

  // Open delete confirmation modal
  const open = function () {
    document.body.appendChild($modal);
    document.body.appendChild($overlay);
  }

  // Close delete confirmation modal
  const close = function () {
    document.body.removeChild($modal);
    document.body.removeChild($overlay);
  }

  const $actionBtns = $modal.querySelectorAll('[data-action-btn]');

  // Handle delete confirmation
  const onSubmit = function (callback) {
    $actionBtns.forEach($btn => $btn.addEventListener('click', function () {
      const isConfirm = this.dataset.actionBtn === 'true';
      callback(isConfirm);
    }));
  }

  return { open, close, onSubmit }
}

export { DeleteConfirmModal, NoteModal }
