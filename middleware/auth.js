const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       const authorizationHeader = req.headers.authorization;
       if (!authorizationHeader) {
           console.log('Authorization header missing');
           return res.status(401).json({ error: 'Authorization header missing' });
       }

       const token = authorizationHeader.split(' ')[1];
       if (!token) {
           console.log('Token missing');
           return res.status(401).json({ error: 'Token missing' });
       }

       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
       console.log('Token verified, userId:', userId);
       next();
   } catch(error) {
       console.log('Token verification failed', error);
       res.status(401).json({ error: 'Invalid request!' });
   }
};