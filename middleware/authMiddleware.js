import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Add decoded user data to the request object
    next();  // Allow the request to proceed to the protected route
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default verifyToken;
