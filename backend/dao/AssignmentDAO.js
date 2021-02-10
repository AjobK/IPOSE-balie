const db = require('../database/db');

module.exports = class AssignmentDAO {

    static getAssignments() {
        return db.query('SELECT * FROM assignment ORDER BY name');
    }
    
}