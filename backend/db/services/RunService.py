from datetime import datetime as dt
from typing import Dict

from schemas.models import DBOptions
from utils.const import (
    FINISHED_AT_COLUMN,
    RUN_ID_COLUMN,
    RUN_TABLE,
    STATUS_COLUMN,
    SUMMARY_COLUMN,
)
from utils.logger import logger


class RunService:
    def __init__(self, run_id: str, options: DBOptions) -> None:
        self.run_id = run_id
        self.options = options

    def log(self, status: str, summary: Dict = {}, finished: bool = False) -> None:
        queryClient = self.options.db

        try:
            queryClient.table(RUN_TABLE).upsert(
                {
                    RUN_ID_COLUMN: self.run_id,
                    STATUS_COLUMN: status,
                    SUMMARY_COLUMN: summary,
                    FINISHED_AT_COLUMN: None
                    if not finished
                    else dt.isoformat(dt.now()),
                },
                on_conflict=RUN_ID_COLUMN,
            ).execute()
        except Exception as e:
            logger.error(f"Error logging inference run: {e}")

    def get_last_run(self):
        queryClient = self.options.db

        try:
            result = (
                queryClient.table(RUN_TABLE)
                .select("*")
                .order(FINISHED_AT_COLUMN, desc=True)
                .limit(1)
                .execute()
            )
            records = result.data
            logger.info(f"Last run records fetched: {records}")
            if records and len(records) > 0:
                return records[0]
            return None
        except Exception as e:
            logger.error(f"Error fetching last run: {e}")
            return None
