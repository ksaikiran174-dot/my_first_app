import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/api";
import "./users.css";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const navigate = useNavigate();

  // ✅ Load users
  const loadUsers = async () => {
    setLoading(true);

    try {
      const data = await getUsers();

      if (!data) {
        return;
      }

      setUsers(data);
    } catch (err) {
      setError("Failed to load users ❌");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ Delete user
  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      await deleteUser(id);
      await loadUsers();
      setMessage("User deleted successfully 🗑️");
    } catch (error) {
      setError(error?.message || "Failed to delete user ❌");
    }
  };

  const confirmDelete = async () => {
    console.log("YES CLICKED");
  setShowConfirm(false);

  try {
    await deleteUser(selectedUserId);
    await loadUsers();
    setMessage("User deleted successfully 🗑️");
  } catch (error) {
    setError(error?.message || "Failed to delete user ❌");
  }
};




  // ✅ Auto-hide messages
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
  <div className="users_page">
    <div
      className="container_users"
      style={{ textAlign: "center", marginTop: "50px" }}
    >
      <h2 className="title_for_users">Users List</h2>

      {/* ✅ Confirm Modal */}
      {showConfirm && (
        <div className="confirm_modal">
          <div className="modal_content">
            <p>Are you sure you want to delete this user?</p>

            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ✅ Messages */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ✅ Loading or Users */}
      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        users.map((user) => (
          <div
            className="usersList"
            key={user.id}
            style={{ marginBottom: "10px" }}
          >
            {user.name} - {user.email}

            <div className="buttons">
              <button
                className="delete_btn"
                onClick={() => {
                  console.log("Delete clicked");
                  setSelectedUserId(user.id);
                  setShowConfirm(true);
                }}
              >
                Delete
              </button>

              <button
                className="edit_btn"
                onClick={() => navigate("/home", { state: user })}
              >
                Edit
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)};