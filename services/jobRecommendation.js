const Applicant = require('../models/applicants.js');
const Jobs = require('../models/jobs.js');
const { spawn } = require('child_process');

async function calculateSimilarity(skillPairs) {
    try {
        const process = spawn('py', ['services/similarity/compute.py', JSON.stringify(skillPairs)]);

        let jsonData = "";

        process.stdout.on('data', (data) => {
            jsonData += data.toString();
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        return new Promise((resolve, reject) => {
            process.on('close', (code) => {
                if (code === 0) {
                    try {
                        const parsedData = JSON.parse(jsonData);
                        if (parsedData.error) {
                            reject(parsedData.error);
                        } else {
                            resolve(parsedData);
                        }
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error("Python script error"));
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

async function get_matching_jobs(user_id, company_id, batch_size = 100, top_n = 10) {
    try {
        let skill_match_count = 0;
        let edu_match_count = 0;
        let exp_match_count = 0;
        let score = 0;

        const recommendations = []

        const applicant = await Applicant.getProfile(user_id);
        applicant.education = await Applicant.education.getEducationByApplicantId(applicant.applicant_id);
        applicant.experience = await Applicant.experience.getExperienceByApplicantId(applicant.applicant_id);
        applicant.skills = await Applicant.skills.getUserSkillsByUserId(user_id);

        const totalJobs = await Jobs.getTotalJobsOfCompany(company_id);
        for (let offset = 0; offset < totalJobs; offset += batch_size) {
            const jobs = await Jobs.getJobsByCompanyId(company_id, offset, batch_size);
            for (const job of jobs) {
                job.skills = job.skills ? job.skills.split(',') : [];
                const job_skills = [];
                const app_skills = [];

                for (const job_skill of job.skills) {
                    if (job_skill.includes('/')) {
                        const s = job_skill.split('/');
                        for (const js of s) {
                            job_skills.push(js);
                        }
                    } else {
                        job_skills.push(job_skill);
                    }
                }

                for (const app_skill of applicant.skills) {
                    if (app_skill.name.includes('/')) {
                        const s = app_skill.name.split('/');
                        for (const appSkill of s) {
                            app_skills.push(appSkill);
                        }
                    } else {
                        app_skills.push(app_skill.name);
                    }
                }

                const skillPairs = [];
                for (const job_skill of job_skills) {
                    for (const applicant_skill of app_skills) {
                        skillPairs.push({ s1: job_skill, s2: applicant_skill });
                    }
                }

                const similarityResults = await calculateSimilarity(skillPairs);
                const filteredSimilarityResults = similarityResults.filter(item => item.score >= 0.7);
                filteredSimilarityResults.sort((a, b) => b.score - a.score)
                const s1visited = []
                for (const result of filteredSimilarityResults) {
                    if (result.score > 0.7 && !s1visited.includes(result.s1)) {
                        s1visited.push(result.s1)
                        skill_match_count++;
                    }
                }

                const skill_score = skill_match_count / job_skills.length;
                score += skill_score * 0.6;

                if (job.education) {
                    const job_education = job.education.toLowerCase();
                    const [job_degree, job_major] = job_education.split(' in ');

                    for (const edu of applicant.education) {
                        if (await calculateSimilarity([{ s1: job_degree, s2: edu.degree.toLowerCase() }]).score > 0.7 &&
                            await calculateSimilarity([{ s1: job_major, s2: edu.major.toLowerCase() }]).score > 0.7) {
                            edu_match_count++;
                            break;
                        }
                    }
                    score += edu_match_count * 0.1;
                } else {
                    score += 0.1;
                }

                if (job.experience) {
                    const job_experience = job.experience;
                    const [years] = job_experience.split(' ');

                    let min = null;
                    let max = null;

                    if (applicant.experience.length !== 0) {
                        for (const exp of applicant.experience) {
                            if (!min) {
                                min = exp.start_date;
                            }

                            if (!max) {
                                max = exp.end_date;
                            }

                            if (exp.start_date < min) {
                                min = exp.start_date;
                            }

                            if (exp.end_date > max) {
                                max = exp.end_date;
                            }
                        }
                    } else {
                        min = 0;
                        max = 0;
                    }

                    const experience = max - min;

                    if (parseInt(years) < experience) {
                        exp_match_count++;
                    }

                    score += exp_match_count * 0.3;
                } else {
                    score += 0.3;
                }
                recommendations.push({
                    applicant_id: applicant.applicant_id,
                    job_id: job.job_id,
                    score
                });

                score = 0;
                skill_match_count = 0;
                edu_match_count = 0;
                exp_match_count = 0;
            }
        }

        recommendations.sort((a, b) => b.score - a.score);
        return recommendations.slice(0, top_n);
    } catch (error) {
        throw error;
    }
}

module.exports = get_matching_jobs;
