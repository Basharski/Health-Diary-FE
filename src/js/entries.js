import { fetchData, showSnackbar } from "./fetch.js";

const baseUrl = "http://127.0.0.1:3000/api/entries";
const fallbackUrl = "/diary.json";

const tableBody = document.getElementById("diary-tbody");
const cardContainer = document.getElementById("diary-cards");
const refreshButton = document.getElementById("refresh-entries");
const shouldInit = !!tableBody || !!cardContainer;

let usingFallback = false;

const buildListUrl = () => {
  const userId = localStorage.getItem("userId");
  if (userId) return `${baseUrl}?userId=${encodeURIComponent(userId)}`;
  return baseUrl;
};

const renderTable = (entries) => {
  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (!Array.isArray(entries) || entries.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = "<td colspan=\"5\">No entries found.</td>";
    tableBody.appendChild(row);
    return;
  }

  entries.forEach((entry) => {
    const readableDate = new Date(entry.entry_date).toLocaleDateString();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${readableDate}</td>
      <td>${entry.mood}</td>
      <td>${entry.weight} kg</td>
      <td><button class="check" data-id="${entry.entry_id}">Info</button></td>
      <td><button class="del" data-id="${entry.entry_id}">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
};

const renderCards = (entries) => {
  if (!cardContainer) return;
  cardContainer.innerHTML = "";

  if (!Array.isArray(entries) || entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "diary-empty";
    empty.textContent = "No diary entries yet.";
    cardContainer.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const readableDate = new Date(entry.entry_date).toLocaleDateString();
    const card = document.createElement("article");
    card.className = "diary-card";
    card.innerHTML = `
      <header class="diary-card__top">
        <div>
          <p class="diary-card__date">${readableDate}</p>
          <p class="diary-card__mood">${entry.mood}</p>
        </div>
        <span class="diary-card__weight">${entry.weight} kg</span>
      </header>
      <div class="diary-card__meta">
        <span>${entry.sleep_hours ?? "-"} h sleep</span>
        <span>#${entry.entry_id}</span>
      </div>
      <p class="diary-card__notes">${entry.notes || "No notes added."}</p>
      <div class="diary-card__actions">
        <button class="check" data-id="${entry.entry_id}">Info</button>
        <button class="del" data-id="${entry.entry_id}">Delete</button>
      </div>
    `;
    cardContainer.appendChild(card);
  });
};

const renderEntries = (entries) => {
  renderTable(entries);
  renderCards(entries);
};

const getEntries = async () => {
  usingFallback = false;
  const data = await fetchData(buildListUrl());

  if (!data.error) {
    renderEntries(data);
    if (!localStorage.getItem("userId")) {
      showSnackbar("Not logged in; showing all demo entries.", true);
    }
    return;
  }

  const localData = await fetchData(fallbackUrl);
  if (!localData.error) {
    usingFallback = true;
    renderEntries(localData);
    showSnackbar("API unavailable, showing local diary data.", true);
  }
};

const handleAction = async (event) => {
  const id = event.target.dataset.id;
  if (!id) return;

  if (event.target.classList.contains("del")) {
    if (usingFallback) {
      showSnackbar("Demo data in use — deleting is disabled.", true);
      return;
    }

    if (confirm("Are you sure you want to delete this entry?")) {
      const result = await fetchData(`${baseUrl}/${id}`, { method: "DELETE" });
      if (!result.error) {
        showSnackbar(result.message || "Entry deleted");
        getEntries();
      }
    }
  }

  if (event.target.classList.contains("check")) {
    const entryData = await fetchData(`${baseUrl}/${id}`);
    if (!entryData.error) {
      alert(
        `Diary Entry Info:\nDate: ${new Date(entryData.entry_date).toLocaleDateString()}\nMood: ${entryData.mood}\nWeight: ${entryData.weight} kg`
      );
    }
  }
};

if (shouldInit) {
  if (tableBody) tableBody.addEventListener("click", handleAction);
  if (cardContainer) cardContainer.addEventListener("click", handleAction);
  if (refreshButton) refreshButton.addEventListener("click", getEntries);
  getEntries();
}