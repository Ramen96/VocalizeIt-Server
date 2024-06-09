const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: '5432',
        user: 'username',
        database: 'vocalizeit',
        password: 'password'
    },
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

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
    const { email, firstname, lastname} = req.body;
    console.log('req.body:', req.body)
    db('users').insert({
        email: email,
        firstname: firstname,
        lastname: lastame,
        joined: new Date()
    }).then(console.log)
    res.json('It works');
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
