const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = async (req, res, next) => {

    try {

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.user;
        if (req.body.userId && req.body.userId !== userId) {
            console.log('token invalide')
            throw 'User ID not valable'; 
        } else {
            console.log('token valide')
            next()          
        }
    } catch (err) {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
    
};
