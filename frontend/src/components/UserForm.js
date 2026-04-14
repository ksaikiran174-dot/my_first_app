import { useState, useEffect } from "react";
import "./UserForm.css";
import { BASE_URL } from "../api/api"
import { createUser, updateUser } from "../api/api";

export default function UserForm({ reload, editingUser, setEditingUser, loadUsers }) {
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

  if (editingUser) {
    try {
      if (editingUser) {
        // ✅ UPDATE
        await updateUser(editingUser.id, { name, email });
      } else {
        // ✅ CREATE
        await createUser({ name, email });
      }

      // ✅ clear form
      setName("");
      setEmail("");

      // ✅ reload users
      loadUsers();

      // ✅ reset editing
      setEditingUser(null);

    } catch (error) {
      console.error("ERROR:", error);
    }

  setName("");
  setEmail("");
  loadUsers();
  setEditingUser(null);
};

  return (
    <div className="form">
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      
      <button className="action_btn" onClick={handleSubmit}>{editingUser ? "Update User" : "Add User"}
      </button>
    </div>
  );
}
};
