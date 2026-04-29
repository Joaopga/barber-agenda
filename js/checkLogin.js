export function checkLogin() {
  const currentUser = localStorage.getItem('currentUser');

  if (!currentUser) {
    window.location.href = 'index.html';
    return null;
  }

  return JSON.parse(currentUser);
}

export function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}