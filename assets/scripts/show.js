function renderSingleProject(project) {
  const artboard =  document.querySelector('.artboard');
  const commentSection =  document.querySelector('.comment_section');

  const wrapper = document.querySelector('.wrapper');
  const card = document.createElement('div');

  const author = document.createElement('h2');
  author.innerText = project.user.username;

  const svg = document.createElement('div');
  svg.innerHTML = project.svg;

  const likeCount = document.createElement('h5');
  likeCount.innerText = `${project.likes.length} Likes`;

  const commentCount = document.createElement('h5');
  commentCount.innerText = `${project.comments.length} Comments`;

  const likeButton = document.createElement('button');
  if (likeExist(project)) {
    likeButton.innerText = 'Unlike';
  } else {
    likeButton.innerText = 'Like';
  }

  handleLikeFunctionality(likeButton, project, likeCount);

  const commentField = document.createElement('textarea');
  commentField.placeholder = 'What do you think about this project?';

  const commentsForProject = document.createElement('div');
  commentsForProject.id = 'comments';
  fetchProject(project).then(updatedProject => addComments(updatedProject, commentsForProject));

  const commentButton = document.createElement('button');
  commentButton.innerText = 'Comment';
  handleCommentFunctionality(commentButton, project, commentsForProject, commentField);

  card.classList.add('card');

  artboard.append(svg);
  card.append(author, likeCount, commentCount, likeButton, commentButton, commentField, commentsForProject);

  commentSection.appendChild(card);
}

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

function handleCommentFunctionality(commentButton, project, commentsForProject, commentField) {
  commentButton.addEventListener('click', e => {
    fetchProject(project).then(updatedProject => postComment(updatedProject, commentField)).then(comment => updateDomComment(commentsForProject, comment));
  });
}

function postComment(project, commentField) {
  commentData = { user_id: localStorage['id'], project_id: project.id, content: commentField.value };
  return fetch(`${baseUrl}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentData),
  }).then(res => res.json());
}

function updateDomComment(commentsForProject, comment) { // quick fix, refactor this to fetching the element and rendering
  const h5 = document.createElement('h5');
  h5.innerText = comment.user.username;
  const p = document.createElement('p');
  p.innerText = comment.content;
  commentsForProject.insertBefore(p, commentsForProject.childNodes[0]);
  commentsForProject.insertBefore(h5, commentsForProject.childNodes[0]);
  document.querySelector("textarea").value = ""
}

function addComments(project, commentsForProject) {
  project.comments.reverse().forEach(comment => {
      const h5 = document.createElement("h5")
      h5.innerText = comment.author
      const p = document.createElement('p');
      p.innerText = comment.content;
      commentsForProject.append(h5, p);
    });
}
