const express = require("express");
const { authMiddleware } = require("../utils/middlewares/auth");
const { 
    listHistorics, historicsList, deleteHistoric, createHistoric, updateHistoric, 
    createConfirmHistoric, updateConfirmHistoric, deleteConfirmHistoric
} = require("../controllers/historics_controller");

const router = express.Router();

// READ
router.get("/historics", authMiddleware, listHistorics);
router.get("/historics-list", historicsList);
router.get("/historics/create", authMiddleware, createHistoric);
router.get("/historics/:id/update", authMiddleware, updateHistoric);
router.get("/historics/:id/delete", authMiddleware, deleteHistoric);

// CREATE
router.post("/historics/create/add", authMiddleware, createConfirmHistoric);

// UPDATE
router.put("/historics/:id/update/modify", authMiddleware, updateConfirmHistoric)

// DELETE
router.delete("/historics/:id/delete", authMiddleware, deleteConfirmHistoric);

module.exports = router;