const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Function to load tasks from the server
async function loadTasks() {
  try {
    const response = await fetch('/tasks');
    const data = await response.json();
    listContainer.innerHTML = ''; // Clear the current list
    data.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = task.task;
      if (task.completed) {
        li.classList.add("checked");
      }

      const span = document.createElement("span");
      span.textContent = "\u00d7";
      li.appendChild(span);

      listContainer.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// Function to add a new task
async function addTask() {
  if (inputBox.value === '') {
    alert("You must write something!");
  } else {
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: inputBox.value }), // Send task as JSON
      });

      const result = await response.json();
      if (response.status === 201) {
        loadTasks(); // Reload tasks after adding
      } else {
        alert(result.message); // Show error message
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('An error occurred while adding the task.');
    }
    inputBox.value = ''; // Clear input box
  }
}

// Event listener for the Add Task button
const addButton = document.querySelector('button');
addButton.addEventListener('click', addTask);

// Event listener to handle clicking tasks or delete buttons
listContainer.addEventListener("click", async function (e) {
  if (e.target.tagName === "LI") {
    const index = Array.from(listContainer.children).indexOf(e.target);
    await fetch(`/tasks/${index}`, { method: 'PUT' });
    e.target.classList.toggle("checked");
  } else if (e.target.tagName === "SPAN") {
    const index = Array.from(listContainer.children).indexOf(e.target.parentElement);
    await fetch(`/tasks/${index}`, { method: 'DELETE' });
    e.target.parentElement.remove();
  }
});

// Load saved tasks when the page loads
loadTasks();
