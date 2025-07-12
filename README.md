# 🌿 Plant Disease Predictor

A full-stack web application that predicts plant diseases from uploaded leaf images using a trained machine learning model.

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Django (REST API)
- **Machine Learning:** CNN Model (Keras/TensorFlow or PyTorch)
- **Integration:** Axios/API for image upload and prediction

---

## 📸 Features

- Upload leaf images via React frontend
- Get real-time predictions from a trained CNN model
- REST API for communication between frontend and backend
- Clean and responsive UI

---

## 🚀 Setup Instructions

### 1. Clone the Repo

bash
git clone https://github.com/your-username/plant-disease-predictor.git
cd plant-disease-predictor

### 2. Setup Django Backend

- bash
- Copy
- Edit
- cd backend
- python -m venv env
- source env/bin/activate      # or env\Scripts\activate on Windows
- pip install -r requirements.txt
- python manage.py runserver


### 3. Setup React Frontend

- bash
- Copy
- Edit
- cd frontend
- npm install
- npm start