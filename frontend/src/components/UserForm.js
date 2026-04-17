import { useState, useEffect } from "react";
import "./UserForm.css";
import { createUser, updateUser } from "../api/api";

export default function UserForm({ editingUser, setEditingUser, loadUsers, showToast }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name || "");
      setEmail(editingUser.email || "");
    }
  }, [editingUser]);

  const handleSubmit = async () => {
  try {
    if (editingUser) {
      await updateUser(editingUser.id, { name, email });
      await loadUsers();
      showToast?.("User updated successfully ✅", "success");
    } else {
      await createUser({ name, email });
      await loadUsers();
      showToast?.("User created successfully ✅", "success");
    }

    setName("");
    setEmail("");
    setEditingUser(null);

  } catch (error) {
    showToast?.(error?.message || "Something went wrong ❌", "error");
  }
};
  return (
    <div className="form">
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button className="action_btn" onClick={handleSubmit}>
        {editingUser ? "Update User" : "Add User"}
      </button>
    </div>
  );
}