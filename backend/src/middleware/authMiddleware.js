import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    // 1. Grab the token securely from the cookies
    const token = req.cookies.token;

    if (!token || token === 'none') {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    // 2. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key');

    // 3. Attach the decoded user ID to the request so the next function can use it
    req.user = decoded;
    
    next(); // Pass control to the next function
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token' });
  }
};