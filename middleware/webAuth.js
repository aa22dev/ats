const axios = require('axios');
const qs = require('qs');

const checkAuth = async (req, res, next) => {
    const token = req.cookies.sessionToken;

    if (!token) {
        return res.redirect('/applicant/login');
    }

    try {
        let data = qs.stringify({
            'sessionToken': token
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/v1/applicant/sessiontoken/validate',
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
                if (response.data.valid) {
                    next();
                } else {
                    res.clearCookie('sessionToken');
                    res.redirect('/applicant/login');
                }
            })
            .catch((error) => {
                console.error(error);
                res.redirect('/applicant/login')
            });
    } catch (error) {
        console.error(error);
        res.redirect('/applicant/login');
    }
};

const redirectIfAuthenticated  = async (req, res, next) => {
    const token = req.cookies.sessionToken;

    try {
        let data = qs.stringify({
            'sessionToken': token
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/v1/applicant/sessiontoken/validate',
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
                if (response.data.valid) {
                    res.redirect('/applicant/');
                } else {
                    res.clearCookie('sessionToken');
                    next();
                }
            })
            .catch((error) => {
                console.error(error);
                next();
            });
    } catch (error) {
        console.error(error);
        next();
    }
};

module.exports = {
    checkAuth,
    redirectIfAuthenticated
};
