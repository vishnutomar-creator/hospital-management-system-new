const express = require("express");

const {
    dispenseMedicine,
    getDispenseRecords,
    getDispenseById,
    getDispensesByPatient,
    returnMedicine,
} = require("../controllers/pharmacy.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    dispenseMedicineValidator,
    dispenseIdValidator,
} = require("../validators/pharmacy.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN),
    dispenseMedicineValidator,
    validationMiddleware,
    dispenseMedicine
);

router.post(
    "/dispensemedicine",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN),
    dispenseMedicineValidator,
    validationMiddleware,
    dispenseMedicine
);

router.get(
    "/",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    getDispenseRecords
);

router.get(
    "/getdispenserecords",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    getDispenseRecords
);

router.get(
    "/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
    dispenseIdValidator,
    validationMiddleware,
    getDispenseById
);

router.get(
    "/getdispenseby/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
    dispenseIdValidator,
    validationMiddleware,
    getDispenseById
);

router.get(
    "/getdispensesbypatient/:patientId",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
    getDispensesByPatient
);

router.patch(
    "/returnmedicine/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN),
    dispenseIdValidator,
    validationMiddleware,
    returnMedicine
);

router.patch(
    "/:id/return",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN),
    dispenseIdValidator,
    validationMiddleware,
    returnMedicine
);

module.exports = router;