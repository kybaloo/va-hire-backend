const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        const { title, content, post_image_url, slug } = req.body;
        const post = new Post({ title, content, post_image_url, slug });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOnePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            res.status(200).json(post);
        })
        .catch((error) => {
            res.status(404).json({ error: error.message });
        });
};

exports.updatePost = async (req, res) => {
    try {
        const { title, content, post_image_url, slug } = req.body;
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, post_image_url, slug },
            { new: true }
        );
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

