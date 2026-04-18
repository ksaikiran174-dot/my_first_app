import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupAdmin } from "../api/api";
import Toast from "../components/Toast";
import "./signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const showToast = (message, variant = "info") => {
    setToast({ message, variant, key: Date.now() });
  };

  const handleSignup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedCompanyCode = companyCode.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedCompanyCode) {
      showToast("All fields are required", "error");
      return;
    }

    setLoading(true);

    try {
      await signupAdmin({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        company_code: trimmedCompanyCode,
      });

      showToast("Admin created. Please login ✅", "success");
      setTimeout(() => navigate("/"), 900);
    } catch (e) {
      showToast(e?.message || "Signup failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup_page">
      <div className="signup_container">
        <h2 className="signup_title">Create Admin</h2>
        <p className="signup_subtitle">Set up your secure administrator account</p>

        <input
          className="signup_input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="signup_input"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="signup_input"
          placeholder="Password (min 8 characters)"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="signup_input"
          placeholder="Company code"
          type="password"
          value={companyCode}
          onChange={(e) => setCompanyCode(e.target.value)}
        />

        <button className="signup_btn" onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Create Admin"}
        </button>

        <button className="signup_link" onClick={() => navigate("/")} disabled={loading}>
          Back to login
        </button>
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

