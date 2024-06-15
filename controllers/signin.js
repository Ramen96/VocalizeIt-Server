const handleSignIn = (req, res, db, bcrypt) => {

    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

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
}

module.exports = {
    handleSignIn: handleSignIn
};