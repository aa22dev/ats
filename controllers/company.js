const Company = require('../models/companies.js');

// Controller methods for handling company-related operations
const companyController = {
    // Create a new company
    createCompany: async (req, res) => {
        try {
            const { companyName, companyEmail } = req.body;
            const company = await Company.create({ companyName, companyEmail });
            res.status(201).json(company);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a company by ID
    get: async (req, res) => {
        try {
            const { id } = req.params;
            const company = await Company.getById(id);
            if (!company) {
                return res.status(404).json({ error: 'Company not found' });
            }
            res.json(company);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a company
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { companyName, companyEmail } = req.body;
            if (!companyName &&!companyEmail) {
                return res.status(400).json({ error: 'Please provide at least one field to update' });
            }



            const updatedCompany = await Company.update(id, { companyName, companyEmail });
            if (!updatedCompany) {
                return res.status(404).json({ error: 'Company not found' });
            }
            res.json(updatedCompany);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a company
    deleteCompany: async (req, res) => {
        try {
            const { companyId } = req.params;
            const deletedCompany = await Company.delete(companyId);
            if (!deletedCompany) {
                return res.status(404).json({ error: 'Company not found' });
            }
            res.json({ message: 'Company deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all companies
    getAllCompanies: async (req, res) => {
        try {
            const companies = await Company.getAll();
            res.json(companies);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = companyController;
