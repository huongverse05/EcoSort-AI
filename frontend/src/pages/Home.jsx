import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <div className="badge">🤖 TRÍ TUỆ NHÂN TẠO THẾ HỆ MỚI 2026</div>

          <h1>
            Phân Loại Rác <br />
            <span>Thông Minh</span> Với <br />
            Công Nghệ AI
          </h1>

          <p>
            EcoSort AI sử dụng thị giác máy tính để nhận diện và phân loại rác
            thải chính xác trong vài giây.
          </p>

          <div className="hero-actions">
            <Link to="/scan" className="primary-link">📷 Trải Nghiệm Quét AI</Link>
            <a href="#features" className="secondary-link">Tìm Hiểu Thêm</a>
          </div>
        </div>

        <div className="hero-image">
          <div className="blob blue"></div>
          <div className="blob green"></div>
          <div className="image-placeholder">🌍♻🤖</div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat"><h2>1.2M+</h2><p>Rác đã phân loại</p></div>
        <div className="stat"><h2>450K</h2><p>Tấn CO2 giảm thiểu</p></div>
        <div className="stat"><h2>85K</h2><p>Người dùng tích cực</p></div>
        <div className="stat"><h2>120+</h2><p>Đối tác môi trường</p></div>
      </section>

      <section className="features-section" id="features">
        <div className="section-title">
          <h2>Giải Pháp Toàn Diện Cho Môi Trường</h2>
          <p>Kết hợp AI và cộng đồng để tạo ra chu kỳ tái chế hiệu quả.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon green">🧠</div>
            <h3>Nhận Diện Thông Minh</h3>
            <p>AI phân tích loại rác và đưa ra hướng dẫn xử lý nhanh chóng.</p>
            <Link to="/scan">Thử ngay →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">📊</div>
            <h3>Theo Dõi Lịch Sử</h3>
            <p>Ghi lại hoạt động phân loại và xem tác động môi trường.</p>
            <Link to="/history">Xem báo cáo →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon yellow">📘</div>
            <h3>Cẩm Nang Tái Chế</h3>
            <p>Thư viện kiến thức về rác tái chế, rác nguy hại và sống xanh.</p>
            <Link to="/guide">Khám phá →</Link>
          </div>
        </div>
      </section>
    </>
  );
}