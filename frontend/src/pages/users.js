import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/api";
import "./users.css";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();

    console.log("USERS DATA:", data);

  if (data.detail) {
    alert("Session expired, login again");
    return;
    }

    setUsers(data);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  return (<div className="users_page">
    <div className="container_users" style={{ textAlign: "center", marginTop: "50px" }}>
      <h2 className="title_for_users">Users List</h2>

      {users.map((user) => (
        <div className="usersList" key={user.id} style={{ marginBottom: "10px" }}>
          {user.name} - {user.email}
          <div className="buttons">
          <button className="delete_btn" onClick={() => handleDelete(user.id)}>Delete</button>
          <button className="edit_btn" onClick={() => navigate("/home", { state: user })}>Edit</button>
          </div>
        </div>
      ))}
    </div></div>
  );
}