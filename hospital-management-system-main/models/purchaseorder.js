const mongoose = require("mongoose");

const purchaseOrderItemSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
    {
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },

        orderDate: {
            type: Date,
            default: Date.now,
        },

        items: {
            type: [purchaseOrderItemSchema],
            required: true,
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: "Purchase order must have at least one item",
            },
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        expectedDeliveryDate: {
            type: Date,
        },

        receivedDate: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Ordered", "Received", "Cancelled"],
            default: "Pending",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

module.exports = PurchaseOrder;