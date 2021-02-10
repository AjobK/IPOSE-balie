const ReviewDAO = require('../dao/ReviewDAO');
const isNumeric = require('validator/lib/isNumeric')
const isURL = require('validator/lib/isURL')

exports.getOpenReviews = (req, res, next) =>  {
    ReviewDAO.getOpenReviews()
    .then(reviews => {
        res.status(200).json({
            message: 'Fetched reviews successfully.',
            reviews: reviews.rows
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    })
}

exports.getReplicaById = (req, res, next) =>  {
    ReviewDAO.getReplicaById(req.params.id)
    .then(replica => {
        res.status(200).json({
            message: 'Fetched replica successfully.',
            replica: replica.rows[0]
        })
    })
    .catch(() => {
        res.status(404).json({
            message: 'Could not find replica by given ID'
        });
    })
}

exports.createReview = (req, res, next) => {
    let { studentNumber, assignmentId } = req.body;

    if (!studentNumber || !assignmentId)
        return res.status(422).json({
            message: 'Invalid request'
        });

    if (typeof studentNumber != 'string' || !studentNumber.match(/([(s|S)]{1}[0-9]{7})/))
        return res.status(422).json({
            message: 'Invalid studentnumber... Please type in following format: s1120364'
        });

    req.body.studentNumber = studentNumber.toLowerCase()

    if (typeof assignmentId != 'number')
        return res.status(422).json({
            message: 'Invalid assignment ID'
        });

    ReviewDAO.createReview(req.body)
    .then(() => {
        res.status(200).json({
            message: 'Created review request succesfully!'
        });
    })
    .catch((e) => {
        res.status(422).json({
            message: 'Could not create review request...'
        });
    });
};

exports.updateReplicaById = (req, res, next) => {
    if (!req.body.imageUrl || !isURL(req.body.imageUrl)) return res.status(422).json({ message: 'Invalud replica URL '})
    if (!req.params.id) return res.status(422).json({ message: 'Invalid replica ID '})

    ReviewDAO.updateReplicaById(req.body, req.params.id)
    .then(() => {
        res.status(200).json({
            message: 'Updated replica successfully.',
        })
    })
    .catch(() => {
        res.status(422).json({
            message: 'Could not update replica'
        });
    });
};

exports.deleteReplicaById = (req, res, next) => {
    if (!req.params.id || !isNumeric(req.params.id)) res.status(500).json({ message: 'Invalid replica ID' });

    ReviewDAO.deleteReplicaById(req.params.id)
    .then(() => {
        res.status(200).json({
            message: 'Deleted replica successfully.'
        })
    })
    .catch(() => {
        res.status(422).json({
            message: 'Could not delete replica'
        });
    });
};

exports.setReviewer = (req, res, next) => {
    if (!req.decoded)
        return res.status(401).json({
            message: 'No authorization data'
        });

    const reviewId = req.params.reviewId * 1;
    const reviewerId = req.decoded.id;

    if (!reviewerId || !reviewId)
        return res.status(422).json({
            message: 'No reviewer or review ID passed'
        });

    if (typeof reviewerId != 'number' && reviewerId != NaN || typeof reviewId != 'number' && reviewerId != NaN)
        return res.status(422).json({
            message: 'Invalid reviewer or review ID passed'
        });

    ReviewDAO.setReviewer(reviewId, reviewerId)
    .then(() => {
        res.status(200).json({
            message: 'Reviewer set'
        })
    })
    .catch(() => {
        res.status(422).json({
            message: 'Could not set reviewer'
        })
    });

}