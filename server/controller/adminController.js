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
      badge_number,
      station_name,
      station_code,
      station_address,
      station_pincode, // ✅ new field
      rank,
      shift_time,
      official_email,
      emergency_contact
    } = req.body;
    if (!/^\d{12}$/.test(aadhaar_number)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid Aadhaar number. It must be exactly 12 digits.'
  });
}
    // === Duplicate Checks ===
    const emailCheck = await client.query(`SELECT 1 FROM users WHERE email = $1`, [email]);
    if (emailCheck.rowCount > 0) return res.status(400).json({ success: false, message: 'A user already exists with this email.' });

    const numberCheck = await client.query(`SELECT 1 FROM users WHERE phone_number = $1`, [phone_number]);
    if (numberCheck.rowCount > 0) return res.status(400).json({ success: false, message: 'A user already exists with this phone number.' });

    const badgeCheck = await client.query(`SELECT 1 FROM police_details WHERE badge_number = $1`, [badge_number]);
    if (badgeCheck.rowCount > 0) return res.status(400).json({ success: false, message: 'A police officer already exists with this badge number.' });

    // === Generate Random Password ===
    const plainPassword = crypto.randomBytes(12).toString('base64').slice(0, 16);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await client.query('BEGIN');

    // === Insert into users table ===
    const userInsertQuery = `
      INSERT INTO users (
        name, dob, gender, phone_number, email, password,
        aadhaar_number, aadhaar_verified,
        profile_picture_url, is_profile_complete, verification_status,
        role, address_line1, address_line2, town, district, state, pincode
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
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

    // === Insert into police_details table ===
    const policeInsertQuery = `
      INSERT INTO police_details (
        user_id, badge_number, station_name, station_code, station_address,
        district, state, rank, shift_time,
        official_email, emergency_contact, station_pincode
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12
      )
    `;
    const policeValues = [
      userId, badge_number, station_name, station_code, station_address,
      district, state, rank, shift_time,
      official_email, emergency_contact, station_pincode // ✅ added station_pincode
    ];
    await client.query(policeInsertQuery, policeValues);

    await client.query('COMMIT');

    // === Fetch full created police officer details ===
    const fullDetailsQuery = `
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
        p.station_pincode,
        p.police_id,
        p.created_at
      FROM users u
      JOIN police_details p ON u.user_id = p.user_id
      WHERE u.role = 'police' AND u.user_id = $1
    `;
    const fullDetails = await client.query(fullDetailsQuery, [userId]);

    // === Send email with credentials ===
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
        data: fullDetails.rows[0]
      });
    } catch (emailError) {
      console.error('❌ Mail sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Police created but email failed to send.',
        data: fullDetails.rows[0]
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
    const allowedGenders = ['male', 'female', 'other'];
    const allowedRanks = ['Inspector', 'Sub-Inspector'];

    if (gender && !allowedGenders.includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender. Allowed: male, female, other",
      });
    }

    if (rank && !allowedRanks.includes(rank)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rank. Allowed: Inspector, Sub-Inspector",
      });
    }

    if (pincode) {
  const trimmedPincode = pincode.trim();
  if (!/^\d{6}$/.test(trimmedPincode)) {
    return res.status(400).json({
      success: false,
      message: "Invalid pincode. Must be a 6-digit number",
    });
  }
}


    const currentPage = Number(page);
    const perPage = Number(limit);
    if (isNaN(currentPage) || currentPage < 1 || isNaN(perPage) || perPage < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination values. 'page' and 'limit' must be positive integers",
      });
    }

    // === Build Query ===
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
      query += ` AND p.rank = $${i++}`;
      values.push(rank);
    }

   if (pincode) {
  const trimmedPincode = String(pincode).trim();
  if (!/^\d{6}$/.test(trimmedPincode)) {
    return res.status(400).json({
      success: false,
      message: "Invalid pincode. Must be a 6-digit number",
    });
  }
  query += ` AND TRIM(p.station_pincode) = $${i++}`;
  values.push(trimmedPincode);
}



    // === Pagination ===
    const offset = (currentPage - 1) * perPage;
    query += ` ORDER BY u.created_at DESC LIMIT $${i++} OFFSET $${i}`;
    values.push(perPage, offset);

    const result = await pool.query(query, values);
    return res.status(200).json({
      success: true,
      police: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error("Error fetching police list:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching police list",
    });
  }
};

const deletePoliceOfficer = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing user ID",
    });
  }

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING *',
      [user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No officer found with the given user ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Police officer deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting police officer:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting officer",
    });
  }
};


const updatePoliceRank = async (req, res) => {
  const { user_id, target_rank } = req.body;

  const allowedRanks = ['Inspector', 'Sub-Inspector'];

  if (!user_id || !target_rank) {
    return res.status(400).json({ success: false, message: "user_id and target_rank are required" });
  }

  if (!allowedRanks.includes(target_rank)) {
    return res.status(400).json({ success: false, message: "Invalid rank. Must be 'Inspector' or 'Sub-Inspector'" });
  }

  try {
    const fetchResult = await pool.query(
      `SELECT rank FROM police_details WHERE user_id = $1`,
      [user_id]
    );

    if (fetchResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Officer not found" });
    }

    const currentRank = fetchResult.rows[0].rank;

    if (currentRank === target_rank) {
      return res.status(400).json({
        success: false,
        message: `Officer is already a ${target_rank}. No change needed.`
      });
    }

    if (currentRank === 'Sub-Inspector' && target_rank === 'Sub-Inspector') {
      return res.status(400).json({
        success: false,
        message: `Officer is already at the lowest rank: ${currentRank}`
      });
    }

    const updateResult = await pool.query(
      `UPDATE police_details SET rank = $1 WHERE user_id = $2 RETURNING *`,
      [target_rank, user_id]
    );

    return res.status(200).json({
      success: true,
      message: `Officer rank updated to ${target_rank}`,
      data: updateResult.rows[0]
    });

  } catch (error) {
    console.error("Error updating officer rank:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating officer rank"
    });
  }
};


 const getPolicePersonnelAnalysis = async (req, res) => {
  try {
    const totalQuery = `SELECT COUNT(*) FROM police_details`;
    const availableQuery = `SELECT COUNT(*) FROM police_details WHERE is_available = true`;

    const byRankQuery = `
      SELECT rank, COUNT(*) as count
      FROM police_details
      GROUP BY rank
    `;

    const byStatusQuery = `
      SELECT status, COUNT(*) as count
      FROM police_details
      GROUP BY status
    `;

    const [totalRes, availableRes, rankRes, statusRes] = await Promise.all([
      pool.query(totalQuery),
      pool.query(availableQuery),
      pool.query(byRankQuery),
      pool.query(byStatusQuery),
    ]);

    const total = parseInt(totalRes.rows[0].count);
    const available = parseInt(availableRes.rows[0].count);

    const rank_distribution = {};
    rankRes.rows.forEach(row => {
      rank_distribution[row.rank || 'Unassigned'] = parseInt(row.count);
    });

    const status_distribution = {};
    statusRes.rows.forEach(row => {
      status_distribution[row.status] = parseInt(row.count);
    });

    res.status(200).json({
      success: true,
      data: {
        total_personnel: total,
        available_for_duty: available,
        rank_distribution,
        status_distribution
      }
    });

  } catch (err) {
    console.error("Error fetching analysis:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports={fetchStats,createPoliceOfficer,getFilteredPolice,deletePoliceOfficer,updatePoliceRank,getPolicePersonnelAnalysis}