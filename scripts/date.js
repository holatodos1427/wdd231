
const copyrightSpan    = document.getElementById('copyright-year');
const lastModifiedPara = document.getElementById('lastModified');

const now = new Date();
const currentYear = now.getFullYear();
const currentDateTime = now.toLocaleString();

copyrightSpan.textContent = `© ${currentYear}`;
lastModifiedPara.textContent = `${currentDateTime}`;
