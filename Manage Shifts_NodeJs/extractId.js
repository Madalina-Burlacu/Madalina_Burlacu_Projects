const jwt = require('jsonwebtoken');

const extractUserIdFromToken = async(request, response, next) =>{
    const valueToken = request.headers.authorization;
    let token;
    if(valueToken && valueToken.startsWith('bearer')){
        token = valueToken.split(' ')[1];
    }

    try{
        const decodedToken = jwt.verify(token, process.env.SECRET_STR);
        request.userIdFromToken = decodedToken.id;

        next();

    }catch(err){
        return response.status(401).json({
            status: 'failed',
            message: 'Unauthorized'
        });
    }
}

module.exports = extractUserIdFromToken;