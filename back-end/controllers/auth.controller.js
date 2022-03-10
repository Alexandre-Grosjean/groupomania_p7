const { User } = require('../models');
const bcrypt = require('bcrypt');

//account creation

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const checkDB = await User.findAll();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        if (checkDB.length === 0) {
            const user = await User.create({ name, email, password: hashedPassword, isAdmin: true });
            return res.json({ message: "admin signed up" });
        } else {
            const user = await User.create({ name, email, password: hashedPassword });
            return res.json({ messsage: "user signed up " });
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
                user: user.id,
                uuid: user.uuid,
                email: user.email,
                name: user.name,
                admin: user.isAdmin
            });
        } else {
            res.json({ message: "user can't log" })
        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: 'something went wrong!' })
    }
}