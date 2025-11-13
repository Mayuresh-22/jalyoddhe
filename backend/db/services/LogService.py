from datetime import datetime as dt
from typing import Dict, Optional

from schemas.models import DBOptions
from utils.const import FINISHED_AT_COLUMN, RUN_ID_COLUMN, RUN_TABLE, STATUS_COLUMN, SUMMARY_COLUMN
from utils.logger import logger


class LogService:
    def __init__(self, run_id: str, options: DBOptions) -> None:
        self.run_id = run_id
        self.options = options

    def log(self, status: str, summary: Dict = {}, finished: bool = False) -> None:
        queryClient = self.options.db
        
        try:
            queryClient.table(RUN_TABLE).upsert({
                RUN_ID_COLUMN: self.run_id,
                STATUS_COLUMN: status,
                SUMMARY_COLUMN: summary,
                FINISHED_AT_COLUMN: None if not finished else dt.isoformat(dt.now())
            }, on_conflict=RUN_ID_COLUMN).execute()
        except Exception as e:
            logger.error(f"Error logging inference run: {e}")
