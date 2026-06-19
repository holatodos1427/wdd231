const detailsEl = document.getElementById('success-details');

function getSubmission() {
  try {
    const raw = localStorage.getItem('gde_last_submission');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    firstName:   params.get('firstName') || '',
    lastName:    params.get('lastName')  || '',
    email:       params.get('email')     || '',
    inquiryType: params.get('inquiryType') || '',
  };
}

function getInquiryLabel(value) {
  const labels = {
    order:    'Regular order',
    event:    'Event / catering order',
    custom:   'Custom dessert request',
    location: 'Find our weekend location',
    other:    'General question',
  };
  return labels[value] || value || 'Not specified';
}

function renderDetails() {
  if (!detailsEl) return;

  const urlData  = getUrlParams();
  const lsData   = getSubmission();

  const firstName   = urlData.firstName   || lsData?.firstName   || '';
  const lastName    = urlData.lastName    || lsData?.lastName    || '';
  const email       = urlData.email       || lsData?.email       || '';
  const inquiryType = urlData.inquiryType || lsData?.inquiryType || '';

  if (!firstName && !email) {
    detailsEl.hidden = true;
    return;
  }

  const name = [firstName, lastName].filter(Boolean).join(' ');

  detailsEl.innerHTML = `
    <div class="success-summary">
      <h3 class="success-summary-title">Your submission summary</h3>
      <dl class="success-summary-list">
        ${name ? `<div class="success-summary-item"><dt>Name</dt><dd>${name}</dd></div>` : ''}
        ${email ? `<div class="success-summary-item"><dt>Email</dt><dd>${email}</dd></div>` : ''}
        ${inquiryType ? `<div class="success-summary-item"><dt>Inquiry</dt><dd>${getInquiryLabel(inquiryType)}</dd></div>` : ''}
      </dl>
    </div>
  `;
  detailsEl.hidden = false;

  try {
    localStorage.removeItem('gde_last_submission');
  } catch { }
}

renderDetails();
