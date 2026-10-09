# 🚀 [Tips Hindawi](https://www.tipshindawi.com/) Internship (August–October) 2026

> 🎓 This project was built during the [ **Tips Hindawi** ](https://www.tipshindawi.com/) **Internship (August–October) 2026**.

## 👤 Participant

| Field            | Value                          |
| ---------------- | ------------------------------------ |
| Full Name        | Karim Salah Abdelaziz Nasr           |
| Project Name     | SuperCV                              |
| GitHub Username  | KareemHerish                         |
| Internship Batch | August–October 2026                  |
| Training Program | Large Language Models (LLMs) Program |
| Organization     | [**Edrak for Ai**](https://edrak4ai.com/en)                         |

---

# 📖 Project Overview

**SuperCV** is an intelligent, bilingual and career guidance platform powered by modern Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG). 

Designed specifically for software engineers, technical professionals, and university graduates, SuperCV bridges the gap between official developer roadmaps ([roadmap.sh](https://roadmap.sh)) and market-ready, high-impact CVs. The platform empowers users to build ATS-compliant resumes with real-time live preview, identify skill gaps against international industry benchmarks, rewrite accomplishments into executive-level impact statements using **Google's XYZ Formula**, prepare for technical interviews with dynamic interactive quizzes, and export pixel-perfect multi-page A4 PDFs.

---

# ✨ Features

* **Interactive Live Resume Builder & Multi-Template Engine**: Real-time editable A4 resume sheet with bilingual support (Arabic RTL & English LTR), customizable typography, custom color accents, photo integration, and dynamic sections (Experience, Projects, Education, Certifications, and Skills).
* **RAG & LLM-Powered Career Architect ("Careem" AI Copilot)**: A specialized AI technical mentor with conversational memory and candidate CV context awareness (semantic chunking and vector retrieval), offering salary benchmarks, roadmap guidance, and direct architectural advice without generic fluff.
* **Automated Google XYZ & STAR Achievement Enhancer**: Transforms weak resume bullet points into executive-level, quantified achievements (*"Accomplished [X] measured by [Y] by doing [Z]"*) to pass both automated Applicant Tracking Systems (ATS) and senior engineering hiring managers.
* **Official Roadmap.sh Integration & Skill Gap Tracker**: 14+ standardized engineering tracks (Frontend, Backend, DevOps, AI/ML, Data Engineering, Cyber Security, Flutter, etc.) featuring an interactive progress tracker, automatic CV skill injection, and personalized skill gap analysis.
* **Dynamic Technical Assessment & Interactive Quizzes**: Generates production-grade multiple-choice technical questions tailored to specific tools and frameworks, complete with instant clickable option evaluation and concise Arabic/English explanations.
* **Pixel-Perfect A4 PDF Export**: High-fidelity PDF rendering engine ensuring 100% visual consistency between the web workspace and the downloaded document, with automatic removal of unfilled placeholder fields.
* **Cloud Sync & Authentication**: Seamless user authentication with Google OAuth via Firebase Auth, accompanied by persistent cloud storage on Firebase Cloud Firestore.

---

# 🛠️ Technologies Used

* **Frontend & UI**:
  * **React 19** & **TypeScript** (Modern functional components, hooks, and strict type safety)
  * **Tailwind CSS v4** (Modern utility-first styling with responsive, accessible layout and dark/light modes)
  * **Framer Motion / Motion** (Fluid micro-interactions, smooth tabs transitions, and animated alerts)
  * **Lucide React** (Consistent, high-clarity iconography)
  * **HTML2Canvas** & **jsPDF** (Vector and canvas-based pixel-perfect multi-page A4 PDF rendering)

* **Backend & Server Architecture**:
  * **Node.js** & **Express.js** (REST API endpoints for AI interactions, PDF streaming, and message delivery)
  * **Vite** (Next-generation frontend tooling and development server middleware)
  * **Vercel Serverless Architecture** (Edge & serverless function integration via `vercel.json` and `/api`)

* **Artificial Intelligence & LLMs**:
  * **@google/genai SDK**: Powered by Google Gemini 2.5 / Flash models with automated multi-model cascade fallback
  * **Hugging Face Inference (@huggingface/inference)**: Integrated with open-weights LLMs (Mistral-7B-Instruct)
  * **RAG Pipeline**: Custom semantic chunking, 64-dimensional pseudo-embeddings, and cosine similarity vector retrieval

* **Database, Authentication & Cloud Services**:
  * **Google Firebase**: Firebase Authentication (Google Sign-In) & Cloud Firestore Database
  * **Nodemailer**: SMTP email integration for portfolio inquiries and contact forms

---

# ⚙️ Installation

Follow these steps to set up and run SuperCV locally on your machine:

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (version 18.x or higher)
* [npm](https://www.npmjs.com/) (version 9.x or higher)
* A Google Gemini API Key (obtainable free from [Google AI Studio](https://aistudio.google.com/apikey))

### 2. Clone the Repository
```bash
git clone https://github.com/SuperCV/SuperCV.git
cd SuperCV
