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
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid  = bcrypt.compareSync(req.body.password, data[0].hash)
            isValid ?
                db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            :
            res.status(400).json('invalid credentaials')
            
        })
        .catch(err => res.status(400).json('wrong credentaials'))
})

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
                })
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
