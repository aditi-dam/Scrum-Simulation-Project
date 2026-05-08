const API_URL = "/tasks";

async function getCurrentUser() {
  const res = await fetch("/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

async function protectPage() {
  const user = await getCurrentUser();
  const path = window.location.pathname;

  const isAuthPage =
    path === "/auth/login" ||
    path === "/auth/register" ||
    path.endsWith("login.html") ||
    path.endsWith("register.html");

  if (!user && !isAuthPage) {
    window.location.href = "/auth/login";
    return null;
  }

  return user;
}


async function getBackgroundColor() {
  const usernameVar = await getCurrentUser();
  const username = usernameVar.username;
  const color_res = await fetch("/auth/getBgColor", { 
    method: "GET", 
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });

  if (color_res.ok) {
    const bgColorObject = await color_res.json();
    const bgColor = bgColorObject.color;

    const root = document.documentElement;
    if (bgColor !== document.body.style.background) {
      root.style.setProperty('--changing-bg', bgColor);
      localStorage.setItem('--changing-bg', bgColor);
    }

    const rgb = hexToRgb(bgColor);
    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);

    // const root = document.documentElement;

    if (luminance > 0.179) {
      root.style.setProperty('--text', '#000000');
      root.style.setProperty('--surface', '#ffffff');

      localStorage.setItem('--text', '#000000');
      localStorage.setItem('--surface', '#ffffff');

    } else {
      root.style.setProperty('--text', '#ffffff');
      root.style.setProperty('--surface', '#000000');

      localStorage.setItem('--text', '#ffffff');
      localStorage.setItem('--surface', '#000000');
    }
  }
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}


async function fetchTasks() {
  const user = await protectPage();
  if (!user) return;

  getBackgroundColor();

  const res = await fetch(API_URL, { credentials: "include" });
  if (!res.ok) return;

  const tasks = await res.json();
  displayTasks(tasks);
}

async function fetchCompletedTasks() {
  const user = await protectPage();
  if (!user) return;

  getBackgroundColor();

  const res = await fetch(API_URL, { credentials: "include" });
  if (!res.ok) return;

  let tasks = await res.json();
  tasks = tasks.filter((t) => t.completed);
  displayTasks(tasks);
}

function displayTasks(tasks) {
  const list = document.getElementById("taskList");
  if (!list) return;

  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = '<div class="empty">Nothing here yet.</div>';
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");

    const tagClass = `tag tag-${task.category || "home"}`;
    const dueDateHtml = task.dueDate
      ? `<span class="due-date">${task.dueDate}</span>`
      : "";

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}
        onchange="toggleTask('${task.id}', this.checked)" />

      <span style="color:${task.color || "inherit"}; ${task.completed ? "text-decoration:line-through; opacity:0.5;" : ""}">
        ${task.title}
      </span>

      <span class="${tagClass}">${task.category || "home"}</span>

      ${dueDateHtml}

      <input type="color" value="${task.color || "#1a1917"}"
        onchange="updateTask('${task.id}', { color: this.value })"
        title="Task color" />

      <select onchange="updateTask('${task.id}', { category: this.value })">
        <option value="work"   ${task.category === "work"   ? "selected" : ""}>Work</option>
        <option value="school" ${task.category === "school" ? "selected" : ""}>School</option>
        <option value="home"   ${task.category === "home"   ? "selected" : ""}>Home</option>
      </select>

      <button onclick="deleteTask('${task.id}')">Delete</button>
    `;

    list.appendChild(li);
  });
}

async function addTask() {
  const title = document.getElementById("taskInput").value;
  const dueDate = document.getElementById("dueDate").value;
  const category = document.getElementById("category").value;
  const color = document.getElementById("taskColor").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, dueDate, category, color })
  });

  window.location.href = "/";
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });

  if (window.location.pathname.includes("completed")) {
    fetchCompletedTasks();
  } else {
    fetchTasks();
  }
}

async function toggleTask(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ completed })
  });

  if (window.location.pathname.includes("completed")) {
    fetchCompletedTasks();
  } else {
    fetchTasks();
  }
}

async function updateTask(id, updates) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates)
  });

  if (window.location.pathname.includes("completed")) {
    fetchCompletedTasks();
  } else {
    fetchTasks();
  }
}

function sortByDate() {
  fetch(API_URL, { credentials: "include" })
    .then((res) => res.json())
    .then((tasks) => {
      tasks.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
      displayTasks(tasks);
    });
}

async function changeBgColor() {
  const newColor = document.getElementById("bgColor").value;
  
  await fetch("/auth/updateBgColor", {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: JSON.stringify({ newColor })
  });

  if (window.location.pathname.includes("completed")) {
    fetchCompletedTasks();
  } else {
    fetchTasks();
  }
}

async function logout() {
  await fetch("/auth/logout", { method: "POST", credentials: "include" });
  window.location.href = "/auth/login";
}

async function continueAsGuest() {
  const res = await fetch("/auth/guest", { method: "POST", credentials: "include" });
  if (!res.ok) return;
  window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;
      const message = document.getElementById("loginMessage");

      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        message.textContent = data.error;
        return;
      }

      window.location.href = "/";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("registerUsername").value;
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById("registerConfirmPassword").value;
      const message = document.getElementById("registerMessage");

      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password, confirmPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        message.textContent = data.error;
        return;
      }

      window.location.href = "/";
    });
  }
});