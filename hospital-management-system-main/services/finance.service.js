const financeRepository = require("../repositories/finance.repository");

// ---------- General Ledger ----------
const createLedgerEntry = async (data, createdBy) => {
    return await financeRepository.createLedgerEntry({ ...data, createdBy });
};

const getLedgerEntries = async () => {
    return await financeRepository.getLedgerEntries();
};

// ---------- Accounts Payable ----------
const createPayable = async (data, createdBy) => {
    const existing = await financeRepository.getPayableByInvoice(data.invoiceNo);
    if (existing) {
        throw new Error("An accounts payable entry with this invoice number already exists");
    }

    return await financeRepository.createPayable({ ...data, createdBy });
};

const getPayables = async () => {
    return await financeRepository.getPayables();
};

const getPayableById = async (id) => {
    const payable = await financeRepository.getPayableById(id);
    if (!payable) {
        throw new Error("Accounts payable entry not found");
    }
    return payable;
};

const markPayablePaid = async (id) => {
    const payable = await financeRepository.getPayableById(id);
    if (!payable) {
        throw new Error("Accounts payable entry not found");
    }

    if (payable.status === "Paid") {
        throw new Error("This payable is already marked as paid");
    }

    return await financeRepository.updatePayable(id, { status: "Paid", paidDate: new Date() });
};

const getOverduePayables = async () => {
    return await financeRepository.getOverduePayables();
};

// ---------- Accounts Receivable ----------
const createReceivable = async (data) => {
    return await financeRepository.createReceivable(data);
};

const getReceivables = async () => {
    return await financeRepository.getReceivables();
};

const getReceivableById = async (id) => {
    const receivable = await financeRepository.getReceivableById(id);
    if (!receivable) {
        throw new Error("Accounts receivable entry not found");
    }
    return receivable;
};

const markReceivablePaid = async (id) => {
    const receivable = await financeRepository.getReceivableById(id);
    if (!receivable) {
        throw new Error("Accounts receivable entry not found");
    }

    if (receivable.status === "Paid") {
        throw new Error("This receivable is already marked as paid");
    }

    return await financeRepository.updateReceivable(id, { status: "Paid", paidDate: new Date() });
};

const getOverdueReceivables = async () => {
    return await financeRepository.getOverdueReceivables();
};

const getFinancialSummary = async () => {
    return await financeRepository.getFinancialSummary();
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