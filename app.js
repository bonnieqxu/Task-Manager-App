
// Select DOM Elements
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");


// Local Storage - a local database (on local browser)

// How to access the local storage （Chrome）(different for firefox)
// 1. Right Click the browser
// 1. Inspect Element
// 2. Application Tab
// 3. Storage
// 4. Local Storage
// [inspect - application - storage - local storage (key, value)]
// local storage is like a dictionary? todos is the key.
/*
localStorage是一种浏览器提供的本地存储机制，它类似于一个字典（或者称为键值对集合），允许你存储和检索数据，其中每个存储的数据都由一个键（key）和一个对应的值（value）组成。但是，localStorage只能存储字符串类型的数据，所以在实际使用时，需要将数据转换成字符串形式再存储
*/ 


// Event Listeners
todoButton.addEventListener("click", addTodo); // 3. Add new task when thhe add button is clicked
document.addEventListener("DOMContentLoaded", getTodos) // 5. Load task from the localStorage when page load
todoList.addEventListener("click", deleteTodo); // 8. Delete or complete a task when a button is clicked (calling the deleteTodo function results in 1 of the 2 options: delete or complete)
filterOption.addEventListener("click", filterTodo); // 10. Filter tasks based on completion status


// 1. Function to save task to the LocalStorage
function saveLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null){
        todos = [];
    }  else {
        // JSON.parse()用于将JSON字符串解析为JavaScript对象
        todos = JSON.parse(localStorage.getItem("todos")); 
    }
    todos.push(todo);
    // JSON.stringify()用于将JavaScript对象转换为JSON字符串
    localStorage.setItem("todos", JSON.stringify(todos));
}

// JSON（JavaScript Object Notation）是一种数据交换格式。JSON数据由键值对组成，就像字典一样，但JSON是一种数据交换格式，而不是一种数据结构。
/*
    - 当从本地存储中获取数据时，数据是以字符串(string)的形式存储的（因为localStorage的key和value都只能存储字符串类型的数据），因此需要使用JSON.parse()来将其解析为JavaScript对象以便使用。

    - 当将数据保存到本地存储时，我们通常先将JavaScript对象转换为JSON字符串，然后再保存。这就是为什么在saveLocalTodos()函数中使用JSON.stringify()来将任务数组转换为JSON字符串以便保存到本地存储中。
*/ 




// 2. Function to add a new task
function addTodo(e) {
    // Prevent form submission
    e.preventDefault();

    // Create a new todo Div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    
    // Create a new list item for the task
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    
    // Save the task to Local Storage
    saveLocalTodos(todoInput.value);

    // Append the new list item to the todo Div container
    todoDiv.appendChild(newTodo);
    // to reset the input box and make it empty
    todoInput.value = "";
   
    // Create a button to mark the task as completed
    const completedButton = document.createElement("button");
    completedButton.innerHTML =  '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

   
    // Create a button delete the task
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // Append the todo div to the todo list
    todoList.appendChild(todoDiv);
}



// 4. Function to load task from localStorage when the page is load
function getTodos(){
    let todos;
    if (localStorage.getItem("todos") === null){
        todos = [];
    }  else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    todos.forEach(function(todo) {
        // Create a new todo Div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");        

        // Create a new list item for the task
        const newTodo = document.createElement("li");
        newTodo.innerText = todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        // Create a button to mark the task as completed
        const completedButton = document.createElement("button");
        completedButton.innerHTML =  '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);


        // Create a button delete the task
        const trashButton = document.createElement("button");
        trashButton.innerHTML =  '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        // Append the todo div to the todo list
        todoList.appendChild(todoDiv);
    });
}



// 6. Function to remove task from localStorage / Middleware
function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null){
        todos = [];
    }  else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    // todo有三个部分：text, complete button, delete button, 这里[0]就是选择text部分 to remove
    // 找到这个task的index
    const todoIndex = todo.children[0].innerText;
    // 从todos这个variable中删除
    todos.splice(todos.indexOf(todoIndex), 1);
    // 并且更新到local storage
    localStorage.setItem("todos", JSON.stringify(todos));
}




/*
        "=>" is the same as 
        function () {
        }
*/ 

//  7. Function to delete or complete a task
function deleteTodo(e) {
    const item = e.target;
    // If the delete button is clicked, [0] is because there is only one class element - line 124
    if (item.classList[0] === "trash-btn") {
        //If the button is clicked, remove the task from the list
        const todo = item.parentElement;
        // this "fall" class is in relation to the css file for animation
        todo.classList.add("fall");
        // call the function to remove it from the local storage
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", (e) => {
            // to remove it from the list so it is not shown on the page anymore
            todo.remove();
        });
    }
    

    // If the complete button is clicked，[0] is because there is only one class element - line 117
    if (item.classList[0] === "complete-btn") {
        // If the complete button is clicked, toggle the completed class
        const todo = item.parentElement;
        // "completed" is in relation to the css file, to strikethrough this item
        todo.classList.toggle("completed");
    }
}




// 9: Function to filter tasks based on completion status
// e is a clicking event: all/completed/uncompleted
function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        // to find out the value of this clicking event
      switch (e.target.value) {
        // clicking all
        case "all":
          todo.style.display = "flex";
          break;
        // clicking completed
        case "completed":
          if (todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
          break;
        // clicking uncompleted
        case "uncompleted":
            // ! is to reverse line 204
          if (!todo.classList.contains("completed")) {
              todo.style.display = "flex";
          } else {
              todo.style.display = "none";
          }
          break;
      }
    });
  }


