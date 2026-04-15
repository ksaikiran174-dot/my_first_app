import { useState, useEffect } from "react";
import "./UserForm.css";
import { createUser, updateUser } from "../api/api";

export default function UserForm({ editingUser, setEditingUser, loadUsers, setMessage, setError }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name || "");
      setEmail(editingUser.email || "");
    }
  }, [editingUser]);

  const handleSubmit = async () => {
  console.log("EDITING USER:", editingUser);

  try {
    if (editingUser) {
      await updateUser(editingUser.id, { name, email });
      await loadUsers();
      setMessage("User updated successfully ✅");
    } else {
      await createUser({ name, email });
      await loadUsers();
      setMessage("User created successfully ✅");
    }

    setName("");
    setEmail("");
    setError("");
    setEditingUser(null);

  } catch (error) {
    console.error("ERROR:", error);
    setError("Something went wrong ❌");
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