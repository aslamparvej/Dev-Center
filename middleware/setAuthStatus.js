const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

function setAuthStatus(req, res, next){
    const token = req.cookies ? req.cookies.token : null;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, user)=>{
            if(error){
                res.locals.isAuthenticated = false;
            } else {
                res.locals.isAuthenticated = true;
                res.locals.user = req.userId;
                req.userId = user.id;

                const loggedUser = await User.findById(user.id);

                if(loggedUser.userType === 'Admin'){
                    res.locals.isAdmin = true;
                }else{
                    res.locals.isAdmin = false;
                }
            }

            next();
        })
    } else {
        res.locals.isAuthenticated = false;
        next();
    }
}

module.exports = setAuthStatus;