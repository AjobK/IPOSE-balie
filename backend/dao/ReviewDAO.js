const db = require('../database/db');

module.exports = class ReviewDAO {
    static getOpenReviews() {
        return db.query('SELECT * FROM review WHERE reviewer_id IS NULL AND request_time >= CURRENT_DATE ORDER BY request_time;');
    }
    
    static getClosedReviews() {
        return db.query('SELECT * FROM review WHERE reviewer_id IS NOT NULL ORDER BY request_time;');
    }

    static getAllReviews() {
        return db.query('SELECT * FROM review ORDER BY request_time;');
    }

    static async createReview(body) {
        const { studentNumber, assignmentId } = body;

        let studentId = -1;

        await db.query('SELECT * FROM student WHERE st_number=$1;', [studentNumber])
        .then((student) => {
            if (student.rows.length <= 0)
                throw new Error('This student is not allowed to open a review');
            else
                studentId = student.rows[0].id;
        })
        
        let newDate = new Date().toLocaleString();

        return db.query(`
            SELECT st_number, reviewer_id, request_time
            FROM student
            RIGHT JOIN review ON review.student_id = student.id
            WHERE st_number=$1 AND request_time >= CURRENT_DATE;
        `, [studentNumber])
        .then(async (students) => {
            console.log(students.rows)

            for (let i = 0; i < students.rows.length; i++) {
                if (students.rows[i].reviewer_id == null)
                    throw new Error('This student has already opened a review');
            }

            return await db.query(
                'INSERT INTO review (student_id, assignment_id, request_time) VALUES ($1, $2, $3);',
                [studentId, assignmentId, newDate]
            )
        })
    }

    static deleteReplicaById(id) {
        // Escape not needed, DB errors if invalid type
        return db.query('DELETE FROM replica WHERE id=$1;', [id])
    }

    static setReviewer(reviewId, reviewerId) {
        return db.query('UPDATE review SET reviewer_id = $1 WHERE id = $2;', [reviewerId, reviewId]);
    }
}
