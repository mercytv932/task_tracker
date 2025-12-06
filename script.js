//accessing the html elements first before writing them in JS

const addTask = document.querySelector("#addTask");
const clearAll = document.querySelector("#clearAll");
const taskList = document.querySelector(".task-list");

const subjectInput = document.querySelector(".subject");
const assignmentInput = document.querySelector(".assignment");
const dueDateInput = document.querySelector(".due-date");

//Tasks stay saved even after windows are refreshed

window.addEventListener("load", ()=>{
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach (task=>createTaskItem(task));
  updateTaskStats();
});


//click the add-task button, and this code is triggered, adds the task to the page

addTask.addEventListener("click", ()=>{
  const subject = subjectInput.value.trim();
  const assignment = assignmentInput.value.trim();
  const dueDate = dueDateInput.value;

  if(!subject || !assignment || !dueDate) return;

  const task = {subject, assignment, dueDate, completed: false};
  createTaskItem(task);

  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(savedTasks));

  subjectInput.value = "";
  assignmentInput.value = "";
  dueDateInput.value = "";

  updateTaskStats();
});


//all the assignmnets cleared/deleted when clear-button is clicked
clearAll.addEventListener("click", ()=>{
taskList.innerHTML = "";
localStorage.removeItem("tasks");
updateTaskStats();
});



// create the new Item/task

function createTaskItem(task){
  const li = document.createElement("li");

li.innerHTML = `<strong> ${task.subject}</strong> - ${task.assignment}
<br>
<small> Due: ${task.dueDate} </small>
`;

const today = new Date().toISOString().split("T") [0];
if (task.dueDate < today && !task.completed) {
  li.classList.add("overdue");
}


if(task.completed){
  li.classList.add("completed");
}



const completeBtn = document.createElement("div");
completeBtn.classList.add("complete-btn");
completeBtn.textContent = task.completed ? "✅" : "";

if(task.completed){
  li.classList.add("completed");
  completeBtn.classList.add("completed");
}

const doneSound = document.getElementById("doneSound");

completeBtn.addEventListener("click", ()=>{
  completeBtn.classList.toggle("completed");
  const isDone = completeBtn.classList.contains("completed");

completeBtn.textContent = isDone ? "✅" : "";
li.classList.toggle("completed", isDone);

if (isDone) {
  doneSound.currentTime = 0;
  doneSound.play();
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks =  tasks.map(t => {
if ( t.subject === task.subject &&
     t.assignment === task.assignment &&
     t.dueDate === task.dueDate){
       t.completed = completeBtn.classList.contains("completed");
}

return t;
});

localStorage.setItem("tasks", JSON.stringify(tasks));
updateTaskStats();
});

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "❌";
deleteBtn.addEventListener("click", () =>{
  li.classList.add("fade-out");

  setTimeout( ()=>{
    li.remove();

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter (t => !(
      t.subject === task.subject &&
      t.assignment === task.assignment &&
      t.dueDate === task.dueDate
    ));
    localStorage.setItem("tasks", JSON.stringify(tasks));

    updateTaskStats();

  }, 300);
});
li.appendChild(completeBtn);
li.appendChild(deleteBtn);
taskList.appendChild(li);


 //Assignment due warning 

const now = new Date();
const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const dueDateObj = new Date(task.dueDate + "T00:00:00");

const msPerDay = 24 * 60 *60 * 1000;
const diffMs = dueDateObj.getTime() - todayMidnight.getTime();
const diffDays = Math.round(diffMs / msPerDay);

if(diffDays < 0 && !task.completed) {
  li.classList.add("overdue");
} else {
  li.classList.remove("overdue");
}


if (diffDays === 1) {
  li.classList.add("due-soon");
  const warn = document.createElement("div");
  warn.textContent = "  📅 Due Tomorrow!";
  warn.classList.add("due-warning");
  li.appendChild(warn);
}
updateTaskStats();

}

//filter tasks

const filterSelect = document.querySelector("#filterSelect");

filterSelect.addEventListener("change",()=>{
  applyFilter(filterSelect.value);
});

function applyFilter(filter) {
  const filterToday = new Date().toISOString().split("T")[0];
  const tasks = document.querySelectorAll(".task-list li");
  
  tasks.forEach (li =>{
    const dueText = li.querySelector("small").textContent.replace("Due: ", "");
    const dueDate = dueText.trim();

    // if(dueDate<today) {
    //   li.classList.add("overdue");
    // } else{
    //   li.classList.remove("overdue");
    // }

    if (filter === "all"){
      li.style.display = "block";
    }
    else if(filter === "upcoming"){
      li.style.display = dueDate >= filterToday ? "block" : "none";
    }

    else if (filter === "overdue"){
      li.style.display = dueDate < filterToday ? "block" : "none";
    }

  });

}

//Them Switch  dark-light mode

const themeSwitch = document.getElementById("themeSwitch");

if (localStorage.getItem("theme") === "dark"){
  document.body.classList.add("dark-mode");
  themeSwitch.checked = true;
}

themeSwitch.addEventListener("change", ()=>{
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});


//completed/total tasks

function updateTaskStats() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const total = tasks.length;
  const completed = tasks.filter (t => t.completed) .length;

  document.getElementById("task-stats"). textContent = 
  `${completed}  / ${total}  complete ✔️`;
}



document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("navLinks").classList.toggle("open");
} );

function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("open");
}