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
  var html = '';
  if (!todos) {
   console.log('No todos');
   todoStatus.innerHTML = 'No todos';
   return;
  } 
  
  // todo status
  var status = '', completedCount = 0;

  for (var i = 0; i < todos.length; i++) {
    html += '<li data-index="' + i + '"><input type="checkbox" ' + (todos[i].completed ? 'checked' : '') + '/>' + '<span>' + todos[i].title + '</span>' +'<input type="button" value="&#xd7;" class="close"/></li>';
    if (todos[i].completed) {
      completedCount++;
    }
  }
  document.getElementById('list-holder').innerHTML = html;

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
    todoIndex, isDeleting = false;
  //console.log(e.target.tagName);

  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SPAN') {
    isDeleting = e.target.type === 'button';
    list = e.target.parentNode;
  } else {
    list = e.target;
  }
  todoIndex = list.getAttribute('data-index');


  if (isDeleting) {
    removeTodo(todoIndex);

  } else {
    toggleCompleted(todoIndex);
  }

  //console.log(list.getAttribute('data-index'));
})


function toggleCompleted(todoIndex) {
  todos[todoIndex].completed = !todos[todoIndex].completed;
  setDataToLocalStorage(KEY, todos);
  renderList();
}

function removeTodo(todoIndex) {
  todos.splice(todoIndex, 1);
  setDataToLocalStorage(KEY, todos);
  renderList();
}

function getKey(){
  
}
renderList();