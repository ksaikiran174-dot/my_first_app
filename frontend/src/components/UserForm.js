import { useState, useEffect } from "react";
import "./UserForm.css";
import { BASE_URL } from "../api/api"

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
    console.log("UPDATING USER...");

    await fetch(`${BASE_URL}/users/${editingUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ name, email }),
    });

  } else {
    console.log("CREATING USER...");

    await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
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

