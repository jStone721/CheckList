// The Firebase Admin SDK to access Firestore.
import { initializeApp } from 'firebase/app'
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";

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
    }
});

async function renderTasks() {
    const tasks = await getTasksFromFirestore();
    taskList.innerHTML = "";
  
    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.textContent = task.text;
      taskList.appendChild(taskItem);
    });
  }

  async function addTaskToFirestore(taskText) {
    await setDoc(doc(db, "todos", 404), {
      text: taskText, 
      completed: false
    });  
  }

  async function getTasksFromFirestore() {
    const userDoc = doc(db, "todos", 404);
    const userData = (await getDoc(userDoc)).data();
  
    return userData?.tasks || [];
  }

  function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

window.addEventListener('error', function (event) {
    console.error('Error occurred: ', event.message);
});