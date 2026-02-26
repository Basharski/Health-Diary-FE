

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