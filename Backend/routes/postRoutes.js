const express = require("express");
const axios = require("axios");
const Posts = require("../models/posts");
const FormData = require("form-data");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.findAll({
      order: [["id", "DESC"]],
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("✅ BATEU NO /POSTS");

    const { title, message, deleteCode, imageBase64 } = req.body;
    console.log('imageBase64', imageBase64)

    if (!imageBase64) {
      return res.status(400).json({ error: "Não há imagem para ser enviada" });
    }

    if (!process.env.IMGBB_API_KEY) {
      return res.status(500).json({ error: "IMGBB_API_KEY não encontrada" });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const formData = new FormData();
    formData.append("key", process.env.IMGBB_API_KEY);
    formData.append("image", base64Data);

    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      { headers: formData.getHeaders() }
    );

    const imageUrl = response.data.data.url;

    const newPost = await Posts.create({
      title,
      message,
      deleteCode,
      image: imageUrl,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("🔥 ERRO IMGBB:", err.response?.data || err.message);
    res.status(500).json({
      error: "Erro ao criar post",
      details: err.response?.data || err.message,
    });
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

router.put("/:id", async (req, res) => {
  try {
    const { title, message, deleteCode, imageBase64 } = req.body;

    const post = await Posts.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    let imageUrl = post.image;

    if (imageBase64) {
      const formData = new FormData();
      formData.append("key", process.env.IMGBB_API_KEY);
      formData.append("image", imageBase64);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        { headers: formData.getHeaders() }
      );

      imageUrl = response.data.data.url;
    }

    await post.update({
      title,
      message,
      deleteCode,
      image: imageUrl,
    });

    res.json(post);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao atualizar post" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    await post.destroy();
    res.json({ message: "Post deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar post" });
  }
});

module.exports = router;
