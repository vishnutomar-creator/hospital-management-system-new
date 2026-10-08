const financeService = require("../services/finance.service");

// ---------- General Ledger ----------
const createLedgerEntry = async (req, res, next) => {
    try {
        const entry = await financeService.createLedgerEntry(req.body, req.user.id);
        res.status(201).json({ success: true, message: "Ledger entry created successfully", data: entry });
    } catch (error) {
        next(error);
    }
};

const getLedgerEntries = async (req, res, next) => {
    try {
        const entries = await financeService.getLedgerEntries();
        res.status(200).json({ success: true, message: "Ledger entries fetched successfully", data: entries });
    } catch (error) {
        next(error);
    }
};

// ---------- Accounts Payable ----------
const createPayable = async (req, res, next) => {
    try {
        const payable = await financeService.createPayable(req.body, req.user.id);
        res.status(201).json({ success: true, message: "Accounts payable created successfully", data: payable });
    } catch (error) {
        next(error);
    }
};

const getPayables = async (req, res, next) => {
    try {
        const payables = await financeService.getPayables();
        res.status(200).json({ success: true, message: "Payables fetched successfully", data: payables });
    } catch (error) {
        next(error);
    }
};

const getPayableById = async (req, res, next) => {
    try {
        const payable = await financeService.getPayableById(req.params.id);
        res.status(200).json({ success: true, message: "Payable fetched successfully", data: payable });
    } catch (error) {
        next(error);
    }
};

const markPayablePaid = async (req, res, next) => {
    try {
        const payable = await financeService.markPayablePaid(req.params.id);
        res.status(200).json({ success: true, message: "Payable marked as paid", data: payable });
    } catch (error) {
        next(error);
    }
};

const getOverduePayables = async (req, res, next) => {
    try {
        const payables = await financeService.getOverduePayables();
        res.status(200).json({ success: true, message: "Overdue payables fetched successfully", data: payables });
    } catch (error) {
        next(error);
    }
};

// ---------- Accounts Receivable ----------
const createReceivable = async (req, res, next) => {
    try {
        const receivable = await financeService.createReceivable(req.body);
        res.status(201).json({ success: true, message: "Accounts receivable created successfully", data: receivable });
    } catch (error) {
        next(error);
    }
};

const getReceivables = async (req, res, next) => {
    try {
        const receivables = await financeService.getReceivables();
        res.status(200).json({ success: true, message: "Receivables fetched successfully", data: receivables });
    } catch (error) {
        next(error);
    }
};

const getReceivableById = async (req, res, next) => {
    try {
        const receivable = await financeService.getReceivableById(req.params.id);
        res.status(200).json({ success: true, message: "Receivable fetched successfully", data: receivable });
    } catch (error) {
        next(error);
    }
};

const markReceivablePaid = async (req, res, next) => {
    try {
        const receivable = await financeService.markReceivablePaid(req.params.id);
        res.status(200).json({ success: true, message: "Receivable marked as paid", data: receivable });
    } catch (error) {
        next(error);
    }
};

const getOverdueReceivables = async (req, res, next) => {
    try {
        const receivables = await financeService.getOverdueReceivables();
        res.status(200).json({ success: true, message: "Overdue receivables fetched successfully", data: receivables });
    } catch (error) {
        next(error);
    }
};

// ---------- Summary ----------
const getFinancialSummary = async (req, res, next) => {
    try {
        const summary = await financeService.getFinancialSummary();
        res.status(200).json({ success: true, message: "Financial summary fetched successfully", data: summary });
    } catch (error) {
        next(error);
    }
};

module.exports = {
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
};