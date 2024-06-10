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
        password: 'your_password'
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
        lastname: lastname,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('Error: unable to join'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
    .then(users => {
        if (users.length) {
            res.json(users[0])
        } else {
            res.json('Not found')
        }   
    })
    .catch(err => res.json('Not found error getting user'))
})

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});
