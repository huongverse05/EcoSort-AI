import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import History from "./pages/History";
import Guide from "./pages/Guide";
import Statistics from "./pages/Statistics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Leaderboard from "./pages/Leaderboard";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="app">
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/scan" element={<Scan user={user} />} />

        <Route path="/leaderboard" element={<Leaderboard user={user} />} />

        <Route
        path="/history"
        element={user ? <History user={user} /> : <Navigate to="/login" />}
        />

        <Route
        path="/statistics"
        element={user?.role === "admin" ? <Statistics /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}