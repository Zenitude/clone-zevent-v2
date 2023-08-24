const express = require("express");
const { authMiddleware } = require("../utils/middlewares/auth");
const { 
    listGames, deleteGame, createGame, updateGame, 
    createConfirmGame, updateConfirmGame, deleteConfirmGame
} = require("../controllers/games_controller");

const router = express.Router();

// READ
router.get("/games", authMiddleware, listGames);
router.get("/games/create", authMiddleware, createGame);
router.get("/games/:id/update", authMiddleware, updateGame);
router.get("/games/:id/delete", authMiddleware, deleteGame);

// CREATE
router.post("/games/create/add", authMiddleware, createConfirmGame);

// UPDATE
router.put("/games/:id/update/modify", authMiddleware, updateConfirmGame)

// DELETE
router.delete("/games/:id/delete", authMiddleware, deleteConfirmGame);

module.exports = router;