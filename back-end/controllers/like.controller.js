const {  User, Post, Likes } = require('../models');

//create like & dislike
exports.createLike = async (req, res) => {
    const { userId, like, dislike } = req.body;
    const post = req.params.uuid;

    try {
        const user = await User.findOne({
            where: { id: userId }
        });

        const posts = await Post.findOne({
            where: { uuid: post }
        });

        const checkLike = await Likes.findOne({
            where: {
                postUuid: post,
                userId: userId
            }
        });

        if (checkLike == null) {

            const likes = await Likes.create({
                userLike: like,
                userDislike: dislike,
                postUuid: post,
                userId: userId,
                postId: posts.id
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
                    postUuid: post,
                    userId: userId
                }
            });

            return res.status(200).json({ message: "choice has been deleted" });
        }

    } catch (err) {
        console.log(err);
        return res.status(400).json(err)
    }
}
