// Поиск элементов на странице
const form = document.querySelector('#form');
const input = document.querySelector('#add');
const tasksList = document.querySelector('.tasks-list');

// Массив для хранения в localStorage
let tasks = [];

//Проверка, если в localStorage есть данные, то парсим их из json
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

checkEmptyList();

// Отрисовка задачи для каждого элемента, сохраненного в массиве
tasks.forEach(task => {
    const classCss = task.done ? 'tasks-title done' : 'tasks-title';
    const taskHTML = `
                <li class="tasks-item d-flex flex-row mt-2" id="${task.id}">
                  <button type="button" class="tasks-done" data-action="done"><img src="images/check.png" width="25px" height="25px" alt="Task done"></button>
                  <input class="${classCss} ms-2" disabled type="text" value="${task.text}" id="task-input"/>
                  <button type="submit" class="tasks-edit ms-2" data-action="edit"><img src="images/edit.png" width="25px" height="25px" alt="Task edit"></button>
                  <button type="button" class="tasks-delete ms-2" data-action="delete"><img src="images/trash.png" width="25px" height="25px" alt="Task delete"></button>
                </li>
    `;
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
});

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))   // перевод массива в строку
}

// Прослушивание событий 
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
tasksList.addEventListener('click', editTask);

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
        isEdit: false,
    };

    // Добавление объекта в массив задач
    tasks.push(newTask);

    // Проверка статуса задачи
    const classCss = 'tasks-title';
    // Отрисовка шаблона задачи
    const taskHTML = `
                <li class="tasks-item d-flex flex-row mt-2" id="${newTask.id}">
                  <button type="button" class="tasks-done" data-action="done"><img src="images/check.png" width="25px" height="25px" alt="Task done"></button>
                  <input class="${classCss} ms-2" disabled type="text" value="${newTask.text}" id="task-input"/>
                  <button type="button" class="tasks-edit ms-2" data-action="edit"><img src="images/edit.png" width="25px" height="25px" alt="Task edit"></button>
                  <button type="button" class="tasks-delete ms-2" data-action="delete"><img src="images/trash.png" width="25px" height="25px" alt="Task delete"></button>
                </li>
    `;

    // Добавление новой задачи в конец списка
    tasksList.insertAdjacentHTML('beforeend', taskHTML);

    // Очистка инпута + сохранение фокуса на нем
    input.value = "";
    input.focus();
    checkEmptyList();
    saveToLocalStorage();
}

function deleteTask(event) {
    // Проверка, что был клик по кнопке delete
    if (event.target.dataset.action !== 'delete') {
        return
    }

    const parentNode = event.target.closest('.tasks-item'); // поиск ближайшего родителя

    // Нахождение id таски
    const id = parentNode.id;

    // Нахождение индекса таски в массиве
    const index = tasks.findIndex(function (task) {

        if (task.id == id) {
            return true
        }
    });

    // Вывод подтверждения об удалении
    const confirmDelete = confirm('Удалить задачу?')
    if (confirmDelete == false) {
        return;
    } else {
        // Удаление задачи из массива
        tasks.splice(index, 1);
        parentNode.remove(); // удаление родителя
        checkEmptyList();
        saveToLocalStorage();
    }
}

function doneTask(event) {
    // Проверка, что был клик по кнопке done
    if (event.target.dataset.action !== 'done') {
        return
    }

    const parentNode = event.target.closest('.tasks-item');    // поиск родительского тега

    // поиск id таски
    const id = parentNode.id;
    const task = tasks.find(function (task) {
        if (task.id == id) {
            return true
        }
    });

    const taskTitle = parentNode.querySelector('.tasks-title'); // поиск текста задачи
    const doneButton = parentNode.querySelector('.tasks-done img');
    task.done = !task.done;

    if (task.done) {
        taskTitle.classList.add('done'); // класс для выполненной таски
        doneButton.src = 'images/uncheck.png';
        doneButton.alt = 'Uncheck task';
    } else {
        taskTitle.classList.remove('done');
        doneButton.src = 'images/check.png';
        doneButton.alt = 'Task done';
    }

    saveToLocalStorage();
}

function editTask(event) {
    // Проверка, что был клик по кнопке edit
    if (event.target.dataset.action !== 'edit') {
        return;
    }

    const parentNode = event.target.closest('.tasks-item'); // поиск родительского тега
    const id = parentNode.id; // поиск id таски
    const task = tasks.find(function (task) {
        if (task.id == id) {
            return true
        }
    })
    const taskInput = parentNode.querySelector('#task-input'); // поиск текста задачи

    if (!task.isEdit) {
        // Включение режима редактирования
        task.isEdit = true;
        taskInput.removeAttribute('disabled');
        taskInput.focus();
        event.target.querySelector('img').src = 'images/save.png';
    } else {
        const newTaskText = taskInput.value.trim(); // Получние нового текста
        if (newTaskText !== '') {
            task.text = newTaskText; // Обновление текста таски в массиве
            taskInput.setAttribute('disabled', 'true');
            task.isEdit = false;
            event.target.querySelector('img').src = 'images/edit.png';

        } else {
            alert('Текст задачи не может быть пустым!');
            taskInput.focus();
        }
    }
    saveToLocalStorage();
}


function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListTasks = `<li class="tasks-item empty" id="emptyList">
                  <div class="tasks-title_empty ">Список дел пока пуст...</div>
                </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListTasks);
    }

    if (tasks.length > 0) {
        const emptyListElement = document.querySelector('#emptyList');
        emptyListElement ? emptyListElement.remove() : null;
    }
}

