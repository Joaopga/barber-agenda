export async function checkLogin() {
  // Check if user is logged in
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }
  
  // Set current user name
  const userInfo = JSON.parse(currentUser);
  document.getElementById('currentUser').textContent = userInfo.username;
  
  // Load users from localStorage or use sample data
  loadUsers();
  
  // Initialize event listeners
  initUserPageListeners();
  
  // Render initial data
  renderUsers();
  updateStats();
}
