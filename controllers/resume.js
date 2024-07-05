const multer = require('multer');
const path = require('path');
const parseResume = require('../services/resumeParser.js');
const Applicant = require('../models/applicants');
const Skills = require('../models/skills.js');
const { url } = require('../helpers/validateData.js');
const fs = require('fs');


const uploadDir = path.join(__basedir, 'public', 'uploads', 'resume');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, req.userId + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 1 } // Max 1 MB File Size Limit
});

const resumeController = {
    uploadResume: upload.single('resume'),
    parseFill: async (req, res, next) => {
        try {
            const { userId } = req;
            const resumeFile = req.file;
        
            if (!resumeFile) {
                throwErr("No resume uploaded", 400)
            }
        
            const parsedData = await parseResume(resumeFile.path);

            const { name, github, linkedin, education, experience, skills } = parsedData;
            
            const applicant_id = await Applicant.create({
                user_id: userId,
                name,
                github: url.ensureHttps(github),
                linkedin_profile: url.ensureHttps(linkedin),
                resume_url: `/uploads/resume/${resumeFile.filename}`
            });

            for (const edu of education) {
                await Applicant.education.createEducation(applicant_id, edu.degree, edu.major, edu.institution, edu.start_date, edu.end_date);
            }

            for (const exp of experience) {
                await Applicant.experience.createExperience(applicant_id, exp.title, exp.company, exp.start_date, exp.end_date, exp.description);
            }

            for (const skill of skills) {
                const skillId = await Skills.createSkill(skill.name);
                await Applicant.skills.addUserSkill(userId, skillId);
            }
        
            res.status(200).json({ message: 'Resume parsed and profile created', parsedData });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = resumeController;