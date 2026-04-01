# Codéna — Starter Kit v3

## Lancer
```bash
cp .env.example .env
docker compose up --build
```

- Swagger : http://localhost:8000/docs
- Web : http://localhost:5173
- Adminer : http://localhost:8080 (server=db user=codena pass=codena db=codena)

## Nouveautés v3
- Refresh token endpoint + rotation (/auth/refresh, /auth/logout)
- Admin CMS CRUD leçons/QCM (/content/admin/*)
- Upload médias (local) (/media/upload)
- Rate limiting (SlowAPI)
- Bonus : squelette Flutter (mobile_flutter/)
