const express = require("express");
const { authMiddleware } = require("../utils/middlewares/auth");
const { loginRender, login, adminRender } = require("../controllers/admin_controller");

const router = express.Router();

router.get("/login", loginRender);

router.post("/login/sign", login);

router.get("/admin", authMiddleware, adminRender);

module.exports = router;