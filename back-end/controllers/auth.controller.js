const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//account creation

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const checkDB = await User.findAll();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        if (checkDB.length === 0) {

            await User.create({ name, email, password: hashedPassword, isAdmin: true });
            return res.status(201).json({ message: "admin signed up" });

        } else if (checkDB.length > 0) {

            await User.create({ name, email, password: hashedPassword });
            return res.status(201).json({ messsage: "user signed up " });

        }

    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

//account login 

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: { email }
        });

        const match = bcrypt.compareSync(password, user.password);

        if (user.active === true && match === true) {

            return res.status(200).json({
                userName: user.name,
                userImage: user.imageUrl,
                userId: user.id,
                token: jwt.sign(
                    {user: user.id},
                    'ceci_est_mon_token_ultra_secret',
                    { expiresIn: '12h' }
                )
            });

        } else if (user.active !== true && match === true) {
            user.active = true;

            await user.save()

            return res.status(200).json({
                userId: user.id,
                token: jwt.sign(
                    {user: user.id},
                    'ceci_est_mon_token_ultra_secret',
                    { expiresIn: '12h' }
                )
            });

        } else {

            res.status(401).json({ message: "user can't log" })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }
}
