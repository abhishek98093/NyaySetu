const pool=require('../config/db');
const bcrypt =require('bcrypt');
require('dotenv').config();
const {policeWelcome} =require('../utils/mailFormat')

const crypto = require('crypto');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});
const fetchStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Financial year start and end
    const fyStart = currentMonth < 4
      ? `${currentYear - 1}-04-01`
      : `${currentYear}-04-01`;

    const fyEnd = currentMonth < 4
      ? `${currentYear}-03-31`
      : `${currentYear + 1}-03-31`;

    // 1. Status-wise count
    const statusResult = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'in-progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
      FROM complaints;
    `);

    // 2. Month-wise count in current financial year
    const monthResult = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        COUNT(*) AS total
      FROM complaints
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY month
      ORDER BY month;
    `, [fyStart, fyEnd]);

    res.status(200).json({
        success:true,
      statusStats: statusResult.rows[0],
      monthWiseStats: monthResult.rows,
    });
  } catch (err) {
    console.error('Error fetching complaint summary:', err);
    res.status(500).json({ success:false,error: 'Internal server error' });
  }
};

const createPoliceOfficer = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      name,
      dob,
      gender,
      phone_number,
      email,
      aadhaar_number,
      profile_picture_url,
      address_line1,
      address_line2,
      town,
      district,
      state,
      pincode,

      // Police details
      station_name,
      station_code,
      station_address,
      rank, // 'Inspector' or 'Sub-Inspector'
      shift_time,
      official_email,
      emergency_contact
    } = req.body;
    const emailCheck = await client.query(
  `SELECT 1 FROM users WHERE email = $1 LIMIT 1`,
  [email]
);

if (emailCheck.rowCount > 0) {
  return res.status(400).json({
    success: false,
    message: 'A user already exists with this email.',
  });
}

    // ✅ Generate random 16-character password and hash it
    const plainPassword = crypto.randomBytes(12).toString('base64').slice(0, 16);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await client.query('BEGIN');

    // Insert into users
    const userInsertQuery = `
      INSERT INTO users (
        name, dob, gender, phone_number, email, password,
        aadhaar_number, aadhaar_verified,
        profile_picture_url, is_profile_complete, verification_status,
        role, address_line1, address_line2, town, district, state, pincode
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8,
        $9, $10, $11,
        'police', $12, $13, $14, $15, $16, $17
      )
      RETURNING user_id
    `;

    const userValues = [
      name, dob, gender, phone_number, email, hashedPassword,
      aadhaar_number, true,
      profile_picture_url, true, 'verified',
      address_line1, address_line2, town, district, state, pincode
    ];

    const userResult = await client.query(userInsertQuery, userValues);
    const userId = userResult.rows[0].user_id;

    // Insert into police_details
    const policeInsertQuery = `
      INSERT INTO police_details (
        user_id, station_name, station_code, station_address,
        district, state, rank, shift_time,
        official_email, emergency_contact
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10
      )
    `;

    const policeValues = [
      userId, station_name, station_code, station_address,
      district, state, rank, shift_time,
      official_email, emergency_contact
    ];

    await client.query(policeInsertQuery, policeValues);
    await client.query('COMMIT');

    // ✅ Send credentials via email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Police Portal Login Credentials',
        html: policeWelcome({ email, plainPassword }),
      });

      return res.status(200).json({
        success: true,
        message: 'Police officer created and credentials emailed successfully.',
        default_password: plainPassword
      });
    } catch (emailError) {
      console.error('❌ Mail sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Police created but email failed to send.',
        default_password: plainPassword
      });
    }

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating police officer:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating police officer.'
    });
  } finally {
    client.release();
  }
};

module.exports={fetchStats,createPoliceOfficer}