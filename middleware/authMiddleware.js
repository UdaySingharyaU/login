// authMiddleware.js
import  Jwt  from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  console.log("authmiddle");
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  Jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // If the token is valid, you can access information about the user from the 'decoded' object
    req.user = decoded;
    next();
  });
};

export default verifyToken ;
