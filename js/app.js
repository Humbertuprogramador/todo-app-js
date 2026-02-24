document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("task-form");
    const input = document.getElementById("task-input");
    const list = document.getElementById("task-list");
    const counter = document.getElementById("task-counter");
    const filterButtons = document.querySelectorAll(".filters button");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function updateCounter() {
        counter.textContent = `Tareas: ${tasks.length}`;
    }

    function renderTasks() {
        list.innerHTML = "";

        let filteredTasks = tasks;

        if (currentFilter === "completed") {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (currentFilter === "pending") {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        filteredTasks.forEach((task) => {
            const actualIndex = tasks.indexOf(task);
            const li = document.createElement("li");

            if (task.completed) {
                li.classList.add("completed");
            }

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            const span = document.createElement("span");
            span.textContent = task.text;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.classList.add("delete-btn");

            deleteBtn.addEventListener("click", () => {
                tasks.splice(actualIndex, 1);
                saveTasks();
                renderTasks();
            });

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });

        updateCounter();
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const text = input.value.trim();
        if (text === "") return;

        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
        input.value = "";
    });

    renderTasks();
});
