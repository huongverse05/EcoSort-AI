import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { predictWasteImage } from "../api/wasteApi";
import { db } from "../firebase";

export default function Scan({ user }) {
  const webcamRef = useRef(null);

  const [mode, setMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const chooseFile = (e) => {
    const img = e.target.files[0];

    if (!img) return;

    setFile(img);
    setPreview(URL.createObjectURL(img));
    setResult(null);
  };

  const captureWebcam = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      alert("Không thể chụp ảnh từ webcam.");
      return;
    }

    setPreview(imageSrc);

    const blob = await fetch(imageSrc).then((res) => res.blob());

    const webcamFile = new File([blob], "webcam-capture.jpg", {
      type: "image/jpeg",
    });

    setFile(webcamFile);
    setResult(null);
  };

  const resetScan = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const saveHistoryToFirestore = async (data) => {
    await addDoc(collection(db, "history"), {
      uid: user?.uid || "guest",
      email: user?.email || "guest",
      class: data.class,
      type: data.type,
      confidence: data.confidence,
      guide: data.guide,
      imagePreview: preview || "",
      createdAt: serverTimestamp(),
    });
  };

  const saveHistoryToLocalStorage = (data) => {
    const historyKey = user?.uid ? `history_${user.uid}` : "history_guest";

    const history = JSON.parse(localStorage.getItem(historyKey)) || [];

    history.unshift({
      ...data,
      uid: user?.uid || "guest",
      email: user?.email || "guest",
      time: new Date().toLocaleString("vi-VN"),
    });

    localStorage.setItem(historyKey, JSON.stringify(history));
  };

  const analyze = async () => {
    if (!file) {
      alert("Vui lòng chọn hoặc chụp ảnh trước.");
      return;
    }

    try {
      setLoading(true);

      const data = await predictWasteImage(file);

      setResult(data);

      saveHistoryToLocalStorage(data);

      await saveHistoryToFirestore(data);
    } catch (error) {
      console.error("SCAN ERROR:", error);
      alert("Lỗi khi phân tích hoặc lưu lịch sử.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="scan-page">
      <div className="scan-left">
        <h1>Nhận Diện Rác Thải</h1>
        <p>Tải ảnh lên hoặc chụp trực tiếp để AI phân loại giúp bạn.</p>

        <div className="scan-tabs">
          <button
            type="button"
            className={mode === "upload" ? "tab-active" : ""}
            onClick={() => {
              setMode("upload");
              resetScan();
            }}
          >
            🖼 Tải ảnh
          </button>

          <button
            type="button"
            className={mode === "camera" ? "tab-active" : ""}
            onClick={() => {
              setMode("camera");
              resetScan();
            }}
          >
            📷 Webcam
          </button>
        </div>

        {mode === "upload" ? (
          <label className="upload-zone">
            {preview ? (
              <img src={preview} alt="preview" className="preview" />
            ) : (
              <>
                <div className="upload-icon">☁️</div>
                <h3>Kéo và thả ảnh vào đây</h3>
                <p>Hỗ trợ JPG, PNG, JPEG</p>
                <span>Chọn Ảnh Từ Thiết Bị</span>
              </>
            )}

            <input type="file" accept="image/*" hidden onChange={chooseFile} />
          </label>
        ) : (
          <div className="webcam-zone">
            {preview ? (
              <img src={preview} alt="webcam-preview" className="preview" />
            ) : (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="webcam"
                videoConstraints={{
                  facingMode: "environment",
                }}
              />
            )}

            <button type="button" className="camera-btn" onClick={captureWebcam}>
              📸 Chụp ảnh
            </button>

            {preview && (
              <button type="button" className="secondary-btn" onClick={resetScan}>
                🔄 Chụp lại
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          className="primary-btn"
          onClick={analyze}
          disabled={!file || loading}
        >
          {loading ? "Đang phân tích..." : "🔍 Phân tích ngay"}
        </button>

        <div className="tips-grid">
          <div>
            💡 <b>Ánh sáng tốt</b>
            <p>Chụp ở nơi đủ sáng để AI nhận diện tốt hơn.</p>
          </div>

          <div>
            🎯 <b>Vật thể rõ ràng</b>
            <p>Tránh chụp nhiều loại rác cùng một lúc.</p>
          </div>

          <div>
            🧼 <b>Làm sạch rác</b>
            <p>Nên đổ sạch chất lỏng bên trong chai lọ.</p>
          </div>
        </div>
      </div>

      <div className="scan-right">
        <div className="result-panel">
          {result ? (
            <>
              {preview && <img src={preview} alt="result" />}

              <div className="result-content">
                <h2>{result.class}</h2>
                <p>Độ tin cậy: {result.confidence}%</p>

                <div className="info-row">✅ Loại: {result.type}</div>
                <div className="info-row">⚠️ {result.guide}</div>
                <div className="info-row">
                  🌱 Kết quả đã được lưu vào lịch sử
                </div>

                <button type="button" className="primary-btn" onClick={resetScan}>
                  Quét ảnh mới
                </button>
              </div>
            </>
          ) : (
            <div className="empty-result">
              <h2>Kết quả nhận diện</h2>
              <p>Vui lòng tải ảnh hoặc chụp webcam để AI phân tích.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}