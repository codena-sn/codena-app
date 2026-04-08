#!/usr/bin/env sh
set -e

echo "[boot] starting entrypoint"
echo "[boot] POSTGRES_HOST=${POSTGRES_HOST:-unset} POSTGRES_PORT=${POSTGRES_PORT:-unset} POSTGRES_DB=${POSTGRES_DB:-unset}"
echo "[boot] waiting for db..."
python -m app.wait_for_db
echo "[boot] db is ready"

echo "[boot] running migrations..."
python -m alembic upgrade head
echo "[boot] migrations done"

echo "[boot] seeding..."
python -m app.seed
echo "[boot] seed done"

echo "[boot] starting uvicorn on PORT=${PORT:-8000}"
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
