# Jalyoddhe — Backend
FastAPI backend for running the Jalyoddhe inference pipeline, managing AOIs, tiles, and admin operations.

The backend:
- Exposes REST APIs used by the frontend  
- Runs a tile-based multi-label classification pipeline through Modal  
- Stores AOI, tile, and pipeline run metadata in a connected database  
---

## 📁 Project Structure
```bash
backend/
│
├── app.py # FastAPI app + API routes + Modal wrapper
│
├── db/
│ ├── conn.py # Database connection
│ └── services/
│ └── RunService.py # Pipeline run DB interactions
│
├── nn_models/
│ └── classification/ # Model architecture / utilities
│
├── saved_models/ # Saved model files
│
├── schemas/
│ ├── models.py # Pydantic schemas (LoginPayload, AOIUpdateEntry, etc.)
│ └── others.py
│
├── services/
│ ├── GDownloader.py # Image/tile download helpers
│ ├── InferencePipeline.py # Full inference pipeline
│ ├── Model.py # Model loading + predictions
│ └── Tiler.py # Image → tile conversion
│
├── utils/
│ ├── const.py # Table/column constants
│ ├── env.py # Env variable loader
│ ├── logger.py # Logger
│ └── utils.py
│
├── pyproject.toml # Dependencies
└── README.md
```
---

## Installation

``` bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
## Running the server (development)
Run with Uvicorn (recommended):
```bash
uvicorn app:web_app --reload --port 5000
```
Server → http://localhost:5000

## Environment Variables
Create a .env file:

```bash
# Inference related (following variables are set by default based on trial and error, and what we felt was right; you can always change them)
LABELS="['Marine Debris', 'Dense Sargassum', 'Sparse Sargassum', 'Natural Organic Material', 'Ship', 'Clouds', 'Marine Water', 'Sediment-Laden Water', 'Foam', 'Turbid Water', 'Shallow Water']"
ALLOWED_LABEL_INDEX="[0,1,2,3,7,8]"
PER_CLASS_THRESHOLD="[
    0.7987891435623169,
    0.04360494390130043,
    0.33120080828666687,
    0.17012758553028107,
    0.46195462346076965,
    0.22206197679042816,
    0.16580776870250702,
    0.7626513838768005,
    0.4333387613296509,
    0.5384535193443298,
    0.2443457841873169
]"
RESNET_MODEL_NAME="/models/multilabel_classification/saved_models/model-file-name.pth"

# Supabase related
SUPABASE_URL="https://your-supabase-url.supabase.co"
SUPABASE_ANON="your_supabase_anon_key"

# Script related
SCRIPT_ENV="LOCAL"
CACHE_DIR="/root/.cache/"

# Admin related
ADMIN_EMAIL="admin@jalyoddhe.com"
ADMIN_SECRET_KEY="your_admin_password"
```

## API Endpoints
### Health
```bash
GET / → { "status": "ok" }
```

### Admin Login
```bash
POST /api/admin/login
```

### Body:

```bash
{ "email": "", "secret_key": "" }
```

### Run Pipeline
```bash
POST /api/pipeline/run
```
Starts tile-based multi-label inference using Modal.

**Note:** The backend and inference script were written to deploy on Modal's infa. If you are planning to host it on another platform, you'll need to make changes to app.py (backend) and modal_inference_script.py (inference script)

### Pipeline Status
```bash
GET /api/pipeline/status?run_id=...
```

Returns:
- 202 → still running
- 200 → finished
- 400 → invalid run_id

### AOI (Public)
```bash
GET /api/aois
```

### AOI (Admin)
```bash
GET /api/admin/aois
POST /api/admin/aois
DELETE /api/admin/aois?aoi_name=
```

### Tiles
```bash
GET /api/tiles?aoi_id=...
```

## Inference Pipeline Workflow
1. Download satellite image(s) of the AOI
2. Convert into tiles (Tiler.py)
3. Run model predictions (Model.py)
4. Store results in DB
5. Query results via /api/pipeline/status and /api/tiles

Model type → **Multi-label classification**

## Maintainers
* Mayuresh Choudhary
* Yashshri Mule

