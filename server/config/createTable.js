const client = require('./db');

const createTable = async () => {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    
    -- Basic Details
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    aadhaar_number CHAR(12) UNIQUE NOT NULL CHECK (aadhaar_number ~ '^\d{12}$'),

    -- Verification Flags
    email_verified BOOLEAN DEFAULT FALSE,
    aadhaar_verified BOOLEAN DEFAULT FALSE,

    -- Address Fields
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    town VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

        `);

        console.log("Table created or verified successfully");
    } catch (err) {
        console.error("❌ Error in creating table:", err.stack);
    }
};

module.exports = { createTable };


// const client = require('./db');

// const createTable = async () => {
//     try {
//         await client.query(`
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


