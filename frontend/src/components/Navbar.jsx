import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="brand" onClick={() => navigate("/")}>
          <div className="brand-icon">♻</div>
          <span>EcoSort AI</span>
        </div>

        <div className="nav-links">
          <NavLink to="/">Trang Chủ</NavLink>

          <NavLink to="/scan">Quét AI</NavLink>

          {user && <NavLink to="/history">Lịch Sử</NavLink>}

          <NavLink to="/guide">Hướng Dẫn</NavLink>

          {user?.role === "admin" && (
            <NavLink to="/statistics">Thống Kê</NavLink>
          )}
        </div>

        {!user ? (
          <button className="start-btn" onClick={() => navigate("/login")}>
            Bắt Đầu Ngay
          </button>
        ) : (
          <div className="user-box">
            <span>
            {user.role === "admin" ? "👑 " : "👤 "}
            {user.name}
            </span>
            <button className="logout-btn" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}