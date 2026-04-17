const BASE_URL = "https://my-first-app-2byt.onrender.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createUser = async (user) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });
  return handleResponse(res);
};

export const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const updateUser = async (id, user) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });

  return handleResponse(res);
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const getUsers = async () => {           
  const res = await fetch(`${BASE_URL}/users`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};

const handleResponse = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : { detail: await res.text() };

  const token = localStorage.getItem("token");

  if (
    token &&
    (data.detail === "Invalid token" || data.detail === "Token expired")
  ) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }

  if (!res.ok) {
    const message =
      data?.detail ||
      data?.error ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
};

