import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// Helper function to generate tokens and set cookies
const sendTokenResponse = (user, statusCode, res, rememberMe) => {
  const expireTime = rememberMe ? '7d' : '1h';
  const cookieMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

  const token = jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.JWT_SECRET || 'super_secret_key', 
    { expiresIn: expireTime }
  );

  const options = {
    expires: new Date(Date.now() + cookieMaxAge),
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict' 
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Using your optimized db.execute wrapper
    const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password_hash]
    );

    const newUser = { id: result.insertId, name, email, role: 'candidate' };
    sendTokenResponse(newUser, 201, res, false);
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Using your optimized db.execute wrapper
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res, rememberMe);
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get Current Logged In User
export const getMe = async (req, res) => {
  try {
    // req.user.id comes directly from our protect middleware!
    const [users] = await db.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: users[0] // Return the user data (notice we excluded the password in the SELECT!)
    });
  } catch (error) {
    console.error("Get Me Error:", error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};