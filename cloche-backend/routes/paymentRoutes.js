const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/initiate", paymentController.initiatePayment);
router.post("/verify", paymentController.confirmPayment);
router.post("/proof", paymentController.submitPaymentProof);
router.get("/proofs", paymentController.listPaymentProofs);
router.post("/proofs/:proofId/approve", paymentController.approvePaymentProof);
router.post("/proofs/:proofId/reject", paymentController.rejectPaymentProof);

module.exports = router;
