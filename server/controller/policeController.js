const pool = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const getPoliceComplaints = async (req, res) => {
  const user_id = req.user.user_id;
  console.log('Backend hit to fetch police complaints and subinspector list with counts if inspector');

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
    let subInspectors = []; // Will be populated only for 'Inspector' rank

    // Logic based on the police officer's rank
    if (police.rank === 'Sub-Inspector') {
      // For Sub-Inspectors, fetch complaints specifically assigned to their badge number
      const complaintResult = await pool.query(
        'SELECT * FROM complaints WHERE assigned_badge = $1',
        [police.badge_number]
      );
      complaints = complaintResult.rows;

    } else if (police.rank === 'Inspector') {
      // For Inspectors, first get the pincode associated with their user profile.
      // This pincode is used to filter complaints and sub-inspectors within their jurisdiction.
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
        SELECT u.user_id, u.name, p.police_id, p.badge_number
        FROM police_details p
        JOIN users u ON p.user_id = u.user_id
        WHERE u.pincode = $1 AND p.rank = 'Sub-Inspector'
        `,
        [pincode]
      );
      subInspectors = subInspectorResult.rows;

      // If there are Sub-Inspectors, fetch their complaint counts efficiently
      const badgeNumbers = subInspectors.map(si => si.badge_number);

      if (badgeNumbers.length > 0) {
        // Fetch counts for 'pending', 'in-progress', 'resolved', 'rejected' statuses
        // for all relevant Sub-Inspectors in a single query.
        // Using `ANY($1)` is efficient for checking against an array of badge numbers.
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
              total: 0 // Initialize total count
            };
          }

          countsMap[badge][status] = count;
          countsMap[badge].total += count;
        });

        // Attach the calculated complaint counts to each Sub-Inspector object
        subInspectors = subInspectors.map(si => ({
          ...si,
          complaintCounts: countsMap[si.badge_number] || { // Provide default if no complaints found
            pending: 0,
            'in-progress': 0,
            resolved: 0,
            rejected: 0,
            total: 0
          }
        }));
      }

    } else {
      // Handle cases where the police rank is neither Sub-Inspector nor Inspector
      return res.status(400).json({
        success: false,
        message: 'Invalid police rank',
      });
    }
    console.log(complaints);
    console.log(subInspectors)
    // Return the fetched complaints and the Sub-Inspector list (with counts for Inspector)
    return res.status(200).json({
      success: true,
      message: 'Complaints fetched successfully',
      complaints: complaints,
      subInspectors: subInspectors // This array will be empty for Sub-Inspectors
    });

  } catch (err) {
    // Centralized error handling
    console.error("getPoliceComplaints error:", err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching complaints',
      error: err.message, // Provide the error message for debugging
    });
  }
};

module.exports = { getPoliceComplaints };