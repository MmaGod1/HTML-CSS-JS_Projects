// DOM Elements
const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.querySelector(".add-todo");
const todoList = document.querySelector(".todos-list");
const filters = document.querySelector(".filters");
const clearBtn = document.getElementById("clear-btn")

// GET, SAVE AND RENDER TODOS
const todos = JSON.parse(localStorage.getItem("todos")) || [];
console.log(todos)

function preventDuplicateTodos(text) {
    return todos.some(todo => todo.text === text)
}

function saveTodos(todos, text, isChecked) {
    todos.push({ text, isChecked });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos(text, isChecked = false) {
    todoList.insertAdjacentHTML("beforeend", `
        <li class="todo-item ${isChecked ? "completed" : ""}">
            <label class="checkbox-container">
                <input type="checkbox" class="todo-checkbox" ${isChecked ? "checked" : ""}>
                <span class="checkmark"></span>
            </label>

            <span class="todo-item-text">${text}</span>
            <button class="delete-btn">
                <i class="fa fa-times"></i>
            </button>
        </li>
        `)
}

function renderFromStorage(todos) {
    todos.forEach(todo => {
        renderTodos(todo.text, todo.isChecked);
    });
}

function handleAddTodo() {
    const text = todoInput.value.trim();

    if (text == "")
        return;

    if (preventDuplicateTodos(text)) {
        todoInput.value = "";
        return
    }

    renderTodos(text, false);
    saveTodos(todos, text, false);

    todoInput.value = "";
    filterTodos(filters.querySelector(".active"));
    countTodos(todos);
    toggleEmptyState(todos);
}

addTodoBtn.addEventListener("click", handleAddTodo)

todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        handleAddTodo();
})

// 1. FILTER FUNCTION

function filterTodos(item) {
    const listItems = todoList.querySelectorAll(".todo-item");

    listItems.forEach(list => {
        const checkbox = list.querySelector(".todo-checkbox");

        switch (item.dataset.filter)  {
            case "all":
                list.style.display = "flex";
                break;
            case "completed":
                list.style.display = checkbox.checked ? "flex" : "none";
                break;
            case "active":
                list.style.display = !checkbox.checked ? "flex" : "none";
    }  
    });
}    

filters.addEventListener("click", (e) => {
    const item = e.target.closest("[data-filter]");

    if (!item || !filters.contains(item))
        return;

    filters.querySelector(".active")?.classList.remove("active");

    item.classList.add("active");

    filterTodos(item);
    toggleEmptyState(todos)
});

function updateCheckState(todos, text, isChecked) {
    const indexOfText = todos.findIndex(todo => todo.text === text);

    if (indexOfText === -1)
        return;

    todos[indexOfText].isChecked = isChecked;

    localStorage.setItem("todos", JSON.stringify(todos))
}

todoList.addEventListener("change", (e) => {
    if (!e.target.classList.contains("todo-checkbox"))
        return;

    const li = e.target.closest(".todo-item");
    const text = li.querySelector(".todo-item-text").textContent;

    li.classList.toggle("completed", e.target.checked);
    updateCheckState(todos, text, e.target.checked);
    filterTodos(filters.querySelector(".active"));
    countTodos(todos);
    toggleEmptyState(todos)
});


// DELETE AND CLEAR
function delTodo(todos, text) {
    const indexOfText = todos.findIndex(todo => todo.text === text);

        if (indexOfText === -1)
            return;
        else {
            todos.splice(indexOfText, 1);
            localStorage.setItem("todos", JSON.stringify(todos));
        }
}

todoList.addEventListener("click", (e) => {
    if (!e.target.closest(".delete-btn"))
        return;

    const li = e.target.closest(".todo-item");
    const text = li.querySelector(".todo-item-text");

    delTodo(todos, text.textContent);

    li.remove();
    countTodos(todos);
    toggleEmptyState(todos)
});

function clearCompletedTodos(todos) {
    const activeTodos = todos.filter(todo => !todo.isChecked);

    todos.length = 0;
    todos.push(...activeTodos);
    localStorage.setItem("todos", JSON.stringify(todos))
}

clearBtn.addEventListener("click", () => {
    clearCompletedTodos(todos);
    
    todoList.innerHTML = "";
    renderFromStorage(todos);

    filterTodos(filters.querySelector(".active"));
    countTodos(todos);
    toggleEmptyState(todos);
})

function todaysDate() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-NG", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    document.getElementById("date").textContent = formattedDate;
}

function countTodos(todos) {
    const uncompleted = todos.filter(item => !item.isChecked).length;
    document.getElementById("task-number").textContent = `${uncompleted} item${uncompleted <= 1 ? "" : "s"}`;
}


function toggleEmptyState(todos) {
    const activeFilter = filters.querySelector(".active");
    const filterType = activeFilter.dataset.filter;
    const state = document.querySelector(".empty-state");
    
    const completed = todos.filter(item => item.isChecked).length;
    const uncompleted = todos.filter(item => !item.isChecked).length;

    const isEmpty = 
        (filterType === "all" && todos.length == 0) || 
        (filterType === "completed" && completed === 0) ||
        (filterType === "active" && uncompleted === 0);
        
    state.style.display = isEmpty ? "flex" : "none";
}

todaysDate();
toggleEmptyState(todos);
renderFromStorage(todos);
countTodos(todos)