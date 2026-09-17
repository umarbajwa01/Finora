const express = require("express");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { changePasswordSchema } = require("../validators/auth.validator");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/me", userController.getMe);
router.put("/me", userController.updateMe);
router.post("/change-password", validate(changePasswordSchema), userController.changePassword);
router.get("/export", userController.exportTransactions);

module.exports = router;
