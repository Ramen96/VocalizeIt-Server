const register = (req, res, db, bcrypt) => {
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
}

module.exports = {
    handleRegister: register
}