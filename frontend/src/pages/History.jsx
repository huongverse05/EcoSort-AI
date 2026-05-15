import { useEffect, useState } from "react";

export default function History({ user }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const historyKey = `history_${user.uid}`;
    const savedHistory = JSON.parse(localStorage.getItem(historyKey)) || [];

    setHistory(savedHistory);
  }, [user]);

  const clearHistory = () => {
    if (!user?.uid) return;

    const historyKey = `history_${user.uid}`;

    localStorage.removeItem(historyKey);
    setHistory([]);
  };

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Lịch Sử Quét Rác</h1>
          <p>Hiển thị lại các lần quét rác của {user?.name || user?.email}.</p>
        </div>

        {history.length > 0 && (
          <button className="primary-small" onClick={clearHistory}>
            Xóa lịch sử
          </button>
        )}
      </div>

      <div className="table-card">
        <h3>Nhật Ký Quét</h3>

        <table>
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Loại rác nhận diện</th>
              <th>Nhóm rác</th>
              <th>Độ tin cậy</th>
              <th>Hướng dẫn</th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="5">Chưa có lịch sử quét.</td>
              </tr>
            ) : (
              history.map((item, index) => (
                <tr key={index}>
                  <td>{item.time}</td>
                  <td>
                    <b>{item.class}</b>
                  </td>
                  <td>
                    <span className="tag">{item.type}</span>
                  </td>
                  <td>{item.confidence}%</td>
                  <td>{item.guide}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}