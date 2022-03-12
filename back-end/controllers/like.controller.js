const { sequelize, User, Post, Likes, Comment } = require('../models');

//create like & dislike
exports.createLike = async (req, res) => {
    const { userUuid, like, dislike } = req.body;
    const post = req.params.uuid;

    try {
        const user = await User.findOne({
            where: { uuid: userUuid }
        });

        const checkLike = await Likes.findOne({
            where: {
                postId: post,
                userId: user.dataValues.id
            }
        });

        if (checkLike == null) {

            const likes = await Likes.create({
                userLike: like,
                userDislike: dislike,
                postId: post,
                userId: user.id
            });

            if (likes.userLike === true) {
                return res.status(201).json({ message: "like created" });
            }
            if (likes.userDislike === true) {
                return res.status(201).json({ message: "dislike created" });
            }

        } else {

            await Likes.destroy({
                where: {
                    postId: post,
                    userId: user.id
                }
            });

            return res.status(400).json({ message: "choice has been deleted" });
        }

    } catch (err) {
        console.log(err);
        return res.status(400).json(err)
    }
}

// get all likes for 1 post and return length

exports.getLikeOnePost = async (req, res) => {
    const post = req.params.uuid;

    try {
        const likes = await Likes.findAll({
            where: {
                postId: post,
                userLike: true
            }
        });

        console.log(likes.length);
        return res.json(likes.length);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }
}

// get all dislikes for 1 post and return length

exports.getDislikeOnePost = async (req, res) => {
    const post = req.params.uuid;

    try {
        const dislikes = await Likes.findAll({
            where: {
                postId: post,
                userDislike: true
            }
        });

        console.log(dislikes.length);
        return res.json(dislikes.length);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }
}