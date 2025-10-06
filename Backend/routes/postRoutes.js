const express = require('express');
const Posts = require('../models/posts')

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const posts = await Posts.findAll({
            order: [["id", "ASC"]]
        });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar posts"});
    }
})

router.post("/", async (req, res) => {
    try {
        const { title, message, deleteCode, image } = req.body;

        const newPost = await Posts.create({
            title,
            message,
            deleteCode,
            image: image ? Buffer.from(image, "base64") : null,
        });

        res.status(201).json(newPost);
    } catch(err) {
        console.error(err);
        res.status(400).json({ error: "Erro a criar post", details: err.errors})
    }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar post" });
  }
});

router.put("/:id", async(req, res) => {
    try {
        const { title, message, deleteCode, image } = req.body;
        const post = await Posts.findByPk(req.params.id);

        if(!post){
            return res.status(404).json({ error: "Post não encontrado"});
        }

        await post.update({
            title,
            message,
            deleteCode,
            image: image ? Buffer.from(image, "base64") : post.image,
        })

        res.json(post);
    } catch(err) {
        console.error(err);
        res.status(400).json({ error: "Erro ao atualizar post", details: err.errors })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const post = await Posts.findByPk(req.params.id);

        if(!post){
            return res.status(404).json({ error: "Post não encontrado" })
        }

        await post.destroy();
        res.json({ message: "Post deletado com sucesso"})
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao deletar post"});
    }
})

module.exports = router