import axios from 'axios';


const BASE_URL = "http://127.0.0.1:8000";

export const createUser = async (user) => {
  const res = await fetch(`${BASE_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const deleteUser = async (id) => {
    await fetch(`http://127.0.0.1:8000/users/${id}`, {
        method: "DELETE",
    });
};

export const updateUser = async (id, user) => {
  const res = await fetch(`http://127.0.0.1:8000/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return handleResponse(res);
};


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};


export const loginUser = async (data) => {
  const res = await fetch("http://127.0.0.1:8000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(res);   
};


export const getUsers = async () => {           
  const res = await fetch(`${BASE_URL}/users`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};

const token = localStorage.getItem("token");

fetch("http://127.0.0.1:8000/users", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


const handleResponse = async (res) => {
  const data = await res.json();

  // 🔥 Only logout if token exists
  const token = localStorage.getItem("token");

  if (
    token &&
    (data.detail === "Invalid token" || data.detail === "Token expired")
  ) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }

  return data;
};

