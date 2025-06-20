const pool = require('./db');

const createTable = async () => {
    try {
        await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,

        -- Basic Info
        name VARCHAR(255),
        dob DATE,
        gender VARCHAR(20),
        phone_number VARCHAR(15) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password TEXT,

        -- Aadhaar Info
        aadhaar_number CHAR(12) ,
        aadhaar_verified BOOLEAN DEFAULT FALSE,
        aadhaar_front_url TEXT,
        aadhaar_back_url TEXT,

        -- Profile Info
        profile_picture_url TEXT,
        is_profile_complete BOOLEAN DEFAULT FALSE,
        verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified','failed')),

        -- Role
        role VARCHAR(20) CHECK (role IN ('citizen', 'police', 'admin')),

        -- Address
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        town VARCHAR(100),
        district VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        country VARCHAR(100) DEFAULT 'India',

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `);

        console.log("✅ Table created or verified successfully");
    } catch (err) {
        console.error("❌ Error in creating table:", err.stack);
    }
};

module.exports = { createTable };



// const pool = require('./db');

// const createTable = async () => {
//     try {
//         await pool.query(`
//             DROP TABLE IF EXISTS 
//                 crime_search_logs,
//                 crime_reports,
//                 police_activity,
//                 missing_persons,
//                 complaints,
//                 news,
//                 users
//             CASCADE;
//         `);
//         console.log("All tables dropped successfully.");
//     } catch (err) {
//         console.error("Error dropping tables:", err.stack);
//     }
// };
// module.exports={createTable}


