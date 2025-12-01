<img width="1531" height="384" alt="logo" src="https://github.com/user-attachments/assets/40aeae9d-d511-4369-8779-ab4f69fae478" />

# Jalyoddhe
From space to shore - Detect, Protect, Restore.

Jalyoddhe is a full-stack system designed to detect and visualize coastal/marine pollution using satellite imagery and AI.

It provides:
- Inference Pipeline (tile-based, multi-label classification)
- Interactive Frontend Dashboard (Leaflet + React)
- Database-backed AOI & tile management
- Admin tools for triggering pipelines and managing AOIs

This repository contains the full monorepo including backend, frontend, and utility modules.

## 📁 Repository Structure
```bash
jalyoddhe/
│
├── backend/                # FastAPI + Modal inference pipeline + database layer
│   └── README.md           # Backend-specific detailed documentation
│
├── frontend/               # React + Vite dashboard (map, admin UI, chatbot)
│   └── README.md           # Frontend-specific detailed documentation
│
├── models/                 # (Optional) model training notebooks / experiments
│
├── utils/                  # Shared helper scripts (optional global utilities)
│
├── .gitignore
└── README.md               # Root-level overview (this file)
```

Detailed documentation for each subsystem is inside its respective folder.

## Project Overview
### Frontend

- Built using React + Vite

- Map powered by Leaflet + OpenStreetMap

- Includes:
    - Dashboard & UI components
    - AOI selection + tile visualization
    - Chatbot panel
    - Admin login & admin dashboard

### See full frontend docs:
`frontend/README.md`
--- 

### Backend
- Built using FastAPI
- Integrated with Modal for running large inference pipelines
- Connects to external DB (Supabase or similar)
- Provides REST APIs for:
  - AOIs
  - Tiles
  - Pipeline run status
  - Admin authentication
- Orchestrates:
  - Image downloading
  - Tiling
  - Multi-label model inference
  - Prediction storage

### See full backend docs:
`backend/README.md`
---

### AI & Pipeline

- Multi-label classification model
- Image → tiles → predictions workflow
- All logic managed inside:
  - services/Tiler.py
  - services/Model.py
  - services/InferencePipeline.py
- Heavy compute runs through Modal serverless infrastructure

## Quick Start (High-Level)
### 1. Clone the Repository
```bash
git clone https://github.com/Mayuresh-22/jalyoddhe
cd jalyoddhe
```

### 2. Start Frontend
```bash
cd frontend/jalyoddhe
npm install
npm run dev
```

Runs on: http://localhost:5173

### 3. Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app:web_app --reload --port 5000
```

Runs on: http://localhost:5000

### 4. Environment Setup

You must create environment files in:
```bash
frontend/jalyoddhe/.env.local
backend/.env
```

Content examples for each are documented inside the respective READMEs:
- Frontend: API base URL
- Backend: DB, admin credentials, model paths, Modal secrets

## System Architecture (High-Level)
```bash
          ┌─────────────────────┐
          │    Frontend UI      │
          │  (React + Leaflet)  │
          └─────────┬───────────┘
                    │ API Calls
                    ▼
        ┌──────────────────────────┐
        │        Backend API       │
        │       (FastAPI App)      │
        └──────┬───────────┬───────┘
               │           │
               │           ▼
               │   ┌──────────────────┐
               │   │  Database (DB)   │
               │   └──────────────────┘
               │
               ▼
    ┌─────────────────────────────┐
    │  Modal Inference Pipeline   │
    │ (RunService + Model + Tiles)│
    └─────────────────────────────┘
```

## What the Platform Provides
- Satellite image processing
- Tile-based pollution prediction
- Prediction visualization on interactive map
- AOI management
- Pipeline run & status monitoring
- Admin-only tools for maintenance

## Contributing
- Code for frontend & backend must follow modular structure 
- Add new utilities only under appropriate /utils folders
- Keep AI-related code isolated in /services or /nn_models
- Use environment variables instead of hardcoding credentials

## Team
* Mayuresh Choudhary
* Yashshri Mule
