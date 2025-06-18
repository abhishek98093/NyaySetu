const pool=require('../config/db');
const bcrypt =require('bcrypt');
const {generateToken,verifyToken}=require('../utils/utility');
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
    return res.status(500).json({ error: result.message });
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

const signup=async (req,res)=>{
    const { name, email, password, phoneNumber } = req.body;
    try{
        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if(emailCheck.rows.length>0){
            return res.status(400).json({message:"user already registered"});
        }
        const phoneCheck = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phoneNumber]);
        if(phoneCheck.rows.length>0){
            return res.status(400).json({message:"phone number is already in use by another user"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const userResult = await pool.query(`
            INSERT INTO users (name, email, password, phone_number)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [name, email, hashedPassword, phoneNumber]  // Corrected to phoneNumber
        );
        const user=userResult.rows[0];
        const  token=generateToken(user);
        return res.status(200).json({message:"user created successfully",token:token});

    }catch (err) {
        console.error("Error in Signup Route:", err);
        if (err.code === '23505') {  
            return res.status(400).json({ message: 'Phone number or email already exists.' });
        }
        return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

module.exports={signup,sendotp};
