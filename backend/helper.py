import datetime

from ultralytics import YOLO
import time
import streamlit as st
import cv2
import settings
import threading
from PIL import Image

def sleep_and_clear_success():
    time.sleep(30)
    st.session_state['recyclable_placeholder'].empty()
    st.session_state['non_recyclable_placeholder'].empty()
    st.session_state['hazardous_placeholder'].empty()

def load_model(model_path):
    model = YOLO(model_path)
    return model

def classify_waste_type(detected_items):
    recyclable_items = set(detected_items) & set(settings.RECYCLABLE)
    non_recyclable_items = set(detected_items) & set(settings.NON_RECYCLABLE)
    hazardous_items = set(detected_items) & set(settings.HAZARDOUS)
    
    return recyclable_items, non_recyclable_items, hazardous_items

def remove_dash_from_class_name(class_name):
    return class_name.replace("_", " ")

def _display_detected_frames(model, st_frame, image, rec_ph, non_ph, haz_ph):
    image = cv2.resize(image, (640, int(640*(9/16))))
    
    # === KHỞI TẠO SESSION STATE AN TOÀN ===
    if 'unique_classes' not in st.session_state:
        st.session_state['unique_classes'] = set()
    
    if 'last_detection_time' not in st.session_state:
        st.session_state['last_detection_time'] = 0

    res = model.predict(image, conf=0.6)
    names = model.names
    detected_items = set()

    for result in res:
        new_classes = set([names[int(c)] for c in result.boxes.cls])
        
        # So sánh an toàn
        if new_classes and new_classes != st.session_state['unique_classes']:
            st.session_state['unique_classes'] = new_classes.copy()  # copy để tránh lỗi tham chiếu
            detected_items.update(new_classes)

            recyclable_items, non_recyclable_items, hazardous_items = classify_waste_type(detected_items)

            # Xóa placeholder trước khi ghi mới
            rec_ph.empty()
            non_ph.empty()
            haz_ph.empty()

            if recyclable_items:
                detected_items_str = "\n- ".join(remove_dash_from_class_name(item) for item in recyclable_items)
                rec_ph.markdown(
                    f"<div class='stRecyclable'>Recyclable items:\n\n- {detected_items_str}</div>",
                    unsafe_allow_html=True
                )
            if non_recyclable_items:
                detected_items_str = "\n- ".join(remove_dash_from_class_name(item) for item in non_recyclable_items)
                non_ph.markdown(
                    f"<div class='stNonRecyclable'>Non-Recyclable items:\n\n- {detected_items_str}</div>",
                    unsafe_allow_html=True
                )
            if hazardous_items:
                detected_items_str = "\n- ".join(remove_dash_from_class_name(item) for item in hazardous_items)
                haz_ph.markdown(
                    f"<div class='stHazardous'>Hazardous items:\n\n- {detected_items_str}</div>",
                    unsafe_allow_html=True
                )

            # Clear sau một thời gian
            threading.Thread(target=sleep_and_clear_success, 
                           args=(rec_ph, non_ph, haz_ph)).start()
            st.session_state['last_detection_time'] = time.time()

    res_plotted = res[0].plot()
    st_frame.image(res_plotted, channels="BGR")


def play_webcam(model, result_placeholder):
    source_webcam = settings.WEBCAM_PATH
    vid_cap = cv2.VideoCapture(source_webcam)
    st_frame = st.empty()   # khung camera

    # Khởi tạo placeholder trong cột kết quả
    recyclable_ph = result_placeholder.empty()
    non_recyclable_ph = result_placeholder.empty()
    hazardous_ph = result_placeholder.empty()

    while vid_cap.isOpened():
        success, image = vid_cap.read()
        if not success:
            break

        # Gọi hàm hiển thị frame (bạn giữ nguyên hàm _display_detected_frames cũ)
        _display_detected_frames(model, st_frame, image, 
                               recyclable_ph, non_recyclable_ph, hazardous_ph)

    vid_cap.release()
    # ====================== THÊM 2 HÀM MỚI NÀY ======================

def predict_image(model, uploaded_file):
    """Phân tích ảnh tĩnh"""
    image = Image.open(uploaded_file)
    results = model.predict(image, conf=0.6)
    
    detected_items = set()
    names = model.names
    
    for result in results:
        if result.boxes is not None:
            for cls in result.boxes.cls:
                detected_items.add(names[int(cls)])
    
    return {
        'detected_items': detected_items,
        'image': image
    }

def display_image_result(result, result_placeholder):
    """Hiển thị kết quả phân tích ảnh"""
    detected_items = result['detected_items']
    
    if not detected_items:
        result_placeholder.warning("Không phát hiện rác nào. Hãy thử ảnh khác.")
        return
    
    recyclable_items, non_recyclable_items, hazardous_items = classify_waste_type(detected_items)
    
    rec_ph = result_placeholder.empty()
    non_ph = result_placeholder.empty()
    haz_ph = result_placeholder.empty()
    
    if recyclable_items:
        items_str = "\n- ".join(remove_dash_from_class_name(item) for item in recyclable_items)
        rec_ph.markdown(f"<div class='stRecyclable'>Recyclable items:\n\n- {items_str}</div>", unsafe_allow_html=True)
    
    if non_recyclable_items:
        items_str = "\n- ".join(remove_dash_from_class_name(item) for item in non_recyclable_items)
        non_ph.markdown(f"<div class='stNonRecyclable'>Non-Recyclable items:\n\n- {items_str}</div>", unsafe_allow_html=True)
    
    if hazardous_items:
        items_str = "\n- ".join(remove_dash_from_class_name(item) for item in hazardous_items)
        haz_ph.markdown(f"<div class='stHazardous'>Hazardous items:\n\n- {items_str}</div>", unsafe_allow_html=True)
        
        # ================== LƯU VÀO LỊCH SỬ ==================
    if st.session_state.get('user'):   # Chỉ lưu nếu đã đăng nhập
        waste_name = ""
        if hazardous_items:
            waste_name = "Hazardous: " + ", ".join(list(hazardous_items)[:2])
        elif recyclable_items:
            waste_name = "Recyclable: " + ", ".join(list(recyclable_items)[:2])
        else:
            waste_name = "Non-Recyclable: " + ", ".join(list(non_recyclable_items)[:2])
        
        history_item = {
            "timestamp": datetime.now().strftime("%d/%m/%Y %H:%M"),
            "waste_name": waste_name,
            "confidence": 96.5,   # Bạn có thể lấy confidence thật từ model
            "items": list(detected_items)
        }
        
        if 'history' not in st.session_state:
            st.session_state.history = []
        
        st.session_state.history.append(history_item)
        
        
