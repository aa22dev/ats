# Recruitment &amp; Application Tracking System

## Table of Contents
- [Recruitment \& Application Tracking System](#recruitment--application-tracking-system)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Installation](#installation)
  - [Configuration](#configuration)
    - [MySQL Database Configuration](#mysql-database-configuration)
    - [Server Configuration](#server-configuration)
    - [Global Configuration](#global-configuration)
    - [Logger Configuration](#logger-configuration)
  - [Usage](#usage)
    - [Run App](#run-app)
    - [APIs Endpoints](#apis-endpoints)
      - [Registration and OTP Verification](#registration-and-otp-verification)
      - [Login and Validate Session](#login-and-validate-session)
      - [Profile, Profile Status and Resume Management](#profile-profile-status-and-resume-management)
      - [Job Recommendation \& Application](#job-recommendation--application)
      - [Psychometric Test](#psychometric-test)
    - [Directory Structure](#directory-structure)

## Introduction

This project is a comprehensive Recruitment & Application Tracking System (ATS). It provides a robust platform for managing the entire recruitment process. Applicants can register, apply for jobs, upload resumes, and complete psychometric tests. The system supports OTP verification during registration, ensuring secure user authentication. Additionally, it offers role-based functionalities, catering to different user types such as applicants, employers, companies, and administrators.

The system allows companies to configure custom SMTP settings for sending system emails, enhancing flexibility and personalization. It employs a secure API key generation algorithm for interacting with the API endpoints of the applicant dashboard, ensuring the integrity and confidentiality of data exchanges. Furthermore, a secure session token mechanism is implemented to manage applicant sessions with the server efficiently.

To enhance the system's reliability and maintainability, an extensive logging layer is integrated, capturing access logs and error logs for easy debugging and monitoring. This ensures that any issues can be quickly identified and resolved, providing a smooth and secure user experience.

## Features

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

## Installation

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

## Configuration

### MySQL Database Configuration
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

### Server Configuration
**File:** `config/server.js`

This file defines the configuration setting for the server. 

**Configuration:**

```javascript
port: 3000, //  Set the server port (default: 3000)
views: path.join(__basedir, 'views'), //  Define the directory containing server-side views (templates)
viewEngine: 'pug',  //  Specify the templating engine used (default: Pug)
statics: path.join(__basedir, 'public'),  //  Define the directory containing static assets (e.g., CSS, JS, images etc.)
```

### Global Configuration
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

### Logger Configuration
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

## Usage

### Run App
- For development Environment:
    ```bash
    npm run dev
    ```
- For Production Environment:
    ```bash
    npm run app
    ```

### APIs Endpoints

#### Registration and OTP Verification

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

#### Login and Validate Session
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

#### Profile, Profile Status and Resume Management

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

#### Job Recommendation & Application
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

#### Psychometric Test

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

### Directory Structure

<details>
  <summary>Click to expand!</summary>
recruitement-and-application-system/
├── cache
├── config
│   ├── database.js
│   ├── globals.js
│   ├── logger.js
│   └── server.js
├── controllers
│   ├── applicant.js
│   ├── application.js
│   ├── company.js
│   ├── jobs.js
│   ├── profile.js
│   ├── psychometricTest.js
│   └── resume.js
├── helpers
│   ├── calculateTestResult.js
│   ├── dataValidityChecker.js
│   ├── error.js
│   ├── otp.js
│   ├── shuffle.js
│   └── validateData.js
├── logs
│   ├── access.log
│   ├── combined.log
│   └── error.log
├── middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── webAuth.js
├── models
│   ├── allowed_origins.js
│   ├── api_access_logs.js
│   ├── api_keys.js
│   ├── api_usage.js
│   ├── applicants.js
│   ├── applications.js
│   ├── audit_trail.js
│   ├── companies.js
│   ├── education.js
│   ├── experience.js
│   ├── job_skills.js
│   ├── jobs.js
│   ├── psychometric_tests.js
│   ├── recommendations.js
│   ├── sessions.js
│   ├── skills.js
│   ├── smtp_configurations.js
│   ├── system_settings.js
│   ├── user_skills.js
│   └── users.js
├── public
│   ├── assets
│   │   ├── extra-libs
│   │   │   ├── c3
│   │   │   │   ├── c3.min.css
│   │   │   │   ├── c3.min.js
│   │   │   │   └── d3.min.js
│   │   │   ├── datatables.net
│   │   │   │   ├── js
│   │   │   │   │   ├── jquery.dataTables.js
│   │   │   │   │   └── jquery.dataTables.min.js
│   │   │   │   ├── License.txt
│   │   │   │   ├── Readme.md
│   │   │   │   └── package.json
│   │   │   ├── datatables.net-bs4
│   │   │   │   ├── css
│   │   │   │   │   ├── dataTables.bootstrap4.css
│   │   │   │   │   ├── dataTables.bootstrap4.min.css
│   │   │   │   │   └── responsive.dataTables.min.css
│   │   │   │   ├── js
│   │   │   │   │   ├── dataTables.bootstrap4.js
│   │   │   │   │   ├── dataTables.bootstrap4.min.js
│   │   │   │   │   └── dataTables.responsive.min.js
│   │   │   │   ├── Readme.md
│   │   │   │   └── package.json
│   │   │   ├── jvector
│   │   │   │   ├── gdp-data.js
│   │   │   │   ├── jquery-jvectormap-2.0.2.css
│   │   │   │   ├── jquery-jvectormap-2.0.2.min.js
│   │   │   │   ├── jquery-jvectormap-asia-mill.js
│   │   │   │   ├── jquery-jvectormap-au-mill.js
│   │   │   │   ├── jquery-jvectormap-ca-lcc.js
│   │   │   │   ├── jquery-jvectormap-de-mill.js
│   │   │   │   ├── jquery-jvectormap-europe-mill-en.js
│   │   │   │   ├── jquery-jvectormap-in-mill.js
│   │   │   │   ├── jquery-jvectormap-uk-mill-en.js
│   │   │   │   ├── jquery-jvectormap-us-aea-en.js
│   │   │   │   ├── jquery-jvectormap-us-il-chicago-mill-en.js
│   │   │   │   ├── jquery-jvectormap-world-mill-en.js
│   │   │   │   └── jvectormap.custom.js
│   │   │   ├── knob
│   │   │   │   ├── jquery.knob.js
│   │   │   │   └── jquery.knob.min.js
│   │   │   ├── prism
│   │   │   │   ├── prism-old.js
│   │   │   │   ├── prism.css
│   │   │   │   └── prism.js
│   │   │   ├── sparkline
│   │   │   │   └── sparkline.js
│   │   │   └── taskboard
│   │   │       ├── css
│   │   │       │   ├── demo.css
│   │   │       │   ├── jquery-ui.min.css
│   │   │       │   ├── lobilist.css
│   │   │       │   └── lobilist.min.css
│   │   │       ├── example1
│   │   │       │   ├── delete.php
│   │   │       │   ├── insert.php
│   │   │       │   ├── load.json
│   │   │       │   └── update.php
│   │   │       ├── js
│   │   │       │   ├── demo.js
│   │   │       │   ├── jquery-ui.min.js
│   │   │       │   ├── jquery.ui.touch-punch-improved.js
│   │   │       │   ├── lobibox.min.js
│   │   │       │   ├── lobilist.js
│   │   │       │   ├── lobilist.min.js
│   │   │       │   └── task-init.js
│   │   │       └── less
│   │   │           ├── lobilist.less
│   │   │           ├── mixins.less
│   │   │           └── variables.less
│   │   ├── images
│   │   │   ├── alert
│   │   │   │   ├── alert.png
│   │   │   │   ├── alert2.png
│   │   │   │   ├── alert3.png
│   │   │   │   ├── alert4.png
│   │   │   │   ├── alert5.png
│   │   │   │   ├── alert6.png
│   │   │   │   ├── alert7.png
│   │   │   │   ├── model.png
│   │   │   │   ├── model2.png
│   │   │   │   └── model3.png
│   │   │   ├── background
│   │   │   │   ├── Thumbs.db
│   │   │   │   ├── active-bg.jpg
│   │   │   │   ├── active-bg.png
│   │   │   │   ├── beauty.jpg
│   │   │   │   ├── error-bg.jpg
│   │   │   │   ├── img5.jpg
│   │   │   │   ├── img5.png
│   │   │   │   ├── login-register.jpg
│   │   │   │   ├── megamenubg.jpg
│   │   │   │   ├── nyan-cat.gif
│   │   │   │   ├── profile-bg.jpg
│   │   │   │   ├── sidebarbg.png
│   │   │   │   ├── socialbg.jpg
│   │   │   │   ├── user-bg.jpg
│   │   │   │   ├── user-info.jpg
│   │   │   │   └── weatherbg.jpg
│   │   │   ├── big
│   │   │   │   ├── 1.jpg
│   │   │   │   ├── 3.jpg
│   │   │   │   ├── 5.jpg
│   │   │   │   ├── Thumbs.db
│   │   │   │   ├── auth-bg.jpg
│   │   │   │   ├── auth-bg2.jpg
│   │   │   │   ├── d2.jpg
│   │   │   │   ├── icon.png
│   │   │   │   ├── img1.jpg
│   │   │   │   ├── img2.jpg
│   │   │   │   ├── img3.jpg
│   │   │   │   ├── img4.jpg
│   │   │   │   ├── img5.jpg
│   │   │   │   └── img6.jpg
│   │   │   ├── browser
│   │   │   │   ├── chrome-logo.png
│   │   │   │   ├── edge-logo.png
│   │   │   │   ├── firefox-logo.png
│   │   │   │   ├── internet-logo.png
│   │   │   │   ├── netscape-logo.png
│   │   │   │   ├── opera-logo.png
│   │   │   │   ├── photoshop.jpg
│   │   │   │   ├── safari-logo.png
│   │   │   │   └── sketch.jpg
│   │   │   ├── docs
│   │   │   │   └── gulp.jpg
│   │   │   ├── gallery
│   │   │   │   ├── chair.jpg
│   │   │   │   ├── chair2.jpg
│   │   │   │   ├── chair3.jpg
│   │   │   │   └── chair4.jpg
│   │   │   ├── landingpage
│   │   │   │   ├── banne-img.png
│   │   │   │   ├── banner-bg.png
│   │   │   │   ├── brand-logos.png
│   │   │   │   ├── db.png
│   │   │   │   ├── f1.png
│   │   │   │   ├── f2.png
│   │   │   │   ├── f3.png
│   │   │   │   ├── favicon.png
│   │   │   │   ├── icon-sprite.jpg
│   │   │   │   ├── img2.jpg
│   │   │   │   ├── img3.jpg
│   │   │   │   ├── logo.png
│   │   │   │   ├── logos.png
│   │   │   │   ├── right-img.png
│   │   │   │   ├── section-bg.png
│   │   │   │   └── section-img.png
│   │   │   ├── product
│   │   │   │   ├── chair.png
│   │   │   │   ├── chair2.png
│   │   │   │   ├── chair3.png
│   │   │   │   ├── chair4.png
│   │   │   │   ├── ipad.png
│   │   │   │   ├── iphone.png
│   │   │   │   ├── iwatch.png
│   │   │   │   ├── p1.jpg
│   │   │   │   ├── p2.jpg
│   │   │   │   ├── p3.jpg
│   │   │   │   └── p4.jpg
│   │   │   ├── qr-codes
│   │   │   │   ├── 12.svg
│   │   │   │   └── 13.svg
│   │   │   ├── rating
│   │   │   │   ├── cancel-off.png
│   │   │   │   ├── cancel-on.png
│   │   │   │   ├── heart.png
│   │   │   │   ├── like.png
│   │   │   │   ├── star-half-mono.png
│   │   │   │   ├── star-half.png
│   │   │   │   ├── star-off.png
│   │   │   │   └── star-on.png
│   │   │   ├── tooltip
│   │   │   │   ├── Euclid.png
│   │   │   │   ├── shape1.svg
│   │   │   │   ├── shape2.svg
│   │   │   │   ├── shape3.svg
│   │   │   │   ├── tooltip1.svg
│   │   │   │   ├── tooltip2.svg
│   │   │   │   └── tooltip3.svg
│   │   │   ├── users
│   │   │   │   ├── 1-old.jpg
│   │   │   │   ├── 1.jpg
│   │   │   │   ├── 1.png
│   │   │   │   ├── 2.jpg
│   │   │   │   ├── 2.png
│   │   │   │   ├── 3.jpg
│   │   │   │   ├── 3.png
│   │   │   │   ├── 4.jpg
│   │   │   │   ├── 5.jpg
│   │   │   │   ├── 6.jpg
│   │   │   │   ├── 7.jpg
│   │   │   │   ├── 8.jpg
│   │   │   │   ├── agent.jpg
│   │   │   │   ├── agent2.jpg
│   │   │   │   ├── d1.jpg
│   │   │   │   ├── d2.jpg
│   │   │   │   ├── d3.jpg
│   │   │   │   ├── d4.jpg
│   │   │   │   ├── d5.jpg
│   │   │   │   ├── default-avatar.png
│   │   │   │   ├── profile-pic-2.jpg
│   │   │   │   ├── profile-pic.jpg
│   │   │   │   ├── profile.png
│   │   │   │   ├── widget-table-pic1.jpg
│   │   │   │   ├── widget-table-pic2.jpg
│   │   │   │   ├── widget-table-pic3.jpg
│   │   │   │   └── widget-table-pic4.jpg
│   │   │   ├── widgets
│   │   │   │   ├── 1.jpg
│   │   │   │   ├── 2.jpg
│   │   │   │   ├── 3.jpg
│   │   │   │   ├── widget-carousel-2.jpg
│   │   │   │   └── widget-carousel.jpg
│   │   │   ├── angular-templates.png
│   │   │   ├── bootstrap-templates.png
│   │   │   ├── custom-select.png
│   │   │   ├── favicon.png
│   │   │   ├── favicon.svg
│   │   │   ├── freedash.svg
│   │   │   ├── freedashDark.svg
│   │   │   ├── img1.jpg
│   │   │   ├── img2.jpg
│   │   │   ├── img3.jpg
│   │   │   ├── logo-1.svg
│   │   │   ├── logo-icon-1.png
│   │   │   ├── logo-icon.png
│   │   │   ├── logo-light-text.png
│   │   │   ├── logo-text-1.png
│   │   │   ├── logo-text.png
│   │   │   ├── logo.svg
│   │   │   └── react-templates.png
│   │   └── libs
│   │       ├── bootstrap
│   │       │   └── dist
│   │       │       ├── css
│   │       │       │   ├── bootstrap-grid.css
│   │       │       │   ├── bootstrap-grid.css.map
│   │       │       │   ├── bootstrap-grid.min.css
│   │       │       │   ├── bootstrap-grid.min.css.map
│   │       │       │   ├── bootstrap-grid.rtl.css
│   │       │       │   ├── bootstrap-grid.rtl.css.map
│   │       │       │   ├── bootstrap-grid.rtl.min.css
│   │       │       │   ├── bootstrap-grid.rtl.min.css.map
│   │       │       │   ├── bootstrap-reboot.css
│   │       │       │   ├── bootstrap-reboot.css.map
│   │       │       │   ├── bootstrap-reboot.min.css
│   │       │       │   ├── bootstrap-reboot.min.css.map
│   │       │       │   ├── bootstrap-reboot.rtl.css
│   │       │       │   ├── bootstrap-reboot.rtl.css.map
│   │       │       │   ├── bootstrap-reboot.rtl.min.css
│   │       │       │   ├── bootstrap-reboot.rtl.min.css.map
│   │       │       │   ├── bootstrap-utilities.css
│   │       │       │   ├── bootstrap-utilities.css.map
│   │       │       │   ├── bootstrap-utilities.min.css
│   │       │       │   ├── bootstrap-utilities.min.css.map
│   │       │       │   ├── bootstrap-utilities.rtl.css
│   │       │       │   ├── bootstrap-utilities.rtl.css.map
│   │       │       │   ├── bootstrap-utilities.rtl.min.css
│   │       │       │   ├── bootstrap-utilities.rtl.min.css.map
│   │       │       │   ├── bootstrap.css
│   │       │       │   ├── bootstrap.css.map
│   │       │       │   ├── bootstrap.min.css
│   │       │       │   ├── bootstrap.min.css.map
│   │       │       │   ├── bootstrap.rtl.css
│   │       │       │   ├── bootstrap.rtl.css.map
│   │       │       │   ├── bootstrap.rtl.min.css
│   │       │       │   └── bootstrap.rtl.min.css.map
│   │       │       └── js
│   │       │           ├── bootstrap.bundle.js
│   │       │           ├── bootstrap.bundle.js.map
│   │       │           ├── bootstrap.bundle.min.js
│   │       │           ├── bootstrap.bundle.min.js.map
│   │       │           ├── bootstrap.esm.js
│   │       │           ├── bootstrap.esm.js.map
│   │       │           ├── bootstrap.esm.min.js
│   │       │           ├── bootstrap.esm.min.js.map
│   │       │           ├── bootstrap.js
│   │       │           ├── bootstrap.js.map
│   │       │           ├── bootstrap.min.js
│   │       │           └── bootstrap.min.js.map
│   │       ├── chart.js
│   │       │   └── dist
│   │       │       ├── Chart.bundle.min.js
│   │       │       ├── Chart.min.css
│   │       │       └── Chart.min.js
│   │       ├── chartist
│   │       │   └── dist
│   │       │       ├── chartist.min.css
│   │       │       └── chartist.min.js
│   │       ├── chartist-plugin-tooltips
│   │       │   └── dist
│   │       │       ├── chartist-plugin-tooltip.css
│   │       │       └── chartist-plugin-tooltip.min.js
│   │       ├── datatables.net-bs4
│   │       │   ├── css
│   │       │   │   └── dataTables.bootstrap4.min.css
│   │       │   └── js
│   │       │       └── dataTables.bootstrap4.min.js
│   │       ├── fullcalendar
│   │       │   └── dist
│   │       │       ├── fullcalendar.min.css
│   │       │       ├── fullcalendar.min.js
│   │       │       ├── fullcalendar.print.min.css
│   │       │       ├── gcal.min.js
│   │       │       └── locale-all.js
│   │       ├── jquery
│   │       │   └── dist
│   │       │       ├── core.js
│   │       │       ├── jquery.js
│   │       │       ├── jquery.min.js
│   │       │       ├── jquery.min.map
│   │       │       ├── jquery.slim.js
│   │       │       ├── jquery.slim.min.js
│   │       │       └── jquery.slim.min.map
│   │       ├── moment
│   │       │   ├── min
│   │       │   │   ├── locales.min.js
│   │       │   │   ├── moment-with-locales.min.js
│   │       │   │   └── moment.min.js
│   │       │   ├── ender.js
│   │       │   ├── moment.js
│   │       │   └── package.js
│   │       ├── morris.js
│   │       │   ├── bower.travis.json
│   │       │   ├── morris.css
│   │       │   └── morris.min.js
│   │       ├── perfect-scrollbar
│   │       │   └── dist
│   │       │       ├── css
│   │       │       │   └── perfect-scrollbar.min.css
│   │       │       ├── js
│   │       │       │   ├── perfect-scrollbar.jquery.min.js
│   │       │       │   └── perfect-scrollbar.min.js
│   │       │       ├── perfect-scrollbar.common.js
│   │       │       ├── perfect-scrollbar.esm.js
│   │       │       ├── perfect-scrollbar.jquery.min.js
│   │       │       └── perfect-scrollbar.min.js
│   │       ├── popper.js
│   │       │   └── dist
│   │       │       ├── esm
│   │       │       │   ├── popper-utils.min.js
│   │       │       │   └── popper.min.js
│   │       │       ├── umd
│   │       │       │   ├── popper-utils.min.js
│   │       │       │   ├── popper.min.js
│   │       │       │   └── poppper.js.flow
│   │       │       ├── popper-utils.min.js
│   │       │       └── popper.min.js
│   │       └── raphael
│   │           ├── dev
│   │           │   ├── banner.txt
│   │           │   ├── raphael.amd.js
│   │           │   ├── raphael.core.js
│   │           │   ├── raphael.svg.js
│   │           │   ├── raphael.vml.js
│   │           │   └── raphaelTest.html
│   │           ├── license.txt
│   │           ├── raphael.min.js
│   │           └── raphael.no-deps.min.js
│   ├── dist
│   │   ├── css
│   │   │   ├── fonts
│   │   │   │   ├── Gilmer-Bold.eot
│   │   │   │   ├── Gilmer-Bold.otf
│   │   │   │   ├── Gilmer-Bold.svg
│   │   │   │   ├── Gilmer-Bold.ttf
│   │   │   │   ├── Gilmer-Bold.woff
│   │   │   │   ├── Gilmer-Heavy.eot
│   │   │   │   ├── Gilmer-Heavy.otf
│   │   │   │   ├── Gilmer-Heavy.svg
│   │   │   │   ├── Gilmer-Heavy.ttf
│   │   │   │   ├── Gilmer-Heavy.woff
│   │   │   │   ├── Gilmer-Medium.eot
│   │   │   │   ├── Gilmer-Medium.otf
│   │   │   │   ├── Gilmer-Medium.svg
│   │   │   │   ├── Gilmer-Medium.ttf
│   │   │   │   ├── Gilmer-Medium.woff
│   │   │   │   ├── Gilmer-Regular.eot
│   │   │   │   ├── Gilmer-Regular.otf
│   │   │   │   ├── Gilmer-Regular.svg
│   │   │   │   ├── Gilmer-Regular.ttf
│   │   │   │   ├── Gilmer-Regular.woff
│   │   │   │   ├── TofinoPersonal-Book.eot
│   │   │   │   ├── TofinoPersonal-Book.otf
│   │   │   │   ├── TofinoPersonal-Book.svg
│   │   │   │   ├── TofinoPersonal-Book.ttf
│   │   │   │   ├── TofinoPersonal-Book.woff
│   │   │   │   ├── TofinoPersonal-Medium.eot
│   │   │   │   ├── TofinoPersonal-Medium.otf
│   │   │   │   ├── TofinoPersonal-Medium.svg
│   │   │   │   ├── TofinoPersonal-Medium.ttf
│   │   │   │   ├── TofinoPersonal-Medium.woff
│   │   │   │   ├── TofinoPersonal-Regular.eot
│   │   │   │   ├── TofinoPersonal-Regular.otf
│   │   │   │   ├── TofinoPersonal-Regular.svg
│   │   │   │   ├── TofinoPersonal-Regular.ttf
│   │   │   │   └── TofinoPersonal-Regular.woff
│   │   │   ├── icons
│   │   │   │   ├── font-awesome
│   │   │   │   │   ├── css
│   │   │   │   │   │   ├── fa-brands.css
│   │   │   │   │   │   ├── fa-brands.min.css
│   │   │   │   │   │   ├── fa-regular.css
│   │   │   │   │   │   ├── fa-regular.min.css
│   │   │   │   │   │   ├── fa-solid.css
│   │   │   │   │   │   ├── fa-solid.min.css
│   │   │   │   │   │   ├── fontawesome-all.css
│   │   │   │   │   │   ├── fontawesome-all.min.css
│   │   │   │   │   │   ├── fontawesome.css
│   │   │   │   │   │   └── fontawesome.min.css
│   │   │   │   │   ├── less
│   │   │   │   │   │   ├── _animated.less
│   │   │   │   │   │   ├── _bordered-pulled.less
│   │   │   │   │   │   ├── _core.less
│   │   │   │   │   │   ├── _fixed-width.less
│   │   │   │   │   │   ├── _icons.less
│   │   │   │   │   │   ├── _larger.less
│   │   │   │   │   │   ├── _list.less
│   │   │   │   │   │   ├── _mixins.less
│   │   │   │   │   │   ├── _rotated-flipped.less
│   │   │   │   │   │   ├── _screen-reader.less
│   │   │   │   │   │   ├── _stacked.less
│   │   │   │   │   │   ├── _variables.less
│   │   │   │   │   │   ├── fa-brands.less
│   │   │   │   │   │   ├── fa-regular.less
│   │   │   │   │   │   ├── fa-solid.less
│   │   │   │   │   │   └── fontawesome.less
│   │   │   │   │   ├── scss
│   │   │   │   │   │   ├── _animated.scss
│   │   │   │   │   │   ├── _bordered-pulled.scss
│   │   │   │   │   │   ├── _core.scss
│   │   │   │   │   │   ├── _fixed-width.scss
│   │   │   │   │   │   ├── _icons.scss
│   │   │   │   │   │   ├── _larger.scss
│   │   │   │   │   │   ├── _list.scss
│   │   │   │   │   │   ├── _mixins.scss
│   │   │   │   │   │   ├── _rotated-flipped.scss
│   │   │   │   │   │   ├── _screen-reader.scss
│   │   │   │   │   │   ├── _stacked.scss
│   │   │   │   │   │   ├── _variables.scss
│   │   │   │   │   │   ├── fa-brands.scss
│   │   │   │   │   │   ├── fa-regular.scss
│   │   │   │   │   │   ├── fa-solid.scss
│   │   │   │   │   │   └── fontawesome.scss
│   │   │   │   │   └── webfonts
│   │   │   │   │       ├── fa-brands-400.eot
│   │   │   │   │       ├── fa-brands-400.svg
│   │   │   │   │       ├── fa-brands-400.ttf
│   │   │   │   │       ├── fa-brands-400.woff
│   │   │   │   │       ├── fa-brands-400.woff2
│   │   │   │   │       ├── fa-regular-400.eot
│   │   │   │   │       ├── fa-regular-400.svg
│   │   │   │   │       ├── fa-regular-400.ttf
│   │   │   │   │       ├── fa-regular-400.woff
│   │   │   │   │       ├── fa-regular-400.woff2
│   │   │   │   │       ├── fa-solid-900.eot
│   │   │   │   │       ├── fa-solid-900.svg
│   │   │   │   │       ├── fa-solid-900.ttf
│   │   │   │   │       ├── fa-solid-900.woff
│   │   │   │   │       └── fa-solid-900.woff2
│   │   │   │   ├── simple-line-icons
│   │   │   │   │   ├── css
│   │   │   │   │   │   └── simple-line-icons.css
│   │   │   │   │   ├── fonts
│   │   │   │   │   │   ├── Simple-Line-Icons.eot
│   │   │   │   │   │   ├── Simple-Line-Icons.svg
│   │   │   │   │   │   ├── Simple-Line-Icons.ttf
│   │   │   │   │   │   ├── Simple-Line-Icons.woff
│   │   │   │   │   │   └── Simple-Line-Icons.woff2
│   │   │   │   │   ├── less
│   │   │   │   │   │   └── simple-line-icons.less
│   │   │   │   │   └── scss
│   │   │   │   │       └── simple-line-icons.scss
│   │   │   │   └── themify-icons
│   │   │   │       ├── fonts
│   │   │   │       │   ├── themify.eot
│   │   │   │       │   ├── themify.svg
│   │   │   │       │   ├── themify.ttf
│   │   │   │       │   └── themify.woff
│   │   │   │       ├── ie7
│   │   │   │       │   ├── ie7.css
│   │   │   │       │   └── ie7.js
│   │   │   │       ├── themify-icons.css
│   │   │   │       └── themify-icons.less
│   │   │   ├── custom.css
│   │   │   ├── login.css
│   │   │   ├── login.min.css
│   │   │   ├── pandalocker.min.css
│   │   │   ├── single-inspection.css
│   │   │   ├── style.css
│   │   │   ├── style.min.css
│   │   │   └── table.css
│   │   ├── img
│   │   │   ├── button-loader-f2f2f2.gif
│   │   │   ├── lock-icon.png
│   │   │   └── social-icons.png
│   │   └── js
│   │       ├── pages
│   │       │   ├── calendar
│   │       │   │   ├── cal-init.js
│   │       │   │   └── cal-init.min.js
│   │       │   ├── chartist
│   │       │   │   ├── chartist-init.css
│   │       │   │   ├── chartist-init.js
│   │       │   │   ├── chartist-init.min.js
│   │       │   │   ├── chartist-plugin-tooltip.js
│   │       │   │   └── chartist-plugin-tooltip.min.js
│   │       │   ├── chartjs
│   │       │   │   ├── chartjs.init.js
│   │       │   │   └── chartjs.init.min.js
│   │       │   ├── dashboards
│   │       │   │   ├── dashboard1.js
│   │       │   │   └── dashboard1.min.js
│   │       │   ├── datatable
│   │       │   │   ├── data.json
│   │       │   │   ├── datatable-basic.init.js
│   │       │   │   ├── datatable-basic.init.min.js
│   │       │   │   ├── datatable-inspections.js
│   │       │   │   ├── datatable-inspectors.js
│   │       │   │   ├── datatable-qr.js
│   │       │   │   └── datatable-recommended-jobs.js
│   │       │   └── morris
│   │       │       ├── morris-data.js
│   │       │       └── morris-data.min.js
│   │       ├── app-style-switcher.js
│   │       ├── app-style-switcher.min.js
│   │       ├── custom.js
│   │       ├── custom.min.js
│   │       ├── feather.min.js
│   │       ├── jquery.ui.highlight.min.js
│   │       ├── pandalocker.js
│   │       ├── pandalocker.min.js
│   │       ├── sidebarmenu.js
│   │       └── sidebarmenu.min.js
│   └── uploads
│       ├── images
│       └── resume
├── routes
│   ├── api
│   │   └── v1
│   │       ├── applicant.js
│   │       ├── company.js
│   │       └── jobs.js
│   └── web
│       └── applicant.js
├── services
│   ├── parser
│   │   ├── dataparser.py
│   │   └── parser.py
│   ├── similarity
│   │   └── compute.py
│   ├── authUtils.js
│   ├── database.js
│   ├── email.js
│   ├── generateApiKey.js
│   ├── jobRecommendation.js
│   ├── middleware.js
│   ├── resumeParser.js
│   ├── router.js
│   └── sessionUtils.js
├── views
│   ├── layout
│   │   ├── footer.pug
│   │   ├── head.pug
│   │   ├── header.pug
│   │   ├── main.pug
│   │   ├── preloader.pug
│   │   ├── scripts.pug
│   │   └── sidebar.pug
│   ├── all-jobs.pug
│   ├── dashboard.pug
│   ├── index.pug
│   └── recommended-jobs.pug
├── .gitignore
├── README.md
├── app.js
├── generate_structure.py
├── package-lock.json
└── package.json
</details>