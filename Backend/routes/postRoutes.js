const express = require("express");
const axios = require("axios");
const Posts = require("../models/posts");
const FormData = require("form-data");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const paginate = require("../middlewares/paginate");

const SALT_ROUNDS = 10;

router.get("/", paginate(Posts), async (req, res) => {
  try {
    res.json(res.paginated);

  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, message, deleteCode, imageBase64 } = req.body;

    const hashedDeleteCode = deleteCode
      ? await bcrypt.hash(deleteCode, SALT_ROUNDS)
      : null;

    let imageUrl = null;

    if (imageBase64) {
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

      imageUrl = response.data.data.url;
    }

    const newPost = await Posts.create({
      title,
      message,
      deleteCode: hashedDeleteCode,
      image: imageUrl,
    });

    return res.status(201).json(newPost);
  } catch (err) {
    console.error("ERROR:", err);

    if (err.name === "SequelizeValidationError") {
      const errors = err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      }));

      return res.status(400).json({
        error: "Erro de validação",
        fields: errors,
      });
    }

    return res.status(500).json({
      error: "Erro ao criar post",
      details: err.message,
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

    if (!title && !message && !imageBase64) {
      return res.status(400).json({ error: "Nenhum dado para atualizar" });
    }

    const post = await Posts.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    // if (deleteCode) {
    //   const isValidCode = await bcrypt.compare(deleteCode, post.deleteCode);
    //   if (!isValidCode) {
    //     return res.status(403).json({ error: "Código de exclusão inválido" });
    //   }
    // } else {
    //   deleteCode = undefined;
    // }

    const updateData = {
      title,
      message,
    };

    if (deleteCode) {
      updateData.deleteCode = await bcrypt.hash(deleteCode, SALT_ROUNDS);
    }

    if (imageBase64) {
      try {
        const formData = new FormData();
        formData.append("key", process.env.IMGBB_API_KEY);
        formData.append("image", imageBase64.split(",")[1] || imageBase64); // Remove data URL prefix se existir

        const response = await axios.post(
          "https://api.imgbb.com/1/upload",
          formData,
          {
            headers: formData.getHeaders(),
            timeout: 10000, // timeout de 10 segundos
          }
        );

        if (response.data && response.data.data && response.data.data.url) {
          updateData.image = response.data.data.url;
        } else {
          throw new Error("Resposta inválida do ImgBB");
        }
      } catch (imgError) {
        console.error("Erro ao fazer upload da imagem:", imgError.message);
        return res.status(500).json({
          error: "Falha ao fazer upload da imagem",
          details: imgError.message,
        });
      }
    }

    const updatedPost = await post.update(updateData);

    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (err) {
    console.error("Erro ao atualizar post:", err.message);

    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Dados inválidos",
        details: err.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      error: "Erro ao atualizar post",
      details: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { deleteCode } = req.body;
    const { id } = req.params;
    
    console.log('deleteCode',deleteCode)
    console.log('id',id)
    if (!deleteCode) {
      return res
        .status(400)
        .json({ error: "Código de exclusão é obrigatório" });
    }

    const post = await Posts.findByPk(id);


    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    if (!post.deleteCode) {
      return res
        .status(400)
        .json({ error: "Este post não possui código de exclusão" });
    }

    const isValid = await bcrypt.compare(deleteCode, post.deleteCode);

    if (!isValid) {
      return res.status(403).json({ error: "Código inválido" });
    }

    await post.destroy();

    res.json({ message: "Post deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar post" });
  }
});

router.post("/:id/check-code", async (req, res) => {
  try {
    const { deleteCode } = req.body;
    const post = await Posts.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    const isValid = await bcrypt.compare(deleteCode, post.deleteCode);

    if (!isValid) {
      return res.status(403).json({ error: "Código inválido" });
    }

    return res.json({ valid: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao verificar código" });
  }
});

module.exports = router;
