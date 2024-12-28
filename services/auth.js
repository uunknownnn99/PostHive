const jwt = require("jsonwebtoken");
const secretKey = "PostHiveDev@AAA";

function createToken(user){
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
    };
    const token = jwt.sign(payload, secretKey);
    return token;
}

function validateToken (token){
    try{
        var payload = jwt.verify(token, secretKey);
    }
    catch(err){}
    return payload;
}

module.exports = {createToken, validateToken };