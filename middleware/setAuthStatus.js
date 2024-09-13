const jwt = require('jsonwebtoken');

function setAuthStatus(req, res, next){
    const token = req.cookies ? req.cookies.token : null;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (error, user)=>{
            if(error){
                res.locals.isAuthenticated = false;
            } else {
                res.locals.isAuthenticated = true;
                res.locals.user = user;
            }

            next();
        })
    } else {
        res.locals.isAuthenticated = false;
        next();
    }
}

module.exports = setAuthStatus;