# Logging

API: `https://api.gagikpog.ru/log`.

- [Запуск API](api/INSTALL.md) и [настройка Nginx](api/NGINX.md)
- [Примеры запросов](api/API.MD)

API использует Express, SQLite (`api/db.sqlite`) и настройки `api/.env`.
Шаблон: [api/.env.example](api/.env.example). При переносе нужны прежняя база
и секрет JWT.
