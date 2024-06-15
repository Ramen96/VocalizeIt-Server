const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


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
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid  = bcrypt.compareSync(req.body.password, data[0].hash)
            isValid ?
                db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            :
            res.status(400).json('invalid credentials');
            
        })
        .catch(err => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {

    const { email, firstname, lastname, password} = req.body;
    const hash =  bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({ hash, email})
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return db('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    firstname: firstname,
                    lastname: lastname,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                });
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
    .catch(err => res.status(400).json('Error: unable to join'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
    .then(users => {
        if (users.length) {
            res.json(users[0]);
        } else {
            res.json('Not found');
        }   
    })
    .catch(err => res.json('Not found error getting user'))
})

app.post('/api', async (req, res) => {
    const { email, password, voiceId, text } = req.body;
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "xi-api-key": "your_api_key"
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v1",
          "voice_settings": {
              "stability": 0.5,
              "similarity_boost": 0.8,
              "style": 0.0,
              "use_speaker_boost": true
          }
        })
      };

    try {
        const data = await db.select("*").from('login').where('email', '=', email);

        if (data.length && bcrypt.compareSync(password, data[0].hash)) {
            try {
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, options);
                const buffer = await response.buffer();
                res.setHeader('Content-Type', response.headers.get('content-type'));
                res.send(buffer);
            } catch (error) {
                res.status(500).send(error.message);
            }
        } else {
            res.status(400).json('Invalid credentials');
        }
    } catch (err) {
        res.status(400).json('Error getting user');
    }
});

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});
