const pool=require('../config/db');
const bcrypt =require('bcrypt');
const {generateToken}=require('../utils/utility');
require('dotenv').config();
const {mailFormat,setOtp,verifyOtp,generateOtp}=require('../utils/otp');


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});



const sendotp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required to send OTP' });
  }

  const otp = generateOtp();
  const result = setOtp(email, otp); 

  if (!result.status) {
    return res.status(500).json({ success:false,error: result.message });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for requested action',
      html: mailFormat(otp),
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });

  } catch (error) {
    console.error('Mail sending failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again after a while.',
    });
  }
};
const signup = async (req, res) => {
  const { name, email, password, phoneNumber, dob } = req.body;
  const role = 'citizen';

  try {
    const emailCheck = await pool.query(
      'SELECT 1 FROM users WHERE email = $1',
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already registered with this email.',
      });
    }

    const phoneCheck = await pool.query(
      'SELECT 1 FROM users WHERE phone_number = $1',
      [phoneNumber]
    );
    if (phoneCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already in use.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (name, email, password, phone_number, dob, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, hashedPassword, phoneNumber, dob, role]
    );

    const { password: _, ...safeUser } = userResult.rows[0]; 

    
    const token = generateToken(safeUser);

    return res.status(200).json({
      success: true,
      message: 'User created successfully',
      token:token,
      user: safeUser,
    });

  } catch (err) {
    console.error('Error in signup route:', err);

    if (err.code === '23505' && err.constraint) {
      return res.status(400).json({
        success: false,
        message: err.constraint.includes('email')
          ? 'Email already exists'
          : err.constraint.includes('phone')
          ? 'Phone number already exists'
          : 'Duplicate value error',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: err.message,
    });
  }
};


  const verify_Otp = (req, res) => {
    const { email, otp } = req.body;
  
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required." });
  
    const isValid = verifyOtp(email, otp);
    if (!isValid) {
      return res.status(400).json({ valid: false, error: "Invalid or expired OTP." });

    }
    return res.status(200).json({ valid: true, message: "OTP verified successfully." });
  };
  
  const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User does not exist, please sign up',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const { password: _, ...safeUser } = user;

    const token = generateToken(safeUser); 

   
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token:token,
      user: safeUser,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: err.message,
    });
  }
};


const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and new password are required.",
    });
  }

  try {
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const resultTwo = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
      [hashedPassword, email]
    );

    const { password: _, ...safeUser } = resultTwo.rows[0]; 

    
    const token = generateToken(safeUser);

    return res.status(200).json({
      success: true,
      message: "Password reset successful.",
      token:token,
      user: safeUser,
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: err.message,
    });
  }
};

module.exports={signup,sendotp,verify_Otp,login,resetPassword};
