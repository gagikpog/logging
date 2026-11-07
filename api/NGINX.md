# Nginx: https://api.gagikpog.ru/log

Добавьте фрагмент в **существующий HTTPS server для api.gagikpog.ru**.
Сохраните другие location, включая `/leadboard/`, PHP и настройки TLS.

```nginx
location = /log {
    proxy_pass http://127.0.0.1:8003;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location ^~ /log/ {
    proxy_pass http://127.0.0.1:8003;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

В `proxy_pass` нет URI и завершающего `/`: Nginx сохраняет `/log/...`.
`/log` обрабатывается без редиректа, `/log/` обслуживает все методы API.
`/logger` и `/logging` под эти location не попадают. CORS уже выставляет Express;
не дублируйте его в Nginx. Пример предполагает прямой приём запросов Nginx.
При наличии доверенного прокси/CDN сначала настройте real_ip для его адресов.

```bash
sudo nginx -t
# Только после успешной проверки:
sudo systemctl reload nginx
curl --fail-with-body https://api.gagikpog.ru/log
curl --fail-with-body https://api.gagikpog.ru/log/
```

Node.js слушает `127.0.0.1:8003`; Nginx должен работать на том же сервере.
Для разных серверов сначала настройте защищённый доступ к upstream.
Не меняйте DNS всего api.gagikpog.ru ради одного сервиса без учёта остальных API.

Поведение URI: [документация Nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass).
