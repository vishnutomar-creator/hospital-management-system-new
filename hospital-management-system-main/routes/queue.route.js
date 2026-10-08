const express = require("express");

const {
    joinQueue,
    getQueues,
    getQueueById,
    getQueueByDoctor,
    callNext,
    completeConsultation,
    skipPatient,
    cancelQueueEntry,
} = require("../controllers/queue.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    joinQueueValidator,
    queueIdValidator,
    doctorIdValidator,
} = require("../validators/queue.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

// Front-desk / self check-in — adds a patient to today's queue
router.post(
    "/",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT),
    joinQueueValidator,
    validationMiddleware,
    joinQueue
);

router.post(
    "/joinqueue",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT),
    joinQueueValidator,
    validationMiddleware,
    joinQueue
);

// Public-facing display data — today's full queue, no role restriction beyond login
router.get("/", getQueues);
router.get("/getqueues", getQueues);

router.get("/:id", queueIdValidator, validationMiddleware, getQueueById);
router.get("/getqueueby/:id", queueIdValidator, validationMiddleware, getQueueById);

router.get("/getqueuebydoctor/:doctorId", doctorIdValidator, validationMiddleware, getQueueByDoctor);
router.get("/doctor/:doctorId", doctorIdValidator, validationMiddleware, getQueueByDoctor);

// Consultation flow — staff only
router.patch(
    "/callnext/:doctorId",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
    doctorIdValidator,
    validationMiddleware,
    callNext
);

router.patch(
    "/completeconsultation/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    queueIdValidator,
    validationMiddleware,
    completeConsultation
);

router.patch(
    "/:id/complete",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    queueIdValidator,
    validationMiddleware,
    completeConsultation
);

router.patch(
    "/skippatient/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
    queueIdValidator,
    validationMiddleware,
    skipPatient
);

router.patch(
    "/cancelqueueentry/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
    queueIdValidator,
    validationMiddleware,
    cancelQueueEntry
);

module.exports = router;