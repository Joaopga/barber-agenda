// State Management
let users = [];
let currentUserId = null;
let isEditing = false;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Check which page we're on and initialize accordingly
  if (document.getElementById('loginForm')) {
    initLoginPage();
  }
  
  if (document.getElementById('usersTableBody')) {
    initUsersPage();
  }
});

// ===============================
// LOGIN PAGE
// ===============================

function initLoginPage() {
  const loginForm = document.getElementById('loginForm');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  // Toggle password visibility
  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      
      const eyeIcon = togglePassword.querySelector('.eye-icon');
      const eyeOffIcon = togglePassword.querySelector('.eye-off-icon');
      
      eyeIcon.classList.toggle('hidden');
      eyeOffIcon.classList.toggle('hidden');
    });
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');
  
  // Clear previous errors
  clearErrors();
  
  // Validate
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
  
  // Show loading state
  setButtonLoading(loginBtn, true);
  
  // Simulate login (replace with actual API call)
  setTimeout(() => {
    // Store logged user info
    localStorage.setItem('currentUser', JSON.stringify({ username }));
    
    // Redirect to users page
    window.location.href = 'usuarios.html';
  }, 1000);
}

// ===============================
// USERS PAGE
// ===============================

function initUsersPage() {
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

function loadUsers() {
  const storedUsers = localStorage.getItem('users');
  
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  } else {
    // Sample data
    users = [
      {
        id: 1,
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao.silva@email.com',
        username: 'joaosilva',
        role: 'Admin',
        observations: 'Administrador principal do sistema'
      },
      {
        id: 2,
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@email.com',
        username: 'mariasantos',
        role: 'Funcionario',
        observations: ''
      },
      {
        id: 3,
        firstName: 'Pedro',
        lastName: 'Costa',
        email: 'pedro.costa@email.com',
        username: 'pedrocosta',
        role: 'Usuario',
        observations: 'Usuário padrão'
      }
    ];
    saveUsers();
  }
}

function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

function initUserPageListeners() {
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  
  // Search
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  
  // Add user button
  document.getElementById('addUserBtn').addEventListener('click', () => openUserModal());
  
  // Modal close buttons
  document.getElementById('closeUserModal').addEventListener('click', closeUserModal);
  document.getElementById('cancelUserModal').addEventListener('click', closeUserModal);
  document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
  document.getElementById('cancelDeleteModal').addEventListener('click', closeDeleteModal);
  
  // User form submission
  document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
  
  // Delete confirmation
  document.getElementById('confirmDeleteBtn').addEventListener('click', handleDeleteConfirm);
  
  // Close modals on overlay click
  document.getElementById('userModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('userModal')) {
      closeUserModal();
    }
  });
  
  document.getElementById('deleteModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('deleteModal')) {
      closeDeleteModal();
    }
  });
  
  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeUserModal();
      closeDeleteModal();
    }
  });
}

function handleLogout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  renderUsers(searchTerm);
}

function renderUsers(searchTerm = '') {
  const tbody = document.getElementById('usersTableBody');
  const emptyState = document.getElementById('emptyState');
  const table = document.querySelector('.users-table');
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm) ||
           user.email.toLowerCase().includes(searchTerm) ||
           user.username.toLowerCase().includes(searchTerm) ||
           user.role.toLowerCase().includes(searchTerm);
  });
  
  // Clear table
  tbody.innerHTML = '';
  
  if (filteredUsers.length === 0) {
    table.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }
  
  table.classList.remove('hidden');
  emptyState.classList.add('hidden');
  
  // Render users
  filteredUsers.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="user-name-cell">${user.firstName} ${user.lastName}</td>
      <td class="user-email">${user.email}</td>
      <td>${user.username}</td>
      <td><span class="badge ${user.role.toLowerCase()}">${getRoleLabel(user.role)}</span></td>
      <td class="actions-cell">
        <button class="btn-icon edit" onclick="openUserModal(${user.id})" title="Editar">
        </button>
        <button class="btn-icon delete" onclick="openDeleteModal(${user.id})" title="Excluir">
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function getRoleLabel(role) {
  const labels = {
    'Admin': 'Admin',
    'Funcionario': 'Funcionário',
    'Usuario': 'Usuário'
  };
  return labels[role] || role;
}

function updateStats() {
  document.getElementById('totalUsers').textContent = users.length;
  document.getElementById('totalAdmins').textContent = users.filter(u => u.role === 'Admin').length;
  document.getElementById('totalEmployees').textContent = users.filter(u => u.role === 'Funcionario').length;
  document.getElementById('totalRegularUsers').textContent = users.filter(u => u.role === 'Usuario').length;
}

// ===============================
// USER MODAL (CREATE/EDIT)
// ===============================

function openUserModal(userId = null) {
  const modal = document.getElementById('userModal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('userForm');
  const passwordRequired = document.getElementById('passwordRequired');
  const passwordInput = document.getElementById('userPassword');
  
  clearErrors();
  form.reset();
  
  if (userId) {
    // Edit mode
    isEditing = true;
    currentUserId = userId;
    title.textContent = 'Editar Usuário';
    passwordRequired.classList.add('hidden');
    passwordInput.required = false;
    passwordInput.placeholder = 'Deixe em branco para manter a senha atual';
    
    const user = users.find(u => u.id === userId);
    if (user) {
      document.getElementById('userId').value = user.id;
      document.getElementById('firstName').value = user.firstName;
      document.getElementById('lastName').value = user.lastName;
      document.getElementById('email').value = user.email;
      document.getElementById('role').value = user.role;
      document.getElementById('userUsername').value = user.username;
      document.getElementById('observations').value = user.observations || '';
    }
  } else {
    // Create mode
    isEditing = false;
    currentUserId = null;
    title.textContent = 'Adicionar Usuário';
    passwordRequired.classList.remove('hidden');
    passwordInput.required = true;
    passwordInput.placeholder = 'Digite a senha';
  }
  
  modal.classList.remove('hidden');
  document.getElementById('firstName').focus();
}

function closeUserModal() {
  const modal = document.getElementById('userModal');
  modal.classList.add('hidden');
  isEditing = false;
  currentUserId = null;
}

function handleUserSubmit(e) {
  e.preventDefault();
  
  // Clear previous errors
  clearErrors();
  
  // Get form values
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const role = document.getElementById('role').value;
  const username = document.getElementById('userUsername').value.trim();
  const password = document.getElementById('userPassword').value;
  const observations = document.getElementById('observations').value.trim();
  
  // Validate
  let hasError = false;
  
  if (!firstName) {
    showError('firstNameError', 'Nome é obrigatório');
    hasError = true;
  }
  
  if (!lastName) {
    showError('lastNameError', 'Sobrenome é obrigatório');
    hasError = true;
  }
  
  if (!email) {
    showError('emailError', 'Email é obrigatório');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError('emailError', 'Email inválido');
    hasError = true;
  }
  
  if (!role) {
    showError('roleError', 'Selecione uma função');
    hasError = true;
  }
  
  if (!username) {
    showError('userUsernameError', 'Nome de usuário é obrigatório');
    hasError = true;
  }
  
  if (!isEditing && !password) {
    showError('userPasswordError', 'Senha é obrigatória');
    hasError = true;
  }
  
  // Check for duplicate email (excluding current user if editing)
  const emailExists = users.some(u => u.email === email && u.id !== currentUserId);
  if (emailExists) {
    showError('emailError', 'Este email já está em uso');
    hasError = true;
  }
  
  // Check for duplicate username (excluding current user if editing)
  const usernameExists = users.some(u => u.username === username && u.id !== currentUserId);
  if (usernameExists) {
    showError('userUsernameError', 'Este nome de usuário já está em uso');
    hasError = true;
  }
  
  if (hasError) return;
  
  // Show loading state
  const saveBtn = document.getElementById('saveUserBtn');
  setButtonLoading(saveBtn, true);
  
  // Simulate API call
  setTimeout(() => {
    if (isEditing) {
      // Update user
      const index = users.findIndex(u => u.id === currentUserId);
      if (index !== -1) {
        users[index] = {
          ...users[index],
          firstName,
          lastName,
          email,
          role,
          username,
          observations
        };
        
        // Update password only if provided
        if (password) {
          users[index].password = password;
        }
      }
      showToast('Usuário atualizado com sucesso!', 'success');
    } else {
      // Create new user
      const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        role,
        username,
        password,
        observations
      };
      users.push(newUser);
      showToast('Usuário criado com sucesso!', 'success');
    }
    
    saveUsers();
    renderUsers();
    updateStats();
    setButtonLoading(saveBtn, false);
    closeUserModal();
  }, 500);
}

// ===============================
// DELETE MODAL
// ===============================

function openDeleteModal(userId) {
  const modal = document.getElementById('deleteModal');
  const user = users.find(u => u.id === userId);
  
  if (user) {
    currentUserId = userId;
    document.getElementById('deleteUserName').textContent = `${user.firstName} ${user.lastName}`;
    modal.classList.remove('hidden');
  }
}

function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  modal.classList.add('hidden');
  currentUserId = null;
}

function handleDeleteConfirm() {
  if (!currentUserId) return;
  
  const deleteBtn = document.getElementById('confirmDeleteBtn');
  setButtonLoading(deleteBtn, true);
  
  // Simulate API call
  setTimeout(() => {
    users = users.filter(u => u.id !== currentUserId);
    saveUsers();
    renderUsers();
    updateStats();
    setButtonLoading(deleteBtn, false);
    closeDeleteModal();
    showToast('Usuário excluído com sucesso!', 'success');
  }, 500);
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(el => el.textContent = '');
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const successIcon = toast.querySelector('.toast-icon.success');
  const errorIcon = toast.querySelector('.toast-icon.error');
  
  toastMessage.textContent = message;
  
  if (type === 'success') {
    successIcon.classList.remove('hidden');
    errorIcon.classList.add('hidden');
  } else {
    successIcon.classList.add('hidden');
    errorIcon.classList.remove('hidden');
  }
  
  toast.classList.remove('hidden');
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Make functions globally accessible
window.openUserModal = openUserModal;
window.openDeleteModal = openDeleteModal;
