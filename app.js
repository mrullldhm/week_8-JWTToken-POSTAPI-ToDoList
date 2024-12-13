const JWTtoken = localStorage.getItem('todoJWTtoken')

function fetchAllTodos(){
  fetch("https://api.kelasprogramming.com/todo", {
    headers: {
      "Authorization": `Bearer ${JWTtoken}`
    }
  })
  .then((response) => response.json())
  .then((body)=>{
    // kita akan convert list kepada list of html elements
    const todoList = body.entry.map((todo) => (
      `<div class="pt-1 d-flex justify-content-between">
          ${todo.details}
          <div class="d-flex" >
            <button class="btn btn-${todo.completed == 1 ? 'success' : 'warning'} me-1">${todo.completed == 1 ? '<i class="bi bi-check"></i>' : '<i class="bi bi-x"></i>'}</button>
            <button class='btn btn-primary me-1' data-bs-toggle="modal" data-bs-target="#editTodo" onclick='selectTodo(${JSON.stringify(todo)})' ><i class="bi bi-pencil"></i></button>
            <button class='btn btn-danger'><i class="bi bi-trash"></i></button>
          </div>  
        </div>`
    ))
    // render list of html elements kepada innerHTML dekat dalam #todoList
    document.getElementById('todoList').innerHTML = todoList.join('')
  })
  .catch((err) => {debugger})
}

// onclick button,
// 1) kita dapatkan value dari input
// 2) kita akan buat post request utk create
// 3) onsuccess,
// 3.1) refetch all todo items
// 3.2) clearkan input field
// 4) on fail, kita alertkan
function onSubmit() {
  const inputValue = document.getElementById('todoInput').value
  fetch('https://api.kelasprogramming.com/todo', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${JWTtoken}`
      },
      body: JSON.stringify({
        "details": inputValue
      })
    })
    .then((response) => response.json())
    .then(body => {
      fetchAllTodos()
      document.getElementById('todoInput').value = ''
    })
    .catch(err=> {debugger} )
}
let selectedTodo = ''
function selectTodo(todo){
  console.log(todo)
  selectedTodo = todo
}

function onSaveChanges(){
  const inputValue = document.getElementById('todoUpdate').value
  fetch(`https://api.kelasprogramming.com/todo/${selectedTodo.id}`, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${JWTtoken}`
      },
      body: JSON.stringify({
        "details": inputValue,
        "completed": 1
        })
    })
    .then((response) => response.json())
    .then(body => {
      fetchAllTodos()
      document.getElementById('todoUpdate').value = ''
      document.getElementById('closeModal').click()
    })
    .catch(err=> {debugger} )
}

fetchAllTodos()
