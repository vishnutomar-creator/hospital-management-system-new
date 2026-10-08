const GeneralLedger = require("../models/GeneralLedger");
const AccountsPayable = require("../models/AccountsPayable");
const AccountsReceivable = require("../models/AccountsReceivable");

// ---------- General Ledger ----------
const createLedgerEntry = async (data) => {
    return await GeneralLedger.create(data);
};

const getLedgerEntries = async () => {
    return await GeneralLedger.find().sort({ transactionDate: -1 });
};

const getLedgerEntryById = async (id) => {
    return await GeneralLedger.findById(id);
};

// ---------- Accounts Payable ----------
const createPayable = async (data) => {
    return await AccountsPayable.create(data);
};

const getPayables = async () => {
    return await AccountsPayable.find()
        .populate("supplierId", "supplierName name phone")
        .sort({ dueDate: 1 });
};

const getPayableById = async (id) => {
    return await AccountsPayable.findById(id).populate("supplierId", "supplierName name phone");
};

const getPayableByInvoice = async (invoiceNo) => {
    return await AccountsPayable.findOne({ invoiceNo });
};

const updatePayable = async (id, data) => {
    return await AccountsPayable.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const getOverduePayables = async () => {
    return await AccountsPayable.find({
        status: "Unpaid",
        dueDate: { $lt: new Date() },
    }).populate("supplierId", "supplierName name phone");
};

// ---------- Accounts Receivable ----------
const createReceivable = async (data) => {
    return await AccountsReceivable.create(data);
};

const getReceivables = async () => {
    return await AccountsReceivable.find()
        .populate("patientId", "name patientName patientId phone")
        .populate("billId")
        .sort({ dueDate: 1 });
};

const getReceivableById = async (id) => {
    return await AccountsReceivable.findById(id)
        .populate("patientId", "name patientName patientId phone")
        .populate("billId");
};

const updateReceivable = async (id, data) => {
    return await AccountsReceivable.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const getOverdueReceivables = async () => {
    return await AccountsReceivable.find({
        status: "Pending",
        dueDate: { $lt: new Date() },
    }).populate("patientId", "name patientName patientId phone");
};

// ---------- Summary ----------
const getFinancialSummary = async () => {
    const [totalPayableAgg, totalReceivableAgg, ledgerAgg] = await Promise.all([
        AccountsPayable.aggregate([
            { $match: { status: { $ne: "Paid" } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),

        AccountsReceivable.aggregate([
            { $match: { status: { $ne: "Paid" } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),

        GeneralLedger.aggregate([
            { $group: { _id: null, totalDebit: { $sum: "$debit" }, totalCredit: { $sum: "$credit" } } },
        ]),
    ]);

    return {
        totalPayableOutstanding: totalPayableAgg[0]?.total || 0,
        totalReceivableOutstanding: totalReceivableAgg[0]?.total || 0,
        totalDebit: ledgerAgg[0]?.totalDebit || 0,
        totalCredit: ledgerAgg[0]?.totalCredit || 0,
        netBalance: (ledgerAgg[0]?.totalCredit || 0) - (ledgerAgg[0]?.totalDebit || 0),
    };
};

module.exports = {
    createLedgerEntry,
    getLedgerEntries,
    getLedgerEntryById,
    createPayable,
    getPayables,
    getPayableById,
    getPayableByInvoice,
    updatePayable,
    getOverduePayables,
    createReceivable,
    getReceivables,
    getReceivableById,
    updateReceivable,
    getOverdueReceivables,
    getFinancialSummary,
};