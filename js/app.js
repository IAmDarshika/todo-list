var todos, KEY = 'app-todos';
var eButton = document.querySelector('#eButton'),
    todoText = document.querySelector('#todoText'),
    todoList = document.querySelector('#list-holder'),
    todoStatus = document.querySelector('#todo-status'),
    allChecked = document.querySelector('#allChecked'),
    onlyChecked = document.querySelector('#onlyChecked'),
    notChecked = document.querySelector('#notChecked');


todos = getDataFromLocalStorage(KEY);
if (!todos) {
  todos = [];
  setDataToLocalStorage(KEY, todos);
}


function getDataFromLocalStorage(key) {
  var item = localStorage.getItem(key);
  return JSON.parse(item);
}

function setDataToLocalStorage(key, obj) {
  var strObj = JSON.stringify(obj);
  localStorage.setItem(key, strObj);
}

//each todo added here
function addTodo(todo) {
  todos.push(todo);

  for (var i = todos.length-1; i >= 0; i--) {
    todos[i].order = i;
  }

  setDataToLocalStorage(KEY, todos);
  renderList();
  todoText.value = '';
}

//list is displayed with this
function renderList() {
  var html = [], filter;

  if (document.getElementById('allChecked').checked) {
    filter = document.getElementById('allChecked').value;
  }
  else if (document.getElementById('onlyChecked').checked) {
    filter = document.getElementById('onlyChecked').value;
  }else {
    filter= document.getElementById('notChecked').value;
  }

  if (!todos) {
   console.log('No todos');
   todoStatus.innerHTML = 'No todos';
   return;
  }
  
  // todo status
  var status = '', completedCount = 0 , filterTodos;
  
  filterTodos = todos.sort(function (a,b) {
    if(a.order < b.order){
      return -1;
    }
    else if(a.order > b.order){
      return 1;
    }
    return 0;
  }).filter(function(todo) {
      if(filter === 'all'){
        return true;
      }
      if(filter === 'completed'){
        return todo.completed;
      }
      if(filter === 'notcompleted'){
        return !todo.completed;
      }
  });

  for (var i = 0; i < filterTodos.length; i++) {
    html.push([
      '<li data-index="' + filterTodos[i].id + '">',
       '<input type="button"  class= "up" />',
        '<input type="button" class= "down" />',
        '<input type="checkbox" ' + (filterTodos[i].completed ? 'checked' : '') + '/>',
        '<span>' + filterTodos[i].title  + '</span>',
        '<input type="button" value="&#xd7;" class="close"/>',
      '</li>'
    ].join(''));
    if (filterTodos[i].completed) {
      completedCount++;
    }
  }

  document.getElementById('list-holder').innerHTML = html.join('');

  todoStatus.innerHTML = (filterTodos.length ? '(' + completedCount + ' of ' + filterTodos.length  + ' task completed)' : 'No todos');
}

function newElement() {
  var newTodoText = todoText.value;
  if (!newTodoText) {
    alert('Enter a Value');
    return;
  }
  var newTodoObject = {
    id: getKey(),
    title: newTodoText,
    completed: false,
    order: 0
  }; 

  addTodo(newTodoObject);
}

function toggleCompleted(todoId) {
  for (var i = 0; i < todos.length; i++) {
    if(todos[i].id === todoId){
      todos[i].completed = !todos[i].completed;
      break;
    }
  }
  
  setDataToLocalStorage(KEY, todos);
  renderList();
}

function removeTodo(todoId) {
  var todoIndex;
  for (var i = 0; i < todos.length; i++) {
    if(todos[i].id === todoId){
      todoIndex = i;
      break;
    }
  }
  if(todoIndex !== undefined){
    todos.splice(todoIndex, 1);
    setDataToLocalStorage(KEY, todos);
    renderList();
  }
}

function orderTodo(todoId, mode){
  var todoIndex = -1, prevIndex, nextIndex;
  for (var i = 0; i < todos.length; i++) {
    if(todos[i].id === todoId){
      todoIndex = i;
      break;
    }
  }

  if(todoIndex !== -1) {
    prevIndex = todoIndex - 1;
    nextIndex = todoIndex + 1;

    if (mode === 'up') {
      if (todoIndex < todos.length - 1) {
        todos[todoIndex].order = todos[todoIndex].order + 1;
      }
      if(nextIndex < todos.length) {
        todos[nextIndex].order = todos[nextIndex].order - 1;
      }
    } else {
      if (todoIndex !== 0) {
        todos[todoIndex].order = todos[todoIndex].order - 1;
      }
      if(prevIndex >= 0) {
        todos[prevIndex].order = todos[prevIndex].order + 1;
      }
    }

    setDataToLocalStorage(KEY, todos);
    renderList();
  }
}

//generating keys randomly
function getKey() {
 return Math.random().toString(36); 
}

//button event listener
eButton.addEventListener('click', function (e) {

  newElement();
});

//text added through enter button  
todoText.addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    newElement();
  }

});

//radio buttons for filter
allChecked.addEventListener('click', function (e){

  renderList();
});

onlyChecked.addEventListener('click', function (e){

  renderList();
  
});

notChecked.addEventListener('click', function (e){

  renderList();
});

todoList.addEventListener('click', function (e) {
  var list,
    todoIndex, isDeleting = false, isUp = false , isDown = false;
  //console.log(e.target.tagName);

  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SPAN' ) {
    isDeleting = e.target.type === 'button' && e.target.classList.contains('close');
    isUp = e.target.type === 'button' && e.target.classList.contains('up');
    isDown = e.target.type === 'button' && e.target.classList.contains('down');
    list = e.target.parentNode;
  } else {
    list = e.target;
  }
  todoIndex = list.getAttribute('data-index');


  if (isDeleting) {
    removeTodo(todoIndex);
  } else if (isUp){
    orderTodo(todoIndex, 'up');
  } else if (isDown){
    orderTodo(todoIndex, 'down');
  }
  else {
    toggleCompleted(todoIndex);
  }

  //console.log(list.getAttribute('data-index'));
})

renderList();