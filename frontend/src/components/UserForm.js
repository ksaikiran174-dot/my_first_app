import { useState, useEffect } from "react";
import { createUser, updateUser } from "../api/api";
import "./UserForm.css";

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
  if (editingUser) {
    // UPDATE
    await fetch(`http://127.0.0.1:8000/users/${editingUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
  } else {
    // CREATE
    await fetch("http://127.0.0.1:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
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

