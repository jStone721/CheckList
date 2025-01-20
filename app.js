import { initializeApp } from 'firebase/app';
import { doc, getDocs, addDoc, updateDoc, getFirestore, collection } from "firebase/firestore";

const sw = new URL('service-worker.js', import.meta.url)
if ('serviceWorker' in navigator) {
    const s = navigator.serviceWorker;
    s.register(sw.href, {
        scope: '/CheckList/'
    })
        .then(_ => console.log('Service Worker Registered for scope:', sw.href, 'with', import.meta.url))
        .catch(err => console.error('Service Worker Error:', err));
}

const firebaseConfig = {
    apiKey: "AIzaSyCuWLYWUJ2R4v6ptAKcL2jmXJPDSGl7uW0",
    authDomain: "info5146.firebaseapp.com",
    projectId: "info5146",
    storageBucket: "info5146.firebasestorage.app",
    messagingSenderId: "711911517967",
    appId: "1:711911517967:web:cadd485436fb294a85987a"
};
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

window.addEventListener('load', () => {
  renderTasks();
});

// Add Task
addTaskBtn.addEventListener('click', async () => {
    const task = taskInput.value.trim();
    if (task) {
        const taskInput = document.getElementById("taskInput");
        const taskText = sanitizeInput(taskInput.value.trim());

        if (taskText) {
            await addTaskToFirestore(taskText);
            renderTasks();
            taskInput.value = "";
        }
        renderTasks();
    }
});

// Remove Task
taskList.addEventListener('click', async (e) => {
  if (e.target.tagName === 'LI') {
    await updateDoc(doc(db, "todos", e.target.id), {
      completed: true
    });  
  }
  renderTasks();
});


async function renderTasks() {
    var tasks = await getTasksFromFirestore();
    taskList.innerHTML = "";
  
    tasks.forEach((task, index) => {
      if(!task.data().completed){
        const taskItem = document.createElement("li");
        taskItem.id = task.id;
        taskItem.textContent = task.data().text;
        taskList.appendChild(taskItem);
      }
    });
  }

  async function addTaskToFirestore(taskText) {
    await addDoc(collection(db, "todos"), {
      text: taskText, 
      completed: false
    });  
  }

  async function getTasksFromFirestore() {
    var data = await getDocs(collection(db, "todos"));
    let userData = [];
    data.forEach((doc) => {
      userData.push(doc);
  });
  return userData;
}

  function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

window.addEventListener('error', function (event) {
    console.error('Error occurred: ', event.message);
});


import log from "loglevel";

// Set the log level (trace, debug, info, warn, error)
log.setLevel("info");

// Example logs
log.info("Application started");
log.debug("Debugging information");
log.error("An error occurred");