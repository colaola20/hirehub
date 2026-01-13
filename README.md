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
- [💡 Why We Built This](#-why-we-built-this)
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

## 💡 Why We Built This
Job searching—especially in tech—can feel overwhelming. While building HireHub, we noticed that many platforms focus only on job listings, but ignore everything else that comes with applying: tracking applications, tailoring resumes, keeping documents updated, and understanding how well you actually match a role.

We wanted to fix that.

HireHub was created by **CodeWhisperers** as a full-stack project with one main idea in mind:  
**make the job hunt more organized, smarter, and less chaotic.**

All job postings are filtered to focus on IT-related roles only.

## ✨ Features

### 🔐 User Accounts & Security
- User registration and login
- OAuth login with **Google, GitHub, and LinkedIn**
- Password recovery
- Automatic session timeout
- Secure document storage using **AWS S3**

### 💼 Job Search & Application Tracking
- Job dashboard with filtering and sorting
- AI-powered job recommendations
- AI-generated **match percentage** for each job
- Application tracker with status updates and personal notes
- Save jobs to favorites
- Email notifications

### 📄 Resume & Cover Letter Tools
- Resume builder that generates ready-to-use templates
- Built-in **OnlyOffice** editor for final edits
- Store and reuse documents when applying to new jobs

### 🤖 AI Features
- AI chatbot to:
  - Ask questions about a company or role
  - Get feedback on your resume
  - Understand missing skills based on job requirements
- Job description summarizer for quick scanning

### 🎨 User Experience
- Fully responsive design (desktop, tablet, mobile)
- Profile management to improve recommendations
- Custom settings
- Clean and easy-to-use UI

## 🧰 Tech Stack

### Backend
- **Flask (Python)**
- **PostgreSQL** (AWS RDS)
- **AWS S3** for file storage

### Frontend
- **React + Vite**
- **CSS3**
- Icons: Lucide React, React Icons
- 3D visuals: Three.js
- HTTP: Axios
- Validation: Yup

### External APIs & Services
- Job data: Adzuna, Findwork
- OAuth: Google, GitHub, LinkedIn
- AI: Groq, OpenAI
- Email service

### AWS
- EC2 (app + OnlyOffice server)
- RDS (PostgreSQL)
- S3 (documents)

## 🧭 How It Works
All HireHub services are available only for sign in users, so the first step is registration or login in with Google, GitHub, or LinkIn credentials.

Registration page:
<img width="1239" height="762" alt="Screenshot 2026-01-13 at 3 14 00 PM" src="https://github.com/user-attachments/assets/5aaa787b-a206-43ee-b900-1ddf5312fac7" />

Login page:
<img width="1239" height="762" alt="Screenshot 2026-01-13 at 3 14 07 PM" src="https://github.com/user-attachments/assets/4b87eb58-7098-47d8-9636-b35863b4c705" />

For more personalized user experience we recommend fill our profile section next.

Profile page:
<img width="1732" height="1218" alt="Screenshot 2026-01-13 at 3 17 46 PM" src="https://github.com/user-attachments/assets/abcb6485-3310-4be9-9516-4eac5918481a" />

Now you are ready to start your job hunt.

Job Dashboard page:
<img width="1740" height="1283" alt="Screenshot 2026-01-13 at 3 23 56 PM" src="https://github.com/user-attachments/assets/e2996431-7376-494d-9c35-0de60ad894a8" />

Job Detailed page:
<img width="1826" height="1293" alt="Screenshot 2026-01-13 at 3 25 48 PM" src="https://github.com/user-attachments/assets/2f2794fa-0e02-413c-81ff-5d0c3ad3aae9" />

Good luck with your job hunt! You got it!

## 🖥️ Demo & Screenshots

Home page:

https://github.com/user-attachments/assets/44fc53e6-1e2c-45d3-865d-8224ba73e17b

How the job hunt might look for you:

https://github.com/user-attachments/assets/9de5f8e5-8e17-4272-b81b-7ee3f07f16a2

Resume Builder:

https://github.com/user-attachments/assets/4d4f5262-a819-400d-b071-244bcebfd7cc

Documents managment:

https://github.com/user-attachments/assets/783e947c-840e-4805-9506-6c9f2d0a9a3e

Notification & Setting page:

https://github.com/user-attachments/assets/63f2ad33-f609-4881-b521-8edc7dad46e6



## ⚙️ Installation

### Backend Setup

1. Clone github repository: git clone https://github.com/colaola20/hirehub.git
2. Create a virtual enviroment, using python3 -m venv env command on Mac
3. Activate virtual enviroment, using source venv/bin/activate command on Mac
4. Install all dependencies from requirements.txt, using python3 -m pip install -r requirements.txt command on Mac
5. Install all npm dependencies, starting with nmp install command
6. Create AWS accound for AWS services, including S3 storage. AWS provide credits for free start with their services.
7. Create a .env file in the backend folder:
   
  DATABASE_URL=

  #OAuth
  
  GITHUB_CLIENT_ID=
  GITHUB_CLIENT_SECRET=
  
  GOOGLE_CLIENT_ID=
  GOOGLE_CLIENT_SECRET=
  
  LINKEDIN_CLIENT_ID=
  LINKEDIN_CLIENT_SECRET=
  
  #Job APIs
  
  FINDWORK_API_KEY=
  ADZUNA_APP_ID=
  ADZUNA_APP_KEY=
  
  #AI Services
  GROQ_API_KEY=
  OPENAI_API_KEY=
  
  #AWS
  
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  S3_BUCKET_NAME=
  
  #Email
  
  MAIL_SERVER=
  MAIL_PORT=
  MAIL_USE_TLS=
  MAIL_USERNAME=
  MAIL_PASSWORD=
  MAIL_DEFAULT_SENDER=


You need to run both backend and frontend servers. To run backend, use flask run --port=5001 command. To run frontend, use npm run dev command.

## ▶️ Usage
HireHub was built mainly for tech students and early-career developers, but it also works great for experienced professionals who like staying organized.

The goal is to keep everything related to applying in one place—jobs, documents, notes, and AI help—so applying feels easier and less stressful.

If you have ideas on how to make HireHub better, feel free to reach out or open an issue.

## 🧪 Testing
Backend testing with pytest

Frontend tested manually (automated tests planned)

## 📚 Documentation
Full project documentation:
https://docs.google.com/document/d/1bncvdEkDYJf-2ZPNqTV5hTURe5S7w92cFxydwMap3i8/edit?usp=sharing

## 🤝 Contributing

We welcome contributions! HireHub is open for community involvement. Please feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🧑‍💻 Contributors

| [<img width="80px" alt="Screenshot 2025-12-03 at 1 55 19 PM" src="https://github.com/user-attachments/assets/6e436198-ec9d-4341-89cf-182a80e874c3" /><br><sub>@Haris Akbar</sub>](https://github.com/HarisAkbar03) | [<img width="80px" alt="Screenshot 2025-12-03 at 1 54 51 PM" src="https://github.com/user-attachments/assets/6643600a-c354-463a-ab4f-a87f4dd10550" /><br><sub>@ Olha Sorych</sub>](https://github.com/colaola20) | [<img width="80px" alt="Screenshot 2025-12-03 at 1 54 45 PM" src="https://github.com/user-attachments/assets/d4992ac1-21ab-4b23-a8fe-98fc49c7f2ec" /><br><sub>@Jonatan Paulino</sub>](https://github.com/JPR420) | [<img width="80px" alt="Screenshot 2025-12-03 at 1 54 57 PM" src="https://github.com/user-attachments/assets/11052ac2-77b9-475b-b604-7ca275f07ec2" /><br><sub>@Michael Moradi</sub>](https://github.com/PracticalEscapement) | [<img width="80px" alt="Screenshot 2026-01-13 at 4 52 30 PM" src="https://github.com/user-attachments/assets/755f6d58-53ee-476b-ba96-791ef2f226c2" /><br><sub>@Hashim Kazmi</sub>](https://github.com/kazmha) |
|:------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------:|

## 🙏 Acknowledgments
Huge thanks to **Dr. Lorraine Greenwald** for supporting us throughout the project and guiding us when we needed it most.

**Built with ❤️ by the HireHub Team**
