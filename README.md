# 🧠 AI Code Review & Bug Detection System  
A full-stack application that performs automated code review, detects bugs, analyzes code quality, and displays issues in a clean dashboard interface.

This project includes:
- A **FastAPI backend** for authentication, code analysis, and session management  
- A **React + TypeScript frontend** under `src/`  
- Integrated **Semgrep rule sets** for static analysis  
- Clean, modular architecture suitable for academic and production use  

---

## 🚀 Features
- User Authentication (Signup, Login)
- Upload or paste code for AI-based review
- Static analysis using Semgrep rules (Python, JS, Java, C, TS)
- Dashboard for listing past analysis sessions
- View detailed issue explanations
- Dark & modern UI built with React + Tailwind
- FastAPI backend connected to PostgreSQL (or SQLite)

---

# 🛠️ Installation & Setup Guide

Follow these steps to run the project locally from the GitHub repository.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Meghanachippada/ai-code-review-bugdetection.git
cd ai-code-review-bugdetection

Backend Setup (FastAPI)

Go to the backend folder:

cd server-python

2️⃣ Create & Activate Virtual Environment
python3 -m venv venv
source venv/bin/activate     # macOS/Linux
venv\Scripts\activate        # Windows

3️⃣ Install Dependencies
pip install -r requirements.txt

4️⃣ Add Environment Variables

Create a .env file inside server-python/:

OPENAI_API_KEY=your_key_here
DATABASE_URL=sqlite:///./app.db     # or your PostgreSQL URL
JWT_SECRET_KEY=your_secret
JWT_ALGORITHM=HS256


(Your GitHub repo already includes .env.example)

5️⃣ Run Backend
uvicorn main:app --reload


Backend runs at:
➡️ http://localhost:8000

🌐 Frontend Setup (React + TypeScript)

Go back to the root folder and install frontend packages:

cd ..
npm install

6️⃣ Start Frontend
npm run dev


Frontend runs at:
➡️ http://localhost:5173

🔗 Connecting Frontend to Backend

The API base URL is set in:

src/lib/api.ts


Default value:

export const API_BASE_URL = "http://localhost:8000";


Change this if backend is hosted elsewhere.

📁 Project Structure
ai-code-review-bugdetection
│── server-python/         # FastAPI backend
│── src/                   # React frontend
│── public/
│── rules/                 # Extra rule sets
│── semgrep_rules/         # Semgrep rule definitions
│── node_modules/
│── package.json
│── requirements.txt
│── README.md

Author

Bhavya Meghana Chippada
