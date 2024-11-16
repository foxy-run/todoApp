// Поиск элементов на странице

const form = document.querySelector('#form');
const input = document.querySelector('#add');
const tasksList = document.querySelector('.tasks__list');
const emptyList = document.querySelector('#emptyList');


// Массив для хранения в localStorage

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(task => {
  const classCss = task.done ? 'tasks__title done' : 'tasks__title'
    
        
    // Отрисовка шаблона задачи

    const taskHTML = `
                <li class="tasks__item" id="${task.id}">
                  <button type="button" class="tasks__done" data-action="done"><img src="img/task_done.png" width="25px" height="25px" alt="Task done"></button>
                  <span class="${classCss}">${task.text}</span>
                  <button type="button" class="tasks__delete" data-action="delete"><img src="img/trash.jpg" width="25px" height="25px" alt="Task delete"></button>
                </li>
    `;

    // Добавление новой задачи в конец списка

    tasksList.insertAdjacentHTML('beforeend', taskHTML);
});

// Прослушивание события отправки формы + Добавление таски

form.addEventListener('submit', function (event) {
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

    const classCss = newTask.done ? 'tasks__title done' : 'tasks__title'
    
        
    // Отрисовка шаблона задачи

    const taskHTML = `
                <li class="tasks__item" id="${newTask.id}">
                  <button type="button" class="tasks__done" data-action="done"><img src="img/task_done.png" width="25px" height="25px" alt="Task done"></button>
                  <span class="${classCss}">${newTask.text}</span>
                  <button type="button" class="tasks__delete" data-action="delete"><img src="img/trash.jpg" width="25px" height="25px" alt="Task delete"></button>
                </li>
    `;

    // Добавление новой задачи в конец списка

    tasksList.insertAdjacentHTML('beforeend', taskHTML);

    // Очистка инпута + сохранение фокуса на нем

    input.value = "";
    input.focus();

    // Скрытие заглушки при добавлении задач

    if(tasksList.children.length > 1) {
      emptyList.classList.add('none');
    }

    saveToLocalStorage ();
});

// Удаление задачи из списка

tasksList.addEventListener('click', function(event){
  
  // Проверка, что был клик по кнопке delete
  if(event.target.dataset.action === 'delete'){
    
    const parentNode = event.target.closest('.tasks__item'); // поиск ближайшего родителя
    
    // Нахождение id таски

    const id = parentNode.id;

    // Нахождение индекса таски в массиве

    const index = tasks.findIndex(function(task){
      
      if (task.id == id) {
        return true
      }

    })
   
    // Удаление задачи из массива

    tasks.splice(index, 1)
    console.log(tasks)
    parentNode.remove(); // удаление родителя

    // Отображение, что список пуст

    if(tasksList.children.length === 1) {
      emptyList.classList.remove('none');
    }
  }
  saveToLocalStorage ();
});

// Пометка о выполнении задачи

tasksList.addEventListener('click', function(event){

  // Проверка, что был клик по кнопке done
  if(event.target.dataset.action === 'done') {
    const parentNode = event.target.closest('.tasks__item');    // поиск родительского тега

    // поиск id таски

    const id = parentNode.id;
    const task = tasks.find(function(task){
      
      if (task.id == id){
        return true
      }
    });

    task.done = !task.done;

    const taskTitle = parentNode.querySelector('.tasks__title'); // поиск текста задачи
    taskTitle.classList.toggle('done'); // добавление класса для визуализации выполнения задачи
  }
  saveToLocalStorage ();
})




// сохранение данных  в localStorage

function saveToLocalStorage () {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}