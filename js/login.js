document.addEventListener('DOMContentLoaded', () => {
  initLoginPage();
});

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error-message')
    .forEach(el => el.textContent = '');
}

function setButtonLoading(button, isLoading) {
  const btnText = button.querySelector('.btn-text');
  const btnLoading = button.querySelector('.btn-loading');

  if (isLoading) {
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    button.disabled = true;
  } else {
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    button.disabled = false;
  }
}

function initLoginPage() {
  const loginForm = document.getElementById('loginForm');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;

      togglePassword.querySelector('.eye-icon').classList.toggle('hidden');
      togglePassword.querySelector('.eye-off-icon').classList.toggle('hidden');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');

  clearErrors();

  let hasError = false;

  if (!username) {
    showError('usernameError', 'Digite seu usuário');
    hasError = true;
  }

  if (!password) {
    showError('passwordError', 'Digite sua senha');
    hasError = true;
  }

  if (hasError) return;

  setButtonLoading(loginBtn, true);

  setTimeout(() => {
    localStorage.setItem('currentUser', JSON.stringify({ username }));
    window.location.href = 'usuarios.html';
  }, 1000);
}