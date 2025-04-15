# AI Social Media Profile Toolkit 💘🤖

**AI Social Media Profile Toolkit** is a full-stack web application that helps users optimize their online social profiles using GPT-powered tools. It currently includes:

- **Bio Critique Tool:** Provides professional-style feedback on profile bios based on tone, clarity, and originality.
- **Opener Generator:** Creates customized opening messages tailored to a user's profile and desired tone.
- **Conversation Coach:** Analyzes a user's conversation and gives feedback on their perceived tone. Suggests responses with a variety of different tones.


The app features a React frontend (Vite + Tailwind) with a FastAPI backend powered by OpenAI’s GPT-3.5-Turbo. It’s containerized with Docker and was tested using a private EC2 instance.

---

## 💡 Description

This project was built to explore practical LLM integration across a real-world full-stack application — combining AI prompt engineering with scalable backend design, modern frontend tooling, and cloud deployment.

The tools are designed to produce engaging, personality-driven outputs that remain appropriate, original, and aligned with user-selected tone — with safeguards in place to avoid repetition, crude content, or generic language.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios (hosted on Vercel)
- **Backend:** Python, FastAPI, OpenAI API, Pydantic, Docker
- **Infrastructure:** Docker Compose, AWS EC2, Nginx, HTTPS via Certbot
- **AI & LLM:** GPT-3.5-Turbo, Prompt Engineering, Tone Control, Output Filtering

---

### ⚠️ Known Limitations

LLMs occasionally return malformed or off-target responses. This is being actively addressed with prompt refinement, fallback handling, and smarter model selection.

---

## 📂 Repository

**Backend:** [`/backend`](https://github.com/zzwerling/ai-social-profile-toolkit/tree/main/backend)  
**Frontend:** [`/frontend`](https://github.com/zzwerling/ai-social-profile-toolkit/tree/main/frontend)

