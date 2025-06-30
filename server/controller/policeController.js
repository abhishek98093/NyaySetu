const pool = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const getPoliceComplaints = async (req, res) => {
  const user_id = req.user.user_id;
  

  try {
    // Fetch police details for the authenticated user
    const policeResult = await pool.query(
      'SELECT * FROM police_details WHERE user_id = $1',
      [user_id]
    );
    const police = policeResult.rows[0];

    // If no police officer found for the user_id, return 404
    if (!police) {
      return res.status(404).json({
        success: false,
        message: 'Police officer not found',
      });
    }

    let complaints = [];
    let subInspectors = []; 
    if (police.rank === 'Sub-Inspector') {
      const complaintResult = await pool.query(
        'SELECT * FROM complaints WHERE assigned_badge = $1',
        [police.badge_number]
      );
      complaints = complaintResult.rows;

    } else if (police.rank === 'Inspector') {
      const userResult = await pool.query(
        'SELECT pincode FROM users WHERE user_id = $1',
        [user_id]
      );
      const pincode = userResult.rows[0]?.pincode; // Use optional chaining for safety

      // If pincode is not found for the Inspector, it's a bad request
      if (!pincode) {
        return res.status(400).json({
          success: false,
          message: 'Inspector station pincode not available in user profile',
        });
      }

      // Fetch all complaints within the Inspector's jurisdiction (based on pincode)
      const complaintResult = await pool.query(
        'SELECT * FROM complaints WHERE pincode = $1',
        [pincode]
      );
      complaints = complaintResult.rows;

      // Fetch all Sub-Inspectors under the same pincode
      const subInspectorResult = await pool.query(
        `
        SELECT u.profile_picture_url,u.user_id, u.name, p.police_id, p.badge_number
        FROM police_details p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.station_pincode = $1 AND p.rank = 'Sub-Inspector'
        `,
        [pincode]
      );
      subInspectors = subInspectorResult.rows;
      const badgeNumbers = subInspectors.map(si => si.badge_number);

      if (badgeNumbers.length > 0) {
        const countsResult = await pool.query(
          `
          SELECT assigned_badge, status, COUNT(*) as count
          FROM complaints
          WHERE assigned_badge = ANY($1)
          GROUP BY assigned_badge, status
          `,
          [badgeNumbers]
        );

        // Organize the fetched counts into a map for easy lookup
        const countsMap = {};
        countsResult.rows.forEach(row => {
          const badge = row.assigned_badge;
          const status = row.status; // Assumes 'status' column values match expected keys
          const count = parseInt(row.count); // Ensure count is a number

          if (!countsMap[badge]) {
            countsMap[badge] = {
              pending: 0,
              'in-progress': 0,
              resolved: 0,
              rejected: 0,
              total: 0 
            };
          }

          countsMap[badge][status] = count;
          countsMap[badge].total += count;
        });

        subInspectors = subInspectors.map(si => ({
          ...si,
          complaintCounts: countsMap[si.badge_number] || { 
            pending: 0,
            'in-progress': 0,
            resolved: 0,
            rejected: 0,
            total: 0
          }
        }));
      }

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid police rank',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Complaints fetched successfully',
      complaints: complaints,
      subInspectors: subInspectors 
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



const assignOfficerToComplaint = async (req, res) => {
  const { police_id, complaint_id } = req.body;
    console.log(police_id,complaint_id)
  if (!police_id || !complaint_id) {
    return res.status(400).json({
      success: false,
      message: "Both police_id and complaint_id are required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const policeResult = await client.query(
      `SELECT pd.police_id, pd.badge_number, pd.station_pincode, pd.rank,
              u.name, u.email
       FROM police_details pd
       JOIN users u ON pd.user_id = u.user_id
       WHERE pd.police_id = $1 AND pd.rank = 'Sub-Inspector'`,
      [police_id]
    );

    if (policeResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: "Sub-Inspector not found with the given police_id",
      });
    }

    const police = policeResult.rows[0];

    const complaintResult = await client.query(
      `SELECT complaint_id, pincode, status
       FROM complaints
       WHERE complaint_id = $1`,
      [complaint_id]
    );

    if (complaintResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const complaint = complaintResult.rows[0];

    if (complaint.pincode !== police.station_pincode) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Police station pincode does not match complaint pincode",
      });
    }

    const newRemark = `Assigned to Sub-Inspector: ${police.name} (Email: ${police.email}, Badge: ${police.badge_number})`;

    const updateResult = await client.query(
      `UPDATE complaints
       SET status = 'in-progress',
           assigned_badge = $1,
           remark = $2,
           updated_at = NOW()
       WHERE complaint_id = $3
       RETURNING *`,
      [police.badge_number, newRemark, complaint_id]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: "Complaint assigned successfully to Sub-Inspector",
      complaint: updateResult.rows[0],
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error assigning officer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    client.release();
  }
};



module.exports = { getPoliceComplaints,assignOfficerToComplaint };