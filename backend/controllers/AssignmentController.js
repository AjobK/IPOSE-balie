const AssignmentDAO = require('../dao/AssignmentDAO');

exports.getAssignments = (req, res, next) => {
    AssignmentDAO.getAssignments()
    .then((data) => {
        return res.status(200).json({
            message: 'Assignments loaded',
            assignments: data.rows
        });
    })
    .catch(() => {
        return res.status(404).json({
            message: 'Could not find assignments',
            assignments: null
        })
    })
}