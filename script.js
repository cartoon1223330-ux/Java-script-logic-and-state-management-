const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display Tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filtered = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filtered.forEach((task, index) => {

        const li = document.createElement("li");
        li.className = task.completed ? "task completed" : "task";
        li.dataset.index = index;

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="actions">
                <button class="complete">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit">Edit</button>

                <button class="delete">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    saveTasks();
}

// Add Task
addBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Enter a task");
        return;
    }

    tasks.push({
        text,
        completed: false
    });

    taskInput.value = "";

    renderTasks();

});

// Enter Key
taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addBtn.click();
});

// Event Delegation
taskList.addEventListener("click", e => {

    const li = e.target.closest(".task");

    if (!li) return;

    const index = li.dataset.index;

    if (e.target.classList.contains("complete")) {

        tasks[index].completed = !tasks[index].completed;

    }

    if (e.target.classList.contains("delete")) {

        tasks.splice(index, 1);

    }

    if (e.target.classList.contains("edit")) {

        const newTask = prompt(
            "Edit Task",
            tasks[index].text
        );

        if (newTask !== null && newTask.trim() !== "") {
            tasks[index].text = newTask.trim();
        }

    }

    renderTasks();

});

// Filter Buttons
filterBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        filterBtns.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();

    });

});

// Initial Render
renderTasks();
