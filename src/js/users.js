import { fetchData, showSnackbar } from "./fetch.js";

const url = "http://127.0.0.1:3000/api/users";
const tbody = document.getElementById("users-tbody");
const addForm = document.getElementById("add-user-form");
const shouldInit = tbody || addForm;

const getUsers = async () => {
  const users = await fetchData(url);
  if (users.error || !tbody) return;

  tbody.innerHTML = "";
  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td><button class="delete-btn" data-id="${user.id}" style="color:red; cursor:pointer;">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
};

if (shouldInit && addForm) {
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newUser = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    const result = await fetchData(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!result.error) {
      showSnackbar(result.message || "User added successfully!");
      addForm.reset();
      getUsers();
    }
  });
}

if (shouldInit) {
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this user?")) {
        const result = await fetchData(`${url}/${id}`, { method: "DELETE" });
        if (!result.error) {
          showSnackbar(result.message || "User deleted!");
          getUsers();
        }
      }
    }
  });

  getUsers();
}