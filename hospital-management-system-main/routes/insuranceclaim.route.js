const express = require("express");

const {
    submitClaim,
    getClaims,
    getClaimById,
    getClaimsByPatient,
    startReview,
    approveClaim,
    rejectClaim,
    settleClaim,
    deleteClaim,
} = require("../controllers/insuranceclaim.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    submitClaimValidator,
    approveClaimValidator,
    rejectClaimValidator,
    idValidator,
} = require("../validators/insuranceclaim.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(authMiddleware, authorizeRoles(ROLES.ADMIN));

router.post("/", submitClaimValidator, validationMiddleware, submitClaim);
router.post("/submitclaim", submitClaimValidator, validationMiddleware, submitClaim);
router.get("/", getClaims);
router.get("/getclaims", getClaims);
router.get("/:id", idValidator, validationMiddleware, getClaimById);
router.get("/getclaimby/:id", idValidator, validationMiddleware, getClaimById);
router.get("/getclaimsbypatient/:patientId", getClaimsByPatient);
router.get("/patient/:patientId", getClaimsByPatient);
router.patch("/startreview/:id", idValidator, validationMiddleware, startReview);
router.patch("/:id/review", idValidator, validationMiddleware, startReview);
router.patch("/approveclaim/:id", approveClaimValidator, validationMiddleware, approveClaim);
router.patch("/:id/approve", approveClaimValidator, validationMiddleware, approveClaim);
router.patch("/rejectclaim/:id", rejectClaimValidator, validationMiddleware, rejectClaim);
router.patch("/:id/reject", rejectClaimValidator, validationMiddleware, rejectClaim);
router.patch("/settleclaim/:id", idValidator, validationMiddleware, settleClaim);
router.patch("/:id/settle", idValidator, validationMiddleware, settleClaim);
router.delete("/:id", idValidator, validationMiddleware, deleteClaim);
router.delete("/deleteclaimby/:id", idValidator, validationMiddleware, deleteClaim);

module.exports = router;