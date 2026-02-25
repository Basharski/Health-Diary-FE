import { fetchData, showSnackbar } from "./fetch.js";

const url = "http://127.0.0.1:3000/api/items";

const tableBody = document.getElementById("items-tbody");
const infoBox = document.getElementById("item-info");
const addForm = document.getElementById("add-item-form");
const updateForm = document.getElementById("update-item-form");
const getForm = document.getElementById("get-item-form");
const deleteForm = document.getElementById("delete-item-form");
const shouldInit = tableBody || addForm || updateForm || getForm || deleteForm;

const renderItems = (items) => {
  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = "<td colspan=\"4\">No items found.</td>";
    tableBody.appendChild(row);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td><button class="check" data-id="${item.id}">Info</button></td>
      <td><button class="del" data-id="${item.id}">Delete</button></td>
      <td>${item.id}</td>
    `;
    tableBody.appendChild(row);
  });
};

const setInfo = (message) => {
  if (!infoBox) return;
  infoBox.textContent = message;
};

const getItems = async () => {
  const data = await fetchData(url);
  if (!data.error) renderItems(data);
};

const getItemById = async (id) => {
  const data = await fetchData(`${url}/${id}`);
  if (!data.error) setInfo(`Item #${data.id}: ${data.name}`);
};

if (shouldInit && tableBody) {
  tableBody.addEventListener("click", async (event) => {
    const id = event.target.dataset.id;

    if (event.target.classList.contains("del")) {
      if (confirm("Delete this item?")) {
        const result = await fetchData(`${url}/${id}`, { method: "DELETE" });
        if (!result.error) {
          showSnackbar(result.message || "Item deleted");
          getItems();
        }
      }
    }

    if (event.target.classList.contains("check")) {
      await getItemById(id);
    }
  });
}

if (shouldInit && addForm) {
  addForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newItem = {
      name: document.getElementById("item-name").value.trim(),
      weight: Number(document.getElementById("item-weight").value),
    };

    const result = await fetchData(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    if (!result.error) {
      showSnackbar(result.message || "Item added");
      addForm.reset();
      getItems();
    }
  });
}

if (shouldInit && updateForm) {
  updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("update-item-id").value;
    const updateItem = {
      name: document.getElementById("update-item-name").value.trim(),
      weight: Number(document.getElementById("update-item-weight").value),
    };

    const result = await fetchData(`${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateItem),
    });

    if (!result.error) {
      showSnackbar(result.message || "Item updated");
      updateForm.reset();
      getItems();
    }
  });
}

if (shouldInit && getForm) {
  getForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("get-item-id").value;
    await getItemById(id);
  });
}

if (shouldInit && deleteForm) {
  deleteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("delete-item-id").value;
    if (!id) return;
    if (confirm("Delete this item?")) {
      const result = await fetchData(`${url}/${id}`, { method: "DELETE" });
      if (!result.error) {
        showSnackbar(result.message || "Item deleted");
        deleteForm.reset();
        getItems();
      }
    }
  });
}

if (shouldInit) {
  getItems();
}