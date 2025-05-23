const accessPassword = "PASSWORD0303";
const adminPassword = "ADMIN9191";
let isAdmin = false;

function checkAccess() {
  const val = document.getElementById("accessPassword").value;
  if (val === accessPassword) {
    document.getElementById("gate").style.display = "none";
    document.getElementById("auth").style.display = "block";
  } else {
    alert("Incorrect password!");
  }
}

function signup() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (localStorage.getItem("user_" + user)) {
    document.getElementById("authMsg").textContent = "User already exists.";
  } else {
    localStorage.setItem("user_" + user, JSON.stringify({ password: pass, verified: false }));
    document.getElementById("authMsg").textContent = "User created. You can now log in.";
  }
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  const data = JSON.parse(localStorage.getItem("user_" + user));
  if (data && data.password === pass) {
    localStorage.setItem("loggedIn", user);
    document.getElementById("auth").style.display = "none";
    document.getElementById("main").style.display = "block";
    document.getElementById("loggedInUser").textContent = "Logged in as: " + user + (data.verified ? " ✅" : "");
    loadPosts();
  } else {
    document.getElementById("authMsg").textContent = "Invalid credentials.";
  }
}

function post() {
  const content = document.getElementById("postContent").value.trim();
  const user = localStorage.getItem("loggedIn");

  if (!content) return;

  const data = JSON.parse(localStorage.getItem("user_" + user));

  const post = {
    user: user,
    verified: data.verified,
    content: content,
    time: new Date().toLocaleString()
  };

  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.unshift(post);
  localStorage.setItem("posts", JSON.stringify(posts));
  loadPosts();
  document.getElementById("postContent").value = "";
}

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const currentUser = localStorage.getItem("loggedIn");
  const postDiv = document.getElementById("posts");
  postDiv.innerHTML = "";

  posts.forEach((p, index) => {
    const canDelete = p.user === currentUser || isAdmin;
    const deleteBtn = canDelete ? `<button onclick="deletePost(${index})">Delete</button>` : "";

    postDiv.innerHTML += `
      <div class="post">
        <strong>${p.user}${p.verified ? " ✅" : ""}</strong><br>
        ${p.content}<br>
        <small>${p.time}</small><br>
        ${deleteBtn}
      </div>
    `;
  });
}

function deletePost(index) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.splice(index, 1);
  localStorage.setItem("posts", JSON.stringify(posts));
  loadPosts();
}

function adminLogin() {
  const pw = prompt("Enter admin password:");
  if (pw === adminPassword) {
    isAdmin = true;
    document.getElementById("adminPanel").style.display = "block";
    alert("Admin mode enabled.");
    loadPosts(); // Refresh to show delete buttons
  } else {
    alert("Wrong admin password.");
  }
}

function verifyUser() {
  const name = document.getElementById("verifyUsername").value;
  const data = JSON.parse(localStorage.getItem("user_" + name));
  if (data) {
    data.verified = true;
    localStorage.setItem("user_" + name, JSON.stringify(data));
    alert(name + " is now verified.");
    loadPosts(); // Update post verification labels
  } else {
    alert("User not found.");
  }
}
