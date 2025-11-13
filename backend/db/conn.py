import os
from supabase import ClientOptions, create_client, Client

from utils.logger import logger
from utils.env import Env

url: str = Env.SUPABASE_URL
key: str = Env.SUPABASE_ANON

logger.debug("Connecting to DB...")
db: Client = create_client(url, key, options=ClientOptions(
    schema="public",
))
logger.debug("DB connection successful")