<!-- omit from toc -->
# Recruitment &amp; Application Tracking System

<!-- omit from toc -->
## Table of Contents
- [1. Introduction](#1-introduction)
- [2. Features](#2-features)
- [3. Installation](#3-installation)
- [4. Configuration](#4-configuration)
  - [4.1. MySQL Database Configuration](#41-mysql-database-configuration)
  - [4.2. Server Configuration](#42-server-configuration)
  - [4.3. Global Configuration](#43-global-configuration)
  - [4.4. Logger Configuration](#44-logger-configuration)
- [5. Usage](#5-usage)
  - [5.1. Run App](#51-run-app)
  - [5.2. APIs Endpoints](#52-apis-endpoints)
    - [5.2.1. Registration and OTP Verification](#521-registration-and-otp-verification)
    - [5.2.2. Login and Validate Session](#522-login-and-validate-session)
    - [5.2.3. Profile, Profile Status and Resume Management](#523-profile-profile-status-and-resume-management)
    - [5.2.4. Job Recommendation \& Application](#524-job-recommendation--application)
    - [5.2.5. Psychometric Test](#525-psychometric-test)
- [6. Directory Structure](#6-directory-structure)
- [7. Contributing](#7-contributing)

## 1. Introduction

This project is a comprehensive Recruitment & Application Tracking System (ATS). It provides a robust platform for managing the entire recruitment process. Applicants can register, apply for jobs, upload resumes, and complete psychometric tests. The system supports OTP verification during registration, ensuring secure user authentication. Additionally, it offers role-based functionalities, catering to different user types such as applicants, employers, companies, and administrators.

The system allows companies to configure custom SMTP settings for sending system emails, enhancing flexibility and personalization. It employs a secure API key generation algorithm for interacting with the API endpoints of the applicant dashboard, ensuring the integrity and confidentiality of data exchanges. Furthermore, a secure session token mechanism is implemented to manage applicant sessions with the server efficiently.

To enhance the system's reliability and maintainability, an extensive logging layer is integrated, capturing access logs and error logs for easy debugging and monitoring. This ensures that any issues can be quickly identified and resolved, providing a smooth and secure user experience.

## 2. Features

- User Registration with OTP verification
- Custom SMTP configuration for companies
- Secure Database by Implementing measures to prevent SQL injection attacks.
- Profile creation and management for applicants
- Resume upload and parsing
- Job application and management
- Recommendation engine using cosine similarity and scoring system
- Psychometric test for applicants
- Role-based access control (Admin, Employer, Applicant)
- Secure API key generation algorithm
- Secure Session Token generation.
- API based architecture

## 3. Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/aa22dev/ats.git recruitement-and-application-system
    cd recruitement-and-application-system
    ```

2. Install dependencies:
    ```bash
    npm install
    pip install -r requirements.txt
    ```

3. Download Spacy Models:
    ```bash
    py -m spacy download en_core_web_sm
    py -m spacy download en_core_web_md
    ```
4. Set up your MySQL database and import the `ats.sql` file to create the necessary tables with mock data.

## 4. Configuration

### 4.1. MySQL Database Configuration
**File:** `config/database.js`

This file defines the configuration setting for the database. 

**Configuration:**

```javascript
host: 'localhost', // replace with your database server hostname
user: 'dummy_user', // replace with your database username
password: 'dummy_password', // replace with your database password 
database: 'dummy_database', // replace with your database name.
port: 3306, // replace with your database server port number.
waitForConnections: true, // Boolean: True or False
connectionLimit: 10, // Max no. of Database Connections at once
queueLimit: 0 // Setup the Database connection Queue Limit
```

### 4.2. Server Configuration
**File:** `config/server.js`

This file defines the configuration setting for the server. 

**Configuration:**

```javascript
port: 3000, //  Set the server port (default: 3000)
views: path.join(__basedir, 'views'), //  Define the directory containing server-side views (templates)
viewEngine: 'pug',  //  Specify the templating engine used (default: Pug)
statics: path.join(__basedir, 'public'),  //  Define the directory containing static assets (e.g., CSS, JS, images etc.)
```

### 4.3. Global Configuration
**File:** `config/server.js`

This file defines global configurations and constants used throughout the application. 

**Configuration:**

```javascript
// Assign global variables using Object.assign
Object.assign(global, {
  // -- DEFAULT -- (DO NOT CHANGE)
  otpStore: new Map(),  // Store One-Time Passwords (OTPs) in a Map
  applicantDetailsStore: new Map(), // Store applicant details in a Map
  app: express(), // Create an Express application instance (global for convenience)
  __basedir: path.resolve(__dirname, '..'), // Define the project root directory
  throwErr, // Make the error handling function globally accessible
  // -- DEFAULT -- (DO NOT CHANGE)
  // -- DEFINE CUSTOM -- (ADD & CHANGE AS NEEDED)
  // key: value pair should be added, where key is the variable name nad value is the value asigned to that variable
  // -- DEFINE CUSTOM -- (ADD & CHANGE AS NEEDED)  
});
```

### 4.4. Logger Configuration
**File:** `config/logger.js`

This file configures logging for the application using Winston and Express Winston.

**Configuration:**

```javascript
const logDir = `${__basedir}/logs`;  // Define the directory for log files

const transports = [
  // Rotate error logs daily
  new winston.transports.DailyRotateFile({
    stream: createStream('error.log'), // Define error log file name
    level: 'error' // Define level of error to log into that file.
  }),
  // Rotate combined logs daily (default level)
  new winston.transports.DailyRotateFile({
    stream: createStream('combined.log') // Define combined log file name
  })
];

// Add console logging during development
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.json({ space: 4 }),
        winston.format.colorize({ all: true })
      )
    })
  );
}

function createStream(file) {
  // Function to generate log file names with timestamps and compression
  function getDate(time) {
    return time ? `${time.toISOString().split('T')[0]}-${file}.gz` : file;
  }

  return rfs.createStream(getDate, {
    interval: '1d',  // Rotate logs daily
    path: logDir,
    compress: 'gzip'
  });
}

const expressLogger = expressWinston.logger({
  // Log levels based on response status codes
  level: function (req, res) {
    const statusCode = res.statusCode;
    return statusCode >= 400 ? 'error'
         : statusCode >= 300 ? 'warn'
         : 'info';
  },
  transports,
  format: winston.format.json(),
  meta: true,
  expressFormat: true,
  // Include error details in logs
  dynamicMeta: function (req, res) {
    const err = res.locals.error;
    return err ? { error: { message: err.message, stack: err.stack } } : {};
  }
});

const accessLogger = morgan('combined', {
  stream: createStream('access.log')  // Log access requests to a separate file
});

```

## 5. Usage

### 5.1. Run App
- For development Environment:
    ```bash
    npm run dev
    ```
- For Production Environment:
    ```bash
    npm run app
    ```

### 5.2. APIs Endpoints

#### 5.2.1. Registration and OTP Verification

- **Register**: `POST /api/v1/applicant/register`
  - Headers: 
    ```JSON
    {
      "x-api-key": "<your_api_key>",
      "Origin": "yourorigin.tld",
    }
    ```
  - Body: 
    ```JSON
    { 
      "username": "testuser", 
      "email": "test@aa22.dev", 
      "password": "yourpassword"
    }
    ```

- **Verify OTP**: `POST /api/v1/applicant/verifyotp`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
    }
    ```
  - Body: 
    ```JSON
    { 
      "email": "test@aa22.dev", 
      "otp": "123456789012" 
    }
    ```

#### 5.2.2. Login and Validate Session
- **Login**: `POST /api/v1/applicant/login`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
    }
    ```
  - Body: 
    ```JSON
    { 
      "email": "test@aa22.dev", 
      "password": "yourpassword" 
    }
    ``` 


- **Validate Session**: `POST /api/v1/applicant/sessiontoken/validate`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
    }
    ```
  - Body: 
    ```JSON
    { 
      "sessionToken": "your-session-token", 
      "password": "yourpassword" 
    }
    ``` 

#### 5.2.3. Profile, Profile Status and Resume Management

- **Upload Resume**: `POST /api/v1/applicant/upload/resume`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```
  - Form Data: 
    ```JSON
    { 
      "resume": <PDF file> 
    }
    ```

- **Profile Status**: `GET /api/v1/applicant/profile/status`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```

- **Get Applicant Details**: `GET /api/v1/applicant`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```

- **Get Profile Details**: `GET /api/v1/applicant/profile`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```

- **Update Profile Details**: `PUT /api/v1/applicant/profile`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```
  - Body:
    ```JSON
    // All the fields are optional. But one of the field must be present.
    {
      "username": "test_user",
      "email": "example@aa22.dev",
      "password": "ExamplePassword@123",
      "name": "Test User",
      "github": "<github-profile-link>",
      "linkedin_profile": "<linkedin-profile-link>",
      "education": {
        "education_id": 1,
        "degree": "Bachelor of Science",
        "major": "Computer Science",
        "university": "Institute of Space Technology",
        "start_date": "2020-09-14",
        "end_date": "2024-09-14"
      },
      "experience": {
        "experience_id": 1,
        "title": "Full Stack Web Developer",
        "company": "FixLife",
        "start_date": "2020-09-14",
        "end_date": "2024-09-14",
        "description": "What is Done? <br> In HTML Format"
      }
    }
    ```

- **Update Profile Picture**: `PUT /api/v1/applicant/upload/resume`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```
  - Form Data: 
    ```JSON
    { 
      "profile_picture": <Image file> 
    }
    ```

#### 5.2.4. Job Recommendation & Application
- **Job Recommendations**: `GET /api/v1/applicant/job/recommendations`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```

- **All Available Jobs**: `GET /api/v1/jobs`

- **Apply for Job**: `POST /api/v1/applicant/apply/:jobId`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```

- **Get All Applicant's Applications**: `GET /api/v1/applicant/applications`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```

- **Get Application for a Job**: `GET /api/v1/applicant/applications/:jobId`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```

#### 5.2.5. Psychometric Test

- **Get Psychometric Test**: `GET /api/v1/applicant/test/psychometric/:id`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```

- **Submit Response of Psychometric Test**: `POST /api/v1/applicant/test/psychometric/submit`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```
  - Body: 
    ```JSON
    { 
      "testId": 1,
      "responses": [
        {
          "questionId": 1,
          "option_id": 2
        },
        {
          "questionId": 3,
          "option_id": 4
        }
      ]
    }
    ```

- **Get Psychometric Test Results**: `POST /api/v1/applicant/test/psychometric/results/:testId`
  - Headers: 
    ```JSON
    {
      "x-api-key": "your-api-key",
      "Origin": "yourorigin.tld",
      "Authorization": "yoursessiontoken"
    }
    ```

## 6. Directory Structure

<details>
  <summary>Click to expand!</summary>
recruitement-and-application-system/<br>
├── cache<br>
├── config<br>
│   ├── database.js<br>
│   ├── globals.js<br>
│   ├── logger.js<br>
│   └── server.js<br>
├── controllers<br>
│   ├── applicant.js<br>
│   ├── application.js<br>
│   ├── company.js<br>
│   ├── jobs.js<br>
│   ├── profile.js<br>
│   ├── psychometricTest.js<br>
│   └── resume.js<br>
├── helpers<br>
│   ├── calculateTestResult.js<br>
│   ├── dataValidityChecker.js<br>
│   ├── error.js<br>
│   ├── otp.js<br>
│   ├── shuffle.js<br>
│   └── validateData.js<br>
├── logs<br>
│   ├── access.log<br>
│   ├── combined.log<br>
│   └── error.log<br>
├── middleware<br>
│   ├── auth.js<br>
│   ├── errorHandler.js<br>
│   └── webAuth.js<br>
├── models<br>
│   ├── allowed_origins.js<br>
│   ├── api_access_logs.js<br>
│   ├── api_keys.js<br>
│   ├── api_usage.js<br>
│   ├── applicants.js<br>
│   ├── applications.js<br>
│   ├── audit_trail.js<br>
│   ├── companies.js<br>
│   ├── education.js<br>
│   ├── experience.js<br>
│   ├── job_skills.js<br>
│   ├── jobs.js<br>
│   ├── psychometric_tests.js<br>
│   ├── recommendations.js<br>
│   ├── sessions.js<br>
│   ├── skills.js<br>
│   ├── smtp_configurations.js<br>
│   ├── system_settings.js<br>
│   ├── user_skills.js<br>
│   └── users.js<br>
├── public<br>
│   ├── assets<br>
│   │   ├── extra-libs<br>
│   │   │   ├── c3<br>
│   │   │   │   ├── c3.min.css<br>
│   │   │   │   ├── c3.min.js<br>
│   │   │   │   └── d3.min.js<br>
│   │   │   ├── datatables.net<br>
│   │   │   │   ├── js<br>
│   │   │   │   │   ├── jquery.dataTables.js<br>
│   │   │   │   │   └── jquery.dataTables.min.js<br>
│   │   │   │   ├── License.txt<br>
│   │   │   │   ├── Readme.md<br>
│   │   │   │   └── package.json<br>
│   │   │   ├── datatables.net-bs4<br>
│   │   │   │   ├── css<br>
│   │   │   │   │   ├── dataTables.bootstrap4.css<br>
│   │   │   │   │   ├── dataTables.bootstrap4.min.css<br>
│   │   │   │   │   └── responsive.dataTables.min.css<br>
│   │   │   │   ├── js<br>
│   │   │   │   │   ├── dataTables.bootstrap4.js<br>
│   │   │   │   │   ├── dataTables.bootstrap4.min.js<br>
│   │   │   │   │   └── dataTables.responsive.min.js<br>
│   │   │   │   ├── Readme.md<br>
│   │   │   │   └── package.json<br>
│   │   │   ├── jvector<br>
│   │   │   │   ├── gdp-data.js<br>
│   │   │   │   ├── jquery-jvectormap-2.0.2.css<br>
│   │   │   │   ├── jquery-jvectormap-2.0.2.min.js<br>
│   │   │   │   ├── jquery-jvectormap-asia-mill.js<br>
│   │   │   │   ├── jquery-jvectormap-au-mill.js<br>
│   │   │   │   ├── jquery-jvectormap-ca-lcc.js<br>
│   │   │   │   ├── jquery-jvectormap-de-mill.js<br>
│   │   │   │   ├── jquery-jvectormap-europe-mill-en.js<br>
│   │   │   │   ├── jquery-jvectormap-in-mill.js<br>
│   │   │   │   ├── jquery-jvectormap-uk-mill-en.js<br>
│   │   │   │   ├── jquery-jvectormap-us-aea-en.js<br>
│   │   │   │   ├── jquery-jvectormap-us-il-chicago-mill-en.js<br>
│   │   │   │   ├── jquery-jvectormap-world-mill-en.js<br>
│   │   │   │   └── jvectormap.custom.js<br>
│   │   │   ├── knob<br>
│   │   │   │   ├── jquery.knob.js<br>
│   │   │   │   └── jquery.knob.min.js<br>
│   │   │   ├── prism<br>
│   │   │   │   ├── prism-old.js<br>
│   │   │   │   ├── prism.css<br>
│   │   │   │   └── prism.js<br>
│   │   │   ├── sparkline<br>
│   │   │   │   └── sparkline.js<br>
│   │   │   └── taskboard<br>
│   │   │       ├── css<br>
│   │   │       │   ├── demo.css<br>
│   │   │       │   ├── jquery-ui.min.css<br>
│   │   │       │   ├── lobilist.css<br>
│   │   │       │   └── lobilist.min.css<br>
│   │   │       ├── example1<br>
│   │   │       │   ├── delete.php<br>
│   │   │       │   ├── insert.php<br>
│   │   │       │   ├── load.json<br>
│   │   │       │   └── update.php<br>
│   │   │       ├── js<br>
│   │   │       │   ├── demo.js<br>
│   │   │       │   ├── jquery-ui.min.js<br>
│   │   │       │   ├── jquery.ui.touch-punch-improved.js<br>
│   │   │       │   ├── lobibox.min.js<br>
│   │   │       │   ├── lobilist.js<br>
│   │   │       │   ├── lobilist.min.js<br>
│   │   │       │   └── task-init.js<br>
│   │   │       └── less<br>
│   │   │           ├── lobilist.less<br>
│   │   │           ├── mixins.less<br>
│   │   │           └── variables.less<br>
│   │   ├── images<br>
│   │   │   ├── alert<br>
│   │   │   │   ├── alert.png<br>
│   │   │   │   ├── alert2.png<br>
│   │   │   │   ├── alert3.png<br>
│   │   │   │   ├── alert4.png<br>
│   │   │   │   ├── alert5.png<br>
│   │   │   │   ├── alert6.png<br>
│   │   │   │   ├── alert7.png<br>
│   │   │   │   ├── model.png<br>
│   │   │   │   ├── model2.png<br>
│   │   │   │   └── model3.png<br>
│   │   │   ├── background<br>
│   │   │   │   ├── Thumbs.db<br>
│   │   │   │   ├── active-bg.jpg<br>
│   │   │   │   ├── active-bg.png<br>
│   │   │   │   ├── beauty.jpg<br>
│   │   │   │   ├── error-bg.jpg<br>
│   │   │   │   ├── img5.jpg<br>
│   │   │   │   ├── img5.png<br>
│   │   │   │   ├── login-register.jpg<br>
│   │   │   │   ├── megamenubg.jpg<br>
│   │   │   │   ├── nyan-cat.gif<br>
│   │   │   │   ├── profile-bg.jpg<br>
│   │   │   │   ├── sidebarbg.png<br>
│   │   │   │   ├── socialbg.jpg<br>
│   │   │   │   ├── user-bg.jpg<br>
│   │   │   │   ├── user-info.jpg<br>
│   │   │   │   └── weatherbg.jpg<br>
│   │   │   ├── big<br>
│   │   │   │   ├── 1.jpg<br>
│   │   │   │   ├── 3.jpg<br>
│   │   │   │   ├── 5.jpg<br>
│   │   │   │   ├── Thumbs.db<br>
│   │   │   │   ├── auth-bg.jpg<br>
│   │   │   │   ├── auth-bg2.jpg<br>
│   │   │   │   ├── d2.jpg<br>
│   │   │   │   ├── icon.png<br>
│   │   │   │   ├── img1.jpg<br>
│   │   │   │   ├── img2.jpg<br>
│   │   │   │   ├── img3.jpg<br>
│   │   │   │   ├── img4.jpg<br>
│   │   │   │   ├── img5.jpg<br>
│   │   │   │   └── img6.jpg<br>
│   │   │   ├── browser<br>
│   │   │   │   ├── chrome-logo.png<br>
│   │   │   │   ├── edge-logo.png<br>
│   │   │   │   ├── firefox-logo.png<br>
│   │   │   │   ├── internet-logo.png<br>
│   │   │   │   ├── netscape-logo.png<br>
│   │   │   │   ├── opera-logo.png<br>
│   │   │   │   ├── photoshop.jpg<br>
│   │   │   │   ├── safari-logo.png<br>
│   │   │   │   └── sketch.jpg<br>
│   │   │   ├── docs<br>
│   │   │   │   └── gulp.jpg<br>
│   │   │   ├── gallery<br>
│   │   │   │   ├── chair.jpg<br>
│   │   │   │   ├── chair2.jpg<br>
│   │   │   │   ├── chair3.jpg<br>
│   │   │   │   └── chair4.jpg<br>
│   │   │   ├── landingpage<br>
│   │   │   │   ├── banne-img.png<br>
│   │   │   │   ├── banner-bg.png<br>
│   │   │   │   ├── brand-logos.png<br>
│   │   │   │   ├── db.png<br>
│   │   │   │   ├── f1.png<br>
│   │   │   │   ├── f2.png<br>
│   │   │   │   ├── f3.png<br>
│   │   │   │   ├── favicon.png<br>
│   │   │   │   ├── icon-sprite.jpg<br>
│   │   │   │   ├── img2.jpg<br>
│   │   │   │   ├── img3.jpg<br>
│   │   │   │   ├── logo.png<br>
│   │   │   │   ├── logos.png<br>
│   │   │   │   ├── right-img.png<br>
│   │   │   │   ├── section-bg.png<br>
│   │   │   │   └── section-img.png<br>
│   │   │   ├── product<br>
│   │   │   │   ├── chair.png<br>
│   │   │   │   ├── chair2.png<br>
│   │   │   │   ├── chair3.png<br>
│   │   │   │   ├── chair4.png<br>
│   │   │   │   ├── ipad.png<br>
│   │   │   │   ├── iphone.png<br>
│   │   │   │   ├── iwatch.png<br>
│   │   │   │   ├── p1.jpg<br>
│   │   │   │   ├── p2.jpg<br>
│   │   │   │   ├── p3.jpg<br>
│   │   │   │   └── p4.jpg<br>
│   │   │   ├── qr-codes<br>
│   │   │   │   ├── 12.svg<br>
│   │   │   │   └── 13.svg<br>
│   │   │   ├── rating<br>
│   │   │   │   ├── cancel-off.png<br>
│   │   │   │   ├── cancel-on.png<br>
│   │   │   │   ├── heart.png<br>
│   │   │   │   ├── like.png<br>
│   │   │   │   ├── star-half-mono.png<br>
│   │   │   │   ├── star-half.png<br>
│   │   │   │   ├── star-off.png<br>
│   │   │   │   └── star-on.png<br>
│   │   │   ├── tooltip<br>
│   │   │   │   ├── Euclid.png<br>
│   │   │   │   ├── shape1.svg<br>
│   │   │   │   ├── shape2.svg<br>
│   │   │   │   ├── shape3.svg<br>
│   │   │   │   ├── tooltip1.svg<br>
│   │   │   │   ├── tooltip2.svg<br>
│   │   │   │   └── tooltip3.svg<br>
│   │   │   ├── users<br>
│   │   │   │   ├── 1-old.jpg<br>
│   │   │   │   ├── 1.jpg<br>
│   │   │   │   ├── 1.png<br>
│   │   │   │   ├── 2.jpg<br>
│   │   │   │   ├── 2.png<br>
│   │   │   │   ├── 3.jpg<br>
│   │   │   │   ├── 3.png<br>
│   │   │   │   ├── 4.jpg<br>
│   │   │   │   ├── 5.jpg<br>
│   │   │   │   ├── 6.jpg<br>
│   │   │   │   ├── 7.jpg<br>
│   │   │   │   ├── 8.jpg<br>
│   │   │   │   ├── agent.jpg<br>
│   │   │   │   ├── agent2.jpg<br>
│   │   │   │   ├── d1.jpg<br>
│   │   │   │   ├── d2.jpg<br>
│   │   │   │   ├── d3.jpg<br>
│   │   │   │   ├── d4.jpg<br>
│   │   │   │   ├── d5.jpg<br>
│   │   │   │   ├── default-avatar.png<br>
│   │   │   │   ├── profile-pic-2.jpg<br>
│   │   │   │   ├── profile-pic.jpg<br>
│   │   │   │   ├── profile.png<br>
│   │   │   │   ├── widget-table-pic1.jpg<br>
│   │   │   │   ├── widget-table-pic2.jpg<br>
│   │   │   │   ├── widget-table-pic3.jpg<br>
│   │   │   │   └── widget-table-pic4.jpg<br>
│   │   │   ├── widgets<br>
│   │   │   │   ├── 1.jpg<br>
│   │   │   │   ├── 2.jpg<br>
│   │   │   │   ├── 3.jpg<br>
│   │   │   │   ├── widget-carousel-2.jpg<br>
│   │   │   │   └── widget-carousel.jpg<br>
│   │   │   ├── angular-templates.png<br>
│   │   │   ├── bootstrap-templates.png<br>
│   │   │   ├── custom-select.png<br>
│   │   │   ├── favicon.png<br>
│   │   │   ├── favicon.svg<br>
│   │   │   ├── freedash.svg<br>
│   │   │   ├── freedashDark.svg<br>
│   │   │   ├── img1.jpg<br>
│   │   │   ├── img2.jpg<br>
│   │   │   ├── img3.jpg<br>
│   │   │   ├── logo-1.svg<br>
│   │   │   ├── logo-icon-1.png<br>
│   │   │   ├── logo-icon.png<br>
│   │   │   ├── logo-light-text.png<br>
│   │   │   ├── logo-text-1.png<br>
│   │   │   ├── logo-text.png<br>
│   │   │   ├── logo.svg<br>
│   │   │   └── react-templates.png<br>
│   │   └── libs<br>
│   │       ├── bootstrap<br>
│   │       │   └── dist<br>
│   │       │       ├── css<br>
│   │       │       │   ├── bootstrap-grid.css<br>
│   │       │       │   ├── bootstrap-grid.css.map<br>
│   │       │       │   ├── bootstrap-grid.min.css<br>
│   │       │       │   ├── bootstrap-grid.min.css.map<br>
│   │       │       │   ├── bootstrap-grid.rtl.css<br>
│   │       │       │   ├── bootstrap-grid.rtl.css.map<br>
│   │       │       │   ├── bootstrap-grid.rtl.min.css<br>
│   │       │       │   ├── bootstrap-grid.rtl.min.css.map<br>
│   │       │       │   ├── bootstrap-reboot.css<br>
│   │       │       │   ├── bootstrap-reboot.css.map<br>
│   │       │       │   ├── bootstrap-reboot.min.css<br>
│   │       │       │   ├── bootstrap-reboot.min.css.map<br>
│   │       │       │   ├── bootstrap-reboot.rtl.css<br>
│   │       │       │   ├── bootstrap-reboot.rtl.css.map<br>
│   │       │       │   ├── bootstrap-reboot.rtl.min.css<br>
│   │       │       │   ├── bootstrap-reboot.rtl.min.css.map<br>
│   │       │       │   ├── bootstrap-utilities.css<br>
│   │       │       │   ├── bootstrap-utilities.css.map<br>
│   │       │       │   ├── bootstrap-utilities.min.css<br>
│   │       │       │   ├── bootstrap-utilities.min.css.map<br>
│   │       │       │   ├── bootstrap-utilities.rtl.css<br>
│   │       │       │   ├── bootstrap-utilities.rtl.css.map<br>
│   │       │       │   ├── bootstrap-utilities.rtl.min.css<br>
│   │       │       │   ├── bootstrap-utilities.rtl.min.css.map<br>
│   │       │       │   ├── bootstrap.css<br>
│   │       │       │   ├── bootstrap.css.map<br>
│   │       │       │   ├── bootstrap.min.css<br>
│   │       │       │   ├── bootstrap.min.css.map<br>
│   │       │       │   ├── bootstrap.rtl.css<br>
│   │       │       │   ├── bootstrap.rtl.css.map<br>
│   │       │       │   ├── bootstrap.rtl.min.css<br>
│   │       │       │   └── bootstrap.rtl.min.css.map<br>
│   │       │       └── js<br>
│   │       │           ├── bootstrap.bundle.js<br>
│   │       │           ├── bootstrap.bundle.js.map<br>
│   │       │           ├── bootstrap.bundle.min.js<br>
│   │       │           ├── bootstrap.bundle.min.js.map<br>
│   │       │           ├── bootstrap.esm.js<br>
│   │       │           ├── bootstrap.esm.js.map<br>
│   │       │           ├── bootstrap.esm.min.js<br>
│   │       │           ├── bootstrap.esm.min.js.map<br>
│   │       │           ├── bootstrap.js<br>
│   │       │           ├── bootstrap.js.map<br>
│   │       │           ├── bootstrap.min.js<br>
│   │       │           └── bootstrap.min.js.map<br>
│   │       ├── chart.js<br>
│   │       │   └── dist<br>
│   │       │       ├── Chart.bundle.min.js<br>
│   │       │       ├── Chart.min.css<br>
│   │       │       └── Chart.min.js<br>
│   │       ├── chartist<br>
│   │       │   └── dist<br>
│   │       │       ├── chartist.min.css<br>
│   │       │       └── chartist.min.js<br>
│   │       ├── chartist-plugin-tooltips<br>
│   │       │   └── dist<br>
│   │       │       ├── chartist-plugin-tooltip.css<br>
│   │       │       └── chartist-plugin-tooltip.min.js<br>
│   │       ├── datatables.net-bs4<br>
│   │       │   ├── css<br>
│   │       │   │   └── dataTables.bootstrap4.min.css<br>
│   │       │   └── js<br>
│   │       │       └── dataTables.bootstrap4.min.js<br>
│   │       ├── fullcalendar<br>
│   │       │   └── dist<br>
│   │       │       ├── fullcalendar.min.css<br>
│   │       │       ├── fullcalendar.min.js<br>
│   │       │       ├── fullcalendar.print.min.css<br>
│   │       │       ├── gcal.min.js<br>
│   │       │       └── locale-all.js<br>
│   │       ├── jquery<br>
│   │       │   └── dist<br>
│   │       │       ├── core.js<br>
│   │       │       ├── jquery.js<br>
│   │       │       ├── jquery.min.js<br>
│   │       │       ├── jquery.min.map<br>
│   │       │       ├── jquery.slim.js<br>
│   │       │       ├── jquery.slim.min.js<br>
│   │       │       └── jquery.slim.min.map<br>
│   │       ├── moment<br>
│   │       │   ├── min<br>
│   │       │   │   ├── locales.min.js<br>
│   │       │   │   ├── moment-with-locales.min.js<br>
│   │       │   │   └── moment.min.js<br>
│   │       │   ├── ender.js<br>
│   │       │   ├── moment.js<br>
│   │       │   └── package.js<br>
│   │       ├── morris.js<br>
│   │       │   ├── bower.travis.json<br>
│   │       │   ├── morris.css<br>
│   │       │   └── morris.min.js<br>
│   │       ├── perfect-scrollbar<br>
│   │       │   └── dist<br>
│   │       │       ├── css<br>
│   │       │       │   └── perfect-scrollbar.min.css<br>
│   │       │       ├── js<br>
│   │       │       │   ├── perfect-scrollbar.jquery.min.js<br>
│   │       │       │   └── perfect-scrollbar.min.js<br>
│   │       │       ├── perfect-scrollbar.common.js<br>
│   │       │       ├── perfect-scrollbar.esm.js<br>
│   │       │       ├── perfect-scrollbar.jquery.min.js<br>
│   │       │       └── perfect-scrollbar.min.js<br>
│   │       ├── popper.js<br>
│   │       │   └── dist<br>
│   │       │       ├── esm<br>
│   │       │       │   ├── popper-utils.min.js<br>
│   │       │       │   └── popper.min.js<br>
│   │       │       ├── umd<br>
│   │       │       │   ├── popper-utils.min.js<br>
│   │       │       │   ├── popper.min.js<br>
│   │       │       │   └── poppper.js.flow<br>
│   │       │       ├── popper-utils.min.js<br>
│   │       │       └── popper.min.js<br>
│   │       └── raphael<br>
│   │           ├── dev<br>
│   │           │   ├── banner.txt<br>
│   │           │   ├── raphael.amd.js<br>
│   │           │   ├── raphael.core.js<br>
│   │           │   ├── raphael.svg.js<br>
│   │           │   ├── raphael.vml.js<br>
│   │           │   └── raphaelTest.html<br>
│   │           ├── license.txt<br>
│   │           ├── raphael.min.js<br>
│   │           └── raphael.no-deps.min.js<br>
│   ├── dist<br>
│   │   ├── css<br>
│   │   │   ├── fonts<br>
│   │   │   │   ├── Gilmer-Bold.eot<br>
│   │   │   │   ├── Gilmer-Bold.otf<br>
│   │   │   │   ├── Gilmer-Bold.svg<br>
│   │   │   │   ├── Gilmer-Bold.ttf<br>
│   │   │   │   ├── Gilmer-Bold.woff<br>
│   │   │   │   ├── Gilmer-Heavy.eot<br>
│   │   │   │   ├── Gilmer-Heavy.otf<br>
│   │   │   │   ├── Gilmer-Heavy.svg<br>
│   │   │   │   ├── Gilmer-Heavy.ttf<br>
│   │   │   │   ├── Gilmer-Heavy.woff<br>
│   │   │   │   ├── Gilmer-Medium.eot<br>
│   │   │   │   ├── Gilmer-Medium.otf<br>
│   │   │   │   ├── Gilmer-Medium.svg<br>
│   │   │   │   ├── Gilmer-Medium.ttf<br>
│   │   │   │   ├── Gilmer-Medium.woff<br>
│   │   │   │   ├── Gilmer-Regular.eot<br>
│   │   │   │   ├── Gilmer-Regular.otf<br>
│   │   │   │   ├── Gilmer-Regular.svg<br>
│   │   │   │   ├── Gilmer-Regular.ttf<br>
│   │   │   │   ├── Gilmer-Regular.woff<br>
│   │   │   │   ├── TofinoPersonal-Book.eot<br>
│   │   │   │   ├── TofinoPersonal-Book.otf<br>
│   │   │   │   ├── TofinoPersonal-Book.svg<br>
│   │   │   │   ├── TofinoPersonal-Book.ttf<br>
│   │   │   │   ├── TofinoPersonal-Book.woff<br>
│   │   │   │   ├── TofinoPersonal-Medium.eot<br>
│   │   │   │   ├── TofinoPersonal-Medium.otf<br>
│   │   │   │   ├── TofinoPersonal-Medium.svg<br>
│   │   │   │   ├── TofinoPersonal-Medium.ttf<br>
│   │   │   │   ├── TofinoPersonal-Medium.woff<br>
│   │   │   │   ├── TofinoPersonal-Regular.eot<br>
│   │   │   │   ├── TofinoPersonal-Regular.otf<br>
│   │   │   │   ├── TofinoPersonal-Regular.svg<br>
│   │   │   │   ├── TofinoPersonal-Regular.ttf<br>
│   │   │   │   └── TofinoPersonal-Regular.woff<br>
│   │   │   ├── icons<br>
│   │   │   │   ├── font-awesome<br>
│   │   │   │   │   ├── css<br>
│   │   │   │   │   │   ├── fa-brands.css<br>
│   │   │   │   │   │   ├── fa-brands.min.css<br>
│   │   │   │   │   │   ├── fa-regular.css<br>
│   │   │   │   │   │   ├── fa-regular.min.css<br>
│   │   │   │   │   │   ├── fa-solid.css<br>
│   │   │   │   │   │   ├── fa-solid.min.css<br>
│   │   │   │   │   │   ├── fontawesome-all.css<br>
│   │   │   │   │   │   ├── fontawesome-all.min.css<br>
│   │   │   │   │   │   ├── fontawesome.css<br>
│   │   │   │   │   │   └── fontawesome.min.css<br>
│   │   │   │   │   ├── less<br>
│   │   │   │   │   │   ├── _animated.less<br>
│   │   │   │   │   │   ├── _bordered-pulled.less<br>
│   │   │   │   │   │   ├── _core.less<br>
│   │   │   │   │   │   ├── _fixed-width.less<br>
│   │   │   │   │   │   ├── _icons.less<br>
│   │   │   │   │   │   ├── _larger.less<br>
│   │   │   │   │   │   ├── _list.less<br>
│   │   │   │   │   │   ├── _mixins.less<br>
│   │   │   │   │   │   ├── _rotated-flipped.less<br>
│   │   │   │   │   │   ├── _screen-reader.less<br>
│   │   │   │   │   │   ├── _stacked.less<br>
│   │   │   │   │   │   ├── _variables.less<br>
│   │   │   │   │   │   ├── fa-brands.less<br>
│   │   │   │   │   │   ├── fa-regular.less<br>
│   │   │   │   │   │   ├── fa-solid.less<br>
│   │   │   │   │   │   └── fontawesome.less<br>
│   │   │   │   │   ├── scss<br>
│   │   │   │   │   │   ├── _animated.scss<br>
│   │   │   │   │   │   ├── _bordered-pulled.scss<br>
│   │   │   │   │   │   ├── _core.scss<br>
│   │   │   │   │   │   ├── _fixed-width.scss<br>
│   │   │   │   │   │   ├── _icons.scss<br>
│   │   │   │   │   │   ├── _larger.scss<br>
│   │   │   │   │   │   ├── _list.scss<br>
│   │   │   │   │   │   ├── _mixins.scss<br>
│   │   │   │   │   │   ├── _rotated-flipped.scss<br>
│   │   │   │   │   │   ├── _screen-reader.scss<br>
│   │   │   │   │   │   ├── _stacked.scss<br>
│   │   │   │   │   │   ├── _variables.scss<br>
│   │   │   │   │   │   ├── fa-brands.scss<br>
│   │   │   │   │   │   ├── fa-regular.scss<br>
│   │   │   │   │   │   ├── fa-solid.scss<br>
│   │   │   │   │   │   └── fontawesome.scss<br>
│   │   │   │   │   └── webfonts<br>
│   │   │   │   │       ├── fa-brands-400.eot<br>
│   │   │   │   │       ├── fa-brands-400.svg<br>
│   │   │   │   │       ├── fa-brands-400.ttf<br>
│   │   │   │   │       ├── fa-brands-400.woff<br>
│   │   │   │   │       ├── fa-brands-400.woff2<br>
│   │   │   │   │       ├── fa-regular-400.eot<br>
│   │   │   │   │       ├── fa-regular-400.svg<br>
│   │   │   │   │       ├── fa-regular-400.ttf<br>
│   │   │   │   │       ├── fa-regular-400.woff<br>
│   │   │   │   │       ├── fa-regular-400.woff2<br>
│   │   │   │   │       ├── fa-solid-900.eot<br>
│   │   │   │   │       ├── fa-solid-900.svg<br>
│   │   │   │   │       ├── fa-solid-900.ttf<br>
│   │   │   │   │       ├── fa-solid-900.woff<br>
│   │   │   │   │       └── fa-solid-900.woff2<br>
│   │   │   │   ├── simple-line-icons<br>
│   │   │   │   │   ├── css<br>
│   │   │   │   │   │   └── simple-line-icons.css<br>
│   │   │   │   │   ├── fonts<br>
│   │   │   │   │   │   ├── Simple-Line-Icons.eot<br>
│   │   │   │   │   │   ├── Simple-Line-Icons.svg<br>
│   │   │   │   │   │   ├── Simple-Line-Icons.ttf<br>
│   │   │   │   │   │   ├── Simple-Line-Icons.woff<br>
│   │   │   │   │   │   └── Simple-Line-Icons.woff2<br>
│   │   │   │   │   ├── less<br>
│   │   │   │   │   │   └── simple-line-icons.less<br>
│   │   │   │   │   └── scss<br>
│   │   │   │   │       └── simple-line-icons.scss<br>
│   │   │   │   └── themify-icons<br>
│   │   │   │       ├── fonts<br>
│   │   │   │       │   ├── themify.eot<br>
│   │   │   │       │   ├── themify.svg<br>
│   │   │   │       │   ├── themify.ttf<br>
│   │   │   │       │   └── themify.woff<br>
│   │   │   │       ├── ie7<br>
│   │   │   │       │   ├── ie7.css<br>
│   │   │   │       │   └── ie7.js<br>
│   │   │   │       ├── themify-icons.css<br>
│   │   │   │       └── themify-icons.less<br>
│   │   │   ├── custom.css<br>
│   │   │   ├── login.css<br>
│   │   │   ├── login.min.css<br>
│   │   │   ├── pandalocker.min.css<br>
│   │   │   ├── single-inspection.css<br>
│   │   │   ├── style.css<br>
│   │   │   ├── style.min.css<br>
│   │   │   └── table.css<br>
│   │   ├── img<br>
│   │   │   ├── button-loader-f2f2f2.gif<br>
│   │   │   ├── lock-icon.png<br>
│   │   │   └── social-icons.png<br>
│   │   └── js<br>
│   │       ├── pages<br>
│   │       │   ├── calendar<br>
│   │       │   │   ├── cal-init.js<br>
│   │       │   │   └── cal-init.min.js<br>
│   │       │   ├── chartist<br>
│   │       │   │   ├── chartist-init.css<br>
│   │       │   │   ├── chartist-init.js<br>
│   │       │   │   ├── chartist-init.min.js<br>
│   │       │   │   ├── chartist-plugin-tooltip.js<br>
│   │       │   │   └── chartist-plugin-tooltip.min.js<br>
│   │       │   ├── chartjs<br>
│   │       │   │   ├── chartjs.init.js<br>
│   │       │   │   └── chartjs.init.min.js<br>
│   │       │   ├── dashboards<br>
│   │       │   │   ├── dashboard1.js<br>
│   │       │   │   └── dashboard1.min.js<br>
│   │       │   ├── datatable<br>
│   │       │   │   ├── data.json<br>
│   │       │   │   ├── datatable-basic.init.js<br>
│   │       │   │   ├── datatable-basic.init.min.js<br>
│   │       │   │   ├── datatable-inspections.js<br>
│   │       │   │   ├── datatable-inspectors.js<br>
│   │       │   │   ├── datatable-qr.js<br>
│   │       │   │   └── datatable-recommended-jobs.js<br>
│   │       │   └── morris<br>
│   │       │       ├── morris-data.js<br>
│   │       │       └── morris-data.min.js<br>
│   │       ├── app-style-switcher.js<br>
│   │       ├── app-style-switcher.min.js<br>
│   │       ├── custom.js<br>
│   │       ├── custom.min.js<br>
│   │       ├── feather.min.js<br>
│   │       ├── jquery.ui.highlight.min.js<br>
│   │       ├── pandalocker.js<br>
│   │       ├── pandalocker.min.js<br>
│   │       ├── sidebarmenu.js<br>
│   │       └── sidebarmenu.min.js<br>
│   └── uploads<br>
│       ├── images<br>
│       └── resume<br>
├── routes<br>
│   ├── api<br>
│   │   └── v1<br>
│   │       ├── applicant.js<br>
│   │       ├── company.js<br>
│   │       └── jobs.js<br>
│   └── web<br>
│       └── applicant.js<br>
├── services<br>
│   ├── parser<br>
│   │   ├── dataparser.py<br>
│   │   └── parser.py<br>
│   ├── similarity<br>
│   │   └── compute.py<br>
│   ├── authUtils.js<br>
│   ├── database.js<br>
│   ├── email.js<br>
│   ├── generateApiKey.js<br>
│   ├── jobRecommendation.js<br>
│   ├── middleware.js<br>
│   ├── resumeParser.js<br>
│   ├── router.js<br>
│   └── sessionUtils.js<br>
├── views<br>
│   ├── layout<br>
│   │   ├── footer.pug<br>
│   │   ├── head.pug<br>
│   │   ├── header.pug<br>
│   │   ├── main.pug<br>
│   │   ├── preloader.pug<br>
│   │   ├── scripts.pug<br>
│   │   └── sidebar.pug<br>
│   ├── all-jobs.pug<br>
│   ├── dashboard.pug<br>
│   ├── index.pug<br>
│   └── recommended-jobs.pug<br>
├── .gitignore<br>
├── README.md<br>
├── app.js<br>
├── generate_structure.py<br>
├── package-lock.json<br>
└── package.json<br>
</details>

## 7. Contributing

Contributions are welcome! Please fork the repository and create a pull request for any feature additions or bug fixes.

Major Contributions are of:
- [Aqib Hussain](https://github.com/aa22dev)
- Hafiz Jawad Mansoor