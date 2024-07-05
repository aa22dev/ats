const db = require('../services/database');

const PsychometricTest = {
    create: async (testData) => {
        try {
            const query = 'INSERT INTO psychometric_tests (name, description) VALUES (?, ?)';
            const [result] = await db.query(query, [testData.name, testData.description]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },
    getById: async (testId) => {
        try {
            const query = 'SELECT * FROM psychometric_tests WHERE id = ?';
            const [test] = await db.query(query, [testId]);
            return test[0];
        } catch (error) {
            throw error;
        }
    },
    getAll: async () => {
        try {
            const query = 'SELECT * FROM psychometric_tests';
            const [tests] = await db.query(query);
            return tests;
        } catch (error) {
            throw error;
        }
    }
};

const PsychometricQuestion = {
    create: async (questionData) => {
        try {
            const query = 'INSERT INTO psychometric_questions (test_id, question) VALUES (?, ?)';
            const [result] = await db.query(query, [questionData.test_id, questionData.question]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },
    getByTestId: async (testId) => {
        try {
            const query = 'SELECT * FROM psychometric_questions WHERE test_id = ?';
            const [questions] = await db.query(query, [testId]);
            return questions;
        } catch (error) {
            throw error;
        }
    }
};

const PsychometricOption = {
    create: async (optionData) => {
        try {
            const query = 'INSERT INTO psychometric_options (question_id, option_text, score) VALUES (?, ?, ?)';
            const [result] = await db.query(query, [optionData.question_id, optionData.option_text, optionData.score]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },
    getByQuestionId: async (questionId) => {
        try {
            const query = 'SELECT * FROM psychometric_options WHERE question_id = ?';
            const [options] = await db.query(query, [questionId]);
            return options;
        } catch (error) {
            throw error;
        }
    }
};

const PsychometricResponse = {
    create: async (responseData) => {
        try {
            const query = 'INSERT INTO psychometric_responses (applicant_id, test_id, question_id, option_id) VALUES (?, ?, ?, ?)';
            const [result] = await db.query(query, [responseData.applicant_id, responseData.test_id, responseData.question_id, responseData.option_id]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },
    getByApplicantIdAndTestId: async (applicantId, testId) => {
        try {
            const query = 'SELECT * FROM psychometric_responses WHERE applicant_id = ? AND test_id = ?';
            const [responses] = await db.query(query, [applicantId, testId]);
            return responses;
        } catch (error) {
            throw error;
        }
    },
    getTotalScore: async (test_id, applicant_id) => {
        try {
            const query = `SELECT po.score, COUNT(pr.id) as total 
	                        FROM psychometric_responses as pr
	                        INNER JOIN psychometric_options as po 
		                        ON po.id = pr.option_id
	                        WHERE pr.test_id = ? and pr.applicant_id = ?
	                        GROUP BY po.score
                            ORDER BY total DESC;`;
            const [score] = await db.query(query, [test_id, applicant_id]);
            return score;
        } catch (error) {
            throw error;
        }
    }
};

const PsychometricMeta = {
    create: async (metaData) => {
        try {
            const query = 'INSERT INTO psychometric_meta (test_id, meta_key, meta_value) VALUES (?, ?, ?)';
            const [result] = await db.query(query, [metaData.test_id, metaData.meta_key, metaData.meta_value]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },
    getByTestId: async (testId) => {
        try {
            const query = 'SELECT * FROM psychometric_meta WHERE test_id = ?';
            const [meta] = await db.query(query, [testId]);
            return meta;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = {
    PsychometricTest,
    PsychometricQuestion,
    PsychometricOption,
    PsychometricResponse,
    PsychometricMeta
};