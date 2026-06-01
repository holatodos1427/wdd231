
// GET

const summaryList = document.getElementById('summary-list');

// Membership level display names

const levelNames = {
  np:     'NP Membership (Non-Profit)',
  bronze: 'Bronze Membership',
  silver: 'Silver Membership',
  gold:   'Gold Membership',
};

// Read & display URL parameters

function displaySubmission() {
  const params = new URLSearchParams(window.location.search);

  // Only show the required fields
  const fields = [
    { key: 'fname', label: 'First Name'   },
    { key: 'lname', label: 'Last Name'    },
    { key: 'email', label: 'Email'        },
    { key: 'phone', label: 'Mobile Phone' },
    { key: 'org-name', label: 'Organization' },
    { key: 'membership', label: 'Membership'   },
    { key: 'timestamp', label: 'Submitted'    },
  ];

  if (!summaryList) return;

  // Build the definition list rows
  summaryList.innerHTML = fields.map(({ key, label }) => {
    let value = params.get(key) || '—';

    // Format the timestamp into a readable date
    if (key === 'timestamp' && value !== '—') {
      value = new Date(value).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      });
    }

    // Show the membership level's full name
    if (key === 'membership' && levelNames[value]) {
      value = levelNames[value];
    }

    return `
      <dt>${label}</dt>
      <dd>${value}</dd>`;
  }).join('');
}

displaySubmission();
