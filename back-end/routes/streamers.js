const express = require("express");
const { authMiddleware } = require("../utils/middlewares/auth");
const { 
    listStreamers, deleteStreamer, createStreamer, updateStreamer, 
    createConfirmStreamer, updateConfirmStreamer, deleteConfirmStreamer
} = require("../controllers/streamers_controller");

const router = express.Router();

// READ
router.get("/streamers", authMiddleware, listStreamers);
router.get("/streamers/create", authMiddleware, createStreamer);
router.get("/streamers/:id/update", authMiddleware, updateStreamer);
router.get("/streamers/:id/delete", authMiddleware, deleteStreamer);

// CREATE
router.post("/streamers/create/add", authMiddleware, createConfirmStreamer);

// UPDATE
router.put("/streamers/:id/update", authMiddleware, updateConfirmStreamer)

// DELETE
router.delete("/streamers/:id/delete", authMiddleware, deleteConfirmStreamer);

module.exports = router;