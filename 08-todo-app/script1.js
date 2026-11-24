
// DOM Elements

const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.querySelector(".add-todo");
const todoList = document.querySelector(".todos-list");
const filters = document.querySelector(".filters");


// 1. FILTER FUNCTION

function filterTodos() {
    const activeFilter = filters.querySelector(".active");
    const listItems = todoList.querySelectorAll(".todo-item");

    if (!activeFilter) return;

    listItems.forEach(list => {
        const checkbox = list.querySelector(".todo-checkbox");

        switch (activeFilter.dataset.filter) {
            case "all":
                list.style.display = "flex";
                break;

            case "completed":
                list.style.display = checkbox.checked ? "flex" : "none";
                break;

            case "active":
                list.style.display = !checkbox.checked ? "flex" : "none";
                break;
        }
    });
}


// 2. ADD TODO FUNCTION

function addTodoItem() {

    // Prevent empty todos
    if (todoInput.value.trim() === "") return;

    todoList.insertAdjacentHTML("beforeend", `
        <li class="todo-item">
            <label class="checkbox-container">
                <input type="checkbox" class="todo-checkbox">
                <span class="checkmark"></span>
            </label>

            <span class="todo-item-text"></span>
            <button class="delete-btn">
                <i class="fa fa-times"></i>
            </button>
        </li>
    `);

    // Safely insert user input as text
    const newTodo = todoList.lastElementChild;
    newTodo.querySelector(".todo-item-text").textContent = todoInput.value.trim();

    todoInput.value = "";

    // Apply the currently selected filter
    filterTodos();
}


// 3. ADD BUTTON EVENT

addTodoBtn.addEventListener("click", addTodoItem);


// 4. FILTER BUTTON EVENT

filters.addEventListener("click", (e) => {
    const item = e.target.closest("[data-filter]");

    if (!item || !filters.contains(item)) return;

    filters.querySelector(".active")?.classList.remove("active");

    item.classList.add("active");

    filterTodos();
});


// 5. CHECKBOX CHANGE EVENT

todoList.addEventListener("change", (e) => {
    if (e.target.classList.contains("todo-checkbox")) {
        filterTodos();
    }
});


// 6. DELETE TODO EVENT

todoList.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");

    if (!deleteBtn || !todoList.contains(deleteBtn)) return;

    deleteBtn.closest(".todo-item").remove();
});
