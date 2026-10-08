const express = require("express");

const {
    createLedgerEntry,
    getLedgerEntries,
    createPayable,
    getPayables,
    getPayableById,
    markPayablePaid,
    getOverduePayables,
    createReceivable,
    getReceivables,
    getReceivableById,
    markReceivablePaid,
    getOverdueReceivables,
    getFinancialSummary,
} = require("../controllers/finance.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    createLedgerValidator,
    createPayableValidator,
    createReceivableValidator,
    idValidator,
} = require("../validators/finance.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

// All Finance routes are Admin-only
router.use(authMiddleware, authorizeRoles(ROLES.ADMIN));

// Ledger
router.post("/ledger/create", createLedgerValidator, validationMiddleware, createLedgerEntry);
router.get("/ledger", getLedgerEntries);

// Payables
router.post("/payables/create", createPayableValidator, validationMiddleware, createPayable);
router.get("/payables", getPayables);
router.get("/payables/overdue", getOverduePayables);
router.get("/payables/:id", idValidator, validationMiddleware, getPayableById);
router.patch("/payables/:id/mark-paid", idValidator, validationMiddleware, markPayablePaid);

// Receivables
router.post("/receivables/create", createReceivableValidator, validationMiddleware, createReceivable);
router.get("/receivables", getReceivables);
router.get("/receivables/overdue", getOverdueReceivables);
router.get("/receivables/:id", idValidator, validationMiddleware, getReceivableById);
router.patch("/receivables/:id/mark-paid", idValidator, validationMiddleware, markReceivablePaid);

// Summary
router.get("/summary", getFinancialSummary);

module.exports = router;