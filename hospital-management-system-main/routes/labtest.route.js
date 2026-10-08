const express = require("express");

const {
    orderLabTest,
    getLabTests,
    getLabTestById,
    getLabTestsByPatient,
    getPendingLabTests,
    collectSample,
    startProcessing,
    submitResult,
    verifyResult,
    cancelLabTest,
    deleteLabTest,
} = require("../controllers/labtest.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    orderLabTestValidator,
    submitResultValidator,
    verifyResultValidator,
    labTestIdValidator,
} = require("../validators/labtest.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post(
    "/orderlabtest",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    orderLabTestValidator,
    validationMiddleware,
    orderLabTest
);

router.get(
    "/getlabtests",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    getLabTests
);

router.get(
    "/getpendinglabtests",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    getPendingLabTests
);

router.get(
    "/getlabtestby/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
    labTestIdValidator,
    validationMiddleware,
    getLabTestById
);

router.get(
    "/getlabtestsbypatient/:patientId",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
    getLabTestsByPatient
);

router.patch(
    "/collectsample/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    labTestIdValidator,
    validationMiddleware,
    collectSample
);

router.patch(
    "/startprocessing/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    labTestIdValidator,
    validationMiddleware,
    startProcessing
);

router.patch(
    "/submitresult/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    upload.single("reportFile"),
    submitResultValidator,
    validationMiddleware,
    submitResult
);

router.patch(
    "/verifyresult/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    verifyResultValidator,
    validationMiddleware,
    verifyResult
);

router.patch(
    "/cancellabtest/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    labTestIdValidator,
    validationMiddleware,
    cancelLabTest
);

router.delete(
    "/deletelabtestby/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN),
    labTestIdValidator,
    validationMiddleware,
    deleteLabTest
);

module.exports = router;