const express = require("express");
const { authMiddleware } = require("../utils/middlewares/auth");
const { 
    listUsers, deleteUser, createUser, updateUser, updatePassword,
    createConfirmUser, updateConfirmUser, updateConfirmPassword,deleteConfirmUser
} = require("../controllers/users_controller");

const router = express.Router();

// READ
router.get("/users", authMiddleware, listUsers);
router.get("/users/create", authMiddleware, createUser);
router.get("/users/:id/update", authMiddleware, updateUser);
router.get("/users/:id/password/update", authMiddleware, updatePassword);
router.get("/users/:id/delete", authMiddleware, deleteUser);

// CREATE
router.post("/users/create/add", authMiddleware, createConfirmUser);

// UPDATE
router.put("/users/:id/update/modify", authMiddleware, updateConfirmUser)
router.put("/users/:id/password/update/modify", authMiddleware, updateConfirmPassword)

// DELETE
router.delete("/users/:id/delete", authMiddleware, deleteConfirmUser);

module.exports = router;