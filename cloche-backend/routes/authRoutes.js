const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", upload.single("image"), authController.signup);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);
router.get("/profile/:boutiqueId", authController.getProfile);
router.post("/profile/:boutiqueId", authController.updateProfile);
router.get("/dashboard/:boutiqueId", authController.getDashboard);

module.exports = router;
