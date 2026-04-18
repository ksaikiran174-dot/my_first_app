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
      <div className="container login_card">
        <h2 className="_h2">Login</h2>

        <input
          className="_input"
          placeholder="Email"
          type="email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="_input"
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="_button _button--primary" onClick={handleLogin}>
          Login
        </button>

        <div className="login_secondary">
          <button className="_button _button--link" onClick={() => navigate("/signup")}>
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