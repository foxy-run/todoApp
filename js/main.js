// Поиск элементов на странице

const form = document.querySelector('#form');
const input = document.querySelector('#add');
const tasksList = document.querySelector('.tasks__list');
const emptyList = document.querySelector('#emptyList');

// Прослушивание события отправки формы + Добавление таски

form.addEventListener('submit', function (event) {
    // Отмена отправки формы
    event.preventDefault();


    // Берем значение из поля формы

    const textValue = input.value;
    console.log(textValue);

    // Отрисовка шаблона задачи

    const taskHTML = `
                <li class="tasks__item">
                  <button type="button" class="tasks__done" data-action="done"><img src="img/task_done.png" width="25px" height="25px" alt="Task done"></button>
                  <span class="tasks__title">${textValue}</span>
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
});

// Удаление задачи из списка

tasksList.addEventListener('click', function(event){
  
  // Проверка, что был клик по кнопке delete
  if(event.target.dataset.action === 'delete'){
    
    const parentNode = event.target.closest('.tasks__item'); // поиск ближайшего родителя
    parentNode.remove(); // удаление родителя

    // Отображение, что список пуст

    if(tasksList.children.length === 1) {
      emptyList.classList.remove('none');
    }
  }

});

// Пометка о выполнении задачи

tasksList.addEventListener('click', function(event){

  // Проверка, что был клик по кнопке done
  if(event.target.dataset.action === 'done') {
    const parentNode = event.target.closest('.tasks__item'); // поиск родительского тега
    const taskTitle = parentNode.querySelector('.tasks__title'); // поиск текста задачи
    taskTitle.classList.toggle('done_task'); // добавление класса для визуализации выполнения задачи
  }
});