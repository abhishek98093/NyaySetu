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
      statusStats: statusResult.rows[0],
      monthWiseStats: monthResult.rows,
    });
  } catch (err) {
    console.error('Error fetching complaint summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports={fetchStats}