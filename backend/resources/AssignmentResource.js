const express = require("express");

const assignmentController = require("../controllers/AssignmentController");

const router = express.Router();

// GET /assignments
router.get("/", assignmentController.getAssignments);

// POST /assignments/open/:assignmentId
router.get("/open/:assignmentId", assignmentController.openAssignment);

// Post /assignments/close/:assignmentId
router.get("/close/:assignmentId", assignmentController.closeAssignment);

module.exports = router;
