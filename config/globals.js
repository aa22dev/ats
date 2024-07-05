const express = require('express');
const path = require('path');
const { throwErr } = require('../helpers/error.js');

Object.assign(global, {
    otpStore: new Map(),
    applicantDetailsStore: new Map(),
    app: express(),
    __basedir: path.resolve(__dirname, '..'),
    throwErr 
});