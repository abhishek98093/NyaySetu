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
const getUserDetails = async (req, res) => {
  const { id } = req.params; // ✅ id is directly available

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Valid user ID is required"
    });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [parseInt(id)]  // ✅ use id directly
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = result.rows[0];
    delete user.password; // ✅ optional: remove sensitive info

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


const submitVerification = async (req, res) => {

  try {
    const {
      user_id,
      dob,
      gender,
      phone_number,
      aadhaar_number,
      address_line1,
      address_line2,
      town,
      district,
      state,
      pincode,
      aadhaar_front_url,
      aadhaar_back_url,
      profile_picture_url,
    } = req.body.data;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // ✅ Enhanced Aadhaar validation
    if (!aadhaar_number) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number is required",
      });
    }

     const cleanedAadhaar = String(aadhaar_number).replace(/\D/g, ''); // Remove all non-digits
    
    if (cleanedAadhaar.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar must be exactly 12 digits"
      });
    }

    if (!/^[2-9]/.test(cleanedAadhaar)) {
      return res.status(400).json({
        success: false, 
        message: "Aadhaar must start with digits 2-9"
      });
    }

    // Debug log before DB operation
    console.log('Aadhaar validation passed:', cleanedAadhaar);
    console.log("→ Raw aadhaar_number from client:", aadhaar_number);
console.log("→ Cleaned Aadhaar being used in query:", cleanedAadhaar);


    const result = await pool.query(
      `UPDATE users SET
        dob = $1,
        gender = $2,
        phone_number = $3,
        aadhaar_number = $4,
        address_line1 = $5,
        address_line2 = $6,
        town = $7,
        district = $8,
        state = $9,
        pincode = $10,
        aadhaar_front_url = $11,
        aadhaar_back_url = $12,
        profile_picture_url = $13,
        is_profile_complete = TRUE,
        verification_status = 'pending',
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $14`,
      [
        dob,
        gender,
        phone_number,
        cleanedAadhaar, // ✅ use cleaned Aadhaar here
        address_line1,
        address_line2,
        town,
        district,
        state,
        pincode,
        aadhaar_front_url,
        aadhaar_back_url,
        profile_picture_url,
        user_id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Verification details submitted successfully.",
    });
  } catch (err) {
    console.error("❌ Error in submitVerification:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Server error while updating verification details.",
    });
  }
};



module.exports={getUserDetails,submitVerification}