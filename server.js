const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const { Client } = require('pg');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile =  require('./controllers/profile');
const api = require('./controllers/api');

const db = new Client({
  connectionString: process.env.PG_CONNECTION_URL,
});

db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('this is working'));
app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)});
app.post('/api', (req, res) => {api.handleApi(req, res, db, bcrypt)});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});
