import { fetchData, showSnackbar } from './fetch.js';

const url = 'http://localhost:3000/api/entries';
const tableBody = document.getElementById('diary-tbody');
const shouldInit = !!tableBody;

const renderEntries = (entries) => {
  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (!Array.isArray(entries) || entries.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5">No entries found.</td>';
    tableBody.appendChild(row);
    return;
  }

  entries.forEach((entry) => {
    const readableDate = new Date(entry.entry_date).toLocaleDateString();
    const row = document.createElement('tr');

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

const getEntries = async () => {
  const data = await fetchData(url);
  if (!data.error) {
    renderEntries(data);
  }
};

if (shouldInit) {
  tableBody.addEventListener('click', async (event) => {
    const id = event.target.dataset.id;

    if (event.target.classList.contains('del')) {
      if (confirm('Are you sure you want to delete this entry?')) {
        const result = await fetchData(`${url}/${id}`, { method: 'DELETE' });
        if (!result.error) {
          showSnackbar(result.message || 'Entry deleted');
          getEntries();
        }
      }
    }

    if (event.target.classList.contains('check')) {
      const entryData = await fetchData(`${url}/${id}`);
      if (!entryData.error) {
        alert(
          `Diary Entry Info:\nDate: ${new Date(entryData.entry_date).toLocaleDateString()}\nMood: ${entryData.mood}\nWeight: ${entryData.weight} kg`
        );
      }
    }
  });

  getEntries();
}
