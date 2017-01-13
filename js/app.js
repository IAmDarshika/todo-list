var todos, KEY = 'app-todos';
var eButton = document.querySelector('#eButton'),
  todoText = document.querySelector('#todoText'),
  todoList = document.querySelector('#list-holder');



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
  } 
  else {
     for (var i = 0; i < todos.length; i++) {
      html += '<li data-index="' + i + '"><input type="checkbox" ' + (todos[i].completed ? 'checked' : '') + '/>' + '<span>' + todos[i].title + '</span>' +'<input type="button" value="&#xd7;" class="close"/></li>';
    }
    document.getElementById('list-holder').innerHTML = html;
  }
}

function newElement() {
  var newTodoText = todoText.value;
  if (!newTodoText) {
    alert('Enter a Value');
    return;
  }
  var newTodoObject = {
    title: newTodoText,
    completed: false
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

  if (e.target.tagName === 'INPUT') {
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
renderList();