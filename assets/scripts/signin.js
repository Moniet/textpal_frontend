const USERURL =  'http://localhost:3000/users';
const homeBtn = document.querySelector('.person_icon');
const createBtn = document.querySelector('.pencil_icon');
const logoutBtn = document.querySelector('.logout_icon');

function getUsers() {
  return fetch(USERURL)
  .then(userData => userData.json());
}

function loginhandler(userNameInput) {
  getUsers()
  .then(userArray => userArray.find(user => user.username === userNameInput.value))
  .then(user => login(user));
}

function login(user) {
  if (user) {
    localStorage.setItem('username', user['username']);
    localStorage.setItem('id', user['id']);
    createBtn.style.display = 'block';
    homeBtn.style.display = 'block';
    logoutBtn.style.display = 'block';
    renderIndexPage();
  } else {
    alert('User does not exist');
  }
}

function runSignIn() {
  const registerBtn = document.querySelector('#register');
  const userNameInput = document.querySelector('#username');

  document.querySelector('#login').addEventListener('click', e => {
      loginhandler(userNameInput);
    });

  registerBtn.addEventListener('click', e => {
      fetch(`${USERURL}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          body: JSON.stringify({ username: userNameInput.value }),
        }).then(response => response.json()).
      then(output => registerMessage(output));
    });
}

function registerMessage(output) {
  if (output['error']) {
    alert('This user already exists, please choose another username');
  } else {
    alert('Successfully created user, please login to continue');
  }
}
