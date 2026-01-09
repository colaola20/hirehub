![HireHub_Logo](https://github.com/user-attachments/assets/21210dd0-b47d-46e5-bbd8-a030fbce33f0)
<div>
  <p align="center">
    <strong>Apply smarter. Track faster. Get hired.</strong>
  </p>
</div>
<br>
<div align="center">
  <img src="https://img.shields.io/badge/JavaScript-2b204f?style=for-the-badge&logo=javascript" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/React-2b204f?style=for-the-badge&logo=react&logoColor=61DAFB" alt="Rect"/>
  <img src="https://img.shields.io/badge/Vite-2b204f?style=for-the-badge&logo=vite&logoColor=646CFF" alt="Vite"/>
  <img src="https://img.shields.io/badge/CSS-2b204f?style=for-the-badge&logo=css&logoColor=F43059" alt="CSS" />
  <img src="https://img.shields.io/badge/Flask-2b204f?style=for-the-badge&logo=flask&logoColor=3BABC3" alt="Flask" />
  <img src="https://img.shields.io/badge/OpenAI-2b204f?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Groq-2b204f?style=for-the-badge&logo=groq&logoColor=white" alt="Groq">
  <img src="https://img.shields.io/badge/AWS%20S3-2b204f?style=for-the-badge&logo=amazons3&logoColor=white" alt="AWS S3" />
  <img src="https://img.shields.io/badge/AWS%20RDS-2b204f?style=for-the-badge&logo=amazonrds&logoColor=white" alt="AWS RDS" />
  <img src="https://img.shields.io/badge/PostgreSQL-2b204f?style=for-the-badge&logo=postgresql&logoColor=4169E1" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Only%20Office-2b204f?style=for-the-badge&logo=onlyoffice&logoColor=444444" alt="Only Office">
  <img src="https://img.shields.io/badge/Docker-2b204f?style=for-the-badge&logo=docker&logoColor=2496ED" alt="Docker" />
</div>
<br>
<div align="center">
  <img src="https://img.shields.io/github/stars/colaola20/hirehub?style=social" alt="Stars" />&nbsp;
  <img src="https://img.shields.io/github/commit-activity/m/colaola20/hirehub?style=social" />
  <img src="https://img.shields.io/github/last-commit/colaola20/hirehub?style=social" alt="Last commit" />&nbsp;
  <img src="https://img.shields.io/github/languages/top/colaola20/hirehub?style=social" alt="Top language" />&nbsp;
</div>
<br>
<h2 align="center">HireHub is an AI-Powered Job Application Platform</h2>
<p align="center">designed to support an intelligent job search by combining all the essential features needed for a smooth and successful process. These include a resume builder, an AI-powered matching and recommendation system, an application tracking dashboard, and document storage with an integrated editor. With everything in one place, users are always prepared to take advantage of new opportunities as they arise.</p>

## 🧭 Table of Contents
- [🚀 Introduction](#-introduction)
- [✨ Features](#-features)
- [🧰 Tech Stack](#-tech-stack)
- [🧭 How It Works](#-how-it-works)
- [🖥️ Demo & Screenshots](#️-demo--screenshots)
- [⚙️ Installation](#️-installation)
- [▶️ Usage](#️-usage)
- [🧪 Testing](#-testing)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [🧑‍💻 Contributors](#-contributors)
- [🙏 Acknowledgments](#-acknowledgments)

## ✨ Key Features

### 🔐 User Management & Security
- **User Authentication**: Registration, login/logout with secure session management
- **OAuth Integration**: Sign in with Google, LinkedIn, or GitHub
- **Password Recovery**: Secure password reset functionality
- **Auto Logout**: Automatic session timeout for enhanced security
- **Cloud Storage**: Secure AWS S3 storage for resumes and cover letters with full CRUD operations

### 💼 Job Search & Tracking
- **Smart Dashboard**: Advanced filtering, sorting, and search with saved preferences
- **AI Job Recommendations**: Personalized job suggestions based on your experience and skills
- **Match Percentage**: AI-calculated compatibility score for each job posting
- **Application Tracker**: Mark applications as Applied, Interviewing, Rejected, or Offered
- **Email Notifications**: Stay updated on your application status
- **Favorites System**: Save jobs for later review

### 📄 Resume & Cover Letter Assistance
- **AI Document Generation**: Create tailored resumes and cover letters for specific job descriptions
- **AI Chatbot**: Refine and edit documents with conversational AI assistance
- **PDF Export**: Download polished documents ready for submission

### 🤖 AI-Enhanced Career Tools
- **Job Description Summarizer**: Convert lengthy job postings into concise bullet points
- **Skills Matching**: Intelligent analysis of your qualifications vs. job requirements

### 🎨 Personalization & User Experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **User Profile Management**: Update personal information and preferences
- **Settings Page**: Customize your HireHub experience
- **Applied Jobs Page**: Organize applications with notes and sorting options
- **Clean UI**: Intuitive, organized job information display

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL (AWS RDS)
- **Storage**: AWS S3
- **AI/ML**: Groq API, OpenAI API

### Frontend
- **Framework**: React with Vite
- **Styling**: CSS
- **Icons**: Lucide React, React Icons
- **3D Graphics**: Three.js
- **HTTP Client**: Axios
- **Validation**: Yup

### External APIs
- **Job Data**: Adzuna, Findwork
- **OAuth**: Google, GitHub, LinkedIn APIs
- **AI Services**: Groq, OpenAI

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- AWS Account (for S3 and RDS)

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/colaola20/hirehub.git
cd hirehub
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Create a .env file with your configuration
cp .env.example .env
# Add your API keys, database URL, and AWS credentials
```

4. Run database migrations:
```bash
flask db upgrade
```

5. Start the backend server:
```bash
flask run
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
npm install html-truncate
npm install lucide-react
npm install three
npm install react-icons
npm install axios
npm install yup
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

---

## 📋 Roadmap & Future Plans

- [ ] **Privacy Controls**: Choose whether documents are stored or used only in-session
- [ ] **Payment Integration**: Secure payment portal for premium features
- [ ] **Skill Development**: Certification and course recommendations to enhance your profile
- [ ] **AI Feedback Loop**: Rate AI responses to improve suggestions over time
- [ ] **Theme Options**: Light/Dark mode toggle
- [ ] **Premium Tiers**: Unlimited storage and resume generations

---

## 🤝 Contributing

We welcome contributions! HireHub is open for community involvement. Please feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📄 License

This project is currently in active development. License information will be added soon.

---

## 📧 Contact

For questions or feedback, please open an issue on [GitHub](https://github.com/colaola20/hirehub/issues).

---

**Built with ❤️ by the HireHub Team**
