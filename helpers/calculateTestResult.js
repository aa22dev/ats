const { getByTestId } = require('../models/psychometric_tests').PsychometricMeta;
const { getTotalScore } = require('../models/psychometric_tests').PsychometricResponse;

async function calculate(testId, applicantId) {
    const mapping = await getByTestId(testId);
    const results = await getTotalScore(testId, applicantId);

    const mappedResults = results.map(result => {
        const match = mapping.find(item => item.meta_name === result.score.toString());
        return match ? { ...result, score: match.meta_value } : result;
    });

    let result = [mappedResults[0].score]

    const selectedTotal = mappedResults[0].total
    
    for (r of mappedResults) {
        if (r.total === selectedTotal && r.score !== result[0]) {
            result.push(r.score)
        }
    }

    if (result.length > 1) {
        const lastIndex = result.length - 2;
        return "Balanced between " + result.reduce((acc, item, index) => {
            const separator = index === lastIndex ? " and " : (!index === lastIndex + 1) ? ", " : "";
            return acc + item + separator;
        }, "");
    }
    return result[0];
}

module.exports = calculate;