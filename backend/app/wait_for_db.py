import os, time
# Si DATABASE_URL n'est pas defini (mode SQLite), il n'y a rien a attendre.
dsn = os.getenv("DATABASE_URL")
if not dsn:
    raise SystemExit(0)
import psycopg2
for _ in range(60):
    try:
        psycopg2.connect(dsn).close()
        raise SystemExit(0)
    except Exception:
        time.sleep(1)
raise SystemExit("DB not ready")
