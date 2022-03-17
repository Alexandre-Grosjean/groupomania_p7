const { User } = require('../models');
const fs = require('fs');

exports.myProfil = async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findOne({
            where: { id: userId }
        });

        return res.status(200).json(user)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }
}

exports.profil = async (req, res) => {
    const email = req.body.email
    try {
        const user = await User.findOne({
            where: { email }
        });

        return res.status(200).json(user)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }
}

exports.updateProfil = async (req, res) => {
    const uuid = req.params.uuid;
    const { name } = req.body;
    const imageProfil = req.file;

    try {
        const user = await User.findOne({
            where: { uuid }
        });
        if (imageProfil) {
            if (user.imageUrl != 'http://localhost:5000/images/profils/defaultProfils.jpg') {
                const filename = user.imageUrl.split('/profils/')[1];
                fs.unlink(`./images/profils/${filename}`, async () => {

                    user.name = name;
                    user.imageUrl = `http://localhost:5000/images/profils/${imageProfil.filename}`;

                    await user.save();

                    return res.status(200).json({ message: "profil updated with image" });
                })

            } else {
                user.name = name;
                user.imageUrl = `http://localhost:5000/images/profils/${imageProfil.filename}`;

                await user.save();

                return res.status(200).json({ message: "profil updated with image" });
            }

        } else if (!imageProfil) {

            user.name = name;
            user.imageUrl = user.imageUrl;

            await user.save();

            return res.status(200).json({ message: "profil updated" });
        }

    } catch {
        return res.status(500).json({ error: 'something went wrong!' })
    }
}

exports.desactivate = async (req, res) => {
    const uuid = req.params.uuid;

    try {
        const user = await User.findOne({
            where: { uuid }
        });

        user.active = false;

        await user.save();
        return res.status(200).json({ message: "account desactivated" });

    } catch {
        return res.status(500).json({ error: 'something went wrong!' })
    }
}