# Examples

#### Create new user
```js
fetch('/logging/create-user/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: 'User', username: 'username', email: 'username@gmail.com', password: 'pass123'}),
}).then((res) => {
    return res.json();
}).then((data) => {
    localStorage.setItem('token', data.token);
}).catch(() => {
    console.error('user create error');
});
```

#### Get current user data
```js
fetch('/logging/user/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}).then((res) => {
    return res.json();
}).catch(() => {
    console.error('user get error');
});
```

#### Auth
```js
fetch('/logging/auth/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: 'username', password: 'pass123'})
}).then((res) => {
    return res.json();
}).then((data) => {
    localStorage.setItem('token', data.token);
}).catch(() => {
    console.error('auth error');
});
```

#### Add new log
```js
fetch('/logging/add/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ app: 'appName', message: 'message', type: 'error', user: 'username' }),
}).then((res) => {
    return res.json();
}).catch(() => {
    console.error('user get error');
});
```

#### Get log list
```js
fetch('/logging/list/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ app: 'appName', types: ['error', 'waring'] }),
}).then((res) => {
    return res.json();
}).catch((err) => {
    console.error('list get error', err);
});
```
