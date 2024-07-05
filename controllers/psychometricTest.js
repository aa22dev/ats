const { PsychometricTest, PsychometricQuestion, PsychometricOption, PsychometricResponse } = require('../models/psychometric_tests');
const shuffle = require('../helpers/shuffle');
const validate = require('../helpers/validateData');
const calculateTestResults = require('../helpers/calculateTestResult');

const psychometricTestController = {
    createTest: async (req, res, next) => {
        try {
            const { name, description, questions } = req.body;
            const testId = await PsychometricTest.create({ name, description });
            
            for (const question of questions) {
                const questionId = await PsychometricQuestion.create({ test_id: testId, question: question.text });
                
                for (const option of question.options) {
                    await PsychometricOption.create({ question_id: questionId, option_text: option.text, score: option.score });
                }
            }
            
            res.status(201).json({ message: 'Test created successfully', testId });
        } catch (error) {
            next(error);
        }
    },
    
    getTest: async (req, res, next) => {
        try {
            const { id } = req.params;
            validate.id.validate(id)
            const test = await PsychometricTest.getById(id);
            const questions = await PsychometricQuestion.getByTestId(id);
            
            for (const question of questions) {
                question.options = await PsychometricOption.getByQuestionId(question.id);
            }
            
            test.questions = shuffle(questions, 10);

            res.status(200).json(test);
        } catch (error) {
            next(error);
        }
    },
    
    getAllTests: async (req, res, next) => {
        try {
            const tests = await PsychometricTest.getAll();
            res.status(200).json(tests);
        } catch (error) {
            next(error);
        }
    },
    
    submitResponse: async (req, res, next) => {
        try {
            const { userId } = req.body;
            const { testId, responses } = req.body;
            
            const isExist = await PsychometricResponse.getByApplicantIdAndTestId(userId, testId); 
            if (isExist.length !== 0) {
                throwErr("Response already submitted!", 400)
            }

            for (const response of responses) {
                await PsychometricResponse.create({ applicant_id: userId, test_id: testId, question_id: response.questionId, option_id: response.optionId });
            }
            
            res.status(200).json({ message: 'Responses submitted successfully' });
        } catch (error) {
            next(error);
        }
    },
    
    getTestResults: async (req, res, next) => {
        try {
            const { userId } = req.body;
            const { testId } = req.params;
            validate.id.validate(testId);

            const results = await calculateTestResults(testId, userId);
            
            res.status(200).json({results});
        } catch (error) {
            next(error);
        }
    }
};

module.exports = psychometricTestController;
