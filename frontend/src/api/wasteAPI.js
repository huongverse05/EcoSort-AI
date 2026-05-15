const API_URL = "http://127.0.0.1:8000/api";

export async function predictWasteImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Không thể nhận diện ảnh");
  }

  return await response.json();
}