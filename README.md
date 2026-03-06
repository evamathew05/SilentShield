# 🛡️ Silent Shield

**Silent Shield** is a high-performance, anonymous cyberbullying reporting portal designed to provide a safe space for digital harassment victims. It features an advanced AI-driven verification pipeline that analyzes screenshots locally to ensure maximum privacy and rapid administrative response.

---

## 🚀 Key Features

### 👤 For Users (Anonymous Submission)
- **100% Anonymous Reporting:** No IP logging or personal data collection.
- **AI Shield Intelligence:**
  - **OCR Evidence Extraction:** Uses `Tesseract.js` to extract text data directly from uploaded screenshots.
  - **Neural Classification:** Leverages a local `BART-MNLI` engine to categorize harassment (Sexual Harassment, Hate Speech, Threats, etc.).
  - **Heuristic Fallback:** An aggressive keyword-based logic engine for instant pre-checks and offline fallback.
- **Reference-Based Tracking:** Users receive a unique ID to monitor case progress (Submitted → Under Review → Resolved) via a professional stepper UI.

### 🔑 For Staff (Admin Management)
- **Authorized Portal:** Secure login via Appwrite Authentication.
- **Incident Dashboard:** Real-time stats (Total, Pending, Resolved) with a comprehensive case management table.
- **Case Review Terminal:**
  - View extracted OCR metadata and high-resolution evidence.
  - Update case status with instant synchronization to the user tracker.
  - Secure bucket storage for all digital evidence.

---

## 🛠️ Tech Stack

### Frontend & OCR
- **Framework:** [React.js](https://reactjs.org/) (Vite)
- **Styling:** [Tailwind CSS v4.0](https://tailwindcss.com/)
- **OCR Engine:** [Tesseract.js](https://tesseract.projectnaptha.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)

### Backend-as-a-Service (Appwrite)
- **Database:** NoSQL storage for incident reports and metadata.
- **Storage:** Encrypted buckets for digital evidence (screenshots).
- **Authentication:** Secure session management for administrative staff.

### AI Engine (Neural Server)
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Classification Model:** `facebook/bart-large-mnli` (Zero-shot classification).
- **Privacy:** 100% local inference; no external AI API calls or data leakage.

---

## 📂 Project Structure

```text
├── ai-server/              # FastAPI Python server for Neural Classification
│   ├── main.py             # Inference API using BART-MNLI
│   └── requirements.txt    # Python dependencies (transformers, torch, fastapi)
├── scripts/                # Backend automation
│   └── setup-appwrite.js   # Automated Appwrite resource & attribute creation
├── src/
│   ├── components/         # ProtectedRoute and UI wrappers
│   ├── pages/              # Home, Report, Track, Admin, and View Case logic
│   ├── utils/              # Appwrite client and Auth services
│   ├── App.jsx             # Route definitions and status checks
│   └── main.jsx            # Entry point
├── public/                 # Static branding and assets
└── .env                    # Application configuration
```

---

## ⚙️ Full Setup Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **Appwrite Instance** (Cloud or Self-hosted)

### 2. Initial Configuration (Root Folder)
```bash
# Install frontend and tool dependencies
npm install

# Prepare environment variables
cp env.example .env
```
*Fill in your `VITE_APPWRITE_ENDPOINT`, `PROJECT_ID`, and `API_KEY` in `.env`.*

### 3. Automated Backend Setup
Silent Shield includes a script to automatically configure your Appwrite instance:
```bash
node scripts/setup-appwrite.js
```
*This creates the "Evidence" bucket, "Reports" collection, and all necessary attributes (type, platform, description, date, status).*

### 4. AI Server Activation (ai-server Folder)
```bash
cd ai-server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
*Note: The first run downloads the ~1.5GB `bart-large-mnli` model weights. The server runs on `http://localhost:8000`.*

### 5. Start Frontend
```bash
# In the root folder
npm run dev
```

---

## 🔒 Security & Privacy Protocol

- **Local Inference:** All AI classification occurs on the local machine to prevent sensitive evidence from leaving the secure environment.
- **Zero Metadata Policy:** No tracking of user agents or browser fingerprints.
- **Encrypted Storage:** All digital evidence is stored in Appwrite's encrypted buckets with strict access control.

---

## 📜 License & Acknowledgments

© 2026 Silent Shield Monitoring System | Mission-driven tool for digital safety.
