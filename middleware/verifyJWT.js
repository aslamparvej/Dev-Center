const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user)=> {
        if(error){
            return res.redirect('/login');
        }

        req.user = user;
        next();
    })
}

module.exports = authenticateToken;