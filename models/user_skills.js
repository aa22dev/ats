const db = require('../services/database');

const UserSkills = {
    // Add user skill
    addUserSkill: async (userId, skillId) => {
        try {
            const query = 'INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)';
            await db.query(query, [userId, skillId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Get user skills by user ID
    getUserSkillsByUserId: async (userId) => {
        try {
            const [rows] = await db.query('SELECT s.name FROM user_skills as u INNER JOIN skills as s on u.skill_id = s.skill_id WHERE u.user_id = ?', [userId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Update user skill proficiency level
    updateUserSkillProficiency: async (userId, skillId, proficiencyLevel) => {
        try {
            await db.query('UPDATE user_skills SET proficiency_level = ? WHERE user_id = ? AND skill_id = ?',
                [proficiencyLevel, userId, skillId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete user skill
    deleteUserSkill: async (userId, skillId) => {
        try {
            await db.query('DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?', [userId, skillId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = UserSkills;
