const db = require('../services/database');

const Skill = {
    // Create a new skill
    createSkill: async function (name) {
        try {
            let skillId = await this.getSkillByName(name);
            if (skillId) {
                return skillId['skill_id'];
            }
            const query = 'INSERT INTO skills (name) VALUES (?)';
            const [result] = await db.query(query, [name]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    // Get skill by ID
    getSkillById: async (skillId) => {
        try {
            const [rows] = await db.query('SELECT * FROM skills WHERE skill_id = ?', [skillId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Get skill by name
    getSkillByName: async function (name) {
        try {
            const [rows] = await db.query('SELECT * FROM skills WHERE name = ?', [name]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Update skill details
    updateSkill: async (skillId, name) => {
        try {
            const query = 'UPDATE skills SET name = ? WHERE skill_id = ?';
            await db.query(query, [name, skillId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete skill by ID
    deleteSkill: async (skillId) => {
        try {
            await db.query('DELETE FROM skills WHERE skill_id = ?', [skillId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Skill;
