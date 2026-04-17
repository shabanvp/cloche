const express = require("express");
const router = express.Router();
const boutiqueController = require("../controllers/boutiqueController");

router.get("/", boutiqueController.getAllBoutiques);
router.get("/:boutiqueId", boutiqueController.getBoutiqueDetails);

module.exports = router;
