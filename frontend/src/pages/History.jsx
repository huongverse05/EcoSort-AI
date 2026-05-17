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

  const stats = history.reduce(
    (acc, item) => {
      if (item.type === "RECYCLABLE") acc.recyclable += 1;
      else if (item.type === "NON_RECYCLABLE") acc.nonRecyclable += 1;
      else if (item.type === "HAZARDOUS") acc.hazardous += 1;

      return acc;
    },
    {
      recyclable: 0,
      nonRecyclable: 0,
      hazardous: 0,
    }
  );

  const totalScan =
    stats.recyclable + stats.nonRecyclable + stats.hazardous;

  const ecoPoints = totalScan * 50;

  const recyclablePercent = totalScan
    ? (stats.recyclable / totalScan) * 100
    : 0;

  const nonRecyclablePercent = totalScan
    ? (stats.nonRecyclable / totalScan) * 100
    : 0;

  const hazardousPercent = totalScan
    ? (stats.hazardous / totalScan) * 100
    : 0;

  const nonRecyclableOffset = -recyclablePercent;
  const hazardousOffset = -(recyclablePercent + nonRecyclablePercent);

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

      <section className="activity-dashboard">
  <div className="activity-dashboard-head">
    <h2>Thống Kê Hoạt Động</h2>
  </div>

  <div className="activity-dashboard-grid">
    <div className="activity-stats-left">
      <div className="activity-stat-card">
        <div className="stat-icon-box green-box">♻️</div>

        <div>
          <h2>Tổng số lần quét</h2>
          <h3>
            {totalScan} <span>lần</span>
          </h3>

          <div className="stat-growth"></div>
        </div>
      </div>

      <div className="activity-stat-card">
        <div className="stat-icon-box yellow-box">⭐</div>

        <div>
          <h2>Eco Points Tích Lũy</h2>
          <h3>
            {ecoPoints} <span>điểm</span>
          </h3>

          <div className="stat-growth"></div>
        </div>
      </div>
    </div>

    <div className="activity-chart-card">
      <h3>Phân Bố Loại Rác</h3>

      <div className="activity-chart-content">
        <div className="donut-box">
          <svg viewBox="0 0 36 36" className="donut-chart-new">
            <circle className="donut-bg-new" cx="18" cy="18" r="15.915" />

            <circle
              className="donut-part recyclable-part"
              cx="18"
              cy="18"
              r="15.915"
              strokeDasharray={`${recyclablePercent} ${
                100 - recyclablePercent
              }`}
              strokeDashoffset="0"
            />

            <circle
              className="donut-part non-recyclable-part"
              cx="18"
              cy="18"
              r="15.915"
              strokeDasharray={`${nonRecyclablePercent} ${
                100 - nonRecyclablePercent
              }`}
              strokeDashoffset={nonRecyclableOffset}
            />

            <circle
              className="donut-part hazardous-part"
              cx="18"
              cy="18"
              r="15.915"
              strokeDasharray={`${hazardousPercent} ${
                100 - hazardousPercent
              }`}
              strokeDashoffset={hazardousOffset}
            />
          </svg>

          <div className="donut-center"></div>
        </div>

        <div className="chart-legend-new">
          <div className="legend-row">
            <span className="legend-dot-new recyclable-dot-new"></span>
            <span>RECYCLABLE</span>
            <b>{stats.recyclable} lần</b>
          </div>

          <div className="legend-row">
            <span className="legend-dot-new non-recyclable-dot-new"></span>
            <span>NON_RECYCLABLE</span>
            <b>{stats.nonRecyclable} lần</b>
          </div>

          <div className="legend-row">
            <span className="legend-dot-new hazardous-dot-new"></span>
            <span>HAZARDOUS</span>
            <b>{stats.hazardous} lần</b>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

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