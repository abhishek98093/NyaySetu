const pool = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();


const getPoliceComplaints = async (req, res) => {
  const user_id = req.user.user_id;
  console.log('Backend hit to fetch police complaints and subinspector list if inspector');

  try {
    // ✅ Fetch police details
    const policeResult = await pool.query(
      'SELECT * FROM police_details WHERE user_id = $1',
      [user_id]
    );
    const police = policeResult.rows[0];

    if (!police) {
      return res.status(404).json({
        success: false,
        message: 'Police officer not found',
      });
    }

    let complaints = [];
    let subInspectors = [];

    if (police.rank === 'Sub-Inspector') {
      // ✅ Fetch complaints assigned to Sub-Inspector badge number
      const complaintResult = await pool.query(
        'SELECT * FROM complaints WHERE assigned_badge = $1',
        [police.badge_number]
      );
      complaints = complaintResult.rows;

    } else if (police.rank === 'Inspector') {
      // ✅ Fetch pincode from users table (station pincode)
      const userResult = await pool.query(
        'SELECT pincode FROM users WHERE user_id = $1',
        [user_id]
      );
      const pincode = userResult.rows[0]?.pincode;

      if (!pincode) {
        return res.status(400).json({
          success: false,
          message: 'Inspector station pincode not available in user profile',
        });
      }

      // ✅ Fetch all complaints under that pincode
      const complaintResult = await pool.query(
        'SELECT * FROM complaints WHERE pincode = $1',
        [pincode]
      );
      complaints = complaintResult.rows;

      // ✅ Fetch Sub-Inspector list in that pincode
      const subInspectorResult = await pool.query(
        `
        SELECT u.user_id, u.name, p.police_id
        FROM police_details p
        JOIN users u ON p.user_id = u.user_id
        WHERE u.pincode = $1 AND p.rank = 'Sub-Inspector'
        `,
        [pincode]
      );
      subInspectors = subInspectorResult.rows;

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid police rank',
      });
    }

    // ✅ Return complaints and subInspector list if inspector
    return res.status(200).json({
      success: true,
      message: 'Complaints fetched successfully',
      complaints: complaints,
      subInspectors: subInspectors // empty array if Sub-Inspector
    });

  } catch (err) {
    console.error("getPoliceComplaints error:", err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching complaints',
      error: err.message,
    });
  }
};

module.exports = { getPoliceComplaints };
