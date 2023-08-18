const jwt = require('jsonwebtoken');
const User = require('../../models/User');

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({message: 'Non autorisé'});
        }

        const decodedtoken = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
        const user = await User.findById(decodedtoken.userId);

        if(!user) {
            return res.status(401).json({error: 'Token invalide'});
        }

        req.decodedtoken = decodedtoken;
        req.session.userId = decodedtoken.userId;
        next();
        
    } catch(error) {
        res.status(401).send('Error auth '+error.message);
    }
}