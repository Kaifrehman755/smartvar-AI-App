# 🚀 SmartVal AI - Intelligent Resale Value Predictor

![Project Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Full%20Stack-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**SmartVal AI** is a state-of-the-art Full-Stack Web Application designed to accurately estimate the fair market resale value of used assets (electronics, gadgets, etc.) using advanced Machine Learning algorithms.

🔗 **Live Demo:** [https://smartvar-ai-app.vercel.app](https://smartvar-ai-app.vercel.app)

---

## 🌟 Key Features

* **🤖 AI-Powered Precision:** Utilizes a trained **Random Forest Regressor** model to analyze depreciation patterns based on brand, age, and condition.
* **⚡ Instant Valuation:** Provides real-time price estimates with low latency using a high-performance **FastAPI** backend.
* **🎨 Modern & Responsive UI:** Built with **React.js** and **Tailwind CSS** to ensure a seamless experience across desktop and mobile devices.
* **☁️ Cloud Native Architecture:**
    * **Frontend:** Deployed on Vercel Edge Network.
    * **Backend:** Hosted on Render Cloud Services.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), TypeScript, Tailwind CSS |
| **Backend** | Python 3.10, FastAPI, Uvicorn |
| **Machine Learning** | Scikit-Learn, Pandas, NumPy, Joblib |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---



## 🚀 Local Installation & Setup

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository
```bash

git clone [https://github.com/Kaifrehman755/smartvar-AI-App.git](https://github.com/Kaifrehman755/smartvar-AI-App.git)
cd smartvar-AI-App

2. Backend Setup
​Navigate to the backend directory and install dependencies.
cd backend
# Create a virtual environment (Recommended)
python -m venv venv
# Activate Virtual Environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Run the Server
uvicorn main:app --reload
The Backend API will start running at http://127.0.0.1:8000
​3. Frontend Setup
​Open a new terminal and navigate to the frontend directory.
cd frontend
# Install Node Modules
npm install

# Start the Development Server
npm run dev
The Frontend App will start running at http://localhost:5173
​📡 API Reference
​Get Predicted Price
POST/predict
Request Body:
---
👨‍💻 Author
​Kaif Rehman
​GitHub: Kaifrehman755
​Role: Full Stack Developer & AI Engineer
​Made  by Kaif Rehman
