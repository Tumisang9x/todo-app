document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Load tasks from the server when the page loads
    loadTasks();

    // Add new task when the Add Task button is clicked
    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task');
            return;
        }

        // Send the task to the server
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: taskText })
        })
        .then(response => response.json())
        .then(data => {
            taskInput.value = '';  // Clear the input field after adding the task
            loadTasks();  // Reload tasks from the server
        })
        .catch(err => console.error('Error adding task:', err));
    });

    // Load tasks from the server
    function loadTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(data => {
                taskList.innerHTML = '';  // Clear the list before adding new tasks
                data.forEach(task => {
                    displayTask(task);
                });
            })
            .catch(err => console.error('Error loading tasks:', err));
    }

    // Display a task in the list
    function displayTask(task) {
        const li = document.createElement('li');
        li.textContent = task.task;
        li.classList.toggle('completed', task.completed);  // Add "completed" class if the task is completed

        // Mark task as completed when clicked
        li.addEventListener('click', () => {
            toggleTaskCompletion(task.id, li);
        });

        // Edit task button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.onclick = (e) => {
            e.stopPropagation();  // Prevent triggering the click event to mark as complete
            editTask(task, li);
        };

        // Delete task button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = (e) => {
            e.stopPropagation();  // Prevent triggering the click event to mark as complete
            deleteTask(task.id, li);
        };

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    // Toggle task completion (mark as completed or not)
    function toggleTaskCompletion(taskId, li) {
        fetch(`/tasks/${taskId}/toggle`, { method: 'PATCH' })
            .then(response => response.json())
            .then(data => {
                li.classList.toggle('completed', data.completed);
            })
            .catch(err => console.error('Error toggling completion:', err));
    }


    // Delete a task
    function deleteTask(taskId, li) {
        fetch(`/tasks/${taskId}`, { method: 'DELETE' })
            .then(() => {
                li.remove();
            })
            .catch(err => console.error('Error deleting task:', err));
    }
    
});
