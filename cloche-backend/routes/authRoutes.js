const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", upload.single("image"), authController.signup);
router.post("/login", authController.login);
router.post("/login-user", authController.loginUser);
router.get("/verify-email", authController.verifyEmail);
router.get("/email-status", authController.emailStatus);
router.get("/profile/:boutiqueId", authController.getProfile);
router.post("/profile/:boutiqueId", authController.updateProfile);
router.get("/dashboard/:boutiqueId", authController.getDashboard);
router.get("/cloudinary-config", authController.getCloudinaryConfig);

module.exports = router;
