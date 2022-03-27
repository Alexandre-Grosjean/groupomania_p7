const { User } = require('../models');
const fs = require('fs');

exports.profil = async (req, res) => {
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

exports.allProfil = async (req, res) => {
    try {
        const user = await User.findAll()

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
    const userId = req.body.userId;

    try {
        const user = await User.findOne({
            where: { uuid }
        });
        const userAdmin = await User.findOne({
            where: { id: userId }
        });
        if (userAdmin.isAdmin == true) {
            user.active = false;
    
            await user.save();
            return res.status(200).json({ message: "account desactivated by admin" });
            
        }

    } catch {
        return res.status(500).json({ error: 'something went wrong!' })
    }
}

exports.reactivate = async (req, res) => {
    const uuid = req.params.uuid;
    const userId = req.body.userId;

    try {
        const user = await User.findOne({
            where: { uuid }
        });
        const userAdmin = await User.findOne({
            where: { id: userId }
        });
        if (userAdmin.isAdmin == true) {
            user.active = true;
    
            await user.save();
            return res.status(200).json({ message: "account reactivated by admin" });
            
        }

    } catch {
        return res.status(500).json({ error: 'something went wrong!' })
    }
}