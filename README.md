# EcoSort AI - Intelligent Waste Classification System

EcoSort AI is a smart waste classification system developed using Artificial Intelligence (AI) and Computer Vision technologies.  
The system allows users to upload images or use a webcam to detect and classify waste automatically into different categories such as recyclable, non-recyclable, and hazardous waste.

This project is developed as a web-based AI application with a modern React frontend, FastAPI backend, Firebase integration, and YOLOv8 object detection model.

---

# Features

## User Features

- Upload waste images
- Real-time webcam detection
- AI waste classification
- View classification results
- View scan history
- Waste sorting guide
- Responsive UI for desktop and mobile

## Admin Features

- View system statistics
- Manage users
- Monitor scan activities
- Export reports
- View total scans and waste categories

---

# Technologies Used

## Frontend

- ReactJS
- React Router DOM
- CSS3
- Vite

## Backend

- Python
- FastAPI
- Uvicorn

## AI / Computer Vision

- YOLOv8
- OpenCV
- Pillow
- Ultralytics

## Database & Authentication

- Firebase Authentication
- Firebase Firestore

---

# Waste Categories

## RECYCLABLE

```python
[
  'cardboard_box',
  'can',
  'plastic_bottle_cap',
  'plastic_bottle',
  'reuseable_paper'
]
```

## NON_RECYCLABLE

```python
[
  'plastic_bag',
  'scrap_paper',
  'stick',
  'plastic_cup',
  'snack_bag',
  'plastic_box',
  'straw',
  'plastic_cup_lid',
  'scrap_plastic',
  'cardboard_bowl',
  'plastic_cultery'
]
```

## HAZARDOUS

```python
[
  'battery',
  'chemical_spray_can',
  'chemical_plastic_bottle',
  'chemical_plastic_gallon',
  'light_bulb',
  'paint_bucket'
]
```

---

# Project Structure

```bash
EcoSort-AI/
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── model/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   ├── firebase/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── train.py
├── README.md
└── best.pt
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/EcoSort-AI.git

cd EcoSort-AI
```

---

# Backend Setup

## 1. Move to backend folder

```bash
cd backend
```

## 2. Create virtual environment

```bash
python -m venv venv
```

## 3. Activate environment

### Windows

```bash
venv\Scripts\activate
```

### MacOS/Linux

```bash
source venv/bin/activate
```

## 4. Install dependencies

```bash
pip install -r requirements.txt
```

## 5. Run backend

```bash
uvicorn main:app --reload
```

Backend will run at:

```bash
http://127.0.0.1:8000
```

---

# Frontend Setup

## 1. Move to frontend folder

```bash
cd frontend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Run frontend

```bash
npm run dev
```

Frontend will run at:

```bash
http://localhost:5173
```

---

# Firebase Setup

Create a Firebase project and enable:

- Authentication (Email/Password)
- Firestore Database

Then create:

```bash
frontend/src/firebase.js
```

Example:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

# Firestore Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null;
    }

    match /history/{historyId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

# AI Model Training

Train model:

```bash
python train.py
```

Dataset:

```text
Roboflow Waste Detection Dataset
```

---

# API Endpoint

## Predict Waste

```http
POST /api/predict
```

Request:

```form-data
file: image
```

Response:

```json
{
  "class": "plastic_bottle",
  "type": "RECYCLABLE",
  "confidence": 94,
  "guide": "Please clean before recycling."
}
```

---

# System Roles

## User

- Scan waste
- View history
- Use webcam detection
- Read waste guide

## Admin

- View statistics
- Manage users
- Export reports
- Monitor system activity

---

# Future Improvements

- Real-time YOLO video detection
- Mobile application
- Multi-language support
- AI model optimization
- Cloud deployment

---

# References

- FastAPI Documentation
- ReactJS Documentation
- Firebase Documentation
- Ultralytics YOLOv8 Documentation
- OpenCV Documentation

---

# Authors

EcoSort AI Development Team

---

# License

This project is developed for educational and research purposes.
