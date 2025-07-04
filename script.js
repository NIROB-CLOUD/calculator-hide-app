// script.js
let screen = document.getElementById('screen');
let hiddenMenu = document.getElementById('hiddenMenu');
let appList = document.getElementById('appList');
let loadingOverlay = document.getElementById('loadingOverlay');
let calculatorApp = document.getElementById('calculatorApp');
let authScreen = document.getElementById('authScreen');

let input = '';
let secretCode = localStorage.getItem('secretCode') || '12345';
let savedApps = JSON.parse(localStorage.getItem('hiddenApps')) || [
  'Gallery', 'WhatsApp', 'Facebook', 'File Manager'
];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

window.onload = () => {
  if (isDarkMode) document.body.classList.add('dark');
};

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  isDarkMode = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDarkMode);
});

function simulateAuth(method) {
  loadingOverlay.style.display = 'flex';
  setTimeout(() => {
    loadingOverlay.style.display = 'none';
    authScreen.style.display = 'none';
    calculatorApp.style.display = 'block';
  }, 2000);
}

function press(key) {
  if (screen.innerText === '0') screen.innerText = '';
  screen.innerText += key;
  input += key;

  if (input.endsWith(secretCode)) {
    showLoading(() => {
      hiddenMenu.style.display = 'block';
      screen.innerText = '0';
      input = '';
      loadAppList();
    });
  } else if (input.length >= 5 && !input.endsWith(secretCode)) {
    screen.innerText = 'Access Denied';
    setTimeout(clearScreen, 1500);
  }
}

function clearScreen() {
  screen.innerText = '0';
  input = '';
}

function calculate() {
  try {
    screen.innerText = eval(screen.innerText);
  } catch {
    screen.innerText = 'Error';
  }
}

function changePassword() {
  const newPass = document.getElementById('newPassword').value;
  if (newPass.length >= 4) {
    secretCode = newPass;
    localStorage.setItem('secretCode', newPass);
    alert('Password changed successfully');
  } else {
    alert('Password must be at least 4 digits');
  }
}

function loadAppList() {
  appList.innerHTML = '';
  savedApps.forEach((app, index) => {
    const item = document.createElement('div');
    item.className = 'app-item';
    item.innerHTML = `
      <span>${app}</span>
      <div>
        <input type='checkbox' checked>
        <button onclick='removeApp(${index})'>❌</button>
      </div>
    `;
    appList.appendChild(item);
  });

  const addNew = document.createElement('div');
  addNew.className = 'app-item';
  addNew.innerHTML = `
    <input type='text' id='newAppName' placeholder='New app name' style='flex:1;padding:5px;border-radius:5px;' />
    <button onclick='addApp()'>Add</button>
  `;
  appList.appendChild(addNew);
  localStorage.setItem('hiddenApps', JSON.stringify(savedApps));
}

function addApp() {
  const newApp = document.getElementById('newAppName').value.trim();
  if (newApp && !savedApps.includes(newApp)) {
    savedApps.push(newApp);
    localStorage.setItem('hiddenApps', JSON.stringify(savedApps));
    loadAppList();
  }
}

function removeApp(index) {
  savedApps.splice(index, 1);
  localStorage.setItem('hiddenApps', JSON.stringify(savedApps));
  loadAppList();
}

function showLoading(callback) {
  loadingOverlay.style.display = 'flex';
  setTimeout(() => {
    loadingOverlay.style.display = 'none';
    callback();
  }, 2000);
}
