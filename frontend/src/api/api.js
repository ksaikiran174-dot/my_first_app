// Production: set REACT_APP_API_URL when you run `npm run build` (hosting dashboard / CI).
// If unset, Create React App falls back to local dev only — deployed sites will break.
const BASE_URL = (process.env.REACT_APP_API_URL || "http://127.0.0.1:8000").replace(
  /\/$/,
  ""
);

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

function formatErrorDetail(detail) {
  if (detail == null) return null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.msg || JSON.stringify(item)
      )
      .join("; ");
  }
  if (typeof detail === "object" && detail.msg) return detail.msg;
  return JSON.stringify(detail);
}

/** Wraps fetch so "Failed to fetch" gets a short, actionable hint for prod misconfig. */
async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (e) {
    const msg = typeof e?.message === "string" ? e.message : "";
    const isNetwork =
      e instanceof TypeError || /network|fetch|load failed/i.test(msg);
    if (isNetwork) {
      throw new Error(
        `Cannot reach the API (${BASE_URL}). If this is a live site: set REACT_APP_API_URL to your API base URL when building the frontend; use HTTPS if your site is HTTPS; and add this site's exact origin to CORS_ORIGINS on the server.`
      );
    }
    throw e;
  }
}

export const createUser = async (user) => {
  const res = await safeFetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });
  return handleResponse(res);
};

export const deleteUser = async (id) => {
  const res = await safeFetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const updateUser = async (id, user) => {
  const res = await safeFetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });

  return handleResponse(res);
};

export const loginUser = async (data) => {
  const res = await safeFetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const signupAdmin = async (data) => {
  const res = await safeFetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const getUsers = async () => {
  const res = await safeFetch(`${BASE_URL}/users`, {
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
      formatErrorDetail(data?.detail) ||
      data?.error ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
};
