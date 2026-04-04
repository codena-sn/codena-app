FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir psycopg2-binary==2.9.9
COPY alembic.ini ./alembic.ini
COPY alembic ./alembic
COPY app ./app
RUN mkdir -p /app/app/media /app/app/generated
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
CMD ["./entrypoint.sh"]
