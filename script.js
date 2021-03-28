'use strict';
// Element Selectors
const navLinks = document.querySelector('.nav-links');
const todoListContainer = document.querySelector('.todo-list-container');
const submitTodoBtn = document.querySelector('.submit-todo');
const todos = document.querySelector('.todos');
const actionBtns = document.querySelector('.action-todo-btns');
const check = document.querySelector('.check');
const trash = document.querySelector('.trash');
const progressBar = document.querySelector('.progress-bar');
const progressBtn = document.querySelector('.progress-btn');
const timeStamp = document.querySelector('.time');
const todoo = document.querySelector('.todo');

// todo-input-container selections
const title = document.querySelector('#title');
const task = document.querySelector('#task');
const priorityContainer = document.querySelector('.radio-btns');
let priority;
// initial variables
let todoList = [];
let todoId = 0;

const options = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekend: 'long',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

// Initial functions

const inputHTML = function (todoObj) {
  const html = `<div class="todo todo-${todoObj.priority} ${
    todoObj.completed ? 'isCompleted' : ''
  }" data-id="${todoObj.id}">
  <div class="action-todo flex ">
    <h2 class="title">${todoObj.title}</h2>
    <div class="action-todo-btns">
      <span><i class="fa fa-2x complete action-btn fa-check-circle"></i></span>
      <span><i class="fa fa-2x trash action-btn fa-trash"></i></span>
    </div>
  </div>
  <p>
    ${todoObj.task}
  </p>
</div>`;
  todos.insertAdjacentHTML('beforeend', html);
};

const calcTime = function () {
  setInterval(function () {
    const date = new Date();
    const dateFormat = new Intl.DateTimeFormat('en-US', options).format(date);
    timeStamp.textContent = '';
    timeStamp.textContent = `${dateFormat}`;
  }, 1000);
};
calcTime();

const setLocalTodos = function (todoList) {
  localStorage.setItem('todoList', JSON.stringify(todoList));
};

const getLocalTodos = function () {
  const getTodos = JSON.parse(localStorage.getItem('todoList'));
  if (!getTodos) return;
  todoList = getTodos;
  todoList.forEach(function (todo) {
    inputHTML(todo);
    todoId = todo.id;
  });
};
getLocalTodos();

const clearInput = function () {
  title.value = task.value = '';
  if (!priority) return;
  priority.checked = false;
  priority = '';
};

const todoTask = function (e) {
  e.preventDefault();

  if (!priority?.value || !title.value || !task.value) {
    alert('empty fields required');
  } else {
    todos.innerHTML = '';
    calcTime();
    todoList.forEach(todo => inputHTML(todo));

    todoId++;
    const todoTaskObj = {
      id: todoId,
      priority: priority.value,
      title: title.value,
      task: task.value,
      completed: false,
    };
    todoList.push(todoTaskObj);
    setLocalTodos(todoList);
    console.log(todoTaskObj.id);
    inputHTML(todoTaskObj);
    //   clear input fields
    clearInput();
  }
};

const action = function (e) {
  const btnExist = e.target.classList.contains('action-btn');
  if (!btnExist) return; //guard clauss
  const actionBtn = e.target;
  const parentTodo = actionBtn.closest('.todo');
  const parentId = parentTodo.dataset.id;

  const findTodo = todoList.find(todo => todo.id === +parentId);

  if (actionBtn.classList.contains('trash')) {
    console.log('trashed');
    parentTodo.classList.toggle('trashed');
    const indexOfTrashTodo = todoList.indexOf(findTodo);
    todoList.splice(indexOfTrashTodo, 1);
    setLocalTodos(todoList);

    parentTodo.addEventListener('transitionend', function () {
      parentTodo.remove();
    });
  }

  if (actionBtn.classList.contains('complete')) {
    parentTodo.classList.toggle('isCompleted');
    findTodo.completed = parentTodo.classList.contains('isCompleted')
      ? true
      : false;

    setLocalTodos(todoList);
  }
};

const filter = function (e) {
  e.preventDefault();
  const navLink = e.target.closest('.nav-link');
  if (!navLink) return;
  todoListContainer.scrollIntoView({ behavior: 'smooth' });

  if (navLink.classList.contains('reset-link')) {
    todoList.splice(0, todoList.length);
    localStorage.clear();
    todoId = 0;
    todoList.forEach(todo => inputHTML(todo));
    location.reload();
  }

  if (
    navLink.classList.contains('completed-link') ||
    navLink.classList.contains('incompleted-link')
  ) {
    todos.innerHTML = '';

    const completedTask = todoList.filter(todoObj =>
      navLink.classList.contains('completed-link')
        ? todoObj.completed === true
        : todoObj.completed === false
    );
    calcTime();
    completedTask.forEach(todoObj => inputHTML(todoObj));
  } else {
    todos.innerHTML = '';
    calcTime();
    todoList.forEach(todo => inputHTML(todo));
  }
};

const progress = function () {
  if (!todoList.length) return alert('Nothing To Track Right Now 🤷‍♀️🤷‍♀️🤦‍♂️!');
  const completedListLength = todoList.filter(todo => todo.completed === true)
    .length;
  const progressPercentage = (
    (completedListLength / todoList.length) *
    100
  ).toFixed(2);
  progressBar.textContent = `${progressPercentage}%`;
  progressBar.style.width = `${progressPercentage}%`;
};
// Event listeners

priorityContainer.addEventListener('click', function (e) {
  priority = e.target.closest('.radio-btn');
  if (!priority) return; //guard clauss
});

submitTodoBtn.addEventListener('click', todoTask);
todos.addEventListener('click', action);

navLinks.addEventListener('click', filter);

progressBtn.addEventListener('click', progress);

console.log(todoList);

// Responsiveness
