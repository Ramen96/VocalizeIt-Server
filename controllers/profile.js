const profile = (req, res, db) => {
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
}

module.exports = {
    handleProfile: profile
}