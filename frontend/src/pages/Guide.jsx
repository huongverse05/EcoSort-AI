export default function Guide() {
  return (
    <main className="page">
      <header className="guide-header">
        <h1>Hướng Dẫn Sử Dụng EcoSort AI</h1>
        <p>
          Trang này giúp người dùng biết cách quét rác, đọc kết quả AI và phân
          loại rác đúng cách.
        </p>
      </header>

      <section className="steps-box">
        <h2>Cách sử dụng hệ thống</h2>

        <div className="steps">
          <div>
            <b>1</b>
            <h3>Chọn ảnh hoặc mở webcam</h3>
            <p>Vào trang Quét AI, tải ảnh rác lên hoặc chụp trực tiếp bằng webcam.</p>
          </div>

          <div>
            <b>2</b>
            <h3>Nhấn phân tích</h3>
            <p>Hệ thống gửi ảnh đến mô hình AI để nhận diện loại rác.</p>
          </div>

          <div>
            <b>3</b>
            <h3>Xem kết quả</h3>
            <p>Người dùng xem tên rác, nhóm rác, độ tin cậy và hướng dẫn xử lý.</p>
          </div>
        </div>
      </section>

      <section className="category-grid">
        <div className="category-card blue-border">
          <div>♻️</div>
          <h3>Rác tái chế</h3>
          <p>Chai nhựa, lon kim loại, thùng carton, giấy sạch, nắp chai nhựa.</p>
          <span>✅ Rửa sạch, làm khô rồi bỏ vào thùng tái chế.</span>
        </div>

        <div className="category-card gray-border">
          <div>🗑️</div>
          <h3>Rác không tái chế</h3>
          <p>Túi nilon bẩn, ống hút, ly nhựa bẩn, hộp xốp, giấy dính dầu mỡ.</p>
          <span>⚠️ Bỏ vào thùng rác sinh hoạt.</span>
        </div>

        <div className="category-card red-border">
          <div>☣️</div>
          <h3>Rác nguy hại</h3>
          <p>Pin, bóng đèn, bình xịt hóa chất, chai hóa chất, thùng sơn.</p>
          <span>🚫 Không bỏ chung, cần đưa đến điểm thu gom riêng.</span>
        </div>
      </section>

      <section className="steps-box">
        <h2>Mẹo để AI nhận diện chính xác hơn</h2>

        <div className="steps">
          <div>
            <b>💡</b>
            <h3>Đủ ánh sáng</h3>
            <p>Chụp ảnh ở nơi sáng, tránh bóng tối hoặc ảnh bị mờ.</p>
          </div>

          <div>
            <b>🎯</b>
            <h3>Một vật thể chính</h3>
            <p>Nên chụp một loại rác rõ ràng, không để quá nhiều vật lẫn nhau.</p>
          </div>

          <div>
            <b>📷</b>
            <h3>Góc chụp rõ</h3>
            <p>Đặt vật ở giữa khung hình để mô hình dễ nhận diện hơn.</p>
          </div>
        </div>
      </section>

      <section className="faq">
        <h2>Câu hỏi thường gặp</h2>

        <details>
          <summary>Hệ thống EcoSort AI dùng để làm gì?</summary>
          <p>
            Hệ thống dùng AI và Computer Vision để nhận diện rác từ hình ảnh,
            sau đó phân loại thành rác tái chế, không tái chế hoặc nguy hại.
          </p>
        </details>

        <details>
          <summary>Kết quả nhận diện có lưu lại không?</summary>
          <p>
            Có. Sau khi quét thành công, kết quả sẽ được lưu ở trang Lịch Sử
            để người dùng xem lại.
          </p>
        </details>

        <details>
          <summary>Cần làm gì nếu AI nhận diện sai?</summary>
          <p>
            Người dùng nên chụp lại ảnh rõ hơn, đủ sáng hơn và để vật thể rác
            nằm ở trung tâm khung hình.
          </p>
        </details>

        <details>
          <summary>Rác nguy hại xử lý như thế nào?</summary>
          <p>
            Pin, bóng đèn, bình xịt hóa chất và chai hóa chất cần được để riêng,
            không bỏ chung với rác sinh hoạt.
          </p>
        </details>
      </section>
    </main>
  );
}