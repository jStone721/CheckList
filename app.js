import {initializeApp} from "firebase/app";
import {
  doc,
  getDocs,
  addDoc,
  updateDoc,
  getFirestore,
  collection,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCvNrhGjhdT76Cfn0n2uf3-S0ne51hCJ1M",
  authDomain: "checklist-d85ed.firebaseapp.com",
  projectId: "checklist-d85ed",
  storageBucket: "checklist-d85ed.firebasestorage.app",
  messagingSenderId: "149443419441",
  appId: "1:149443419441:web:08ce3a2034962e6561e410",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sw = new URL("service-worker.js", import.meta.url);
if ("serviceWorker" in navigator) {
  const s = navigator.serviceWorker;
  s.register(sw.href, {
    scope: "/CheckList/",
  })
    .then(_ =>
      console.log(
        "Service Worker Registered for scope:",
        sw.href,
        "with",
        import.meta.url
      )
    )
    .catch(err => console.error("Service Worker Error:", err));
}

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Add Tasksss
addTaskBtn.addEventListener("click", async () => {
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
async function addTaskToFirestore(taskText) {
  await addDoc(collection(db, "todos"), {
    text: taskText,
    completed: false,
  });
}

async function renderTasks() {
  var tasks = await getTasksFromFirestore();
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    if (!task.data().completed) {
      const taskItem = document.createElement("li");
      taskItem.tabIndex = 0;
      taskItem.id = task.id;
      taskItem.textContent = task.data().text;
      taskList.appendChild(taskItem);
    }
  });
}
async function getTasksFromFirestore() {
  var data = await getDocs(collection(db, "todos"));
  let userData = [];
  data.forEach(doc => {
    userData.push(doc);
  });
  return userData;
}

function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}
// Remove Task on Click
taskList.addEventListener("click", e => {
  if (e.target.tagName === "LI") {
    e.target.remove();
  }
});
taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTaskBtn.click();
  }
});
taskList.addEventListener("keypress", async function (e) {
  if (e.target.tagName === "LI" && e.key === "Enter") {
    await updateDoc(doc(db, "todos", e.target.id), {
      completed: true,
    });
  }
  renderTasks();
});
if (task) {
  console.log("yes");
} else {
  alert("Please enter a task!");
}
window.addEventListener("error", event => {
  console.error("Error occured: ", event.message);
});
