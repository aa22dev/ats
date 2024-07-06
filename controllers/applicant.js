const Applicant = require('../models/applicants');
const Session = require('../models/sessions');
const Jobs = require('../models/jobs');
const OTP = require('../helpers/otp');
const { hash, verify } = require('argon2');
const validator = require('../helpers/validateData');
const { generateSessionToken } = require('../services/sessionUtils');
const { sendOtpEmail } = require('../services/email');
const { throwErr } = require('../helpers/error');
const jobRecommendation = require('../services/jobRecommendation');
const Recommendation = require('../models/recommendations');
const { verifySessionTokenInDB } = require('../services/authUtils');


const applicantController = {
    details: async (req, res, next) => {
        try {
            const { userId } = req.body;
            const applicant = await Applicant.user.getUserById(userId);
            if (!applicant) {
                throwErr('Applicant not found', 404)
            }
            const { password_hash, ...applicantData } = applicant;
            
            applicantData['profile_picture'] = await Applicant.getProfilePicture(userId);

            res.json(applicantData);
        } catch (error) {
            next(error);
        }
    },
    profile: async (req, res, next) => {
        try {
            const { userId } = req.body;
            const applicant = await Applicant.getProfile(userId);
            if (!applicant) {
                throwErr('Applicant not found', 404)
            }

            applicant.education = await Applicant.education.getEducationByApplicantId(applicant.applicant_id);
            applicant.experience = await Applicant.experience.getExperienceByApplicantId(applicant.applicant_id);
            applicant.skills = await Applicant.skills.getUserSkillsByUserId(userId);

            res.json(applicant);
        } catch (error) {
            next(error);
        }
    },
    updateProfile: async (req, res, next) => {
        try {
            const { companyId, userId, applicantId, ...data } = req.body;

            if (Object.keys(data).length === 0) {
                throwErr('Nothing to update!', 400);
            }

            const { username, email, password, name, github, linkedin_profile, education, experience } = data

            let query = ""
            let values = []

            if (username) {
                validator.username.length(username);
                await validator.username.isExist(username, companyId, Applicant.user.getByUsername);
                query += "username = ?,"
                values.push(username)
            }

            if (email) {
                validator.email.isValid(email);
                await validator.email.isExist(email, companyId, Applicant.user.getByEmail);
                query += "email = ?,"
                values.push(email)
            }

            if (password) {
                validator.password.isSecure(password);
                query += "password_hash = ?,"
                values.push(await hash(password));
            }

            query = query.slice(0, -1);
            if (query) await Applicant.user.update(userId, companyId, query, values);

            query = ""
            values = []

            if (name) {
                validator.name.isValid(name);
                validator.name.length(name);
                query += "name = ?,"
                values.push(name)
            }

            if (github) {
                let githubUrl = validator.url.ensureHttps(github);
                validator.url.isValidUrl(githubUrl);
                validator.url.github.check(githubUrl)
                query += "github = ?,"
                values.push(githubUrl)
            }

            if (linkedin_profile) {
                let linkedin_profile_url = validator.url.ensureHttps(linkedin_profile);
                validator.url.isValidUrl(linkedin_profile_url);
                validator.url.linkedin.check(linkedin_profile_url)
                query += "linkedin_profile = ?,"
                values.push(linkedin_profile_url)
            }

            query = query.slice(0, -1);
            if (query) await Applicant.update(applicantId, query, values);

            query = ""
            values = []
            if (education) {
                for (const edu of education) {
                    if (typeof edu !== 'object') {
                        throwErr('Invalid education input', 400);
                    }

                    if (!Object.keys(edu).includes('education_id')) {
                        throwErr("education_id is required to update education records.", 400);
                    }

                    const { education_id, degree, major, institution, start_date, end_date } = edu;

                    if (degree) {
                        query += "degree = ?,",
                            values.push(degree)
                    }

                    if (major) {
                        query += "major = ?,",
                            values.push(major)
                    }

                    if (institution) {
                        query += "institution = ?,",
                            values.push(institution)
                    }

                    if (start_date) {
                        query += "start_date = ?,",
                            values.push(start_date)
                    }

                    if (end_date) {
                        query += "end_date = ?,",
                            values.push(end_date)
                    }

                    query = query.slice(0, -1);

                    if (query) await Applicant.education.update(applicantId, education_id, query, values)

                    query = ""
                    values = []
                }
            }

            if (experience) {
                for (const exp of experience) {
                    if (typeof exp !== 'object') {
                        throwErr('Invalid experience input', 400);
                    }

                    const { experience_id, title, company, start_date, end_date, description } = exp;

                    if (!Object.keys(exp).includes('experience_id')) {
                        throwErr("experience_id is required to update experience records.", 400);
                    }

                    if (title) {
                        query += "title = ?,",
                            values.push(title)
                    }

                    if (company) {
                        query += "company = ?,",
                            values.push(company)
                    }

                    if (start_date) {
                        query += "start_date = ?,",
                            values.push(start_date)
                    }

                    if (end_date) {
                        query += "end_date = ?,",
                            values.push(end_date)
                    }

                    if (description) {
                        query += "description = ?,",
                            values.push(description)
                    }

                    query = query.slice(0, -1);

                    if (query) await Applicant.experience.update(applicantId, experience_id, query, values)

                    query = ""
                    values = []
                }
            }

            res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            next(error);
        }
    },
    profileStatus: async (req, res, next) => {
        try {
            const { userId } = req.body;
            const applicant = await Applicant.getProfile(userId);
            const education = await Applicant.education.getEducationByApplicantId(applicant ? applicant.applicant_id : 0);
            if (!applicant || !education.length) {
                return res.status(200).json({ profileComplete: false, message: "Profile needs to be completed" });
            }
            return res.status(200).json({ profileComplete: true });
        } catch (error) {
            next(error)
        }
    },
    login: async (req, res, next) => {
        const { email, password, companyId } = req.body;
        try {
            validator.id.validate(companyId);
            validator.email.check(email);
            validator.password.check(password);
            validator.email.isValid(email);

            const user = await Applicant.user.getByEmail(email, companyId);

            if (!user || user.role !== 'applicant') {
                throwErr('Invalid email or password', 401);
            }

            const isValidPassword = await verify(user.password_hash, password);

            if (!isValidPassword) {
                throwErr('Invalid email or password', 401);
            }

            const sessionToken = await generateSessionToken({ id: user.user_id, email: user.email, companyId, role: 'applicant' });
            const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

            await Session.createSession(user.user_id, sessionToken, expirationTime);

            res.json({ sessionToken });
        } catch (err) {
            next(err);
        }
    },
    validateSessionToken: async (req, res, next) => {
        try {
            const { sessionToken } = req.body;
            
            if (!sessionToken) {
                res.json({ valid: false })
            }

            const verifier = await verifySessionTokenInDB(sessionToken);

            if (!verifier.isValid) {
                res.json({ valid: false })
            }

            res.json({ valid: true });
        } catch (error) {
            next(error);
        }
    },
    register: async (req, res, next) => {
        const { username, email, password, companyId } = req.body;
        try {
            validator.id.validate(companyId);
            validator.email.check(email);
            validator.password.all(password);
            validator.email.isValid(email);
            validator.username.check(username);
            validator.username.length(username);
            try {
                const user = await Applicant.user.getByUsername(username, companyId)
                console.log(user)
                if (user) throwErr('Username already exists', 409);
            } catch (e) {
                throw e;
            }

            try {
                const user = await Applicant.user.getByEmail(email, companyId);
                if (user) throwErr('Email already exists', 409);
            } catch (e) {
                throw e;
            }


            OTP.email = email;

            const otp = OTP.generateOtp();
            await sendOtpEmail(email, otp, companyId);

            OTP.storeRegistrationDetails({
                'company_id': companyId,
                username,
                email,
                'password_hash': await hash(password),
                'role': 'applicant'
            });
            res.status(200).json({ message: 'OTP sent to your email. Please verify to complete registration.' });
        } catch (error) {
            next(error)
        }
    },
    verifyOtp: async (req, res, next) => {
        const { email, otp } = req.body;
        try {
            if (!email) {
                throwErr('Email is a required field', 400);
            }

            if (!OTP.verifyOtp(otp)) {
                throwErr('Invalid or expired OTP', 401);
            }

            const registrationDetails = OTP.getRegistrationDetails(email);

            if (!registrationDetails) {
                throwErr('Registration details not found', 404);
            }

            const applicant = await Applicant.user.create(registrationDetails);

            OTP.clearOtpEntry();
            OTP.clearRegistrationDetailsEntry();

            res.status(200).json({ 'applicant_id': applicant, message: 'OTP verified successfully.' });
        } catch (error) {
            next(error)
        }
    },
    recommendJobs: async (req, res, next) => {
        try {
            const { companyId, userId, applicantId } = req.body;

            let recommendations = await Recommendation.get(applicantId)
            
            if (recommendations.length === 0) {
                recommendations = await jobRecommendation(userId, companyId);
                Recommendation.create(recommendations);
            }

            const totalJobs = Jobs.getTotalJobsOfCompany(companyId);

            if (totalJobs > recommendations.length && recommendations.length < 10) {
                recommendations = await jobRecommendation(userId, companyId);
                Recommendation.create(recommendations);
            }

            const jobIds = recommendations.map(rec => rec.job_id);
            const jobs = await Jobs.getJobsByIds(jobIds, companyId);

            const formattedJobs = jobs.map(job => {
                const recommendation = recommendations.find(rec => rec.job_id === job.job_id);
                return {
                    job_id: job.job_id,
                    title: job.title,
                    description: job.description,
                    requirements: job.requirements ? job.requirements.split('\n') : [],
                    experience: job.experience,
                    education: job.education,
                    salary: job.salary,
                    deadline: job.deadline,
                    score: recommendation ? (recommendation.score * 100).toFixed(2) : null
                };
            });            

            res.status(200).json({ draw: req.body.draw, recordsTotal: recommendations.length, recordsFiltered: recommendations.length, data: formattedJobs });
        } catch (error) {
            next(error);
        }
    }

};

module.exports = applicantController;