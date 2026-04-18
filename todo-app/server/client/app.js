const TASKS_URL = "/tasks";
const CATEGORY_URL = "/categories";

async function fetchTasks() {
  document.querySelectorAll('.category-name').forEach(el => el.remove());
  document.querySelectorAll('.category-list').forEach(el => el.remove());

  const res1 = await fetch(TASKS_URL);
  const tasks = await res1.json();
  console.log(tasks);

  const res2 = await fetch(CATEGORY_URL);
  const categories = await res2.json();
  categories.push({id: 0, title: 'Uncategorized', color: '#ffffff'});
  console.log(categories);

  // If there are any tasks belonging to a category which has now been removed, 
  // move those tasks to Uncategorized now
  tasks.forEach((task) => {
    const exists = categories.some(category => category.title === task.category);
    if (exists === false) {
      task.category = "uncategorized";
    }
  });

  // Display full list
  categories.forEach((category) => {
    const category_name = document.createElement("p");
    category_name.className = "category-name";
    if (category.title === "Uncategorized") {
      category_name.innerHTML = `<b>${category.title}</b>`;
    }
    else {
      category_name.innerHTML = `
        <b>${category.title}</b>
        <button onclick="deleteCategory(${category.id})">Delete</button>
      `;
    }
    document.body.appendChild(category_name);

    const category_list = document.createElement("ul");
    category_list.className = "category-list";
    category_list.innerHTML = "";

    tasks.forEach((task) => {
      if (task.category.toLowerCase() === category.title.toLowerCase()) {
        const li = document.createElement("li");
        const inputId = "newCategInput" + task.id
        
        li.innerHTML = `
          <input type="checkbox" ${task.completed ? "checked" : ""} 
            onchange="toggleTask(${task.id}, this.checked)" />
          ${task.title}
          <input id="${inputId}" placeholder="New category name" />
          <button onclick="changeTaskCategory(${task.id})">Change Category</button>
          <button onclick="deleteTask(${task.id})">Delete</button>
        `;

        category_list.appendChild(li);
      }
    });

    document.body.appendChild(category_list);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");

  await fetch(TASKS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: input.value }),
  });

  input.value = "";
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${TASKS_URL}/${id}`, {
    method: "DELETE",
  });

  fetchTasks();
}

async function toggleTask(id, completed) {
  await fetch(`${TASKS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  fetchTasks();
}

async function changeTaskCategory(id) {
  let newCategory = document.getElementById("newCategInput" + id);
  console.log(newCategory);

  // Check if provided category actually exists
  const res2 = await fetch(CATEGORY_URL);
  const categories = await res2.json();
  categories.push({id: 0, title: 'Uncategorized', color: '#ffffff'});

  const exists = categories.some(category => category.title === newCategory.value);

  if (exists == false) {
    alert("Category '" + newCategory.value + "' does not exist.")
  }
  else {
    await fetch(`${TASKS_URL}/${id}/changeCategory`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: newCategory.value }),
    });
  }

  fetchTasks();
}


async function makeCategory() {
  const input = document.getElementById("categoryInput");

  await fetch(CATEGORY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: input.value }),
  });

  input.value = "";
  fetchTasks();
}

async function deleteCategory(id) {
  await fetch(`${CATEGORY_URL}/${id}`, {
    method: "DELETE",
  });

  fetchTasks();
}


fetchTasks();