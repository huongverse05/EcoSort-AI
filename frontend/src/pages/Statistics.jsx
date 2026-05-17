import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function Statistics() {
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);

  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    status: "Hoạt động",
  });

  const fetchData = async () => {
    try {
      const historySnap = await getDocs(
        collection(db, "history")
      );

      const usersSnap = await getDocs(
        collection(db, "users")
      );

      const historyData = historySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const usersData = usersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistory(historyData);
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // THỐNG KÊ
  // =========================

  const totalScans = history.length;

  const recyclable = history.filter(
    (item) => item.type === "RECYCLABLE"
  ).length;

  const nonRecyclable = history.filter(
    (item) => item.type === "NON_RECYCLABLE"
  ).length;

  const hazardous = history.filter(
    (item) => item.type === "HAZARDOUS"
  ).length;

  const unknown = history.filter(
    (item) =>
      item.type !== "RECYCLABLE" &&
      item.type !== "NON_RECYCLABLE" &&
      item.type !== "HAZARDOUS"
  ).length;

  // =========================
  // USER SCAN COUNT
  // =========================

  const getUserScans = (user) => {
    return history.filter(
      (item) =>
        item.uid === user.id ||
        item.email === user.email
    ).length;
  };

  // =========================
  // EXPORT CSV
  // =========================

  const exportReport = () => {
    const rows = [
      [
        "Email",
        "Loai rac",
        "Nhom",
        "Do tin cay",
        "Huong dan",
      ],

      ...history.map((item) => [
        item.email || "guest",
        item.class || "Unknown",
        item.type || "Unknown",
        item.confidence || 0,
        item.guide || "",
      ]),
    ];

    const csv = rows
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "ecosort-report.csv";

    a.click();

    URL.revokeObjectURL(url);
  };

  // =========================
  // EDIT USER
  // =========================

  const openEdit = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      status: user.status || "Hoạt động",
    });
  };

  const saveEdit = async () => {
    try {
      if (!editingUser) return;

      await updateDoc(
        doc(db, "users", editingUser.id),
        {
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
        }
      );

      setEditingUser(null);

      fetchData();

      alert("Cập nhật thành công!");
    } catch (error) {
      console.error(error);
      alert("Lỗi cập nhật user.");
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const deleteUser = async (userId) => {
    const ok = confirm(
      "Bạn có chắc muốn xóa user này?"
    );

    if (!ok) return;

    try {
      await deleteDoc(doc(db, "users", userId));

      fetchData();

      alert("Đã xóa user.");
    } catch (error) {
      console.error(error);
      alert("Lỗi xóa user.");
    }
  };
  const maxValue = Math.max(recyclable, nonRecyclable, hazardous, 1);

  let step = 2;
  let chartMax = 10;

  if (maxValue <= 10) {
    step = 2;
    chartMax = 10;
  } else if (maxValue <= 50) {
    step = 10;
    chartMax = Math.ceil(maxValue / 10) * 10 + 20;
  } else if (maxValue <= 100) {
    step = 20;
    chartMax = Math.ceil(maxValue / 20) * 20 + 20;
  } else {
    step = 50;
    chartMax = Math.ceil(maxValue / 50) * 50 + 50;
  }

  const yAxisLabels = [];

  for (let value = chartMax; value >= 0; value -= step) {
    yAxisLabels.push(value);
  }

  const getBarHeight = (value) => {
    return `${(value / chartMax) * 100}%`;
  };

  return (
    <main className="admin-page">
      {/* HEADER */}

      <div className="admin-header">
        <div>
          <h1>Thống Kê Hệ Thống EcoSort AI</h1>

          <p>
            Theo dõi dữ liệu thật từ Firebase
            Firestore.
          </p>
        </div>

        <button
          className="admin-btn"
          onClick={exportReport}
        >
          Xuất báo cáo
        </button>
      </div>
      

      {/* STATS */}
  

      <section className="admin-stats">
        <div className="admin-stat-card">
          <span>📷</span>

          <p>Tổng lượt quét</p>

          <h2>{totalScans}</h2>
        </div>

        <div className="admin-stat-card">
          <span>♻️</span>

          <p>Rác tái chế</p>

          <h2>{recyclable}</h2>
        </div>

        <div className="admin-stat-card">
          <span>🗑️</span>

          <p>Không tái chế</p>

          <h2>{nonRecyclable}</h2>
        </div>

        <div className="admin-stat-card">
          <span>☣️</span>

          <p>Rác nguy hại</p>

          <h2>{hazardous}</h2>
        </div>
      </section>

      {/* GRID */}

      <section className="trash-bar-section">
          <h2>Thống kê số lượng rác theo từng loại</h2>

          <div className="chart-wrapper">
            <div className="y-axis">
              {yAxisLabels.map((label) => (
                <div className="y-label" key={label}>
                  {label}
                </div>
              ))}
            </div>

            <div className="chart-area">
              <div className="grid-lines">
                {yAxisLabels.map((label) => (
                  <div key={label} className="grid-line"></div>
              ))}
            </div>

            <div className="bars">
              <div className="bar-group">
                <div className="bar-value">{recyclable}</div>
                <div
                  className="bar recyclable-bar"
                  style={{ height: getBarHeight(recyclable) }}
                ></div>
                <p>TÁI CHẾ</p>
              </div>

              <div className="bar-group">
                <div className="bar-value">{nonRecyclable}</div>
                <div
                  className="bar non-recyclable-bar"
                  style={{ height: getBarHeight(nonRecyclable) }}
                ></div>
                <p>KHÔNG TÁI CHẾ</p>
              </div>

              <div className="bar-group">
                <div className="bar-value">{hazardous}</div>
                <div
                  className="bar hazardous-bar"
                  style={{ height: getBarHeight(hazardous) }}
                ></div>
                <p>NGUY HẠI</p>
              </div>
            </div>
          </div>
        </div>  
      </section>

      <section className="admin-grid">
        {/* LEFT */}

        <div className="admin-card">
          <h2>Phân loại lượt quét</h2>

          <div className="progress-row">
            <div>
              <b>Rác tái chế</b>

              <p>
                Chai nhựa, lon, giấy,
                carton...
              </p>
            </div>

            <span>{recyclable}</span>
          </div>

          <div className="progress-row">
            <div>
              <b>Rác không tái chế</b>

              <p>
                Túi nilon, ống hút,
                ly nhựa bẩn...
              </p>
            </div>

            <span>{nonRecyclable}</span>
          </div>

          <div className="progress-row">
            <div>
              <b>Rác nguy hại</b>

              <p>
                Pin, bóng đèn, bình
                xịt hóa chất...
              </p>
            </div>

            <span>{hazardous}</span>
          </div>

          <div className="progress-row">
            <div>
              <b>Không xác định</b>

              <p>
                Ảnh mờ hoặc AI chưa
                nhận diện được.
              </p>
            </div>

            <span>{unknown}</span>
          </div>
        </div>
        
        {/* RIGHT */}

        <div className="admin-card">
          <h2>Hoạt động gần đây</h2>

          {history.length === 0 ? (
            <p className="muted">
              Chưa có dữ liệu hoạt động.
            </p>
          ) : (
            history
              .slice(0, 6)
              .map((item) => (
                <div
                  className="activity-item"
                  key={item.id}
                >
                  <div className="activity-icon">
                    ♻️
                  </div>

                  <div>
                    <b>
                      {item.class ||
                        "Unknown"}
                    </b>

                    <p>
                      {item.email ||
                        "guest"}{" "}
                      •{" "}
                      {item.type ||
                        "Unknown"}{" "}
                      •{" "}
                      {item.confidence ||
                        0}
                      %
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>

      {/* USER MANAGEMENT */}

      <section className="admin-card">
        <div className="table-header">
          <h2>Quản lý người dùng</h2>
        </div>

        {/* EDIT FORM */}

        {editingUser && (
          <div className="user-form">
            <input
              placeholder="Tên"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            >
              <option value="user">
                user
              </option>

              <option value="admin">
                admin
              </option>
            </select>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
            >
              <option value="Hoạt động">
                Hoạt động
              </option>

              <option value="Khóa">
                Khóa
              </option>
            </select>

            <button
              className="admin-btn small"
              onClick={saveEdit}
            >
              Lưu
            </button>
          </div>
        )}

        {/* TABLE */}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Lượt quét</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6">
                  Chưa có dữ liệu user.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <b>
                      {user.name ||
                        "Chưa có tên"}
                    </b>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className="admin-tag">
                      {user.role ||
                        "user"}
                    </span>
                  </td>

                  <td>
                    {getUserScans(user)}
                  </td>

                  <td className="success">
                    {user.status ||
                      "Hoạt động"}
                  </td>

                  <td>
                    <button
                      className="action-btn"
                      onClick={() =>
                        openEdit(user)
                      }
                    >
                      Sửa
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteUser(user.id)
                      }
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* SYSTEM */}

      <section className="admin-card system-section">
        <h2>Thông tin hệ thống</h2>

        <div className="system-grid">
          <div>
            <b>Mô hình AI</b>

            <p>
              YOLOv8 Object Detection
            </p>
          </div>

          <div>
            <b>Backend</b>

            <p>FastAPI Python</p>
          </div>

          <div>
            <b>Frontend</b>

            <p>ReactJS + CSS</p>
          </div>

          <div>
            <b>Cơ sở dữ liệu</b>

            <p>
              Firebase Firestore
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}