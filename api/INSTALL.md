# Запуск API

Проксирование: [NGINX.md](NGINX.md).

Все команды выполняются из каталога `logging/api`:

```bash
npm ci
# Только для нового сервиса. При переносе сохраните существующий .env.
cp .env.example .env
# Заполните TOKEN_SECRET; PORT=8003, HOST=127.0.0.1, PASSWORD_SALT=12.
npm run build
npm start
```

API: `http://127.0.0.1:8003/log/`.
`db.sqlite` и `.env` читаются из рабочего каталога процесса. При миграции
восстановите прежнюю базу до первого запуска, иначе API создаст пустую.

Для постоянного запуска установите PM2 и выполняйте из того же каталога:

```bash
npm install --global pm2
pm2 start pm2.json --env production
pm2 status
pm2 startup
# Выполните команду, напечатанную pm2 startup, затем:
pm2 save
```

При обновлении зарегистрированного процесса сначала проверьте его cwd, script
и пользователя: старый процесс мог запускать npm из другого каталога.

```bash
pm2 logs logging --lines 50 --nostream
pm2 restart logging --update-env
sudo ss -ltnp
```
