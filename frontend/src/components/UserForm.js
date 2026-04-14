import { useState, useEffect } from "react";
import "./UserForm.css";
import { createUser, updateUser } from "../api/api";

export default function UserForm({ editingUser, setEditingUser, loadUsers }) {
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
        // ✅ UPDATE
        await updateUser(editingUser.id, { name, email });
      } else {
        // ✅ CREATE
        await createUser({ name, email });
      }

      setName("");
      setEmail("");
      loadUsers();
      setEditingUser(null);

    } catch (error) {
      console.error("ERROR:", error);
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