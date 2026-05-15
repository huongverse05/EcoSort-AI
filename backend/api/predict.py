from fastapi import APIRouter, UploadFile, File
from services.ai_service import predict_waste_image

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    result = await predict_waste_image(file)
    return result