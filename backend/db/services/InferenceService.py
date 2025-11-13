from typing import List
from supabase import Client
from schemas.models import DBOptions, InferencePayload
from utils.logger import logger
from utils.const import AOI_NAME_COLUMN, BOUNDS_COLUMN, TILE_TABLE, LAST_UPDATED_COLUMN, PREDICTION_COLUMN, TILE_ID_COLUMN


class InferenceService:
    def upsert(self, payloads: List[InferencePayload], options: DBOptions):
        queryClient = options.db
        
        try:
            rows = [payload.model_dump() for payload in payloads]
            print(rows)
            resp = queryClient.table(TILE_TABLE).upsert(
                rows, on_conflict=BOUNDS_COLUMN
            ).execute()
            logger.info(f"DB upsert response: {resp}")
        except Exception as e:
            logger.error(f"Error upserting inferences into DB: {e}")
    
    def upsert_in_batch(self, payloads: List[InferencePayload], options: DBOptions):
        logger.info("Batch upsert started...")
        for start in range(0, len(payloads), options.batch_size):
            self.upsert(payloads[start : options.batch_size], options)
        logger.info("Batch upsert completed successfully")
    
    def get_inferences_by_aoi(self, aoi_name: str, options: DBOptions, *cols: str) -> List[dict] | List:
        queryClient = options.db
        if not cols:
            cols = (TILE_ID_COLUMN, BOUNDS_COLUMN, PREDICTION_COLUMN, LAST_UPDATED_COLUMN)
        try:
            resp = queryClient.table(TILE_TABLE).select(*cols).eq(AOI_NAME_COLUMN, aoi_name).execute()
            logger.info(f"DB fetch response: {resp}")
            return resp.data or []
        except Exception as e:
            logger.error(f"Error fetching inferences from DB: {e}")
            return []
