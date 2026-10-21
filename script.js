const listElement = document.getElementById('starred-list');

if (!listElement) {
  throw new Error('The starred repositories list element was not found.');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeText(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function formatStars(stars) {
  const numericStars = Number(stars);
  return Number.isFinite(numericStars) ? new Intl.NumberFormat('en-US').format(numericStars) : '0';
}

function renderRepositories(repositories) {
  if (!Array.isArray(repositories) || repositories.length === 0) {
    listElement.innerHTML = '<li class="empty-state">No starred repositories yet.</li>';
    return;
  }

  const validRepositories = repositories.filter((repo) => repo && typeof repo === 'object');

  if (validRepositories.length === 0) {
    listElement.innerHTML = '<li class="empty-state">No starred repositories yet.</li>';
    return;
  }

  listElement.innerHTML = validRepositories
    .map((repo) => {
      const name = escapeHtml(safeText(repo.name, 'Unnamed repository'));
      const description = escapeHtml(safeText(repo.description, 'No description provided.'));
      const language = escapeHtml(safeText(repo.language, 'Unknown'));
      const stars = formatStars(repo.stars);
      const url = typeof repo.url === 'string' && repo.url.trim() ? repo.url : '';
      const repoTitle = url
        ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${name}</a>`
        : `<span>${name}</span>`;

      return `
        <li class="repo-card">
          <h2>${repoTitle}</h2>
          <p>${description}</p>
          <div class="repo-meta">
            <span><span class="language-dot" aria-hidden="true"></span>${language}</span>
            <span>⭐ ${stars}</span>
          </div>
        </li>
      `;
    })
    .join('');
}

fetch('events.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Unable to load starred repositories.');
    }
    return response.json();
  })
  .then((data) => {
    if (!Array.isArray(data)) {
      throw new Error('The repository data is not in the expected format.');
    }

    renderRepositories(data);
  })
  .catch((error) => {
    console.error(error);
    listElement.innerHTML = '<li class="empty-state">Something went wrong while loading the list.</li>';
  });