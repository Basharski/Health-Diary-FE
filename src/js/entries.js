
// AI-avusteinen: entries-CRUD-kutsujen runko tarkennettu Copilotin avulla.
import { fetchData, apiUrl } from "./fetch.js";

export const getEntries = async () => {
  // Protected: requires token
  return fetchData(apiUrl("/entries"));
};

export const createEntry = async (entry) => {
  // Protected; backend uses token userId (do NOT send userId from FE)
  return fetchData(apiUrl("/entries"), {
    method: "POST",
    body: JSON.stringify(entry),
  });
};

export const updateEntry = async (id, patch) => {
  return fetchData(apiUrl(`/entries/${id}`), {
    method: "PUT",
    body: JSON.stringify(patch),
  });
};

export const deleteEntry = async (id) => {
  return fetchData(apiUrl(`/entries/${id}`), { method: "DELETE" });
};