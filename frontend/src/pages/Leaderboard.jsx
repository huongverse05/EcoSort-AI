import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const fetchLeaderboard = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    const historySnap = await getDocs(collection(db, "history"));

    const usersData = usersSnap.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((user) => user.role !== "admin");

    const historyData = historySnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const usersWithStats = usersData.map((user) => {
    const userHistory = historyData.filter(
        (item) =>
            (item.uid === user.id ||
            item.email === user.email) &&
        item.class &&
        item.type &&
        item.confidence
);

      const totalScans = userHistory.length;

      
     const ecoPoint = totalScans * 50;

      return {
        ...user,
        totalScans,
        ecoPoint,
      };
    });

    usersWithStats.sort(
      (a, b) => b.ecoPoint - a.ecoPoint
    );

    setUsers(usersWithStats);
  };

  fetchLeaderboard();
}, []);

  const getLevel = (point = 0) => {
    if (point >= 1000) return "Eco Master";
    if (point >= 500) return "Eco Guardian";
    if (point >= 300) return "Eco Sorter";
    if (point >= 100) return "Green Beginner";
    return "Newbie";
  };

  const getRank = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  const totalPoints = users.reduce(
    (sum, user) => sum + (user.ecoPoint || 0),
    0
  );

  const totalScans = users.reduce(
    (sum, user) => sum + (user.totalScans || 0),
    0
  );

  return (
    <main className="leaderboard-page">
      <div className="leaderboard-head">
        <h1>🏆 Bảng Xếp Hạng Cộng Đồng</h1>
        <p>Cùng nhau phân loại rác – cùng nhau bảo vệ môi trường.</p>
      </div>

      <section className="leaderboard-summary">
        <div className="leader-summary-card">
          <span>👥</span>
          <div>
            <h2>{users.length}</h2>
            <p>Người tham gia</p>
          </div>
        </div>

        <div className="leader-summary-card">
          <span>♻️</span>
          <div>
            <h2>{totalScans}</h2>
            <p>Lần quét rác</p>
          </div>
        </div>

        <div className="leader-summary-card">
          <span>⭐</span>
          <div>
            <h2>{totalPoints}</h2>
            <p>EcoPoint đã tích lũy</p>
          </div>
        </div>
      </section>

      <section className="leaderboard-card">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Người dùng</th>
              <th>Cấp độ</th>
              <th>EcoPoint</th>
              <th>Lần quét</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5">Chưa có dữ liệu bảng xếp hạng.</td>
              </tr>
            ) : (
              users.map((item, index) => (
                <tr key={item.id}>
                  <td className="rank-cell">{getRank(index)}</td>

                  <td>
                    <div className="leader-user">
                      <div className="leader-avatar">
                        {item.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <b>{item.name || item.email || "Người dùng"}</b>
                    </div>
                  </td>

                  <td>
                    <span className="level-badge">Lv.{index + 1}</span>
                    <span className="level-title">
                      {getLevel(item.ecoPoint)}
                    </span>
                  </td>

                  <td className="leader-points">
                    {(item.ecoPoint || 0).toLocaleString("vi-VN")}
                  </td>

                  <td>{item.totalScans || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}