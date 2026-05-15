from ultralytics import YOLO
from pathlib import Path


# =========================
# CONFIG
# =========================
BASE_DIR = Path(__file__).resolve().parent

DATA_YAML = BASE_DIR / "data.yaml"

MODEL_NAME = "yolov8n.pt"

EPOCHS = 50
IMAGE_SIZE = 640
BATCH_SIZE = 8

PROJECT_NAME = "runs"
EXPERIMENT_NAME = "waste_detection"


# =========================
# TRAIN MODEL
# =========================
def train_model():
    if not DATA_YAML.exists():
        raise FileNotFoundError(f"Không tìm thấy file data.yaml: {DATA_YAML}")

    model = YOLO(MODEL_NAME)

    results = model.train(
        data=str(DATA_YAML),
        epochs=EPOCHS,
        imgsz=IMAGE_SIZE,
        batch=BATCH_SIZE,
        project=PROJECT_NAME,
        name=EXPERIMENT_NAME,
        device="cpu"
    )

    print("Train hoàn tất!")
    print(results)


# =========================
# MAIN
# =========================
if __name__ == "__main__":
    train_model()