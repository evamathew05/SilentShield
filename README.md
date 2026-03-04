# 🛡️ Silent Shield

**Silent Shield** is a modern, anonymous cyberbullying reporting portal designed to provide a safe and secure space for students and individuals to speak up against digital harassment. Built with a focus on privacy and rapid response, the platform ensures that every report is encrypted and handled with the highest level of confidentiality.

---

## 🚀 Key Features

### 👤 For Users (Anonymous Reporting)
- **100% Anonymous Submissions:** Report incidents without providing any personal identification.
- **Incident Categorization:** Specify the type of bullying (Harassment, Hate Speech, Impersonation, etc.) and the platform where it occurred.
- **Evidence Upload:** Attach screenshots or images directly to the report via secure cloud storage.
- **Reference ID Tracking:** Receive a unique, private reference ID to monitor the status of your case in real-time.
- **Progress Stepper:** Visually track your report from "Submitted" to "Staff Assessment" and final "Resolution."

### 🔑 For Staff (Admin Portal)
- **Secure Authentication:** Centralized AuthService for authorized staff access.
- **Executive Dashboard:** Real-time statistics showing total, pending, and resolved cases.
- **Case Management:** Detailed view of every report, including high-resolution evidence inspection.
- **Status Control:** Update case progress (Pending, Under Review, Resolved) to keep victims informed.
- **Protected Routes:** Advanced route security ensures administrative tools are only accessible to verified staff.

---

## 🛠️ Tech Stack

- **Frontend:** [React.js](https://reactjs.org/) (Single Page Application)
- **Styling:** [Tailwind CSS v4.0](https://tailwindcss.com/) (Professional SaaS Aesthetic)
- **Backend-as-a-Service:** [Appwrite](https://appwrite.io/)
  - **Auth:** Email/Password Session Management
  - **Databases:** NoSQL storage for incident reports
  - **Storage:** Secure buckets for digital evidence
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)

---

## 📂 Project Structure

```text
├── scripts/                # Backend setup & automation scripts
├── src/
│   ├── components/         # Reusable UI components (Protected Routes, etc.)
│   ├── pages/              # Application Views (Home, Report, Admin, etc.)
│   ├── styles/             # Global CSS and Tailwind configuration
│   ├── utils/              # Appwrite services and Auth logic
│   ├── App.jsx             # Main routing logic
│   └── main.jsx            # React entry point
├── public/                 # Static assets (Logos, Icons)
└── .env                    # Environment variables (Internal use)
```

---

## ⚙️ Local Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/evamathew/SilentShield.git
    cd SilentShield
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add your Appwrite credentials:
    ```env
    VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
    VITE_APPWRITE_PROJECT_ID=your_project_id
    VITE_APPWRITE_DATABASE_ID=your_database_id
    VITE_APPWRITE_COLLECTION_ID=your_collection_id
    VITE_APPWRITE_BUCKET_ID=your_bucket_id
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🔒 Security Protocol

- **Zero-Logging Policy:** No metadata regarding user IP addresses or browser fingerprints is stored.
- **Data Encryption:** All reports are transmitted via SSL and stored with Appwrite's built-in encryption.
- **Access Control:** Strict database permissions ensure that only authenticated staff accounts can read incident data.

---

## 📜 License & Acknowledgments

This project was developed as a mission-driven tool to combat cyberbullying. 

© 2026 Silent Shield Monitoring System | Built with React & Appwrite.
