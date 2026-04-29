import { checkLogin, logout } from "./checkLogin.js";

// ===============================
// STATE
// ===============================
let users = [];
let currentUserId = null;
let isEditing = false;

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  initUsersPage();
});

function initUsersPage() {
  const user = checkLogin();
  if (!user) return;

  document.getElementById('currentUser').textContent = user.username;

  loadUsers();
  initUserPageListeners();
  renderUsers();
  updateStats();
}

// ===============================
// DATA
// ===============================

function loadUsers() {
  const storedUsers = localStorage.getItem('users');

  if (storedUsers) {
    users = JSON.parse(storedUsers);
  } else {
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

// ===============================
// EVENTS
// ===============================

function initUserPageListeners() {
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  document.getElementById('addUserBtn').addEventListener('click', () => openUserModal());

  document.getElementById('closeUserModal').addEventListener('click', closeUserModal);
  document.getElementById('cancelUserModal').addEventListener('click', closeUserModal);

  document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
  document.getElementById('cancelDeleteModal').addEventListener('click', closeDeleteModal);

  document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
  document.getElementById('confirmDeleteBtn').addEventListener('click', handleDeleteConfirm);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeUserModal();
      closeDeleteModal();
    }
  });
}

function handleLogout() {
  logout();
}

function handleSearch(e) {
  renderUsers(e.target.value.toLowerCase());
}

// ===============================
// RENDER
// ===============================

function renderUsers(searchTerm = '') {
  const tbody = document.getElementById('usersTableBody');
  const emptyState = document.getElementById('emptyState');
  const table = document.querySelector('.users-table');

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm) ||
           user.email.toLowerCase().includes(searchTerm) ||
           user.username.toLowerCase().includes(searchTerm) ||
           user.role.toLowerCase().includes(searchTerm);
  });

  tbody.innerHTML = '';

  if (filteredUsers.length === 0) {
    table.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  table.classList.remove('hidden');
  emptyState.classList.add('hidden');

  filteredUsers.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>
        <button onclick="openUserModal(${user.id})" class="btn-icon edit">Editar</button>
        <button onclick="openDeleteModal(${user.id}" class="btn-icon delete">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateStats() {
  document.getElementById('totalUsers').textContent = users.length;
}

// ===============================
// MODAL
// ===============================

function openUserModal(userId = null) {
  const modal = document.getElementById('userModal');
  const form = document.getElementById('userForm');

  form.reset();

  if (userId) {
    isEditing = true;
    currentUserId = userId;

    const user = users.find(u => u.id === userId);

    if (user) {
      document.getElementById('firstName').value = user.firstName;
      document.getElementById('lastName').value = user.lastName;
      document.getElementById('email').value = user.email;
      document.getElementById('role').value = user.role;
      document.getElementById('userUsername').value = user.username;
    }
  } else {
    isEditing = false;
    currentUserId = null;
  }

  modal.classList.remove('hidden');
}

function closeUserModal() {
  document.getElementById('userModal').classList.add('hidden');
}

// ===============================
// CREATE / EDIT
// ===============================

function handleUserSubmit(e) {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const role = document.getElementById('role').value;
  const username = document.getElementById('userUsername').value;

  if (isEditing) {
    const index = users.findIndex(u => u.id === currentUserId);
    users[index] = { ...users[index], firstName, lastName, email, role, username };
  } else {
    users.push({
      id: Date.now(),
      firstName,
      lastName,
      email,
      role,
      username
    });
  }

  saveUsers();
  renderUsers();
  updateStats();
  closeUserModal();
}

// ===============================
// DELETE
// ===============================

function openDeleteModal(userId) {
  currentUserId = userId;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.add('hidden');
}

function handleDeleteConfirm() {
  users = users.filter(u => u.id !== currentUserId);

  saveUsers();
  renderUsers();
  updateStats();
  closeDeleteModal();
}

// ===============================
// GLOBAL (IMPORTANTE)
// ===============================
window.openUserModal = openUserModal;
window.openDeleteModal = openDeleteModal;