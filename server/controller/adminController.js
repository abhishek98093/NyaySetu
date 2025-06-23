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
      badge_number,
      station_name,
      station_code,
      station_address,
      rank,
      shift_time,
      official_email,
      emergency_contact
    } = req.body;

    // === Check for duplicates ===
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

    const numberCheck = await client.query(
      `SELECT 1 FROM users WHERE phone_number = $1 LIMIT 1`,
      [phone_number]
    );
    if (numberCheck.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'A user already exists with this phone number.',
      });
    }

    const badgeCheck = await client.query(
      `SELECT 1 FROM police_details WHERE badge_number = $1 LIMIT 1`,
      [badge_number]
    );
    if (badgeCheck.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'A police officer already exists with this badge number.',
      });
    }

    // === Generate password ===
    const plainPassword = crypto.randomBytes(12).toString('base64').slice(0, 16);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await client.query('BEGIN');

    // === Insert into users ===
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

    // === Insert into police_details ===
    const policeInsertQuery = `
      INSERT INTO police_details (
        user_id, badge_number, station_name, station_code, station_address,
        district, state, rank, shift_time,
        official_email, emergency_contact
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11
      )
    `;
    const policeValues = [
      userId, badge_number, station_name, station_code, station_address,
      district, state, rank, shift_time,
      official_email, emergency_contact
    ];
    await client.query(policeInsertQuery, policeValues);

    await client.query('COMMIT');

    // === Send Email ===
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Police Portal Login Credentials',
        html: policeWelcome(email, plainPassword),
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


// controllers/policeController.js
const getFilteredPolice = async (req, res) => {
  try {
    const {
      gender,
      station_code,
      badge_number,
      rank,
      pincode,
      page = 1,
      limit = 10,
    } = req.query;

    let query = `
  SELECT 
    u.user_id,
    u.name,
    u.dob,
    u.profile_picture_url,
    p.badge_number,
    p.station_name,
    p.station_code,
    p.rank,
    p.official_email,
    p.station_address,
    p.police_id,
    p.created_at
  FROM users u
  JOIN police_details p ON u.user_id = p.user_id
  WHERE u.role = 'police'
`;


    const values = [];
    let i = 1;

    if (gender) {
      query += ` AND u.gender = $${i++}`;
      values.push(gender);
    }

    if (station_code) {
      query += ` AND p.station_code ILIKE $${i++}`;
      values.push(`%${station_code}%`);
    }

    if (badge_number) {
      query += ` AND p.police_id = $${i++}`;
      values.push(badge_number);
    }

    if (rank) {
      query += ` AND p.rank ILIKE $${i++}`;
      values.push(`%${rank}%`);
    }

    if (pincode) {
      query += ` AND u.pincode = $${i++}`;
      values.push(pincode);
    }

    // Pagination logic
    const offset = (page - 1) * limit;
    query += ` ORDER BY u.created_at DESC LIMIT $${i++} OFFSET $${i}`;
    values.push(Number(limit), Number(offset));

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      police: result.rows,
      total:result.rows.length
    });
  } catch (error) {
    console.error("Error fetching police list:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports={fetchStats,createPoliceOfficer,getFilteredPolice}