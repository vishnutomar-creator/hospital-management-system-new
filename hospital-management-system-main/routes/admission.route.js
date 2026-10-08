const express = require("express");

const {
    admitPatient,
    getAdmissions,
    getAdmissionById,
    getAdmissionsByPatient,
    dischargePatient,
    transferPatient,
} = require("../controllers/admissions.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    admitPatientValidator,
    dischargeValidator,
    transferValidator,
    admissionIdValidator,
} = require("../validators/admission.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.post(
    "/admitpatient",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
    admitPatientValidator,
    validationMiddleware,
    admitPatient
);

router.get(
    "/getadmissions",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
    getAdmissions
);

router.get(
    "/getadmissionby/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
    admissionIdValidator,
    validationMiddleware,
    getAdmissionById
);

router.get(
    "/getadmissionsbypatient/:patientId",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT),
    getAdmissionsByPatient
);

router.route("/dischargepatient/:id")
    .patch(
        authMiddleware,
        authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.NURSE),
        dischargeValidator,
        validationMiddleware,
        dischargePatient
    )
    .put(
        authMiddleware,
        authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.NURSE),
        dischargeValidator,
        validationMiddleware,
        dischargePatient
    );

router.route("/transferpatient/:id")
    .patch(
        authMiddleware,
        authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.NURSE),
        transferValidator,
        validationMiddleware,
        transferPatient
    )
    .put(
        authMiddleware,
        authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.NURSE),
        transferValidator,
        validationMiddleware,
        transferPatient
    );

module.exports = router;