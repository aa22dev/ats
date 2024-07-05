const db = require('../services/database');

const SystemSettings = {
    // Create new system setting
    createSystemSetting: async (companyId, settingName, settingValue) => {
        try {
            const query = 'INSERT INTO system_settings (company_id, setting_name, setting_value) VALUES (?, ?, ?)';
            await db.query(query, [companyId, settingName, settingValue]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Get system settings by company ID
    getSystemSettingsByCompanyId: async (companyId) => {
        try {
            const [rows] = await db.query('SELECT * FROM system_settings WHERE company_id = ?', [companyId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Update system setting
    updateSystemSetting: async (companyId, settingName, settingValue) => {
        try {
            await db.query('UPDATE system_settings SET setting_value = ? WHERE company_id = ? AND setting_name = ?',
                [settingValue, companyId, settingName]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete system setting
    deleteSystemSetting: async (companyId, settingName) => {
        try {
            await db.query('DELETE FROM system_settings WHERE company_id = ? AND setting_name = ?', [companyId, settingName]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = SystemSettings;
