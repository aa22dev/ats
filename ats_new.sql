SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ats`
--

-- --------------------------------------------------------

--
-- Table structure for table `allowed_origins`
--

CREATE TABLE `allowed_origins` (
  `allowed_origin_id` int(11) NOT NULL,
  `api_key_id` int(11) NOT NULL,
  `origin_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `allowed_origins`
--

INSERT INTO `allowed_origins` (`allowed_origin_id`, `api_key_id`, `origin_url`, `created_at`, `updated_at`) VALUES
(1, 1, 'https://digitalera.com.pk', '2024-06-27 07:12:10', '2024-06-27 07:12:10');

-- --------------------------------------------------------

--
-- Table structure for table `api_keys`
--

CREATE TABLE `api_keys` (
  `api_key_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `api_key` text NOT NULL,
  `subscription_plan` enum('free','basic','premium') NOT NULL DEFAULT 'free',
  `rate_limit` int(11) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `api_keys`
--

INSERT INTO `api_keys` (`api_key_id`, `company_id`, `api_key`, `subscription_plan`, `rate_limit`, `usage_limit`, `created_at`, `updated_at`) VALUES
(1, 1, 'DeMTMwNmFmYzhiZmQ4.RaATsYWQ2YWQ3YjY2NWQyMzMyZjU1ODVlMTc5MmI2NDhmMGRjNDFkOWY3NWI3YjE4YjRmOTM0M2YzODNjOGUzMGJlZDlhYzRkNGNjN2UwZGE5ZmE4MzhlZWVmZjk3OTY5YmRjMmRmM2JmODc2NTgwMzgyOGM4M2ZiMGQ3NWZiM2RlNDI', 'free', NULL, NULL, '2024-06-27 07:10:53', '2024-06-27 07:10:53');

-- --------------------------------------------------------

--
-- Table structure for table `api_request_logs`
--

CREATE TABLE `api_request_logs` (
  `log_id` int(11) NOT NULL,
  `api_key_id` int(11) NOT NULL,
  `request_url` varchar(255) NOT NULL,
  `request_method` enum('GET','POST','PUT','DELETE') NOT NULL,
  `request_headers` text DEFAULT NULL,
  `request_body` text DEFAULT NULL,
  `response_status` int(11) NOT NULL,
  `response_body` text DEFAULT NULL,
  `client_ip` varchar(45) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_usage`
--

CREATE TABLE `api_usage` (
  `usage_id` int(11) NOT NULL,
  `api_key_id` int(11) NOT NULL,
  `total_requests` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicants`
--

CREATE TABLE `applicants` (
  `applicant_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL DEFAULT 'Pakistan',
  `github` varchar(255) DEFAULT NULL,
  `linkedin_profile` varchar(255) DEFAULT NULL,
  `resume_url` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT '/uploads/dp/default.png',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applicants`
--

INSERT INTO `applicants` (`applicant_id`, `user_id`, `name`, `city`, `country`, `github`, `linkedin_profile`, `resume_url`, `profile_picture`, `created_at`, `updated_at`) VALUES
(1, 2, 'Aqib Hussain', 'Islamabad', 'Pakistan', 'https://github.com/aa22dev', 'https://linkedin.com/in/muhammadaqibhussainofficial', '/uploads/resume/2.pdf', '/uploads/dp/default.png', '2024-06-27 07:29:57', '2024-06-28 13:18:26'),
(10, 4, 'Aqib', '', 'Pakistan', 'https://github.com/aa22dev', 'https://linkedin.com/in/muhammadaqibhussainofficial', '/uploads/resume/4-1719936311204-782778988.pdf', '/uploads/images/4-1719957277419-815264118.png', '2024-07-02 16:05:30', '2024-07-02 21:54:37'),
(13, 5, 'Aqib Hussain', '', 'Pakistan', 'https://', 'https://linkedin.com/in/muhammadaqibhussainofficial', '/uploads/resume/5-1720049146860-654239300.pdf', '/uploads/images/5-1720049334917-497174949.png', '2024-07-03 23:26:35', '2024-07-03 23:28:54');

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `application_id` int(11) NOT NULL,
  `job_id` int(11) DEFAULT NULL,
  `applicant_id` int(11) DEFAULT NULL,
  `status` enum('applied','under review','rejected','hired') NOT NULL,
  `date_applied` date DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`application_id`, `job_id`, `applicant_id`, `status`, `date_applied`, `created_at`, `updated_at`) VALUES
(2, 3, 10, 'applied', '2024-07-03', '2024-07-03 15:36:03', '2024-07-03 15:36:03'),
(3, 3, 13, 'applied', '2024-07-04', '2024-07-03 23:35:32', '2024-07-03 23:35:32');

-- --------------------------------------------------------

--
-- Table structure for table `audit_trail`
--

CREATE TABLE `audit_trail` (
  `audit_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` enum('login','logout','job_posted','application_submitted') NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `company_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`company_id`, `user_id`, `company_name`, `company_email`, `created_at`, `updated_at`) VALUES
(1, 1, 'Digital Era', 'admin@digitalera.com.pk', '2024-06-27 06:57:53', '2024-06-27 06:57:53');

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `education_id` int(11) NOT NULL,
  `applicant_id` int(11) DEFAULT NULL,
  `degree` varchar(255) NOT NULL,
  `major` varchar(255) DEFAULT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `start_date` year(4) DEFAULT NULL,
  `end_date` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`education_id`, `applicant_id`, `degree`, `major`, `institution`, `start_date`, `end_date`) VALUES
(1, 1, 'Bachelor in Science', 'Computer Science', 'Institute of Space Technology', 2020, 2024),
(2, 1, 'Intermediate', 'Computer Science', 'PakTurk Maarif International School & College', 2018, 2020),
(3, 1, 'Matriculation', 'Computer Science', 'Muslim Hands School of Excellence', 2016, 2018),
(25, 10, 'BSc', 'Computer Science', 'Institute of Space Technology', 2020, 2024),
(26, 10, 'Intermediate', 'Computer Science', 'Pak-Turk Maarif International Schools and Colleges', 2018, 2020),
(27, 10, 'Matriculation', 'Computer Science', 'Muslim Hands School of Excellence', 2016, 2018),
(28, 13, 'Bachelor of Science - BS', 'Computer Science', 'Institute of Space Technology (IST)', 2020, 2024),
(29, 13, 'Intermediate', 'Computer Science', 'Pak-Turk Maarif International Schools and Colleges', 2018, 2020),
(30, 13, 'Matriculation', 'Computer Science', 'Muslim Hands School of Excellence', 2016, 2018),
(31, 13, 'Course', 'Operating Systems and You: Becoming a Power User', 'Coursera', 2023, 2023);

-- --------------------------------------------------------

--
-- Table structure for table `experience`
--

CREATE TABLE `experience` (
  `experience_id` int(11) NOT NULL,
  `applicant_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `start_date` year(4) DEFAULT NULL,
  `end_date` year(4) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `experience`
--

INSERT INTO `experience` (`experience_id`, `applicant_id`, `title`, `company`, `start_date`, `end_date`, `description`) VALUES
(19, 10, 'Developer', 'Wybe Network', 2018, 2023, 'Contributed to open-source projects, enhancing functionality and usability. Collaborated with the community to address issues and implement new features. Developed a discord bot using Discord.js for basic moderation tasks of guild. Developed documentation using docsify. Provided CDN using cloudflare pages for delivery of static assets.'),
(20, 10, 'WordPress Developer', 'KindTech Group', 2019, 2021, 'Designed and deployed multiple WordPress and WHMCS websites for clients. Conducted speed and on-site SEO optimizations to improve site performance and visibility. Managed server configurations and SSL certificate installations. Managed Plesk and cPanel servers.'),
(21, 10, 'Full Stack Web Developer', 'FixLife', 2022, 2022, 'Designed and developed an appointment management system using NuxtJS, PHP, and MySQL. Implemented automated re-scheduling of weekly and monthly appointments using cron jobs. Integrated Stripe for secure payment processing. Deployed oracle compute engine and managed it for hosting website. Installed and managed websites using CloudPanel.'),
(22, 13, 'Developer', 'Wybe Network', 2018, 2023, NULL),
(23, 13, 'Web Developer', 'FixLife', 2022, 2022, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `job_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `requirements` text DEFAULT NULL,
  `education` varchar(255) NOT NULL,
  `experience` varchar(255) NOT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `status` enum('active','closed') NOT NULL DEFAULT 'active',
  `deadline` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`job_id`, `company_id`, `title`, `description`, `requirements`, `education`, `experience`, `salary`, `status`, `deadline`, `created_at`, `updated_at`) VALUES
(1, 1, 'Web Developer', 'We seek a skilled Web Developer to join our industry-leading team. You will work in a fast-paced environment to develop high-quality, responsive websites and web applications. The ideal candidate has 5+ years of experience, mastery of modern frameworks, and a portfolio showcasing previous work.', '<li>5+ years of web development experience</li>\n<li>Proficiency in modern frameworks (e.g., React, Angular, Vue.js)</li>\n<li>Strong HTML, CSS, and JavaScript skills</li>\n<li>Responsive design</li> expertise\nPortfolio demonstrating previous web development projects</li>', 'Bachelor in Science in Computer Science', '2 Years', '150000.00', 'active', '2024-07-31', '2024-06-29 11:58:25', '2024-06-29 18:39:24'),
(2, 1, 'Front-End Web Developer', 'Join our dynamic team as a Front-End Web Developer! You’ll collaborate with designers and back-end developers to create visually appealing and user-friendly websites. Proficiency in HTML, CSS, JavaScript, and responsive design is essential.', '<li>Proficiency in HTML, CSS, and JavaScript</li>\r\n<li>Experience with front-end frameworks (e.g., Bootstrap, Material-UI)</li>\r\n<li>Responsive design skills</li>\r\n<li>Strong attention to detail</li>', 'Bachelor in Science in Computer Science', '2 Year', '100000.00', 'active', '2024-07-31', '2024-06-29 12:00:20', '2024-06-29 12:25:55'),
(3, 1, 'Full-Stack Web Developer', 'We’re hiring a Full-Stack Web Developer to build end-to-end web solutions. You’ll work on both front-end and back-end development, integrating databases, APIs, and user interfaces. Proficiency in multiple programming languages and frameworks is required.', '<li>Proficiency in both front-end (HTML, CSS, JavaScript) and back-end (Node.js, Python, PHP, etc.) development</li>\r\n<li>Experience with databases (e.g., MySQL, MongoDB)</li>\r\n<li>Knowledge of RESTful APIs</li>\r\n<li>Strong problem-solving skills</li>', '', '', '150000.00', 'active', '2024-07-31', '2024-06-29 12:22:41', '2024-06-29 12:25:09');

-- --------------------------------------------------------

--
-- Table structure for table `job_skills`
--

CREATE TABLE `job_skills` (
  `job_skill_id` int(11) NOT NULL,
  `job_id` int(11) DEFAULT NULL,
  `skill_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_skills`
--

INSERT INTO `job_skills` (`job_skill_id`, `job_id`, `skill_id`) VALUES
(1, 1, 4),
(2, 1, 5),
(3, 1, 6),
(4, 1, 7),
(5, 1, 3),
(6, 1, 15),
(7, 1, 14),
(8, 1, 7),
(9, 2, 4),
(10, 2, 5),
(11, 2, 6),
(12, 2, 17),
(13, 2, 18),
(14, 3, 4),
(15, 3, 5),
(16, 3, 6),
(17, 3, 3),
(18, 3, 21),
(19, 3, 2),
(20, 3, 19),
(21, 3, 20);

-- --------------------------------------------------------

--
-- Table structure for table `psychometric_meta`
--

CREATE TABLE `psychometric_meta` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `meta_name` varchar(255) NOT NULL,
  `meta_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `psychometric_meta`
--

INSERT INTO `psychometric_meta` (`id`, `test_id`, `meta_name`, `meta_value`) VALUES
(1, 1, '1', 'Introvert'),
(2, 1, '2', 'Extrovert');

-- --------------------------------------------------------

--
-- Table structure for table `psychometric_options`
--

CREATE TABLE `psychometric_options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_text` varchar(255) NOT NULL,
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `psychometric_options`
--

INSERT INTO `psychometric_options` (`id`, `question_id`, `option_text`, `score`) VALUES
(1, 1, 'Spending time with friends or going out.', 2),
(2, 1, 'Reading, listening to music, or being alone.', 1),
(3, 2, 'A busy schedule with lots of social events.', 2),
(4, 2, 'A quiet weekend at home with a good book.', 1),
(5, 3, 'A big party with lots of people.', 2),
(6, 3, 'A quiet celebration with a few close friends or family.', 1),
(7, 4, 'Energized and excited.', 2),
(8, 4, 'Exhausted and drained.', 1),
(9, 5, 'Frequently, several times a day.', 2),
(10, 5, 'Less often, a few times a week is enough.', 1),
(11, 6, 'In a team, I love collaborating.', 2),
(12, 6, 'Independently, I need space to focus.', 1),
(13, 7, 'I love exploring new experiences.', 2),
(14, 7, 'I prefer familiar activities and routines.', 1),
(15, 8, 'Talking to friends or going out for a fun activity.', 2),
(16, 8, 'Spending time alone in quiet reflection or engaging in a solitary hobby.', 1),
(17, 9, 'Yes, I like being the life of the party.', 2),
(18, 9, 'No, I prefer to blend in and observe.', 1),
(19, 10, 'I love it, it\'s a great way to share my ideas.', 2),
(20, 10, 'I dread it, it makes me anxious.', 1),
(21, 11, 'I love driving, it gives me freedom to explore.', 2),
(22, 11, 'I prefer walking or public transport, it\'s a time to reflect.', 1),
(23, 12, 'It doesn\'t bother me, I can easily switch tasks.', 2),
(24, 12, 'It\'s very distracting, I need time to refocus.', 1),
(25, 13, 'I like to have a plan, but I\'m also open to spontaneity.', 2),
(26, 13, 'I prefer to have a plan and stick to it.', 1),
(27, 14, 'I\'m eager to learn and share it with others.', 2),
(28, 14, 'I need time to process it and reflect before sharing.', 1),
(29, 15, 'I enjoy making conversation with strangers.', 2),
(30, 15, 'I find it superficial and prefer deeper conversations.', 1),
(31, 16, 'Yes, I\'m outgoing and approachable.', 2),
(32, 16, 'No, it takes time for me to warm up to people.', 1),
(33, 17, 'I enjoy my own company but I also need social interaction.', 2),
(34, 17, 'I value my alone time and find it rejuvenating.', 1),
(35, 18, 'I thrive in a lively, bustling atmosphere.', 2),
(36, 18, 'I need quiet and focus to be productive.', 1),
(37, 19, 'I\'m more of a morning person, I feel energized early.', 2),
(38, 19, 'I\'m a night owl, I\'m most productive later in the day.', 1),
(39, 20, 'I prefer some structure, but I\'m open to adjustments.', 2),
(40, 20, 'I need a clear routine to feel organized.', 1),
(41, 21, 'I jump right in and learn as I go.', 2),
(42, 21, 'I prefer to research and plan before taking action.', 1),
(43, 22, 'Yes, I love the thrill of competition.', 2),
(44, 22, 'No, I prefer cooperative or solitary activities.', 1),
(45, 23, 'I take it in stride and use it as an opportunity to improve.', 2),
(46, 23, 'I\'m sensitive to criticism and it can affect my confidence.', 1),
(47, 24, 'I learn best by doing, hands-on experiences.', 2),
(48, 24, 'I prefer to learn through reading and reflecting.', 1),
(49, 25, 'I express my emotions openly and directly.', 2),
(50, 25, 'I\'m more reserved and prefer to process emotions privately.', 1),
(51, 26, 'I\'m comfortable in large groups, I feel energized by the energy.', 2),
(52, 26, 'Large crowds make me feel overwhelmed and claustrophobic.', 1),
(53, 27, 'I\'m direct and assertive, I try to resolve conflicts quickly.', 2),
(54, 27, 'I\'m more reserved and avoid confrontation if possible.', 1),
(55, 28, 'I\'m comfortable sharing my feelings with close friends and family.', 2),
(56, 28, 'I prefer to keep my feelings private and process them on my own.', 1),
(57, 29, 'I adapt quickly and embrace new challenges.', 2),
(58, 29, 'I need time to adjust and feel comfortable in new environments.', 1),
(59, 30, 'I seek out social support and distractions.', 2),
(60, 30, 'I prefer to withdraw and find solitude to process my emotions.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `psychometric_questions`
--

CREATE TABLE `psychometric_questions` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `question` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `psychometric_questions`
--

INSERT INTO `psychometric_questions` (`id`, `test_id`, `question`) VALUES
(1, 1, 'How do you typically recharge after a busy day?'),
(2, 1, 'Which statement best describes your ideal weekend?'),
(3, 1, 'What\'s your preferred way to celebrate a birthday?'),
(4, 1, 'How do you typically feel after a large social gathering?'),
(5, 1, 'How often do you need to talk to someone to feel connected?'),
(6, 1, 'Do you prefer working on a project independently or with a team?'),
(7, 1, 'How do you feel about trying new things?'),
(8, 1, 'What\'s your go-to activity for stress relief?'),
(9, 1, 'Do you enjoy being the center of attention?'),
(10, 1, 'How do you feel about public speaking?'),
(11, 1, 'What\'s your preferred mode of transportation?'),
(12, 1, 'How do you feel about being interrupted while working?'),
(13, 1, 'Do you prefer to plan your activities in detail or go with the flow?'),
(14, 1, 'How do you typically react to new information?'),
(15, 1, 'How do you feel about small talk?'),
(16, 1, 'Do you find it easy to make new friends?'),
(17, 1, 'How do you feel about being alone?'),
(18, 1, 'Do you prefer to work in a busy or quiet environment?'),
(19, 1, 'Do you think of yourself as a morning person or a night owl?'),
(20, 1, 'Do you prefer a structured routine or a more flexible schedule?'),
(21, 1, 'How do you typically approach a new challenge?'),
(22, 1, 'Do you enjoy playing competitive games?'),
(23, 1, 'How do you feel about receiving criticism?'),
(24, 1, 'Do you prefer to learn by doing or by reading?'),
(25, 1, 'How do you typically express your emotions?'),
(26, 1, 'How do you feel about being in large crowds?'),
(27, 1, 'How do you typically handle conflict?'),
(28, 1, 'Do you feel more comfortable sharing your feelings with others or keeping them to yourself?'),
(29, 1, 'Do you find it easy to adapt to new situations or do you need time to adjust?'),
(30, 1, 'How do you typically respond to stress?');

-- --------------------------------------------------------

--
-- Table structure for table `psychometric_responses`
--

CREATE TABLE `psychometric_responses` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `psychometric_responses`
--

INSERT INTO `psychometric_responses` (`id`, `applicant_id`, `test_id`, `question_id`, `option_id`) VALUES
(2, 4, 1, 1, 2),
(3, 4, 1, 2, 4),
(4, 4, 1, 26, 52),
(5, 4, 1, 4, 8),
(6, 4, 1, 30, 60),
(7, 4, 1, 14, 27),
(8, 4, 1, 13, 25),
(9, 4, 1, 8, 16),
(10, 4, 1, 9, 18),
(11, 4, 1, 19, 37),
(12, 5, 1, 1, 2),
(13, 5, 1, 2, 4),
(14, 5, 1, 26, 52),
(15, 5, 1, 4, 8),
(16, 5, 1, 30, 60),
(17, 5, 1, 14, 27),
(18, 5, 1, 13, 25),
(19, 5, 1, 8, 16),
(20, 5, 1, 9, 18),
(21, 5, 1, 19, 37);

-- --------------------------------------------------------

--
-- Table structure for table `psychometric_tests`
--

CREATE TABLE `psychometric_tests` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `psychometric_tests`
--

INSERT INTO `psychometric_tests` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Extraversion/Introversion', 'Psychometric Tests for Extraversion/Introversion', '2024-07-03 11:05:39');

-- --------------------------------------------------------

--
-- Table structure for table `recommendations`
--

CREATE TABLE `recommendations` (
  `id` int(11) NOT NULL,
  `applicant_id` int(11) DEFAULT NULL,
  `job_id` int(11) DEFAULT NULL,
  `score` float DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recommendations`
--

INSERT INTO `recommendations` (`id`, `applicant_id`, `job_id`, `score`, `created_at`, `updated_at`) VALUES
(1, 10, 3, 0.925, '2024-07-03 10:02:04', '2024-07-03 10:02:04'),
(2, 10, 2, 0.9, '2024-07-03 10:02:04', '2024-07-03 10:02:04'),
(3, 10, 1, 0.675, '2024-07-03 10:02:04', '2024-07-03 10:02:04'),
(4, 13, 3, 0.7, '2024-07-03 23:32:38', '2024-07-03 23:32:38'),
(5, 13, 2, 0.54, '2024-07-03 23:32:38', '2024-07-03 23:32:38'),
(6, 13, 1, 0.45, '2024-07-03 23:32:38', '2024-07-03 23:32:38');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `token` longtext NOT NULL,
  `expiration_time` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `user_id`, `token`, `expiration_time`, `created_at`, `updated_at`) VALUES
(3, 2, 'sqYogEiy9rd8A_lI2s3jr6uLyvExzNUeDUPWydKW0KBzprUw2h1kcvVJaTr6fnwIgAtjI8mICH-Mcw3JtsKso_Idk0DVTP8qBkMN3p5WBq4154g7gEO7YMyYKh65ghtj8Tp-7tcItXxRA2aEP0wAKw%MTI4LTIy%kAa0CLI7Clnywrj0zdXBVA', '2024-06-29 14:34:16', '2024-06-28 09:34:16', '2024-06-28 09:34:16'),
(4, 2, 'ppiDct99rfjJHIiFSxBE957WShAJupcWqxnaqVL14B-9sRmFGh3wyLj2Hlk43QDsQudpAEY7TTCBEQJ3uYGnsnT_7x1OkLGnjojK913L4tn5sIwc4az46462vs2oRfwdwXi6iPbaEzEj0R5eAp_zxg%MTI4LTIy%vX9hoKx7dTFzwKjEcxItyw', '2024-06-30 15:11:49', '2024-06-29 10:11:49', '2024-06-29 10:11:49'),
(5, 4, 'sEz0d7KNGAcvpadCGnFOKTCI_eaofSMhgMDhs_z0yJRtdrSDrqldc4DX1kYta50DTRymmf9N_hHg7FeFlDZ9arGi3hRjGn_35ChK78VOkAHaZtJQZKDnc8rTviOpH4LYj_38G8q-zx3a-TXCyddUDg%MTI4LTIy%OkYVcxzCsMke6keQmm5dBw', '2024-07-02 11:58:13', '2024-07-01 06:58:13', '2024-07-01 06:58:13'),
(6, 4, 'sSFvJfUgP2lwsVjmIHzU0KW2mV8UJYUutOCTRYs9zZcdUZBnC28j3pBOAQXHU1vFUMvNIVyvO6dTzkYtZlHVSkTYVFaUhRrMU5c7NNWdVXUmBFJ_luebWny7TIXMbNXfXKKZsWaqiyrbIaositDI8A%MTI4LTIy%akkOTbuyY2vZBGadrUUw0w', '2024-07-03 18:44:30', '2024-07-02 13:44:30', '2024-07-02 13:44:30'),
(7, 4, '4UiaIWHRj06ibAbYJMsai8KNAA_TC3jW0qbmPgjTZUMZencSKjlruf3AbA5OOU-CnbIx5quWBCSHmSw2sGKn_fFsPkapNB71Tt90lhVyw761TSIKiJp3hlQz0v7CMe4VNVhV52nJV9l5GwgjPExEfg%MTI4LTIy%ihhWFkt5O-b7wq0akcEoiQ', '2024-07-04 19:41:05', '2024-07-03 14:41:05', '2024-07-03 14:41:05'),
(8, 4, 'tkQ4VO2sUeur73aJP1rDAdL2NKxuqSM5SNJl66OsOaLtvLflceO04ecOZd2PG7B3smBBKiTVbnhVkMa3FgsM73DkVJHFu2gixLC7IXQM8sq7skT6ff7u3lm2rNJXPYVbYDnNJznRlNrn1P47SpGbfA%MTI4LTIy%lRpC8lFLdOTisZ1Gkp4C1Q', '2024-07-04 22:33:02', '2024-07-03 17:33:02', '2024-07-03 17:33:02'),
(9, 4, 'h6G7sUxPKinhxke8xeHMq_YXBFm8eYbGw5qMA8gi4MbZPIGftlU1BbuoTCX6nVr0a4aFkqFkkOqOAN9k8ar814Oove6L8JxMHJoA5xDGNPaccabfsOz1NGwCdAJ04UFnlVJ5-rBlcpqzy_9P4iTX6g%MTI4LTIy%Vp2TGBEvjoxSqyUPyY1m3Q', '2024-07-04 22:40:50', '2024-07-03 17:40:50', '2024-07-03 17:40:50'),
(10, 4, 'nn5G_5tqFVgjmBQc7q0ndq9S-DKnP8g2UdWmtIuWtQ-7NZeLq9-0yTgOG9erFRcyZc62HcxnBPm6JHEVlxICSmeU2tsG3sn_z3NA62wQoBGkaj__i9q1bDcNHfe8FW-7FeT92raCAqj7Z31Zg17fgw%MTI4LTIy%XavA9QICfmpgEEGdlWkhdQ', '2024-07-04 22:41:58', '2024-07-03 17:41:58', '2024-07-03 17:41:58'),
(11, 4, 'pKQzV9iqfd5UA5Xo-7ZZbdIdFO6X4ZOLDlKQZ6YflgRWIwlZzG6WT-xiwrVwEHwKchOgcQeo7w5af7yCyZwuKNselqCC3K8whyd7N9hRE6gLOB8YuUBK8__9OwwP_4jZmyZy1SHp1onwqbuIIYERkg%MTI4LTIy%H_Ca25RfveaX7HqdXwtpyw', '2024-07-04 22:46:18', '2024-07-03 17:46:18', '2024-07-03 17:46:18'),
(12, 4, 'z5w0cJcxwFb2kHBJag4uioM5KvD3_ACFKAaY2zTY2CqNojZOuYKSFbqKr7A8-fmQ_425kjSlIvIfVhAeUdZ0m6lpF_crmN-j4ReyRlr4q_M_Z5qQ-uApmSuzOzl-3CvETD7T7uyDyn-hzqRE2Tpccg%MTI4LTIy%3VIzSfDMsALyC-G2S1gOBA', '2024-07-04 22:59:04', '2024-07-03 17:59:04', '2024-07-03 17:59:04'),
(13, 4, 'mwJKyBdNyO_4kFyHWwa5ewposlwTM7EU7dmGgTLd1RSb8dnZw4uKOhle0PWI3EcLQu3hpRDTn-3RQjJ1rk81mucSVIklumEDUZeNaYBVOFbxewSQeUsKITVrjSZV3LKTWBptz-6jlNdgopTBFFYBsg%MTI4LTIy%8mdNmjkItsrYvtJ21R04iw', '2024-07-04 23:00:47', '2024-07-03 18:00:47', '2024-07-03 18:00:47'),
(14, 4, 'beMOsVj4fSrAEGjdLcHB3vUKn_f8CYkVRb9HhPJ_RWbH7KZ5s0hcYn4FFDp0XMj5Vp6DPjRLnV2ogI1mv7cPEAtsoXGqggdMuMlSVEOUS5exgWJqchXl-nXeiDkC0DLogxpCHM1JeySq3wAkPEyu3A%MTI4LTIy%U3POx0or1YtKd8pT7yTOCw', '2024-07-04 23:01:04', '2024-07-03 18:01:04', '2024-07-03 18:01:04'),
(15, 4, 'zgkJswB3k2MT-NuN1hFIq1JGMDNZXL0ybwavw2PYp-t2YU_q9ZuvPahb_AuCWWi057OFxA4LayCqq1vipBEiW4PqvRFcqzyJ839aWReVkb_3-jg5jbuPtFVAWggSYM0is17h5L3eFwgyVtNyT4Ppog%MTI4LTIy%7_QbnoR0-ZgTLFbhhrrxqA', '2024-07-04 23:02:01', '2024-07-03 18:02:01', '2024-07-03 18:02:01'),
(16, 4, '2jVmKGJMy899m_rNv117MQC4sN7mjFx8HpdUtdtJazxyA7xrSpXgZw_WXPiJxAM6xX7w8OWIEmJYZDnB8G74Z0OHX76RAyPQ2twOki180gVw8lIBEHZ6FmBpYTf2tsjRuri7vEkNHsvq0nVTDc7JJg%MTI4LTIy%PnNR6_TijcQ7r83YtLVXpg', '2024-07-04 23:02:26', '2024-07-03 18:02:26', '2024-07-03 18:02:26'),
(17, 4, '-KmA-A0PZfZCF_L0Tt0mfU4oRtTCSgDb5WOYIAf1T6dvriFFiKMWq3VSFFYmWjlDj76eIYfwyiJbijuJktgYGEAFhxy_yDo_gsRz4RkEysxTIpQC3OspvfGAAHsZvoNq4KiQMU9xOw4DuTKbuPJk_g%MTI4LTIy%ZyweB6splkMSU2u7HTRLow', '2024-07-04 23:03:23', '2024-07-03 18:03:23', '2024-07-03 18:03:23'),
(18, 4, '2-d29UqFMGnAPyKSt0mwzkJnZCi2fvxkrnbopvsyMmBBGCe8R-fEYS3X1Ya34xXKiB_INQKYQfapKZ8p9P29MlS6X7QcsYDtpTwiLpP73xZElqQs2-XcAiPCZCIndg2j-mAdkc7VBanjrrZlppcNUg%MTI4LTIy%QTk-7MLlP6i4FcMaadydxw', '2024-07-04 23:04:16', '2024-07-03 18:04:16', '2024-07-03 18:04:16'),
(19, 4, 'csheEv2fufM0hhQ4x4NbrJjzFJLPl0P7e0F42T7o6imV-r8vO33VT1_yXCzIAE-ZQm_HDiouI-bkxI8ts2stx2fH5SJIU8-pqRaYeTQOQYHpgatzHHMgT9j6W4RIMG6Mh5EPvd0481sz2-EcEWhDsA%MTI4LTIy%90UEmVsiO34uDazQ13Yb4Q', '2024-07-04 23:04:44', '2024-07-03 18:04:44', '2024-07-03 18:04:44'),
(20, 4, '-pRw2R71afBFK3WFK94boWeJ4yYRs9cAMVQRUsNe1VCvYchKKSb1YcqNTEYy7agpxyHJb73QL-bbT-Y6Y6VsDTGKs3bF2w_fvCrAm00JYEE7pL70Y9dzdVp1mVBbZZ1kGYkgs9a0i7yBx9p7A9BxpQ%MTI4LTIy%yQhbP4A5jPt_I4l-RnNJyA', '2024-07-04 23:05:17', '2024-07-03 18:05:17', '2024-07-03 18:05:17'),
(21, 4, 'tpyBtyBUs397j_Qr7N1-gGo67KrIaiOOmv-OFd6TqqpwrMG0HHEPJyyeLOOX1fTTUdrWRnYy0n9neeCy8TFiNHc_8ousUcjvItQ3euDZ01qeFUE0B89UsSSG2wnedRrshqCimKpn9nmpRJnsyJo0oA%MTI4LTIy%HVNf1q36DGblyI9eU41LdA', '2024-07-04 23:05:51', '2024-07-03 18:05:51', '2024-07-03 18:05:51'),
(22, 4, '-KQxoFieYpvgD-158fmFogNJRH9XvH786QjKO0iUXGH22RjEcEGJDwJMwvbeyETUuSnU9dx7glCPCVkLmIVy8q2olM3ZNz6ihb5tm8Y_wjtSS1P43QwocDjmXy94t91vbvnYXGUAdG7erQc3N2EJ1Q%MTI4LTIy%uMl34A_6PzmjWwIV8HH8jg', '2024-07-04 23:27:58', '2024-07-03 18:27:58', '2024-07-03 18:27:58'),
(23, 4, '7JCfnV2a0MlPDja2tVKEVoniI7glQeyQ5CFZqJvGBhZ7kNlU-kbn0uCbIim2pmiNo-1SXnFlKpPS1XgrxoCvH4yP-rBuw917Umq4DKxDgwqV0bM7RWO2TpMRWqgUAZvedMUsau-3tnLMwi4gcJbCeg%MTI4LTIy%wKIDdL0IrPtWP_lKmazaVA', '2024-07-05 03:41:12', '2024-07-03 22:41:12', '2024-07-03 22:41:12'),
(24, 4, '6A6IJPwioY5sOPLhMiSPPEhQMcf5L5wHPc6AZepWXy3n2cgjSXRwSspA1eXYInM1d5_ChnJWLT9cA8Kg0JlDjTETuhw7UnQBGkBS9v_Kry9t6NTj-cYbG07SwK70vTMGhWXnrdsuPmnUBwhQfLDY3A%MTI4LTIy%L9Zj2rBqpxhXKlRwjfxY7Q', '2024-07-05 03:41:31', '2024-07-03 22:41:31', '2024-07-03 22:41:31'),
(25, 4, '_tAlJGhSnqPJmxrw12_H779PE5PE6rC7EsPpGg4vwDgtQwbomf_MnluxEG_dtMJpHn1hk339c0KqOt-j9esvz12TD-uX0_4sDkZfBlGNHaRmuK3Dlxe2PFtBgBKbAQCwmEOjt5MF_R2Z00QED4PuiA%MTI4LTIy%1AOBqLPuXtjJslyOB_B24A', '2024-07-05 03:42:21', '2024-07-03 22:42:21', '2024-07-03 22:42:21'),
(26, 4, '8mILquU1qet4b8ePDVSlbXnAz62cXKsdXZoZQ_5KiOZ0ydRb2ojgkgmvk1Cs0ZsZz1avPLIFI7IvHPBN2gEjwXhHrx0KpIdMhVP9zSWwZcTUIOwkIGVgtDDrZsthY54JNR1gpQMv_t8b4ix8dKtKsQ%MTI4LTIy%W90iEYDwuYK0BLH6QpA8GA', '2024-07-05 03:42:57', '2024-07-03 22:42:57', '2024-07-03 22:42:57'),
(27, 4, 'HmZ_65pz5Ng4SAiyE2vr5tvaIQvklFKwsE8TC3Yw0CNhsi6fPMtMgCkTTDv5WIeJKBusRSRiMpZMdKj1mvC9uJuvL1v6CBBjjkgcrh-J1G4zx18FYIba4qxD7hLCwyPFuPgxjrYDxky0Tyq9r1dpDQ%MTI4LTIy%PLUsZ11KJLDiCN1ZyLfXOw', '2024-07-05 03:45:52', '2024-07-03 22:45:52', '2024-07-03 22:45:52'),
(28, 4, 'gNkrODujUMuUDsISvSR_Ft8lsCf11PDosYKwzYkTwAdB5HB3noDbzmYmEqrlKulo91tIHjTZ3F1igGVselN-PX4R-keidKdGf5P-fYg6USayW9vMXfKx6WFVlRfP9jNsaZgXnXxhnRh_4VC-_67cpQ%MTI4LTIy%5_8Ve2ShEgs2hXu1mDGBDA', '2024-07-05 03:49:05', '2024-07-03 22:49:05', '2024-07-03 22:49:05'),
(29, 4, 'jDx8ksy8huB7PXoC8O69s_XR8FSTkSt6zW8OScV1jdj9zFdJeNgNl5EAdPQlwHSgQ4P7z_y2qnVza7AAICmzgdObJbmBj10aNflNViqE0PU1ElJR5bH-er8n4ChbNDXSq85fMpkhNPU9fnpmk9hbXw%MTI4LTIy%05gn5qDlj0K8J0GAuHlxlw', '2024-07-05 03:49:19', '2024-07-03 22:49:19', '2024-07-03 22:49:19'),
(30, 4, 'Y7gze_Vz3Q3co-SnIVZ8iTRqukNSNnMsOQHzH61eo2ooSTR0f8ylU9y3QaTGtN-K75U3jYlDDAM-GF20iK_-myUeouzqx5RT-ihPCfabXEg9BtQZ-2cKYvW_0MYQ8Fr6sscbdDIngvLcWtsY7se-Sg%MTI4LTIy%1Zk2lEbxVrO2cUhk648wfQ', '2024-07-05 03:51:32', '2024-07-03 22:51:32', '2024-07-03 22:51:32'),
(31, 4, '2D98X_y1zr3VucWdxXc_fjE2MI0DRC1tKSbOUiqxbq15VePhUMLnci8G9Ho9HLPXSvHSjyXN7b1UB0eIQWLzq7YmOkptv7GGFDFD0FY2N9Te3LCmUqMSopte6zgzFwu66iG2yfY6pSt_YdKQR2mvPw%MTI4LTIy%L0n5Q_NJ0cvfRV2Fsqx5yA', '2024-07-05 03:55:03', '2024-07-03 22:55:03', '2024-07-03 22:55:03'),
(32, 4, 'fV5-3wuendY1xcWXa8ITveA1pTxezbOlpih1KSmNeZkfKQt6TKeL3Nim5mPrp-VQn3Vz2MFgByJ-uDu_1OE660yylJskdvwRcJ7ss_5ke4SoWHX533rk0feHG1mH-QyIKyOk9WioQIRnG1SGGfWSfA%MTI4LTIy%KzkP7QujsejXiUYqYt5A6Q', '2024-07-05 03:57:00', '2024-07-03 22:57:00', '2024-07-03 22:57:00'),
(33, 4, 'nKhMUtNB4mMy2qeyZCIplDSyYsDK-dU4FwoXlKHAFoAZgp-dFwffMKnmsVBr3EchI-HN7TPVuSYubzTuvGzj7N5DQmkCsvvjFTte_0paxOghStRXHWb70ardI9sM2X1szbQsQqaFNzX3Vfmxk7GFHw%MTI4LTIy%P069XIkiG79coHpPvfoC3Q', '2024-07-05 04:04:05', '2024-07-03 23:04:05', '2024-07-03 23:04:05'),
(34, 4, 'Plo1qDfhfz-S-00AL-3Kq8lhIuK2ALEH6dPu8H1CUsd11chwIdjdC4gEg56MCbsLYbeVf0QpgL8LI3FxHXKtTxNtFL9Mw28U8SfitHGkYjOoReXMCORp-H81olFaBI6CRGi3cfh64Xgsap23Ud7A_A%MTI4LTIy%s-tqhu2jq4xYM91FbCskgg', '2024-07-05 04:22:27', '2024-07-03 23:22:27', '2024-07-03 23:22:27'),
(35, 5, 'k6NEVWugbDad5X57dl5JPOr_PSRXEE7qLPzUsJ68k5MhpLE0UgjY0FQRfDJU8d7nq7RJH3QhMHW6TYWH-ZdwBJeWOZPHBPUZ1ajJhwIcAxN1-ZcVEnrcXe4p7rIYZLr0k_VSWXjH7H47H_1R2wy57g%MTI4LTIy%DtcbaDhXhqmlkGsGhSBDRA', '2024-07-05 04:24:25', '2024-07-03 23:24:25', '2024-07-03 23:24:25'),
(36, 4, 'aPVG7nk-YBaRvqd14Uho4_DPt0VKUxLNYaz_DFCIv5YGBTGqBcd00GLMbO89DxxqSNRmzsOJjHGL4YH9sVZ1zoHVIqr6964uUQt5t1xY60a9-9KM91SdaZMr7i7fw6ugdHwrltYGqKE6-0_MMH6Omw%MTI4LTIy%Rxl5Z3m9qxw-47rhATzztQ', '2024-07-05 04:57:10', '2024-07-03 23:57:10', '2024-07-03 23:57:10'),
(37, 4, '8Syl0vz0U42JgvGaa82OwMK7eaz5irDjA-8GY1nwl38AEGFl6rDGByRO3fuHd4S0Wd0Pklf6AJmwxiRj14kvj0fO7d09McWPdMfSkIN44PrcZFaxxchxjniRsMaOldcVAy4Ud1ZaijRQfLSlxf-qyw%MTI4LTIy%vM-m-LlbjRsUvILDvrVzaQ', '2024-07-05 09:58:53', '2024-07-04 04:58:53', '2024-07-04 04:58:53');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `skill_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`skill_id`, `name`) VALUES
(1, 'C++'),
(2, 'Python'),
(3, 'NodeJS'),
(4, 'HTML'),
(5, 'CSS'),
(6, 'JS'),
(7, 'Website Development'),
(8, 'Information Security'),
(9, 'Artificial Intelligence'),
(10, 'Computer Vision'),
(11, 'Network Security'),
(12, 'Server Administrator'),
(13, 'DNS'),
(14, 'ReactJS'),
(15, 'AngularJS'),
(16, 'VueJS'),
(17, 'Bootstrap'),
(18, 'Material-UI'),
(19, 'MySQL'),
(20, 'MongoDB'),
(21, 'PHP'),
(22, 'NuxtJS'),
(23, 'JavaScript'),
(24, 'Node.js'),
(25, 'C/C++'),
(26, 'SQL'),
(27, 'Kotlin'),
(28, 'XML'),
(29, 'Sass'),
(30, 'Nuxt.js'),
(31, 'Discord.js'),
(32, 'Pug.js'),
(33, 'Express.js'),
(34, 'Flask'),
(35, 'Pandas'),
(36, 'NumPy'),
(37, 'Matplotlib'),
(38, 'FastAI'),
(39, 'Scikit-Learn'),
(40, 'cPanel'),
(41, 'WHM'),
(42, 'Plesk'),
(43, 'CloudPanel'),
(44, 'Netlify'),
(45, 'Cloudflare'),
(46, 'GitHub Actions'),
(47, 'Aiven.io'),
(48, 'Google Cloud'),
(49, 'AWS'),
(50, 'Render'),
(51, 'Git'),
(52, 'Terraform'),
(53, 'JIRA'),
(54, 'Wireshark'),
(55, 'IDA'),
(56, 'Java Decompiler'),
(57, 'VS Code'),
(58, 'Android Studio'),
(59, 'PyCharm'),
(60, 'WordPress'),
(61, 'WHMCS'),
(62, 'Shopify'),
(63, 'Agile'),
(64, 'SCRUM'),
(65, 'AI Model Training'),
(66, 'Mobile App Development'),
(67, 'Discord Bot Development'),
(68, 'Reverse Engineering'),
(69, 'Virus Analysis'),
(70, 'Object-Oriented Programming (OOP)'),
(71, 'Computer Science'),
(72, 'HTML5');

-- --------------------------------------------------------

--
-- Table structure for table `smtp_configurations`
--

CREATE TABLE `smtp_configurations` (
  `config_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `smtp_host` varchar(255) NOT NULL,
  `smtp_port` int(11) NOT NULL,
  `smtp_username` varchar(255) NOT NULL,
  `smtp_password` varchar(255) NOT NULL,
  `smtp_secure` enum('none','ssl','tls') NOT NULL DEFAULT 'none',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `setting_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `setting_name` varchar(255) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('applicant','employer','company','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `company_id`, `username`, `email`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
(1, NULL, 'digitalera', 'admin@digitalera.com.pk', '$argon2id$v=19$m=65536,t=3,p=4$wyVKJS/a48Dg6CJgoTqdLw$iE/kUbY24WKuqtoRd/Bw8AlHOPdkLS2XjZaMkFm1/Tw', 'company', '2024-06-27 06:57:07', '2024-06-30 11:01:28'),
(2, 1, 'aqib', 'aqibhussain2001@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$UR99Lg64yVgpjsmoX0NzkA$L4Lri1BHOb+BLRSpFlFL0AtmqrUADQdE8zfjHmbnZr8', 'applicant', '2024-06-27 07:26:52', '2024-06-30 11:01:25'),
(4, 1, 'aqib2001', 'aqibhussain2001.work@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$akL8PbIjGN45Qd0LtfJ+Gw$6YkHZ0zGdqZ/th5a60h8cCYKc+38x8zK6GHAXE8lajk', 'applicant', '2024-06-30 14:13:16', '2024-07-02 20:47:07'),
(5, 1, 'aqib20012', 'aqibhussain2001.uni@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$x6TCgoMcxKFzY4FBHc8qFA$e0SSrfn8Xbmw3+rwzSVCkvHK+n4nkQCEvougSrTKuRE', 'applicant', '2024-07-03 23:24:05', '2024-07-03 23:24:05');

-- --------------------------------------------------------

--
-- Table structure for table `user_skills`
--

CREATE TABLE `user_skills` (
  `user_skill_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `skill_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_skills`
--

INSERT INTO `user_skills` (`user_skill_id`, `user_id`, `skill_id`) VALUES
(1, 2, 1),
(2, 2, 2),
(3, 2, 3),
(4, 2, 4),
(5, 2, 5),
(6, 2, 6),
(7, 2, 7),
(8, 2, 8),
(9, 2, 9),
(10, 2, 10),
(11, 2, 11),
(12, 2, 12),
(13, 2, 13),
(237, 4, 2),
(235, 4, 4),
(236, 4, 5),
(278, 4, 10),
(247, 4, 17),
(246, 4, 18),
(232, 4, 21),
(230, 4, 23),
(231, 4, 24),
(233, 4, 25),
(234, 4, 26),
(238, 4, 27),
(239, 4, 28),
(240, 4, 29),
(241, 4, 30),
(242, 4, 31),
(243, 4, 32),
(244, 4, 33),
(245, 4, 34),
(248, 4, 35),
(249, 4, 36),
(250, 4, 37),
(251, 4, 38),
(252, 4, 39),
(253, 4, 40),
(254, 4, 41),
(255, 4, 42),
(256, 4, 43),
(257, 4, 44),
(258, 4, 45),
(259, 4, 46),
(260, 4, 47),
(261, 4, 48),
(262, 4, 49),
(263, 4, 50),
(264, 4, 51),
(265, 4, 52),
(266, 4, 53),
(267, 4, 54),
(268, 4, 55),
(269, 4, 56),
(270, 4, 57),
(271, 4, 58),
(272, 4, 59),
(273, 4, 60),
(274, 4, 61),
(275, 4, 62),
(276, 4, 63),
(277, 4, 64),
(279, 4, 65),
(280, 4, 66),
(281, 4, 67),
(282, 4, 68),
(283, 4, 69),
(287, 5, 17),
(293, 5, 24),
(292, 5, 30),
(289, 5, 40),
(288, 5, 42),
(291, 5, 60),
(290, 5, 61),
(284, 5, 70),
(285, 5, 71),
(286, 5, 72);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allowed_origins`
--
ALTER TABLE `allowed_origins`
  ADD PRIMARY KEY (`allowed_origin_id`),
  ADD KEY `api_key_id` (`api_key_id`);

--
-- Indexes for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD PRIMARY KEY (`api_key_id`),
  ADD UNIQUE KEY `api_key` (`api_key`) USING HASH,
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `api_request_logs`
--
ALTER TABLE `api_request_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `api_key_id` (`api_key_id`);

--
-- Indexes for table `api_usage`
--
ALTER TABLE `api_usage`
  ADD PRIMARY KEY (`usage_id`),
  ADD KEY `api_key_id` (`api_key_id`);

--
-- Indexes for table `applicants`
--
ALTER TABLE `applicants`
  ADD PRIMARY KEY (`applicant_id`),
  ADD UNIQUE KEY `user_id` (`user_id`) USING BTREE;

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `audit_trail`
--
ALTER TABLE `audit_trail`
  ADD PRIMARY KEY (`audit_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`company_id`),
  ADD UNIQUE KEY `company_email` (`company_email`),
  ADD KEY `user_account` (`user_id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`education_id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `experience`
--
ALTER TABLE `experience`
  ADD PRIMARY KEY (`experience_id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `job_skills`
--
ALTER TABLE `job_skills`
  ADD PRIMARY KEY (`job_skill_id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indexes for table `psychometric_meta`
--
ALTER TABLE `psychometric_meta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `test_id` (`test_id`);

--
-- Indexes for table `psychometric_options`
--
ALTER TABLE `psychometric_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `psychometric_questions`
--
ALTER TABLE `psychometric_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `test_id` (`test_id`);

--
-- Indexes for table `psychometric_responses`
--
ALTER TABLE `psychometric_responses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `applicant_id` (`applicant_id`,`test_id`,`question_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `option_id` (`option_id`);

--
-- Indexes for table `psychometric_tests`
--
ALTER TABLE `psychometric_tests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `applicant_id` (`applicant_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`skill_id`);

--
-- Indexes for table `smtp_configurations`
--
ALTER TABLE `smtp_configurations`
  ADD PRIMARY KEY (`config_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`setting_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `unique_user_company` (`company_id`,`username`),
  ADD UNIQUE KEY `unique_email_company` (`company_id`,`email`);

--
-- Indexes for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD PRIMARY KEY (`user_skill_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allowed_origins`
--
ALTER TABLE `allowed_origins`
  MODIFY `allowed_origin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `api_keys`
--
ALTER TABLE `api_keys`
  MODIFY `api_key_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `api_request_logs`
--
ALTER TABLE `api_request_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_usage`
--
ALTER TABLE `api_usage`
  MODIFY `usage_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applicants`
--
ALTER TABLE `applicants`
  MODIFY `applicant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `audit_trail`
--
ALTER TABLE `audit_trail`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `education_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `experience`
--
ALTER TABLE `experience`
  MODIFY `experience_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `job_skills`
--
ALTER TABLE `job_skills`
  MODIFY `job_skill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `psychometric_meta`
--
ALTER TABLE `psychometric_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `psychometric_options`
--
ALTER TABLE `psychometric_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `psychometric_questions`
--
ALTER TABLE `psychometric_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `psychometric_responses`
--
ALTER TABLE `psychometric_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `psychometric_tests`
--
ALTER TABLE `psychometric_tests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `recommendations`
--
ALTER TABLE `recommendations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `skill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `smtp_configurations`
--
ALTER TABLE `smtp_configurations`
  MODIFY `config_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_skills`
--
ALTER TABLE `user_skills`
  MODIFY `user_skill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=294;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `allowed_origins`
--
ALTER TABLE `allowed_origins`
  ADD CONSTRAINT `allowed_origins_ibfk_1` FOREIGN KEY (`api_key_id`) REFERENCES `api_keys` (`api_key_id`) ON DELETE CASCADE;

--
-- Constraints for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD CONSTRAINT `api_keys_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE;

--
-- Constraints for table `api_request_logs`
--
ALTER TABLE `api_request_logs`
  ADD CONSTRAINT `api_request_logs_ibfk_1` FOREIGN KEY (`api_key_id`) REFERENCES `api_keys` (`api_key_id`) ON DELETE CASCADE;

--
-- Constraints for table `api_usage`
--
ALTER TABLE `api_usage`
  ADD CONSTRAINT `api_usage_ibfk_1` FOREIGN KEY (`api_key_id`) REFERENCES `api_keys` (`api_key_id`) ON DELETE CASCADE;

--
-- Constraints for table `applicants`
--
ALTER TABLE `applicants`
  ADD CONSTRAINT `applicants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_trail`
--
ALTER TABLE `audit_trail`
  ADD CONSTRAINT `audit_trail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `user_account` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `education`
--
ALTER TABLE `education`
  ADD CONSTRAINT `education_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `experience`
--
ALTER TABLE `experience`
  ADD CONSTRAINT `experience_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`applicant_id`) ON DELETE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE;

--
-- Constraints for table `job_skills`
--
ALTER TABLE `job_skills`
  ADD CONSTRAINT `job_skills_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE;

--
-- Constraints for table `psychometric_meta`
--
ALTER TABLE `psychometric_meta`
  ADD CONSTRAINT `test_id` FOREIGN KEY (`test_id`) REFERENCES `psychometric_tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `psychometric_options`
--
ALTER TABLE `psychometric_options`
  ADD CONSTRAINT `psychometric_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `psychometric_questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `psychometric_questions`
--
ALTER TABLE `psychometric_questions`
  ADD CONSTRAINT `psychometric_questions_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `psychometric_tests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `psychometric_responses`
--
ALTER TABLE `psychometric_responses`
  ADD CONSTRAINT `psychometric_responses_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `psychometric_responses_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `psychometric_tests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `psychometric_responses_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `psychometric_questions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `psychometric_responses_ibfk_4` FOREIGN KEY (`option_id`) REFERENCES `psychometric_options` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`applicant_id`),
  ADD CONSTRAINT `recommendations_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `smtp_configurations`
--
ALTER TABLE `smtp_configurations`
  ADD CONSTRAINT `smtp_configurations_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE;

--
-- Constraints for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD CONSTRAINT `system_settings_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
