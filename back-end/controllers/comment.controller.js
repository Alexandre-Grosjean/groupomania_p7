const { sequelize, User, Post, Comment } = require('../models');

//******************* comments on post */

//create comment

exports.createComment = async (req, res) => {

    const { userId, body } = req.body;
    const post = req.params.uuid;

    try {
        const user = await User.findOne({
            where: { id: userId }
        });
        const postComment = await Post.findOne({
            where: { uuid: post }
        });
        const userComment = await Comment.create({
            body: body,
            userId: user.id,
            postId: postComment.id,
            userName: user.name
        });

        return res.status(201).json({ message: 'comment created' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }

}

//delete comment

exports.deleteComment = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const user = await User.findOne({
            where: { id: userId }
        });

        const userComment = await Comment.findOne({
            where: {
                id: id
            }
        });

        if (userComment.userId === user.id) {
            await userComment.destroy({
                where: {
                    id: id
                }
            })
            return res.status(200).json({ message: "comment as been deleted" });
        } else if (user.isAdmin === true ){
            await userComment.destroy({
                where: {
                    id: id
                }
            })
            return res.status(200).json({ message: "comment as been deleted by admin" });
        } else {
            return res.status(400).json({ error: "don't have permission for this request" })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }
}


