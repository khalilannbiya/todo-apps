// Variabel todos adalah sebuah variabel yang menampung array dari beberapa object Todo.
const todos = [];

// Kemudian RENDER_EVENT, variabel konstan ini bertujuan sebagai nama dari Custom Event yang akan kita buat, yang mana nantinya akan kita gunakan sebagai dasar ketika ada perubahan pada variabel todos, seperti perpindahan todo, menambah todo, maupun menghapus todo.
const RENDER_EVENT = "render-todo";

const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

// Kode ini adalah sebuah listener yang akan menjalankan kode yang ada didalamnya ketika event DOMContentLoaded dibangkitkan alias ketika semua element HTML sudah dimuat menjadi DOM dengan baik
document.addEventListener("DOMContentLoaded", function () {
   const submitForm = document.getElementById("form");
   submitForm.addEventListener("submit", function (e) {
      e.preventDefault();
      addTodo();
   });
   if (isStorageExist()) {
      loadDataFromStorage();
   }
});

function addTodo() {
   const textTodo = document.getElementById("title").value;
   const timestamp = document.getElementById("date").value;

   const generatedID = generatedId();
   const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
   todos.push(todoObject);

   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function generatedId() {
   // Fungsi generateId() ini berfungsi untuk menghasilkan identitas unik pada setiap item todo. Untuk menghasilkan id yang unik, kita manfaatkan +new Date() alias kode yang digunakan untuk mendapatkan timestamp pada JavaScript.
   return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
   // Fungsi generateTodoObject() ini berfungsi untuk membuat sebuah object di JavaScript dari data yang sudah disediakan dari inputan, seperti ID, nama todo (task), waktu (timestamp), dan isCompleted (penanda todo apakah sudah selesai atau belum).
   return {
      id,
      task,
      timestamp,
      isCompleted,
   };
}

document.addEventListener(RENDER_EVENT, function () {
   const uncompletedTODOList = document.getElementById("todos");
   uncompletedTODOList.innerHTML = "Hallo";

   const completedTODOList = document.getElementById("completed-todos");
   completedTODOList.innerHTML = "";

   for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      // jika todo belum selesai, masukkan ke uncompleted list
      if (!todoItem.isCompleted) {
         uncompletedTODOList.innerHTML = "";
         uncompletedTODOList.append(todoElement);
      }
      // Jika todo sudah selesai, masukkan ke completed list
      else completedTODOList.append(todoElement);
   }
});

function makeTodo(todoObject) {
   const textTitle = document.createElement("h2");
   textTitle.innerText = todoObject.task;

   const textTimestamp = document.createElement("p");
   textTimestamp.innerText = todoObject.timestamp;

   const textContainer = document.createElement("div");
   textContainer.classList.add("inner");
   textContainer.append(textTitle, textTimestamp);

   const container = document.createElement("div");
   container.classList.add("item", "shadow");
   container.appendChild(textContainer);
   container.setAttribute("id", `todo-${todoObject.id}`);

   if (todoObject.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("undo-button");

      undoButton.addEventListener("click", function () {
         undoTaskFromCompleted(todoObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");

      trashButton.addEventListener("click", function () {
         removeTaskFromCompleted(todoObject.id);
      });

      container.append(undoButton, trashButton);
   } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("check-button");

      checkButton.addEventListener("click", function () {
         addTaskToCompleted(todoObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");

      trashButton.addEventListener("click", function () {
         removeTaskFromCompleted(todoObject.id);
      });

      container.append(checkButton, trashButton);
   }

   return container;
}

function addTaskToCompleted(todoId) {
   const todoTarget = findTodo(todoId);

   if (todoTarget == null) return;

   todoTarget.isCompleted = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function findTodo(todoId) {
   for (const todoItem of todos) {
      if (todoItem.id === todoId) {
         return todoItem;
      }
   }
   return null;
}

function removeTaskFromCompleted(todoId) {
   const todoTarget = findTodoIndex(todoId);

   if (todoTarget === -1) return;

   todos.splice(todoTarget, 1);
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function undoTaskFromCompleted(todoId) {
   const todoTarget = findTodo(todoId);

   if (todoTarget == null) return;

   todoTarget.isCompleted = false;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function findTodoIndex(todoId) {
   for (const index in todos) {
      if (todos[index].id === todoId) {
         return index;
      }
   }

   return -1;
}

function saveData() {
   if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
   }
}

function isStorageExist() /* boolean */ {
   if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
   }
   return true;
}

document.addEventListener(SAVED_EVENT, function () {
   console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);

   if (data !== null) {
      for (const todo of data) {
         todos.push(todo);
      }
   }

   document.dispatchEvent(new Event(RENDER_EVENT));
}
