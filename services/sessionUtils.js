const { v5: uuid } = require('uuid');
const { randomBytes, createCipheriv, createDecipheriv} = require('crypto');

const secretKey = 'aqib_jawad_key24';

function encode(data) {
    return Buffer.from(data).toString('base64url');
}

function decode(data) {
    return Buffer.from(data, 'base64url');
}

async function generateSessionToken(userData) {
    try {
        userData.timestamp = Date.now();

        let length = '';

        const iv = randomBytes(16);

        const cipher = createCipheriv('aes-128-cbc', secretKey, iv);

        let token = encode(cipher.update(JSON.stringify(userData), 'utf8'));
        length += token.length;

        const final = cipher.final();
        token += encode(final); 

        length += '-' + encode(final).length;

        token += '%' + encode(length) + '%';
        token += encode(iv);

        return token;
    } catch (err) {
        throwErr(`Error while creating session: ${err}`, 500)
    }
}

// function decryptToken(token) {
//     const decryptedLength = decode(token.slice(token.indexOf('%') + 1, token.lastIndexOf('%'))).toString();

//     const separtorIndex = decryptedLength.indexOf('-');
//     const cipherLength = parseInt(decryptedLength.slice(0, separtorIndex));
//     const finalLength = parseInt(decryptedLength.slice(separtorIndex + 1,));

//     const first = Buffer.from(decode(token.slice(0, cipherLength)), 'base64url');
//     const final = Buffer.from(decode(token.slice(cipherLength, cipherLength + finalLength)), 'base64url');
//     const iv = Buffer.from(decode(token.slice(-22)), 'base64url');

//     const cipher = createDecipheriv('aes-128-cbc', secretKey, iv);

//     const decrypted = cipher.update(Buffer.concat([first, final]));

//     return JSON.parse(Buffer.concat([decrypted, cipher.final()]).toString('utf8'));
// }

module.exports = {
    generateSessionToken
}