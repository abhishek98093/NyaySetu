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

        -- Contribution Points
        contribution_points INT DEFAULT 0,

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
    
    assigned_badge VARCHAR(20) REFERENCES police_details(badge_number) ON DELETE SET NULL,


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
    title TEXT,

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
    case_file_url TEXT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

        `);

        await pool.query(`
    CREATE TABLE IF NOT EXISTS police_details (
        police_id SERIAL PRIMARY KEY,
        user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
        badge_number VARCHAR(20) UNIQUE NOT NULL,
        must_reset_password BOOLEAN DEFAULT TRUE,


        -- Station Info
        station_name VARCHAR(255),
        station_code VARCHAR(50),
        station_pincode VARCHAR(10),
        station_address TEXT,
        district VARCHAR(100),
        state VARCHAR(100),

        -- Optional Role Info
        rank VARCHAR(50) CHECK (rank IN ('Inspector', 'Sub-Inspector')),

        shift_time VARCHAR(50),

        -- Availability & Status
        is_available BOOLEAN DEFAULT TRUE,  -- for duty assignment
        status VARCHAR(20) DEFAULT 'active' CHECK (
            status IN ('active', 'on_leave', 'suspended', 'retired')
        ),

        -- Contact Info (if needed)
        official_email VARCHAR(255),
        emergency_contact VARCHAR(15),

        -- Metadata
        last_login TIMESTAMP,
        remarks TEXT,

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

            await pool.query(`
               CREATE TABLE IF NOT EXISTS missing_persons (
    missing_id SERIAL PRIMARY KEY,

    -- Basic Info
    name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(20),

    -- Description
    description TEXT,

    -- Profile Picture
    profile_picture_url TEXT,

    -- Last Seen Info
    last_seen_location TEXT,
    last_seen_time TIMESTAMP,

    -- Address Info
    address TEXT,          -- Absolute place or detailed address
    district VARCHAR(100),
    probable_location TEXT,
    pincode VARCHAR(10),

    -- Registered Pincode (where case is registered)
    registered_pincode VARCHAR(10),

    -- Price on Information (reward amount)
    reward_on_information INTEGER,

    -- Status Info
    status VARCHAR(20) DEFAULT 'active' CHECK (
        status IN ('active', 'found', 'closed')
    ),

    -- Added By Police
    added_by INT REFERENCES police_details(police_id) ON DELETE SET NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



                `);

            await pool.query(
                `
                CREATE TABLE IF NOT EXISTS criminals (
    criminal_id SERIAL PRIMARY KEY,

    -- Basic Info
    name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(20),

    -- Description
    description TEXT,

    -- Profile Picture
    profile_picture_url TEXT,

    -- Last Seen Info
    last_seen_location TEXT,
    last_seen_time TIMESTAMP,

    -- Probable Location (police assessment)
    probable_location TEXT,

    -- Address Info
    address TEXT,          -- Absolute place or detailed address
    district VARCHAR(100),
    pincode VARCHAR(10), --probable address pincode

    -- Registered Pincode (where case is registered)
    registered_pincode VARCHAR(10),

    star INTEGER CHECK (star BETWEEN 1 AND 5),

    reward_on_information NUMERIC,

    -- Status Info
    status VARCHAR(20) DEFAULT 'wanted' CHECK (
        status IN ('wanted', 'arrested', 'closed')
    ),

    -- Added By Police
    added_by INT REFERENCES police_details(police_id) ON DELETE SET NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`
            );
            await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
        lead_id SERIAL PRIMARY KEY,

        user_id INT REFERENCES users(user_id) ON DELETE SET NULL,

        title VARCHAR(255) NOT NULL CHECK (
            title IN (
                'Person Running Suspiciously',
                'Car Driving Over Speed Limit',
                'Bike Racing on Road',
                'Group of People Fighting',
                'Animal Injured on Road',
                'Person Carrying Weapon',
                'Unknown Person Lurking Around',
                'Drunk Driver Sighting',
                'Street Light Not Working',
                'Broken Road or Pothole',
                'Car Parked Illegally',
                'Fire or Smoke Seen',
                'Theft in Progress',
                'Person Asking for Help',
                'Loud Noise or Disturbance',
                'Woman or Child Crying Alone',
                'Illegal Construction Activity',
                'Garbage Dumped on Road',
                'Water Leakage or Pipeline Burst',
                'Electricity Wire Hanging Low',
                'Dangerous Dog Roaming',
                'Public Harassment Incident',
                'Person Taking Photos Suspiciously',
                'Car With Broken Number Plate',
                'Vehicle Abandoned for Long Time',
                'Crowd Gathering Suddenly',
                'Road Blocked by Protest',
                'Person Being Beaten',
                'Possible Kidnapping Scene',
                'Person Selling Drugs',
                'Stranger Knocking Doors Randomly',
                'Shop Selling Illegal Items',
                'Car Accident Seen',
                'Child Begging Alone',
                'Man Following Woman',
                'Loud Argument in Public',
                'Broken Traffic Signal',
                'Unauthorized Vendor on Footpath',
                'Tree Fallen on Road',
                'Stranger Trying to Enter Houses',
                'Person Throwing Stones at Vehicles',
                'Bus Overcrowded Dangerously',
                'Vehicle Emitting Excessive Smoke',
                'Person Falling Unconscious',
                'Elderly Person Needing Help',
                'Lost Child Spotted',
                'Snake or Wild Animal Sighting',
                'Speeding Truck or Lorry',
                'Person Selling Fake Products',
                'Large Gathering Without Permission'
            )
        ),

        media_urls JSONB NOT NULL, -- stores up to 3 media URLs as object

        description TEXT NOT NULL,

        incident_datetime TIMESTAMP NOT NULL, -- new field added

        location_address TEXT,
        town VARCHAR(100),
        district VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        country VARCHAR(100) DEFAULT 'India',

        anonymous BOOLEAN DEFAULT FALSE,

        status VARCHAR(20) DEFAULT 'pending' CHECK (
            status IN ('pending', 'reviewed', 'verified', 'rejected')
        ),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);



            await pool.query(
                `CREATE TABLE IF NOT EXISTS updates (
    update_id SERIAL PRIMARY KEY,

    -- Type of Entity Update Belongs To
    type VARCHAR(20) NOT NULL CHECK (type IN ('missing', 'criminal')),

    -- Reference ID in missing_persons or criminals table
    ref_id INT NOT NULL,

    -- Who Updated
    updated_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    updated_by_role VARCHAR(20) NOT NULL CHECK (updated_by_role IN ('police', 'citizen')),

    -- Update Details
    update_text TEXT,
    proof_url TEXT,

    -- Location Info
    address TEXT,          -- Absolute place or detailed address
    district VARCHAR(100),
    pincode VARCHAR(10),

    -- Time of Sighting
    time_of_sighting TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
            );


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


