const pool = require('./db');

const createTable = async () => {
    try {
        // Create users table
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
                aadhaar_number CHAR(12),
                aadhaar_verified BOOLEAN DEFAULT FALSE,
                aadhaar_front_url TEXT,
                aadhaar_back_url TEXT,

                -- Profile Info
                profile_picture_url TEXT,
                is_profile_complete BOOLEAN DEFAULT FALSE,
                verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (
                    verification_status IN ('unverified', 'pending', 'verified', 'failed')
                ),

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

        // Create complaints table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS complaints (
    complaint_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    assigned_police_id INT REFERENCES users(user_id) ON DELETE SET NULL,

    crime_type VARCHAR(50) NOT NULL CHECK (
        crime_type IN (
            'Assault', 'Domestic Violence', 'Attempt to Murder', 'Murder',
            'Kidnapping / Abduction', 'Sexual Assault / Rape',
            'Theft', 'Burglary / Break-in', 'Robbery', 'Vandalism', 'Arson', 'Trespassing',
            'Cyber Bullying', 'Online Fraud / Scam', 'Identity Theft', 'Phishing Attack',
            'Cyberstalking', 'Hacking / Unauthorized Access',
            'Missing Adult', 'Missing Child', 'Human Trafficking Suspicion',
            'Drunk and Disorderly Conduct', 'Public Nuisance', 'Rioting', 'Illegal Gathering / Protest',
            'Bribery / Corruption', 'Bank Fraud', 'Fake Currency', 'Ponzi / Investment Scam',
            'Tax Evasion', 'Verbal Abuse', 'Workplace Harassment', 'Stalking',
            'Blackmail / Extortion', 'Drug Possession', 'Drug Trafficking', 'Illegal Alcohol Sale',
            'Hit and Run', 'Drunk Driving', 'Reckless Driving', 'Road Rage Incident',
            'Animal Abuse', 'Child Abuse', 'Suicide Attempt Reporting', 'Suspicious Activity', 'Other'
        )
    ),

    description TEXT,

    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'in-progress', 'resolved', 'rejected')
    ),

    remark TEXT, -- ✅ New field for police remark

    location_address TEXT,
    town VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'India',

    crime_datetime TIMESTAMP,
    proof_urls TEXT[],

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

        `);

        console.log("✅ Tables created or verified successfully");

    } catch (err) {
        console.error("❌ Error in creating tables:", err.stack);
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


