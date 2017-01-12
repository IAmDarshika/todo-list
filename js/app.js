var todos , KEY = 'app-todos' ;
var eButton=document.querySelector('#eButton'),
	todoText=document.querySelector('#todoText') ;						;



	function getDataFromLocalStorage(key)
			 {
				var item = localStorage.getItem(key);
				console.log(item);
				return JSON.parse(item);
			 }

	function setDataToLocalStorage(key, obj) 
			{
				var strObj = JSON.stringify(obj);
				localStorage.setItem(key, strObj);
			}


	todos = getDataFromLocalStorage(KEY);


	if (!todos) 
			{
				todos = [];
				setDataToLocalStorage(KEY, todos);
			}
			
	console.log(todos);

	function addTodo(todo) 
			{
				todos.push(todo);
				setDataToLocalStorage(KEY, todos);
				renderList();
				todoText.value = '';
			}

	function renderList() 
			{
				var html = '';
				if (todos.length) 
				{
					for (var i = 0; i < todos.length; i++) {
						// html += '\n';
						// html += 'Title: ' + todos[i].title;
						// html += '\n';
						// html += 'Completed: ' + (todos[i].completed ? 'YES' : 'NO');
						// html += '\n';
						html += '<li><input type="checkbox" '+(todos[i].completed ? 'checked' : '' )+'/>' + todos[i].title + '</li>';

					}
				document.getElementById('list-holder').innerHTML = html;
			} else 
				{
				console.log('No todos');
				}
			}

	function newElement(){
		var newTodoText = todoText.value;
		if(!newTodoText){
			alert('Enter a Value');
			return;
		}
		var newTodoObject = {
			title: newTodoText,
			completed: false
		}; //initialise object

		addTodo(newTodoObject);
	}

	eButton.addEventListener('click', function (e){

		newElement();
	});


	todoText.addEventListener('keydown',function(e){
  	if(e.keyCode==13)
    {
      newElement();
    }

	});

	renderList();