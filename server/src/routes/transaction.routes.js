const express = require("express");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createTransactionSchema,
  updateTransactionSchema,
  listQuerySchema,
} = require("../validators/transaction.validator");
const transactionController = require("../controllers/transaction.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/", validate(listQuerySchema, "query"), transactionController.getTransactions);
router.get("/:id", transactionController.getTransactionById);
router.post("/", validate(createTransactionSchema), transactionController.createTransaction);
router.put("/:id", validate(updateTransactionSchema), transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
