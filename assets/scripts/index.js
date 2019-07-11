const baseUrl = 'http://localhost:3000';
const wrapper = document.querySelector('.page_wrapper');
const personIcon = document.querySelector('.person_icon');
const pencilIcon = document.querySelector('.pencil_icon');
const logoutIcon = document.querySelector('.logout_icon');

function renderTemplate(id) {
  wrapper.textContent = '';
  let template = document.querySelector(id);
  let content = document.importNode(template.content, true);
  wrapper.appendChild(content);
}

function logout() {
  delete localStorage['username'];
  delete localStorage['id'];
  welcome();
}

function welcome() {
  if (localStorage.username) {
    renderIndexPage();
    personIcon.style.display = 'block';
  } else {
    renderTemplate('#sign-in');
    runSignIn();
    personIcon.style.display = 'none';
    pencilIcon.style.display = 'none';
    logoutIcon.style.display = 'none';
  }
}

function renderIndexPage() {
  wrapper.textContent = '';
  fetch(`${baseUrl}/projects`)
  .then(res => res.json())
  .then(projects => {
    renderIndexCards(projects.reverse());
  });
}

function showProject(svg, project) {
  svg.addEventListener('click', e => {
    localStorage.setItem('project', project.id);
    renderTemplate('#show-page');
    renderSingleProject(project);
  });
}

function renderIndexCards(projects) {
  const indexWrapper = document.createElement('div');
  indexWrapper.className = 'index_wrapper';

  projects.forEach(project => renderCards(project, indexWrapper));

  wrapper.appendChild(indexWrapper);
}

function renderCards(project, container) {
  const card = document.createElement('div');

  const author = document.createElement('h2');
  author.innerText = project.user.username;

  const svg = document.createElement('div');
  showProject(svg, project);
  svg.innerHTML = project.svg;

  const likeCount = document.createElement('h5');
  likeCount.innerText = `${project.likes.length} Likes`;

  const commentCount = document.createElement('h5');
  commentCount.innerText = `${project.comments.length} Comments`;

  const likeButton = document.createElement('button');
  likeButton.className = 'btn col-md-12';
  if (likeExist(project)) {
    likeButton.innerText = 'Unlike';
  } else {
    likeButton.innerText = 'Like';
  }

  handleLikeFunctionality(likeButton, project, likeCount);

  card.className = 'card';

  card.append(svg, author, likeCount, commentCount, likeButton);

  container.appendChild(card);
};

function handleLikeFunctionality(likeButton, project, likeCount) {
  likeButton.addEventListener('click', e => {
    fetchProject(project).then(updatedProject => checkLike(likeButton, updatedProject, likeCount));
  });
}

function fetchProject(project) {
  return fetch(`${baseUrl}/projects/${project.id}`)
  .then(res => res.json());
}

function checkLike(likeButton, project, likeCount) {
  if (!likeExist(project)) {
    likeProject(project);
    likeCount.innerText = `${project.likes.length + 1} Likes`;
    likeButton.innerText = 'Unlike';
  } else {
    unlikeProject(project);
    likeCount.innerText = `${project.likes.length - 1} Likes`;
    likeButton.innerText = 'Like';
  }
}

function likeProject(project) {
  likeData = { user_id: localStorage['id'], project_id: project.id };
  return fetch(`${baseUrl}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(likeData),
  });
}

function unlikeProject(project) {
  likeData = project.likes.find(like => like.user_id == localStorage['id']);
  return fetch(`${baseUrl}/likes/${likeData.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function likeExist(project) {
  if (project.likes.find(like => like.user_id == localStorage['id'])) {
    return true;
  } else {
    return false;
  }
}

welcome();

pencilIcon.addEventListener('click', () => {
  renderTemplate('#project-page');
  projectPageInit();
});

personIcon.addEventListener('click', () => {
  renderIndexPage();
});

logoutIcon.addEventListener('click', logout);
