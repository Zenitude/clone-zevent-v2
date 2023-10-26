const express = require("express");
const { authMiddleware } = require("../utils/middlewares/auth");
const { loginRender, login, adminRender, logout } = require("../controllers/admin_controller");

const router = express.Router();

router.get("/", loginRender);

router.post("/sign", login);

router.get("/admin", authMiddleware, adminRender);

router.post("/logout", logout);

module.exports = router;