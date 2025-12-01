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
# Inference related
LABELS="['Marine Debris','Dense Sargassum','...']"
ALLOWED_LABEL_INDEX="[0,1,2,3,7,8]"
PER_CLASS_THRESHOLD="[
0.7987, 0.0436, 0.3312, 0.1701, 0.4619,
0.2220, 0.1658, 0.7626, 0.4383, 0.5384, 0.2443
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

