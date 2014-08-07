DEBUG = False
REDIS_HOST = 'localhost'
REDIS_PORT = 6379
REDIS_DB = 0

try:
    from local_settings import *  # noqa
except ImportError:
    pass
