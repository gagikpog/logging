# Nginx configuration

## Install Nginx
```bash
apt-get install nginx
```

## Reload Nginx service
```bash
systemctl reload nginx
```

## Test Nginx
```bash
nginx -t
```

## Change config

open config file
```bash
vim /etc/nginx/sites-enabled/default
```

add config after root location
```
location /logging {
    proxy_pass http://127.0.0.1:8003;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## links
[Deploying Python Application With Nginx](https://medium.com/swlh/mini-project-deploying-python-application-with-nginx-30f9b25b195)
