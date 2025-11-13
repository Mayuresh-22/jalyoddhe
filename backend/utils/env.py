import os
from typing import List
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local", override=True)


class Env:
    LABELS: List[str] = eval(os.getenv("LABELS", "['Marine Debris', 'Dense Sargassum', 'Sparse Sargassum', 'Natural Organic Material', 'Ship', 'Clouds', 'Marine Water', 'Sediment-Laden Water', 'Foam', 'Turbid Water', 'Shallow Water']"))
    ALLOWED_LABEL_INDEX: List[int] = eval(os.getenv("ALLOWED_LABEL_INDEX", "[0, 2, 3, 7, 8]"))
    PER_CLASS_THRESHOLD: List[float] = eval(os.getenv("PER_CLASS_THRESHOLD", "[0.677416205406189, 0.07188495248556137, 0.3964208662509918, 0.17160184681415558, 0.8084190487861633, 0.2527278661727905, 0.30465438961982727, 0.7812029719352722, 0.5235404968261719, 0.7620067596435547, 0.2915283739566803]"))
    RESNET_MODEL_NAME: str = str(os.getenv("RESNET_MODEL_NAME", "resnet50_v1"))
    SUPABASE_URL: str = str(os.getenv("SUPABASE_URL"))
    SUPABASE_ANON: str = str(os.getenv("SUPABASE_ANON"))