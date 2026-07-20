const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), authController.signup);
router.post("/login", authController.login);
router.post("/login-user", authController.loginUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/resend-verification", authController.resendVerification);
router.get("/verify-email", authController.verifyEmail);
router.get("/email-status", authController.emailStatus);
router.get("/debug-email", authController.debugEmail);
router.get("/profile/:boutiqueId", authController.getProfile);
router.put("/profile/:boutiqueId", authController.updateProfile);
router.put("/profile/:boutiqueId/password", authController.updatePassword);

// Showcase routes
router.get("/profile/:boutiqueId/showcase", authController.getShowcase);
router.post("/profile/:boutiqueId/showcase", authController.updateShowcase);
router.put("/profile/:boutiqueId/showcase", authController.updateShowcase);
router.post("/profile/:boutiqueId/showcase-image", authController.updateShowcaseImage);

router.get("/dashboard/:boutiqueId", authController.getDashboard);
router.get("/cloudinary-config", authController.getCloudinaryConfig);

module.exports = router;
