import { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./login.css"
import Toast from "../components/Toast";

export default function Login({ setIsLoggedIn}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleLogin = async () => {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  if (!trimmedEmail || !trimmedPassword) {
    setToast({ message: "All fields are required", variant: "error", key: Date.now() });
    return;
  }

  setLoading(true);
  try {
    const res = await loginUser({ email: trimmedEmail, password: trimmedPassword });

    if (res && res.access_token) {
      localStorage.setItem("token", res.access_token);
      setIsLoggedIn(true);
      navigate("/home");
    } else {
      setToast({ message: "Login failed ❌", variant: "error", key: Date.now() });
    }
  } catch (e) {
    setToast({ message: e?.message || "Login failed ❌", variant: "error", key: Date.now() });
  } finally {
    setLoading(false);
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

        <button className="_button _button--primary" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="login_secondary">
          <button className="_button _button--link" onClick={() => navigate("/signup")} disabled={loading}>
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