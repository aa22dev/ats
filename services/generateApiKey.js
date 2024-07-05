const { v5: uuid } = require('uuid');
const { uuidv7 } = require('uuidv7');
const { hash } = require('argon2');
const { randomBytes, randomUUID, createHmac} = require('crypto');

function toHex(string) {
    return Buffer.from(string).toString('hex');
}

function toBase64(string) {
    return Buffer.from(string).toString('base64url');
}

async function generateApiKey(companyId, origin) {
    devCompany = "De"
    appName = "RaATs"
    regNo = "1306"

    try {
        const data = {
            companyId,
            origin: toHex(origin),
            date: toHex(new Date().toUTCString()),
            pepper: randomBytes(16).toString('hex'),
            salt: randomBytes(16).toString('hex'),
            secret: regNo + randomBytes(4).toString('hex'),
            uid: toHex(uuidv7())
        }

        let combinedString = toHex(data.companyId) + data.origin + toHex(Date.now().toString());

        data.uuid = uuid(combinedString, randomUUID()).replaceAll('-', '');

        combinedString = data.secret + data.salt + data.uuid + combinedString + data.pepper;

        data.hash = await hash(combinedString);

        return `${devCompany}${toBase64(data.secret)}.${appName}${toBase64(createHmac('sha512', data.salt).update(JSON.stringify(data)).digest('hex'))}`;
    } catch (err) {
        throwErr(`Error generating API key: ${err}`, 500)
    }
}

// Example usage
const companyId = '1';
const origin = 'http://localhost';
generateApiKey(companyId, origin).then((apiKey) => {
    console.log('Generated API Key:', apiKey);
}).catch((error) => {
    console.error('Error generating API key:', error);
});