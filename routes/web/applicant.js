const router = require('express').Router();
const axios = require('axios');
const qs = require('qs');
const auth = require('../../middleware/webAuth');
const http = require('http');


const agent = new http.Agent({ keepAlive: false });

router.get('/', auth.checkAuth, async (req, res) => {
    const sessionToken = req.cookies.sessionToken;
    const options = {
        title: 'Dashboard',
        appName: 'ATS',
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/v1/applicant/',
        headers: {
            'Origin': 'https://digitalera.com.pk',
            'x-api-key': 'DeMTMwNmFmYzhiZmQ4.RaATsYWQ2YWQ3YjY2NWQyMzMyZjU1ODVlMTc5MmI2NDhmMGRjNDFkOWY3NWI3YjE4YjRmOTM0M2YzODNjOGUzMGJlZDlhYzRkNGNjN2UwZGE5ZmE4MzhlZWVmZjk3OTY5YmRjMmRmM2JmODc2NTgwMzgyOGM4M2ZiMGQ3NWZiM2RlNDI',
            'Authorization': sessionToken,
            'Host': 'https://digitalera.com.pk'
        },
    };

    try {
        let response = await axios.request(config);
        let data = response.data;
        options.user = {
            username: data.username,
            profile_picture: data.profile_picture
        };
        
        config.url += 'applications';

        response = await axios.request(config);
        data = response.data;

        options.totalApplications = data.length;

        config.url = 'http://localhost:3000/api/v1/jobs'

        response = await axios.request(config);
        data = response.data;
        
        options.totalJobs = data.jobs.length;

        res.render('dashboard', options);
    } catch (error) {
        console.log(error);
    }    
});

router.get('/login', auth.redirectIfAuthenticated, async (req, res) => {
    res.render('index', {title: 'Applicant Dashboard', appName: 'ATS'});
});

router.post('/login', auth.redirectIfAuthenticated, async (req, res) => {
    let data = qs.stringify({
        'email': req.body.email,
        'password': req.body.password
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/v1/applicant/login',
        httpAgent: agent,
        headers: {
            'Origin': 'https://digitalera.com.pk',
            'x-api-key': 'DeMTMwNmFmYzhiZmQ4.RaATsYWQ2YWQ3YjY2NWQyMzMyZjU1ODVlMTc5MmI2NDhmMGRjNDFkOWY3NWI3YjE4YjRmOTM0M2YzODNjOGUzMGJlZDlhYzRkNGNjN2UwZGE5ZmE4MzhlZWVmZjk3OTY5YmRjMmRmM2JmODc2NTgwMzgyOGM4M2ZiMGQ3NWZiM2RlNDI',
            'Host': 'https://digitalera.com.pk',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            session_token = response.data['sessionToken'];
            res.cookie('sessionToken', session_token, { httpOnly: true, secure: false });
            res.redirect('/applicant/');
        })
        .catch((error) => {
            console.error(error);
            const errMsg = (error.response) ? (error.response.data) ? error.response.data.error : "Something went wrong!" : "Something went wrong!";
            res.render('index', { error: errMsg });
        });
});

router.get('/jobs', auth.checkAuth, async (req, res) => {
    const sessionToken = req.cookies.sessionToken;
    const options = {
        title: 'All Jobs',
        appName: 'ATS',
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/v1/applicant/',
        headers: {
            'Origin': 'https://digitalera.com.pk',
            'x-api-key': 'DeMTMwNmFmYzhiZmQ4.RaATsYWQ2YWQ3YjY2NWQyMzMyZjU1ODVlMTc5MmI2NDhmMGRjNDFkOWY3NWI3YjE4YjRmOTM0M2YzODNjOGUzMGJlZDlhYzRkNGNjN2UwZGE5ZmE4MzhlZWVmZjk3OTY5YmRjMmRmM2JmODc2NTgwMzgyOGM4M2ZiMGQ3NWZiM2RlNDI',
            'Authorization': sessionToken,
            'Host': 'https://digitalera.com.pk'
        },
    };

    try {
        let response = await axios.request(config);
        let data = response.data;
        options.user = {
            username: data.username,
            profile_picture: data.profile_picture
        };
        res.render('all-jobs', options)
    } catch (error) {
        console.log(error);
    }
});

router.post('/jobs', auth.checkAuth, async (req, res) => {
    const sessionToken = req.cookies.sessionToken;

    let data = qs.stringify({
        'isDatatable': '1',
        ...req.body 
    });

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/v1/jobs',
        headers: {
            'Origin': 'https://digitalera.com.pk',
            'x-api-key': 'DeMTMwNmFmYzhiZmQ4.RaATsYWQ2YWQ3YjY2NWQyMzMyZjU1ODVlMTc5MmI2NDhmMGRjNDFkOWY3NWI3YjE4YjRmOTM0M2YzODNjOGUzMGJlZDlhYzRkNGNjN2UwZGE5ZmE4MzhlZWVmZjk3OTY5YmRjMmRmM2JmODc2NTgwMzgyOGM4M2ZiMGQ3NWZiM2RlNDI',
            'Authorization': sessionToken,
            'Host': 'https://digitalera.com.pk',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            res.send(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
});

router.get('/jobs/recommended', auth.checkAuth, async (req, res) => {
    const sessionToken = req.cookies.sessionToken;
    const options = {
        title: 'All Jobs',
        appName: 'ATS',
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/v1/applicant/',
        headers: {
            'Origin': 'https://digitalera.com.pk',
            'x-api-key': 'DeMTMwNmFmYzhiZmQ4.RaATsYWQ2YWQ3YjY2NWQyMzMyZjU1ODVlMTc5MmI2NDhmMGRjNDFkOWY3NWI3YjE4YjRmOTM0M2YzODNjOGUzMGJlZDlhYzRkNGNjN2UwZGE5ZmE4MzhlZWVmZjk3OTY5YmRjMmRmM2JmODc2NTgwMzgyOGM4M2ZiMGQ3NWZiM2RlNDI',
            'Authorization': sessionToken,
            'Host': 'https://digitalera.com.pk'
        },
    };

    try {
        let response = await axios.request(config);
        let data = response.data;
        options.user = {
            username: data.username,
            profile_picture: data.profile_picture
        };
        res.render('recommended-jobs', options)
    } catch (error) {
        console.log(error);
    }
});

router.post('/jobs/recommended', auth.checkAuth, async (req, res) => {
    const sessionToken = req.cookies.sessionToken;

    let data = qs.stringify({
        'isDatatable': '1',
        ...req.body 
    });

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/v1/applicant/job/recommendations',
        headers: {
            'Origin': 'https://digitalera.com.pk',
            'x-api-key': 'DeMTMwNmFmYzhiZmQ4.RaATsYWQ2YWQ3YjY2NWQyMzMyZjU1ODVlMTc5MmI2NDhmMGRjNDFkOWY3NWI3YjE4YjRmOTM0M2YzODNjOGUzMGJlZDlhYzRkNGNjN2UwZGE5ZmE4MzhlZWVmZjk3OTY5YmRjMmRmM2JmODc2NTgwMzgyOGM4M2ZiMGQ3NWZiM2RlNDI',
            'Authorization': sessionToken,
            'Host': 'https://digitalera.com.pk',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            res.send(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
});

router.get('/logout', auth.checkAuth, async (req, res) => {
    res.clearCookie('sessionToken');
    res.redirect('/applicant/login');
});

module.exports = {
    router,
    path: '/applicant',
}