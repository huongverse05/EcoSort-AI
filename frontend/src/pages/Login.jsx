import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const uid = userCredential.user.uid;
      const userEmail = userCredential.user.email;

      const userDoc = await getDoc(doc(db, "users", uid));

      const userData = userDoc.exists()
        ? userDoc.data()
        : {
            name: "Người dùng",
            role: "user",
          };

      const loginUser = {
        uid,
        email: userEmail,
        role: userData.role || "user",
        name: userData.name || userEmail,
      };

      localStorage.setItem("currentUser", JSON.stringify(loginUser));
      setUser(loginUser);

      navigate("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error.code, error.message);
      alert("Đăng nhập thất bại: " + error.code);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={login}>
        <div className="auth-logo">♻</div>

        <h1>Đăng nhập EcoSort AI</h1>
        <p>Đăng nhập để quét rác, xem lịch sử và sử dụng hệ thống.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Đăng nhập</button>

        <span className="auth-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </span>
      </form>
    </main>
  );
}