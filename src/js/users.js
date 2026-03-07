
// AI-avusteinen: moduulin rakenne ja CRUD-kutsut viimeistelty Copilotin avulla.
import { fetchData, apiUrl } from "./fetch.js";

export const getUsers = async () => fetchData(apiUrl("/users"));

export const createUser = async (user) => {
  return fetchData(apiUrl("/users"), {
    method: "POST",
    body: JSON.stringify(user),
  });
};

export const deleteUser = async (id) => {
  return fetchData(apiUrl(`/users/${id}`), { method: "DELETE" });
};

// Protected: only your own id is allowed by backend
export const updateUser = async (id, patch) => {
  return fetchData(apiUrl(`/users/${id}`), {
    method: "PUT",
    body: JSON.stringify(patch),
  });
};

const usersTbody = document.getElementById("users-tbody");
const addUserForm = document.getElementById("add-user-form");
const shouldInit = usersTbody || addUserForm;

const renderUsers = (users) => {
  if (!usersTbody) return;
  usersTbody.innerHTML = "";

  if (!Array.isArray(users) || users.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = "<td colspan=\"3\">No users found.</td>";
    usersTbody.appendChild(row);
    return;
  }

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td><button class="del" data-id="${user.id}">Delete</button></td>
    `;
    usersTbody.appendChild(row);
  });
};

const loadUsers = async () => {
  const data = await getUsers();
  if (!data?.error) renderUsers(data);
};

if (shouldInit && usersTbody) {
  usersTbody.addEventListener("click", async (event) => {
    if (!event.target.classList.contains("del")) return;
    const id = event.target.dataset.id;
    if (!id) return;
    if (confirm("Delete this user?")) {
      const result = await deleteUser(id);
      if (!result?.error) loadUsers();
    }
  });
}

if (shouldInit && addUserForm) {
  addUserForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const user = {
      username: document.getElementById("username")?.value?.trim(),
      email: document.getElementById("email")?.value?.trim(),
      password: document.getElementById("password")?.value,
    };

    const result = await createUser(user);
    if (!result?.error) {
      addUserForm.reset();
      loadUsers();
    }
  });
}

if (shouldInit) {
  loadUsers();
}