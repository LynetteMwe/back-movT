const bcrypt = require("bcrypt");

const isEmail = email => {
    if (typeof email !== "string") {
        return false;
    }
    const emailRegex =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return emailRegex.test(email);
};

const serverError = (res, error) => {
    console.log(error);
    res.statusCode = error?.original?.code === "ER_DUP_ENTRY" ? 400 : 500;
    return res.json({
        status: res.statusCode, // Internal Server Error
        error: {
            name: error?.name,
            code: error?.original?.code,
            message: error?.original?.sqlMessage,
        },
    });
};

function encryptPassword(plainText) {
    return bcrypt.hashSync(plainText, 10);
}
function comparePassword(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
}
function getUser(user, showToken = false) {
    const obj = {
        // id: user?.id,
        // f_name: user?.f_name,
        // l_name: user?.l_name,
        id: user?.id,
        username: user?.username,
        contact:user?.contact,


        email: user?.email,
    };
    if (showToken) obj.token = user?.token;
    return obj;
}

function generateToken(email) {
    const str = email + new Date().toUTCString();
    return bcrypt.hashSync(str, 10);
}

module.exports = {
    isEmail,
    serverError,
    encryptPassword,
    comparePassword,
    getUser,
    generateToken,
};
