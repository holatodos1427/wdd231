const form = document.getElementById('contact-form');
const inquirySelect = document.getElementById('inquiry-type');
const eventDateGroup = document.getElementById('event-date-group');
const eventDateInput = document.getElementById('event-date');
const prefsBadge = document.getElementById('form-preferences');
const firstNameInput = document.getElementById('first-name');
const emailInput = document.getElementById('email');
const howFoundSelect = document.getElementById('how-found');

const PREFS_KEY = 'gde_contact_prefs';

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch { }
}

function applyPrefs() {
  const prefs = loadPrefs();
  if (!prefs) return;

  if (prefs.firstName && firstNameInput) firstNameInput.value = prefs.firstName;
  if (prefs.email && emailInput) emailInput.value = prefs.email;
  if (prefs.howFound && howFoundSelect) howFoundSelect.value = prefs.howFound;

  if (prefsBadge) prefsBadge.hidden = false;
}

function handleInquiryChange() {
  const value = inquirySelect?.value;
  if (!eventDateGroup) return;

  if (value === 'event') {
    eventDateGroup.hidden = false;
    eventDateInput?.setAttribute('required', 'true');
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    if (eventDateInput) eventDateInput.min = minDate.toISOString().split('T')[0];
  } else {
    eventDateGroup.hidden = true;
    eventDateInput?.removeAttribute('required');
  }
}

inquirySelect?.addEventListener('change', handleInquiryChange);

function validateField(input, errorId) {
  const group = input?.closest('.form__group');
  const errorEl = document.getElementById(errorId);
  if (!input || !group) return true;

  const isValid = input.checkValidity();
  group.classList.toggle('has-error', !isValid);
  if (errorEl) errorEl.style.display = isValid ? 'none' : 'block';
  return isValid;
}

document.getElementById('first-name')?.addEventListener('blur', () =>
  validateField(document.getElementById('first-name'), 'first-name-error'));
document.getElementById('last-name')?.addEventListener('blur', () =>
  validateField(document.getElementById('last-name'), 'last-name-error'));
document.getElementById('email')?.addEventListener('blur', () =>
  validateField(document.getElementById('email'), 'email-error'));
document.getElementById('inquiry-type')?.addEventListener('blur', () =>
  validateField(document.getElementById('inquiry-type'), 'inquiry-error'));
document.getElementById('message')?.addEventListener('blur', () =>
  validateField(document.getElementById('message'), 'message-error'));

form?.addEventListener('submit', (e) => {
  const fieldsToValidate = [
    { input: document.getElementById('first-name'), errorId: 'first-name-error' },
    { input: document.getElementById('last-name'), errorId: 'last-name-error' },
    { input: document.getElementById('email'), errorId: 'email-error' },
    { input: document.getElementById('inquiry-type'), errorId: 'inquiry-error' },
    { input: document.getElementById('message'), errorId: 'message-error' },
  ];

  const allValid = fieldsToValidate
    .map(({ input, errorId }) => validateField(input, errorId))
    .every(Boolean);

  if (!allValid) {
    e.preventDefault();
    const firstError = form.querySelector('.form__group.has-error input, .form__group.has-error select, .form__group.has-error textarea');
    firstError?.focus();
    return;
  }

  const prefs = {
    firstName: document.getElementById('first-name')?.value.trim(),
    email: document.getElementById('email')?.value.trim(),
    howFound: document.getElementById('how-found')?.value,
    savedAt: Date.now(),
  };
  savePrefs(prefs);

  try {
    localStorage.setItem('gde_last_submission', JSON.stringify({
      firstName: prefs.firstName,
      lastName: document.getElementById('last-name')?.value.trim(),
      email: prefs.email,
      inquiryType: document.getElementById('inquiry-type')?.value,
      timestamp: Date.now(),
    }));
  } catch { }
});

applyPrefs();
handleInquiryChange();
