FROM python:3.11-slim

WORKDIR /app
ENV PYTHONPATH=/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt \
  && python -c "import psycopg2; print('psycopg2 import OK')"

COPY alembic.ini ./alembic.ini
COPY alembic ./alembic
COPY app ./app

RUN mkdir -p /app/app/media /app/app/generated

COPY entrypoint.sh ./entrypoint.sh
RUN sed -i 's/\r$//' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]
