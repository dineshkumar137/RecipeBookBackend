const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CreatedRecipe = require("../models/CreatedRecipe");

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/recipes
router.post("/recipes", upload.single("media"), async (req, res) => {
  try {
    const { name, ingredients, tips, tags, userEmail } = req.body;
    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

    const recipe = new CreatedRecipe({
      name,
      ingredients,
      tips,
      tags: tags.split(",").map(tag => tag.trim()),
      mediaUrl: req.file.path,
      mediaType,
      userEmail
    });

    await recipe.save();
    res.status(201).json({ message: "Recipe created successfully!" });
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ message: "Server error while saving recipe." });
  }
});

// GET recipe by ID
router.get("/recipes/byemail/:email", async (req, res) => {
  try {
    const recipes = await CreatedRecipe.find({ userEmail: req.params.email });
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes by email:", error);
    res.status(500).json({ message: "Server error fetching recipes" });
  }
});


// DELETE recipe
router.delete("/recipes/:id", async (req, res) => {
  try {
    await CreatedRecipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete recipe" });
  }
});

// PUT update recipe
router.put('/recipes/:id', async (req, res) => {
  try {
    console.log("Updating recipe with:", req.body); // ✅ DEBUG LOG

    const updated = await CreatedRecipe.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        ingredients: req.body.ingredients,
        tips: req.body.tips,
        tags: req.body.tags,
        email: req.body.email
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

module.exports = router;
