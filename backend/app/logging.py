import json
from datetime import datetime
def log_event(event: str, **kwargs):
    print(json.dumps({"ts":datetime.utcnow().isoformat()+"Z","event":event,**kwargs}, ensure_ascii=False))
