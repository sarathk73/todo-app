let todoLists = []; // Store multiple to-do lists


function saveToLocalStorage() {
  localStorage.setItem("todoLists", JSON.stringify(todoLists));
}


function createTodoElement(todo) {
  const isChecked = todo.checked ? "done" : "";
  const node = document.createElement("li");
  node.className = `todo-item ${isChecked}`;
  node.setAttribute("data-key", todo.id);
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox" class="tick js-tick" ${
    todo.checked ? "checked" : ""
  }/>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">X</button>
  `;
  return node;
}


function renderTodo(todo, listElement) {
  saveToLocalStorage();

  const item = listElement.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item && item.remove();
    if (listElement.children.length === 0) listElement.innerHTML = "";
    return;
  }

  const todoElement = createTodoElement(todo);

  if (item) {
    listElement.replaceChild(todoElement, item);
  } else {
    listElement.appendChild(todoElement);
  }
}


function addTodo(text, listIndex) {
  const todo = {
    text: text.trim().slice(0, 35),
    checked: false,
    id: Date.now(),
  };

  todoLists[listIndex].items.push(todo);
  renderTodo(todo, todoLists[listIndex].element);
}


function toggleDone(listIndex, key) {
  const index = todoLists[listIndex].items.findIndex(
    (item) => item.id === Number(key)
  );
  todoLists[listIndex].items[index].checked = !todoLists[listIndex].items[
    index
  ].checked;
  renderTodo(todoLists[listIndex].items[index], todoLists[listIndex].element);
}


function deleteTodo(listIndex, key) {
  const index = todoLists[listIndex].items.findIndex(
    (item) => item.id === Number(key)
  );
  const deletedTodo = {
    deleted: true,
    ...todoLists[listIndex].items[index],
  };
  todoLists[listIndex].items.splice(index, 1);
  renderTodo(deletedTodo, todoLists[listIndex].element);
}


function handleFormSubmit(event) {
  event.preventDefault();
  const input = document.querySelector(".js-todo-input");
  const text = input.value.trim();

  if (text !== "") {
    addTodo(text, 0); // For now, assume all new tasks are added to the first list
    input.value = "";
    input.focus();
  }
}


function handleListClick(event) {
  const target = event.target;
  const itemKey = target.parentElement.dataset.key;
  const listIndex = Array.from(target.closest('.todo-list').parentElement.children).indexOf(target.closest('.todo-list'));

  if (target.classList.contains("js-tick")) {
    toggleDone(listIndex, itemKey);
  }

  if (target.classList.contains("js-delete-todo")) {
    deleteTodo(listIndex, itemKey);
  }
}


function initializeTodos() {
  const storedTodoLists = localStorage.getItem("todoLists");

  if (storedTodoLists) {
    todoLists = JSON.parse(storedTodoLists);
    todoLists.forEach((list) => {
      list.items.forEach((todo) => renderTodo(todo, list.element));
    });
  }
}


const form = document.querySelector(".js-form");
form.addEventListener("submit", handleFormSubmit);

const lists = document.querySelectorAll(".js-todo-list");
lists.forEach((list) => {
  list.addEventListener("click", handleListClick);
});

document.addEventListener("DOMContentLoaded", initializeTodos);
