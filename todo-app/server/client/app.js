const API_URL = "/tasks";

async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  displayTasks(tasks);
}

async function fetchCompletedTasks() {
  const res = await fetch(API_URL);
  let tasks = await res.json();
  tasks = tasks.filter(t => t.completed);
  displayTasks(tasks);
}

function displayTasks(tasks) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}
        onchange="toggleTask(${task.id}, this.checked)" />

      <span style="color:${task.color || "#000000"}">
        ${task.title} (${task.category})
        ${task.dueDate ? " - " + task.dueDate : ""}
      </span>

      <input type="color" value="${task.color || "#000000"}"
        onchange="updateTask(${task.id}, { color: this.value })" />

      <select onchange="updateTask(${task.id}, { category: this.value })">
        <option value="work" ${task.category === "work" ? "selected" : ""}>Work</option>
        <option value="school" ${task.category === "school" ? "selected" : ""}>School</option>
        <option value="home" ${task.category === "home" ? "selected" : ""}>Home</option>
      </select>

      <button onclick="deleteTask(${task.id})">Delete</button>
    `;

    list.appendChild(li);
  });
}

async function addTask() {
  const title = document.getElementById("taskInput").value;
  const dueDate = document.getElementById("dueDate").value;
  const category = document.getElementById("category").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, dueDate, category }),
  });

  window.location.href = "/";
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

async function toggleTask(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  fetchTasks();
}

async function updateTask(id, updates) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  fetchTasks();
}

function sortByDate() {
  fetch(API_URL)
    .then(res => res.json())
    .then(tasks => {
      tasks.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
      displayTasks(tasks);
    });
}