import { useEffect, useState, useCallback } from "react";
import { getUsers} from "../api/api";
import UserForm from "../components/UserForm";
import "./Home.css";
import { useNavigate , useLocation } from "react-router-dom";
import Toast from "../components/Toast";


export default function Home({ setIsLoggedIn }) {
  const [, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [navigatingUsers, setNavigatingUsers] = useState(false);

  const showToast = (message, variant = "info") => {
    setToast({ message, variant, key: Date.now() });
  };


  
  useEffect(() => {
  if (location.state) {
    setEditingUser(location.state);

    // ✅ CLEAR STATE AFTER USING
    navigate(location.pathname, { replace: true });
  }
}, [location.state, navigate, location.pathname]);


const loadUsers = useCallback(async () => {
  setLoading(true);

  try {
    const data = await getUsers();

    if (!data) return;
    setUsers(data);

  } catch (err) {
    showToast("Failed to load users ❌", "error");
  }

  setLoading(false);
}, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);


  const handleLogout = () => {
  localStorage.removeItem("token");
  setIsLoggedIn(false);    
  navigate("/");      
  };


  return (

    <div className="home_page">
      <div className="_container">
        <h2 className="title">USER PAGE</h2>
        <button onClick={handleLogout} className="logout_btn" >
          Logout
        </button>

        <UserForm
          loadUsers={loadUsers}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          showToast={showToast}
        />

        <br />
        <br />
        <h2 style={{ fontFamily: "Lato", fontWeight: "bold" }}>Existing users :</h2>

        {loading ? (
          <div className="home_page_loader" role="status" aria-label="Loading">
            <span className="home_page_loader__bar" />
            <span className="home_page_loader__bar" />
            <span className="home_page_loader__bar" />
            <span className="home_page_loader__bar" />
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <button
              className="existing_users"
              disabled={navigatingUsers}
              onClick={() => {
                setNavigatingUsers(true);
                navigate("/users");
              }}
            >
              {navigatingUsers ? (
                <span className="home_btn_loader" aria-hidden="true">
                  <span className="home_btn_loader__track">
                    <span className="home_btn_loader__shimmer" />
                  </span>
                  <span className="home_btn_loader__label">Opening…</span>
                </span>
              ) : (
                "Show Existing Users"
              )}
            </button>
          </div>
        )}
      </div>

      <Toast
        open={!!toast}
        message={toast?.message}
        variant={toast?.variant}
        onClose={() => setToast(null)}
      />
    </div>
  );
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