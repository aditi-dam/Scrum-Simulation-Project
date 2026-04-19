const API_URL = "/tasks";

async function fetchTasks() {
  const res = await fetch(API_URL);
  let tasks = await res.json();

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

      <span style="color:${task.color || 'black'}">
        ${task.title} (${task.category}) 
        ${task.dueDate ? " - " + task.dueDate : ""}
      </span>

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

  alert("Task added!");
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

function sortByDate() {
  fetch(API_URL)
    .then(res => res.json())
    .then(tasks => {
      tasks.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
      displayTasks(tasks);
    });
}