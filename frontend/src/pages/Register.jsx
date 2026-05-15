import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();

    try {
      // Tạo tài khoản Authentication
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const uid = userCredential.user.uid;

      // Tạo document Firestore
      await setDoc(doc(db, "users", uid), {
        name: name.trim(),
        email: email.trim(),
        role: "user", // AUTO USER
        createdAt: serverTimestamp(),
      });

      alert("Đăng ký thành công!");

      navigate("/login");
    } catch (error) {
      console.log(error);

      if (error.code === "auth/email-already-in-use") {
        alert("Email đã tồn tại.");
      } else if (error.code === "auth/weak-password") {
        alert("Mật khẩu phải từ 6 ký tự.");
      } else {
        alert("Lỗi: " + error.code);
      }
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={register}>
        <div className="auth-logo">♻</div>

        <h1>Đăng ký tài khoản</h1>

        <p>
          Tạo tài khoản để sử dụng hệ thống phân loại
          rác thông minh.
        </p>

        <input
          type="text"
          placeholder="Họ và tên"
          required
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          required
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Đăng ký
        </button>

        <span className="auth-link">
          Đã có tài khoản?
          <Link to="/login">
            {" "}
            Đăng nhập
          </Link>
        </span>
      </form>
    </main>
  );
}