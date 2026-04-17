import { useCallback, useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/api";
import "./users.css";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import Toast from "../components/Toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  const showToast = useCallback((message, variant = "info") => {
    setToast({ message, variant, key: Date.now() });
  }, []);

  // ✅ Load users
  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getUsers();

      if (!data) {
        return;
      }

      setUsers(data);
    } catch (err) {
      showToast("Failed to load users ❌", "error");
    }

    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openDeleteConfirm = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowConfirm(false);
    setSelectedUser(null);
  };

  const confirmDelete = async () => {
  const userId = selectedUser?.id;
  closeDeleteConfirm();

  try {
    if (!userId) return;
    await deleteUser(userId);
    await loadUsers();
    showToast("User deleted successfully 🗑️", "success");
  } catch (error) {
    showToast(error?.message || "Failed to delete user ❌", "error");
  }
};

  // ✅ Close modal on ESC
  useEffect(() => {
    if (!showConfirm) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeDeleteConfirm();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showConfirm]);



  return (
  <div className="users_page">
    <div
      className="container_users"
      style={{ textAlign: "center", marginTop: "50px" }}
    >
      <h2 className="title_for_users">Users List</h2>

      {/* ✅ Loading or Users */}
      {loading ? (
        <div className="users_spinner" role="status" aria-label="Loading users">
          <span className="users_spinner_ring" aria-hidden="true" />
        </div>
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
                type="button"
                onClick={() => openDeleteConfirm(user)}
              >
                Delete
              </button>

              <button
                className="edit_btn"
                type="button"
                onClick={() => navigate("/home", { state: user })}
              >
                Edit
              </button>
            </div>
          </div>
        ))
      )}
    </div>

    {/* ✅ Confirm Modal (Portal to body so it's never hidden) */}
    {showConfirm &&
      createPortal(
        <div
          className="confirm_modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          aria-describedby="delete-desc"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeDeleteConfirm();
          }}
        >
          <div className="modal_content" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal_header">
              <h3 id="delete-title">Delete user?</h3>
            </div>

            <p id="delete-desc" className="modal_desc">
              This will permanently delete{" "}
              <span className="modal_user">
                {selectedUser?.name}
                {selectedUser?.email ? ` (${selectedUser.email})` : ""}
              </span>
              .
            </p>

            <div className="modal_actions">
              <button
                className="modal_btn modal_btn--ghost"
                type="button"
                onClick={closeDeleteConfirm}
              >
                Cancel
              </button>
              <button
                className="modal_btn modal_btn--danger"
                type="button"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    <Toast
      open={!!toast}
      message={toast?.message}
      variant={toast?.variant}
      onClose={() => setToast(null)}
    />
  </div>
)};