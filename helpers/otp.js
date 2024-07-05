const otplib = require('otplib');
const crypto = require('crypto');

const OTP_SECRET = crypto.randomBytes(64).toString('hex');
otplib.authenticator.options = {
    step: 300, // 5 minutes
    digits: 12
};

module.exports = { 
    email: null, 
    generateOtp: function() {
        try {
            const storedOtp = otpStore.get(this.email);
            if (storedOtp && Date.now() > storedOtp.expiresAt) {
                this.clearOtpEntry();
            } else if (storedOtp) {
                throwErr('OTP already generated!', 403);
            }
            const otp = otplib.authenticator.generate(OTP_SECRET);
            otpStore.set(this.email, { otp, expiresAt: Date.now() + 300000 });
            return otp;
        } catch (error) {
            throw error;
        }
    }, 
    verifyOtp: function (otp) {
        const storedOtp = otpStore.get(this.email);
        if (storedOtp && storedOtp.otp === otp && Date.now() < storedOtp.expiresAt) {
            return true;
        }
        return false;
    }, 
    storeRegistrationDetails: function(details) {
        applicantDetailsStore.set(this.email, { details });
    }, 
    getRegistrationDetails: function() {
        const entry = applicantDetailsStore.get(this.email);
        return entry ? entry.details : null;
    }, 
    clearOtpEntry: function() {
        otpStore.delete(this.email);
    }, 
    clearRegistrationDetailsEntry: function() {
        applicantDetailsStore.delete(this.email);
    } 
};
