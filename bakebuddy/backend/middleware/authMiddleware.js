import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware to verify JWT and attach user to request
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token exists and follows 'Bearer <token>' format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing after Bearer' });
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure decoded payload has an ID
    if (!decoded.id) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
    }

    // Fetch user from the database using the decoded ID
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the full user object to the request
    req.user = user;
    next();
  } catch (error) {
    // Detailed error handling
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Unauthorized: Token has expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }

    // Log unexpected errors for debugging
    console.error('JWT verification failed:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
  }
};

// Middleware to restrict access to admins only
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: 'Access denied: User not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin role required' });
  }

  next();
};

export { protect, adminOnly };