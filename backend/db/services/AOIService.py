from schemas.models import DBOptions
from utils.const import AOI_ID_COLUMN, AOI_NAME_COLUMN, AOI_TABLE, FILE_ID_COLUMN
from utils.logger import logger


class AOIService:
    def get_aois(self, options: DBOptions):
        queryClient = options.db
        
        try:
            resp = queryClient.table(AOI_TABLE).select(
                AOI_ID_COLUMN, AOI_NAME_COLUMN, FILE_ID_COLUMN
            ).execute()
            logger.debug(f"DB select response: {resp.data}")
            return resp.data
        except Exception as e:
            logger.error(f"Error selecting AOIs from DB: {e}")