import os
import uuid
import cv2
import numpy as np
from PIL import Image
from ultralytics import YOLO

import settings

model = YOLO(settings.DETECTION_MODEL)


def classify_waste_type(class_name):
    if class_name in settings.RECYCLABLE:
        return "RECYCLABLE", "#22c55e", "Rửa sạch và bỏ vào thùng tái chế."

    if class_name in settings.NON_RECYCLABLE:
        return "NON_RECYCLABLE", "#64748b", "Bỏ vào thùng rác sinh hoạt."

    if class_name in settings.HAZARDOUS:
        return "HAZARDOUS", "#ef4444", "Cần xử lý riêng, không bỏ chung với rác sinh hoạt."

    return "UNKNOWN", "#64748b", "Chưa có hướng dẫn xử lý."


async def predict_waste_image(file):
    os.makedirs("uploads", exist_ok=True)

    file_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join("uploads", file_name)

    content = await file.read()

    with open(file_path, "wb") as f:
        f.write(content)

    image = Image.open(file_path).convert("RGB")
    image_np = np.array(image)
    image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    results = model.predict(image_cv, conf=0.5)

    names = model.names

    detected_class = None
    confidence = 0

    for result in results:
        boxes = result.boxes

        if len(boxes) > 0:
            cls_id = int(boxes[0].cls[0])
            confidence = float(boxes[0].conf[0]) * 100
            detected_class = names[cls_id]
            break

    if detected_class is None:
        return {
            "class": "Không nhận diện được",
            "type": "UNKNOWN",
            "confidence": 0,
            "color": "#64748b",
            "guide": "Vui lòng thử ảnh khác rõ hơn."
        }

    waste_type, color, guide = classify_waste_type(detected_class)

    return {
        "class": detected_class.replace("_", " "),
        "type": waste_type,
        "confidence": round(confidence, 2),
        "color": color,
        "guide": guide
    }