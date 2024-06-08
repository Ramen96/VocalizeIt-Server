const express = require('express');
const bodyParser = require('body-parser');
const bycrpt = require('bcrypt-nodejs');
const cors = require('cors');
const kenx = require('knex');

const database = kenx({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'username',
      password: 'your_password',
      database: 'vocalizeit_db',
    },
  });

database.select("*").from('users').then(data => console.log(data));

const app = express();

app.use(cors());
app.use(bodyParser.json());

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'john',
//             email: 'john@gmail.com',
//             password: 'password',
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'password123',
//             joined: new Date()
//         }
//     ]
// }

app.get('/', (req, res) => {
    res.send('this is working');
});


app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('success');
        } else {
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req, res) => {
    db('users').insert({
        email: email,
        firstName: firstName,
        lastName: lastName,
        joined: new Date()
    }).then(console.log)
    res.json(database.users[database.users.length-1]);
})

app.get('profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user)
        }
    });
})

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});
