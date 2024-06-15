const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile =  require('./controllers/profile');
const api = require('./controllers/api');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: '5432',
        user: 'eric',
        database: 'vocalizeit',
        password: 'tr33house'
    },
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('this is working'));
app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)})
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)})
app.post('/api', (req, res) => {api.handleApi(req, res, db, bcrypt)});

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});
