import Home from "./pages/Home";
import { useState } from "react";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Users from "./pages/users";
import Signup from "./pages/Signup";

function App() {
      const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/home" />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/home" />}
        />

        {/* HOME (PROTECTED) */}
        <Route
          path="/home"
          element={isLoggedIn ? < Home setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        />

        <Route
           path="/users"
            element={isLoggedIn ? <Users /> : <Navigate to="/" />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
















//   const [isLoggedIn, setIsLoggedIn] = useState(
//     !!localStorage.getItem("token")
//   );

//   return (
//     <>
//       {isLoggedIn ? (
//         <Home setIsLoggedIn={setIsLoggedIn} />
//       ) : (
//         <Login setIsLoggedIn={setIsLoggedIn} />
//       )}
//     </>
//   );
// }