import { useEffect, useRef, useState } from "react";
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

  const [realtime, setRealtime] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  const chooseFile = (e) => {
    const img = e.target.files[0];
    if (!img) return;

    setRealtime(false);
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

    setRealtime(false);
    setPreview(imageSrc);

    const blob = await fetch(imageSrc).then((res) => res.blob());

    const webcamFile = new File([blob], "webcam-capture.jpg", {
      type: "image/jpeg",
    });

    setFile(webcamFile);
    setResult(null);
  };

  const resetScan = () => {
    setRealtime(false);
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

      // Nếu Firestore đang lỗi quyền thì có thể comment dòng này
      await saveHistoryToFirestore(data);
    } catch (error) {
      console.error("SCAN ERROR:", error);
      alert("Lỗi khi phân tích hoặc lưu lịch sử.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeRealtimeFrame = async () => {
    if (!webcamRef.current || isPredicting) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      setIsPredicting(true);

      const blob = await fetch(imageSrc).then((res) => res.blob());

      const webcamFile = new File([blob], "realtime-frame.jpg", {
        type: "image/jpeg",
      });

      const data = await predictWasteImage(webcamFile);

      setPreview(imageSrc);
      setResult(data);

      // Không lưu lịch sử realtime để tránh spam Firebase
    } catch (error) {
      console.error("REALTIME SCAN ERROR:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  useEffect(() => {
    if (mode !== "camera" || !realtime) return;

    const interval = setInterval(() => {
      analyzeRealtimeFrame();
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, realtime, isPredicting]);

  return (
    <main className="scan-page">
      <div className="scan-left">
        <h1>Nhận Diện Rác Thải</h1>
        <p>Tải ảnh lên, chụp webcam hoặc bật realtime để AI phân loại giúp bạn.</p>

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
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="webcam"
              videoConstraints={{
                facingMode: "environment",
              }}
            />

            <div className="webcam-actions">
              <button
                type="button"
                className="camera-btn"
                onClick={captureWebcam}
                disabled={realtime}
              >
                📸 Chụp ảnh
              </button>

              <button
                type="button"
                className="camera-btn"
                onClick={() => {
                  setRealtime((prev) => !prev);
                  setFile(null);
                  setPreview(null);
                  setResult(null);
                }}
              >
                {realtime ? "⏸ Dừng realtime" : "▶️ Bật realtime"}
              </button>

              {(preview || result) && (
                <button type="button" className="secondary-btn" onClick={resetScan}>
                  🔄 Làm mới
                </button>
              )}
            </div>

            {realtime && (
              <p className="realtime-status">
                {isPredicting ? "Đang nhận diện..." : "Realtime đang bật"}
              </p>
            )}
          </div>
        )}

        {mode === "upload" || (mode === "camera" && !realtime) ? (
          <button
            type="button"
            className="primary-btn"
            onClick={analyze}
            disabled={!file || loading}
          >
            {loading ? "Đang phân tích..." : "🔍 Phân tích ngay"}
          </button>
        ) : null}

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

                {realtime ? (
                  <div className="info-row">📷 Kết quả realtime, chưa lưu lịch sử</div>
                ) : (
                  <div className="info-row">🌱 Kết quả đã được lưu vào lịch sử</div>
                )}

                <button type="button" className="primary-btn" onClick={resetScan}>
                  Quét ảnh mới
                </button>
              </div>
            </>
          ) : (
            <div className="empty-result">
              <h2>Kết quả nhận diện</h2>
              <p>
                Vui lòng tải ảnh, chụp webcam hoặc bật realtime để AI phân tích.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}