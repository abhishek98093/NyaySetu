const pool=require('../config/db');
const bcrypt =require('bcrypt');
require('dotenv').config();


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

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

    // Aadhaar validation
    if (!aadhaar_number) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number is required",
      });
    }

    const cleanedAadhaar = String(aadhaar_number).replace(/\D/g, '');

    if (cleanedAadhaar.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar must be exactly 12 digits",
      });
    }

    if (!/^[2-9]/.test(cleanedAadhaar)) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar must start with digits 2-9",
      });
    }

    // SQL UPDATE with RETURNING *
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
      WHERE user_id = $14
      RETURNING *;`,
      [
        dob,
        gender,
        phone_number,
        cleanedAadhaar,
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

    // ✅ Remove password from updated user before sending
    const { password: _, ...safeUser } = result.rows[0];

    return res.status(200).json({
      success: true,
      message: "Verification details submitted successfully.",
      user: safeUser,
    });

  } catch (err) {
    console.error("❌ Error in submitVerification:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Server error while updating verification details.",
    });
  }
};



const submitComplaint = async (req, res) => {
  try {
    const {
      crime_type,
      description,
      location_address,
      town,
      district,
      state,
      pincode,
      crime_datetime,
      proof_urls,
      title
    } = req.body;

    const user_id = req.user?.user_id; 

    if (!user_id || !crime_type || !crime_datetime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: crime_type or crime_datetime.",
      });
    }

    const result = await pool.query(
  `INSERT INTO complaints (
    user_id,
    crime_type,
    description,
    location_address,
    town,
    district,
    state,
    pincode,
    crime_datetime,
    proof_urls,
    status,
    created_at,
    updated_at,
    title
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $11
  ) RETURNING *`,
  [
    user_id,
    crime_type,
    description || '',
    location_address || '',
    town || '',
    district || '',
    state || '',
    pincode || '',
    crime_datetime,
    proof_urls || [],
    title || ''
  ]
);


    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error submitting complaint:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting complaint.",
    });
  }
};


const getComplaint = async (req, res) => {
  console.log("🔁 /getComplaint route hit");

  try {
    const id = req.user.user_id;

    const result = await pool.query(
      'SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC',
      [id]
    );

    if (result.rows.length === 0) {
  return res.status(200).json({
    success: true,
    message: 'No complaints found for this user.',
    complaints: [],
  });
}
    console.log('fetched successfully');

    return res.status(200).json({
      success: true,
      complaints: result.rows,
    });
  } catch (error) {
    console.error("❌ Error fetching complaints:", error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching complaints.',
    });
  }
};




module.exports={submitVerification,submitComplaint,getComplaint}