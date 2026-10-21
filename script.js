const listElement = document.getElementById('starred-list');

function formatStars(stars) {
  return new Intl.NumberFormat('en-US').format(stars);
}

function renderRepositories(repositories) {
  if (!repositories || repositories.length === 0) {
    listElement.innerHTML = '<li class="empty-state">No starred repositories yet.</li>';
    return;
  }

  listElement.innerHTML = repositories
    .map(
      (repo) => `
        <li class="repo-card">
          <h2><a href="${repo.url}" target="_blank" rel="noreferrer">${repo.name}</a></h2>
          <p>${repo.description}</p>
          <div class="repo-meta">
            <span><span class="language-dot" aria-hidden="true"></span>${repo.language}</span>
            <span>⭐ ${formatStars(repo.stars)}</span>
          </div>
        </li>
      `
    )
    .join('');
}

fetch('events.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Unable to load starred repositories.');
    }
    return response.json();
  })
  .then((data) => renderRepositories(data))
  .catch((error) => {
    console.error(error);
    listElement.innerHTML = '<li class="empty-state">Something went wrong while loading the list.</li>';
  });
