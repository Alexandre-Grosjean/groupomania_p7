const { User } = require('../models');
const bcrypt = require('bcrypt');

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