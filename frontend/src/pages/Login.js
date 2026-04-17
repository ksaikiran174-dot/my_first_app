import { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./login.css"
import Toast from "../components/Toast";

export default function Login({ setIsLoggedIn}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const res = await loginUser({ email, password });

    if (res && res.access_token) {
      localStorage.setItem("token", res.access_token);
      setIsLoggedIn(true);
      navigate("/home");
    } else {
      setToast({ message: "Login failed ❌", variant: "error", key: Date.now() });
    }
  } catch (e) {
    setToast({ message: e?.message || "Login failed ❌", variant: "error", key: Date.now() });
  }
};

  return (
    <div className="login_page">
      <div className="container" style={{ textAlign: "center", marginTop: "100px" }}>
        <h2 className="_h2">Login</h2>
        <br />
        <br />

        <input
          className="_input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />

        <input
          className="_input"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />

        <button className="_button" onClick={handleLogin}>
          Login
        </button>

        <div style={{ marginTop: "16px" }}>
          <button className="_button" onClick={() => navigate("/signup")}>
            Create new admin
          </button>
        </div>
      </div>

      <Toast
        open={!!toast}
        message={toast?.message}
        variant={toast?.variant}
        onClose={() => setToast(null)}
      />
    </div>
  );
}