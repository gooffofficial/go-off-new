const jwt = require('express-jwt');
const getTokenFromHeaders = (req) => {
    /*
    const{ headers: { authorization} } = req;

    if(authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
    */
    //console.log(req);
    if(!req.signedCookies){
        return null;
    }
    const userJWT = req.signedCookies.authJWT;
    if(!userJWT){
        return null
    }
    else{
        return req.signedCookies.authJWT;
    }
}

const auth = {
    
    sessionRequired: (req, res, next) => {
        if(req.isAuthenticated()){
            console.log("success");
            return next();
        }
        else{
            console.log("fail");
        }
    },
    
    required: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};

module.exports = auth;