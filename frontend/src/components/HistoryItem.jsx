import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    isActive ? "active-link" : "";

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="brand" onClick={() => navigate("/")}>
          <div className="brand-icon">♻</div>
          <span>EcoSort AI</span>
        </div>

        <div className="nav-links">
          <NavLink to="/" className={navClass}>
            Trang Chủ
          </NavLink>

          {user && (
            <NavLink to="/scan" className={navClass}>
              Quét AI
            </NavLink>
          )}

          {user && (
            <NavLink to="/history" className={navClass}>
              Lịch Sử
            </NavLink>
          )}

          <NavLink to="/guide" className={navClass}>
            Hướng Dẫn
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" className={navClass}>
              Thống Kê
            </NavLink>
          )}
        </div>

        {!user ? (
          <button
            className="start-btn"
            onClick={() => navigate("/login")}
          >
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