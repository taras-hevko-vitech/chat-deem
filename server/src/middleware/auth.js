const jwt = require("jsonwebtoken")

module.exports = (context) => {
    let token;
        if (context.req.headers.authorization) {
            token = context.req.headers.authorization.split("Bearer ")[1]
        }
        if (token) {
            jwt.verify(token, "JWT_SKEY_123", null, (err, decodedToken) => {
                context.user = decodedToken
            })
        }
    return context;
}