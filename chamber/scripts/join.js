
//  hidden timestamp + modal open/close

const timestampField = document.getElementById('timestamp');
const infoButtons    = document.querySelectorAll('.btn-info');
const closeButtons   = document.querySelectorAll('.modal-close');

// Timestamp

// Record when the user loaded the form — submitted as a hidden field
if (timestampField) {
  timestampField.value = new Date().toISOString();
}

// Modals

// Open the modal whose id matches the button's data-modal attribute
infoButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-modal');
    const modal   = document.getElementById(modalId);
    if (modal) modal.showModal();
  });
});

// Close when the ✕ button is clicked
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    button.closest('dialog').close();
  });
});

// Also close when the user clicks the backdrop (outside the dialog)
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left  ||
      e.clientX > rect.right ||
      e.clientY < rect.top   ||
      e.clientY > rect.bottom;
    if (clickedOutside) dialog.close();
  });
});
