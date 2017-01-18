var todos, KEY = 'app-todos';
var eButton = document.querySelector('#eButton'),
  todoText = document.querySelector('#todoText'),
  todoList = document.querySelector('#list-holder'),
  todoStatus = document.querySelector('#todo-status');

function getDataFromLocalStorage(key) {
  var item = localStorage.getItem(key);
  console.log(item);
  return JSON.parse(item);
}

function setDataToLocalStorage(key, obj) {
  var strObj = JSON.stringify(obj);
  localStorage.setItem(key, strObj);
}


todos = getDataFromLocalStorage(KEY);


if (!todos) {
  todos = [];
  setDataToLocalStorage(KEY, todos);
}

console.log(todos);

function addTodo(todo) {
  todos.push(todo);
  setDataToLocalStorage(KEY, todos);
  renderList();
  todoText.value = '';
}

function renderList() {
  var html = [];
  if (!todos) {
   console.log('No todos');
   todoStatus.innerHTML = 'No todos';
   return;
  } 
  
  // todo status
  var status = '', completedCount = 0 ;
  todos.sort(function (a,b) {
    if(a.order < b.order){
      return -1;
    }
    else if(a.order > b.order){
      return 1;
    }
    return 0;
  });
  for (var i = 0; i < todos.length; i++) {
    html.push([
      '<li data-index="' + todos[i].id + '">',
       '<input type="button" value ="up" class="up"/>',
        '<input type="button" value ="down" class="down"/>',
        '<input type="checkbox" ' + (todos[i].completed ? 'checked' : '') + '/>',
        '<span>' + todos[i].title + '</span>',
        '<input type="button" value="&#xd7;" class="close"/>',
      '</li>'
    ].join(''));
    if (todos[i].completed) {
      completedCount++;
    }
  }

  document.getElementById('list-holder').innerHTML = html.join('');

  todoStatus.innerHTML = (todos.length ? '(' + completedCount + ' of ' + todos.length + ' task completed)' : 'No todos');
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
  }; //initialise object

  addTodo(newTodoObject);
}

eButton.addEventListener('click', function (e) {

  newElement();
});


todoText.addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    newElement();
  }

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
    upTodo(todoIndex);
  } else if (isDown){
    downTodo(todoIndex);
  }
  else {
    toggleCompleted(todoIndex);
  }

  //console.log(list.getAttribute('data-index'));
})


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

function upTodo(todoId){
  for (var i = 0; i < todos.length; i++) {
    if(todos[i].id === todoId){
      todos[i].order++;
      break;
    }
  }

  setDataToLocalStorage(KEY, todos);
  renderList();
  
}

function downTodo(todoId){
  for (var i = 0; i < todos.length; i++) {
    if(todos[i].id === todoId){
      todos[i].order--;
      if(todos[i].order < 0){
        todos[i].order = 0;
      }
      break;
    }
  }
  
  setDataToLocalStorage(KEY, todos);
  renderList();
  
}

function getKey(){
  return Math.random().toString(36); 
}
renderList();