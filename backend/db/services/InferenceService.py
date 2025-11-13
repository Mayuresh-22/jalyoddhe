from typing import List
from supabase import Client
from schemas.models import DBOptions, InferencePayload
from utils.logger import logger
from utils.const import INFERENCE_TABLE


class InferenceService:
    def insert(self, payloads: List[InferencePayload], options: DBOptions):
        queryClient = options.db
        
        try:
            rows = [payload.model_dump() for payload in payloads]
            print(rows)
            resp = queryClient.table(INFERENCE_TABLE).insert(
                rows
            ).execute()
            logger.info(f"DB insert response: {resp}")
        except Exception as e:
            logger.error(f"Error inserting inferences into DB: {e}")
    
    def insert_in_batch(self, payloads: List[InferencePayload], options: DBOptions):
        logger.info("Batch insert started...")
        for start in range(0, len(payloads), options.batch_size):
            self.insert(payloads[start : options.batch_size], options)
        logger.info("Batch insert completed successfully")