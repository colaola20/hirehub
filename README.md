# 🚀 HireHub

**AI-Powered Job Application Platform**  
Built with Flask, React, PostgreSQL & Groq

HireHub is an intelligent job search companion that helps job seekers apply faster and smarter. With AI-powered resume tailoring, personalized cover letters, job matching, application tracking, and cloud document storage — it's your complete end-to-end job search solution.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/colaola20/hirehub)

---

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
