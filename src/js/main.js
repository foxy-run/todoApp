// Поиск элементов на странице
const form = document.querySelector('#form');
const input = document.querySelector('#add');
const tasksList = document.querySelector('.tasks__list');
const emptyList = document.querySelector('#emptyList');

// Массив для хранения в localStorage
let tasks = [];

//Проверка, если в localStorage есть данные, то парсим их из json
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
};

checkEmptyList();

// Отрисовка задачи для каждого элемента, сохраненного в массиве
tasks.forEach(task => {
  const classCss = task.done ? 'tasks__title done' : 'tasks__title';
  const taskHTML = `
                <li class="tasks__item row my-1" id="${task.id}">
                  <button type="button" class="tasks__done col-1 offset-1" data-action="done"><img src="assets/img/64.png" width="25px" height="25px" alt="Task done"></button>
                  <span class="${classCss} col-8">${task.text}</span>
                  <button type="button" class="tasks__delete col-1" data-action="delete"><img src="assets/img/65.png" width="25px" height="25px" alt="Task delete"></button>
                </li>
    `;
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
});

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))   // перевод массива в json
}

// Прослушивание событий 
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
  // Отмена отправки формы
  event.preventDefault();

  // Берем значение из поля формы
  const textValue = input.value;

  // Объект для новой задачи
  const newTask = {
    id: Date.now(),
    text: textValue,
    done: false,
  };

  // Добавление объекта в массив задач
  tasks.push(newTask);

  // Проверка статуса задачи
  const classCss = newTask.done ? 'tasks__title done' : 'tasks__title';

  // Отрисовка шаблона задачи
  const taskHTML = `
                <li class="tasks__item row my-1" id="${newTask.id}">
                  <button type="button" class="tasks__done col-1 offset-1" data-action="done"><img src="assets/img/64.png" width="25px" height="25px" alt="Task done"></button>
                  <span class="${classCss} col-8">${newTask.text}</span>
                  <button type="button" class="tasks__delete col-1" data-action="delete"><img src="assets/img/65.png" width="25px" height="25px" alt="Task delete"></button>
                </li>
    `;

  // Добавление новой задачи в конец списка
  tasksList.insertAdjacentHTML('beforeend', taskHTML);

  // Очистка инпута + сохранение фокуса на нем
  input.value = "";
  input.focus();
  checkEmptyList();
  saveToLocalStorage();
};

function deleteTask(event) {
  // Проверка, что был клик по кнопке delete
  if (event.target.dataset.action !== 'delete') {
    return
  }

  const parentNode = event.target.closest('.tasks__item'); // поиск ближайшего родителя

  // Нахождение id таски
  const id = parentNode.id;

  // Нахождение индекса таски в массиве
  const index = tasks.findIndex(function (task) {

    if (task.id == id) {
      return true
    }
  });

  // Удаление задачи из массива
  tasks.splice(index, 1);
  parentNode.remove(); // удаление родителя
  checkEmptyList();
  saveToLocalStorage();
};

function doneTask(event) {
  // Проверка, что был клик по кнопке done
  if (event.target.dataset.action !== 'done') {

    return
  }

  const parentNode = event.target.closest('.tasks__item');    // поиск родительского тега

  // поиск id таски
  const id = parentNode.id;
  const task = tasks.find(function (task) {
    if (task.id == id) {
      return true
    }
  });

  task.done = !task.done;
  const taskTitle = parentNode.querySelector('.tasks__title'); // поиск текста задачи
  taskTitle.classList.toggle('done'); // добавление класса для визуализации выполнения задачи
  saveToLocalStorage();
};



function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListTasks = `<li class="tasks__item empty col-md-auto" id="emptyList">
                  <div class="tasks__title_empty ">Список дел пока пуст...</div>
                </li>`
    tasksList.insertAdjacentHTML('afterbegin', emptyListTasks);
  }

  if (tasks.length > 0) {
    const emptyListElement = document.querySelector('#emptyList');
    emptyListElement ? emptyListElement.remove() : null;
  }
}

