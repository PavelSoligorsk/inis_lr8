const express = require("express");
const Article = require("../models/Article");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Статья не найдена" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ message: "Некорректный идентификатор" });
  }
});

router.post("/", async (req, res) => {
  try {
    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: "Не удалось создать статью" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) {
      return res.status(404).json({ message: "Статья не найдена" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ message: "Не удалось обновить статью" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Статья не найдена" });
    }
    res.status(200).json({ message: "Статья удалена" });
  } catch (error) {
    res.status(400).json({ message: "Некорректный идентификатор" });
  }
});

module.exports = router;
