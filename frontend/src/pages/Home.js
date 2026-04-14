import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/api";
import UserForm from "../components/UserForm";
import "./Home.css";
import { useNavigate , useLocation } from "react-router-dom";


export default function Home({ setIsLoggedIn }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
  if (location.state) {
    setEditingUser(location.state);   // 🔥 connect both
  }
}, [location.state]);

  const loadUsers = async () => {
    const data = await getUsers();
    

    if (data.detail === "Invalid token") {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/");
  } else {
    setUsers(data);
  }
  };

    useEffect(() => {
      loadUsers();
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  setIsLoggedIn(false);    
  navigate("/");      
  };


  return (
    <div className="home_page">
    <div className="_container">
      <h2 className="title">USER PAGE</h2>

      <button onClick={handleLogout} className="logout_btn" >Logout</button>

      <UserForm loadUsers={loadUsers}
                editingUser={editingUser}
                setEditingUser={setEditingUser} />
       <br />< br /><h2 style={{fontFamily: "Lato", fontWeight: "bold"}}>Existing users :</h2>

      <div style={{ marginTop: "20px" }}>
        
            <button className="existing_users" onClick={() => navigate("/users")}>
                Show Existing Users
            </button>
          </div>
          </div></div>
        )
        };
        

      
  











// {users.map((user, index) => (
//           <div
//             className="user-row"
//             key={user.id}
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginBottom: "10px",
//               padding: "10px",
//               border: "1px solid #eee",
//               borderRadius: "5px",
//               alignContent: "center",
//             }}
//           >
//             <span>
//               {index + 1}. {user.name}  {user.email}
//             </span>

//             <div style={{display: "flex", gap: "15px "}}>
//             <button className="delete"
//               onClick={() => handleDelete(user.id)}
//             >Delete</button>
//             <button className="edit" onClick={() => setEditingUser(user)}>Edit</button>