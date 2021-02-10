const express = require('express');

const assignmentController = require('../controllers/AssignmentController');

const router = express.Router();

// GET /assignments
router.get('/', assignmentController.getAssignments);

module.exports = router;
