## pm2 installation
```sh
npm install pm2@latest -g
```

## start app
```sh
# run node
pm2 start pm2.json
```

## Process starting after reload server
```sh
pm2 save
```

## show pm2 status
```sh
pm2 status
```

## kill app
```sh
pm2 delete logging
```

## Run without json config
```sh
pm2 start npm --name "logging" -- start --watch --port 8003
```

### Show using port list
```sh
sudo ss -ltnp
```
