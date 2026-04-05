#!/usr/bin/env sh
set -e

python -m app.wait_for_db
alembic upgrade head
python -m app.seed

uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
