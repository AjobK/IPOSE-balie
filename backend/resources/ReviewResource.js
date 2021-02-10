const express = require('express');

const reviewController = require('../controllers/ReviewController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/', reviewController.createReview)

router.get('/', reviewController.getOpenReviews)

// TODO Closing
// router.get('/close/:id', isAuth, reviewController)

// PATCH /review/:id
router.patch('/:reviewId', isAuth, reviewController.setReviewer);

module.exports = router;