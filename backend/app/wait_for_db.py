import os, time
import psycopg2
host=os.getenv("POSTGRES_HOST","db")
port=int(os.getenv("POSTGRES_PORT","5432"))
user=os.getenv("POSTGRES_USER","codena")
pw=os.getenv("POSTGRES_PASSWORD","codena")
db=os.getenv("POSTGRES_DB","codena")
for _ in range(60):
    try:
        psycopg2.connect(host=host, port=port, user=user, password=pw, dbname=db).close()
        raise SystemExit(0)
    except Exception:
        time.sleep(1)
raise SystemExit("DB not ready")
