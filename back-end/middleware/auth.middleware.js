const jwt = require('jsonwebtoken');
const { sequelize, User, Post, Likes, Comment } = require('../models');

module.exports = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({
        where: { email }
    });

    try {

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'ceci_est_mon_token_ultra_secret');
        const userId = decodedToken.user;

        if (req.body.user !== userId) {
            console.log('token invalide')
            throw 'User ID not valable';
        } else {
            console.log('token valide')
            next()
        }
    } catch (err) {
        res.status(401).json({ err });
        next()
    }
    
};
