import { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./login.css"

export default function Login({ setIsLoggedIn}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleLogin = async () => {
    const res = await loginUser({
      email
    , password
    });



    console.log("RESPONSE:", res);
    if (res && res.access_token) {
      localStorage.setItem("token", res.access_token);

     console.log("TOKEN AFTER LOGIN:", localStorage.getItem("token")); 
    setIsLoggedIn(true);
    navigate("/home");
    } else {
      alert("Something went wrong");
    }
};

  return ( <div className="login_page">
    <div className="container" style={{ textAlign: "center", marginTop: "100px" }}>
      <h2 className="_h2" >Login</h2><br /><br />

      <input className="_input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input className="_input"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button className="_button" onClick={handleLogin}>Login</button>
    </div></div>
  );
}