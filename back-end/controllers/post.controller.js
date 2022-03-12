const { User, Post } = require('../models');
const fs = require('fs');

//create a post
exports.createPost = async (req, res) => {
    const { userUuid, body } = req.body;
    const imagePosts = req.file;

    try {
        const user = await User.findOne({
            where: { uuid: userUuid }
        });

        if (imagePosts) {
            let upload = `http://localhost:5000/images/posts/${imagePosts.filename}`;

            await Post.create({ body, imageUrl: upload, userId: user.id });
            return res.status(201).json({ message: "post created with image" });
        } else {
            await Post.create({ body, userId: user.id });

            return res.status(201).json({ message: "post created without image" });
        }

    } catch (err) {
        return res.status(400).json(err)
    }
}

//get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: ['user']
        });

        return res.json(posts);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }
}

// delete one post
exports.deletePost = async (req, res) => {
    const uuid = req.params.uuid;
    const { email } = req.body;

    try {

        const post = await Post.findOne({
            where: {
                uuid
            },
            include: ['user']
        });

        const user = await User.findOne({
            where: { email }
        });
        
        if (user.uuid == post.user.uuid) {


            if (post.imageUrl === null) {
                await Post.destroy({
                    where: {
                        uuid
                    }
                });
                return res.status(200).json({ message: 'post has been deleted' })
            } else {
                const filename = post.imageUrl.split('/posts/')[1];

                fs.unlink(`images/posts/${filename}`, async () => {

                    await Post.destroy({
                        where: {
                            uuid
                        }
                    });
                });
                return res.status(200).json({ message: 'post has been deleted' })
            }


        } else if (user.isAdmin == true) {

            if (post.imageUrl === null) {
                await Post.destroy({
                    where: {
                        uuid
                    }
                });
                return res.status(200).json({ message: 'post has been deleted by admin' })
            } else {
                const filename = post.imageUrl.split('/posts/')[1];

                fs.unlink(`images/posts/${filename}`, async () => {

                    await Post.destroy({
                        where: {
                            uuid
                        }
                    });
                });
                return res.status(200).json({ message: 'post has been deleted by admin' })
            }

        } else {

            return res.status(401).json({ message: "you don't have permission to delete !" })

        }


    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong!' })
    }
}