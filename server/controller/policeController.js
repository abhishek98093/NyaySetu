const pool = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const getPoliceComplaints = async (req, res) => {
  const user_id = req.user.user_id;
  

  try {
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
      const pincode = userResult.rows[0]?.pincode; 

      if (!pincode) {
        return res.status(400).json({
          success: false,
          message: 'Inspector station pincode not available in user profile',
        });
      }

      const complaintResult = await pool.query(
        'SELECT * FROM complaints WHERE pincode = $1',
        [pincode]
      );
      complaints = complaintResult.rows;

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

const addMissingPerson = async (req, res) => {
  try {
    const police_user_id = req.user.user_id;

    // Get police_id and station_pincode from police_details
    const policeResult = await pool.query(
      'SELECT police_id, station_pincode FROM police_details WHERE user_id = $1',
      [police_user_id]
    );

    if (policeResult.rows.length === 0) {
      return res.status(403).json({ error: "Police account not found." });
    }

    const police_id = policeResult.rows[0].police_id;
    const registered_pincode = policeResult.rows[0].station_pincode;

    const {
      name,
      age,
      gender,
      description,
      profile_picture_url,
      last_seen_location,
      last_seen_time,
      probable_location,  // 🔥 Added here
      address,
      district,
      pincode,
      reward_on_information = 0
    } = req.body;

    // Validate reward_on_information
    if (!Number.isInteger(reward_on_information)) {
      return res.status(400).json({
        error: "Invalid 'reward_on_information'. It must be an integer."
      });
    }

    const insertQuery = `
      INSERT INTO missing_persons (
        name, age, gender, description,
        profile_picture_url,
        last_seen_location, last_seen_time,
        probable_location,       -- 🔥 Added here
        address, district, pincode,
        registered_pincode,
        added_by,
        reward_on_information
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      name,
      age,
      gender,
      description,
      profile_picture_url,
      last_seen_location,
      last_seen_time,
      probable_location,      // 🔥 Added here
      address,
      district,
      pincode,
      registered_pincode,
      police_id,
      reward_on_information
    ]);

    res.status(201).json({
      message: "Missing person added successfully",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("Error adding missing person:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addCriminal = async (req, res) => {
  try {
    const police_user_id = req.user.user_id;

    // Get police_id and station_pincode from police_details
    const policeResult = await pool.query(
      'SELECT police_id, station_pincode FROM police_details WHERE user_id = $1',
      [police_user_id]
    );

    if (policeResult.rows.length === 0) {
      return res.status(403).json({ error: "Police account not found." });
    }

    const police_id = policeResult.rows[0].police_id;
    const registered_pincode = policeResult.rows[0].station_pincode;

    const {
      name,
      description,
      profile_picture_url,
      last_seen_location,
      last_seen_time,
      probable_location,
      address,
      district,
      pincode,
      star = 1, // default to 1
      reward_on_information = 0, // default to 0
      age = null,
      gender = null
    } = req.body;

    // ⭐️ Validate star
    if (isNaN(star) || star < 1 || star > 5) {
      return res.status(400).json({
        error: "Invalid 'star' value. It must be an integer between 1 and 5."
      });
    }

    // 💰 Validate reward_on_information
    if (!Number.isInteger(reward_on_information)) {
      return res.status(400).json({
        error: "Invalid 'reward_on_information'. It must be an integer."
      });
    }

    // 🔢 Validate age if provided
    if (age !== null && (!Number.isInteger(age) || age < 0 || age > 150)) {
      return res.status(400).json({
        error: "Invalid 'age'. It must be an integer between 0 and 150."
      });
    }

    // ⚧️ Validate gender if provided
    const validGenders = ['male', 'female', 'other'];
    if (gender !== null && !validGenders.includes(gender.toLowerCase())) {
      return res.status(400).json({
        error: "Invalid 'gender'. Allowed values are 'male', 'female', or 'other'."
      });
    }

    const insertQuery = `
      INSERT INTO criminals (
        name, description,
        profile_picture_url,
        last_seen_location, last_seen_time,
        probable_location,
        address, district, pincode,
        registered_pincode,
        added_by,
        star,
        reward_on_information,
        age,
        gender
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      name,
      description,
      profile_picture_url,
      last_seen_location,
      last_seen_time,
      probable_location,
      address,
      district,
      pincode,
      registered_pincode,
      police_id,
      star,
      reward_on_information,
      age,
      gender
    ]);

    res.status(201).json({
      message: "Criminal added successfully",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("Error adding criminal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getAllMissingAndCriminals = async (req, res) => {
    try {
        const police_user_id = req.user.user_id;

        // 1. Get station_pincode from police_details
        const policeResult = await pool.query(
            'SELECT station_pincode FROM police_details WHERE user_id = $1',
            [police_user_id]
        );
        if (policeResult.rows.length === 0) {
            return res.status(403).json({ error: "Police account not found." });
        }
        const station_pincode = policeResult.rows[0].station_pincode;

        // 2. Fetch missing persons with same registered_pincode
        const missingQuery = `
            SELECT * FROM missing_persons
            WHERE registered_pincode = $1
            ORDER BY created_at DESC
        `;
        const missingResult = await pool.query(missingQuery, [station_pincode]);

        // 3. Fetch criminals with same registered_pincode
        const criminalQuery = `
            SELECT * FROM criminals
            WHERE registered_pincode = $1
            ORDER BY created_at DESC
        `;
        const criminalResult = await pool.query(criminalQuery, [station_pincode]);

        // 4. Return combined response
        console.log(missingResult.rows,criminalResult.rows);
        res.status(200).json({
            success:true,
            missing_persons: missingResult.rows,
            criminals: criminalResult.rows
        });

    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};



const deleteMissingPerson = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await pool.query(
      'DELETE FROM missing_persons WHERE missing_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Missing person not found" });
    }
    console.log(result.rows[0]);
    res.status(200).json({
      message: "Missing person deleted successfully",
      data: result.rows[0]
    });
  } catch (err) {
    console.log(err);
    console.error("Error deleting missing person:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete Criminal by ID (criminal_id remains same)
const deleteCriminal = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM criminals WHERE criminal_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Criminal not found" });
    }

    res.status(200).json({
      message: "Criminal deleted successfully",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Error deleting criminal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getPoliceComplaints,assignOfficerToComplaint ,addCriminal,addMissingPerson,getAllMissingAndCriminals,deleteCriminal,deleteMissingPerson};