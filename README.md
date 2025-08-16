# ⚖️ NyaySetu [🔗 Live](https://www.nyaysetuindia.space)

**NyaySetu** is a full-stack justice facilitation platform that bridges the gap between **citizens** and **law enforcement**. Citizens can upload sightings or proof, and police officers working on relevant cases can browse and use them — filtered by crime type, location, and time. It brings accountability, traceability, and collaboration to the justice process.

---


## 🧠 Why NyaySetu?

Many people record crimes or suspicious activity but hesitate to approach the police — either due to confusion, fear, or lack of proper channels. **NyaySetu** removes this friction by enabling citizens to report anonymously or directly, and ensures that officers working in the relevant **location/time/crime type** can access these leads effectively.

To further simplify and secure the system, **Aadhar-based verification** has been implemented — users submit full Aadhar details and Aadhar card as proof. Since UIDAI data is not publicly available, an **Inspector manually verifies** the submission before access is granted. This brings authenticity to reports while allowing traceability and responsible access.

This system **streamlines citizen–police collaboration** — enabling officers to act more swiftly and efficiently on public leads.

---

## ✨ Features

### 👤 For Citizens
- Submit sightings of **criminals** or **missing persons** with image/video proof  
- Launch formal **complaints** with location and timestamp  
- Aadhar-based user verification for better accountability  
- Track complaint status, receive officer updates  
- ⭐ Earn **stars** if your uploads help solve a case  
- 🏆 Compete on **leaderboards per pincode**  
- Choose to remain **anonymous** if desired  

---

### 👮 For Police
- Browse all public uploads by **type**, **location**, and **time**  
- Update **missing/criminal** last seen data  
- Assign and manage **complaints** (Inspector → Sub-Inspector)  
- View personal **performance dashboard**  
- Respond to citizen uploads with status/progress  
- Verify users via Aadhar submission panel  

---

### 🛡️ For Admin
- 📧 **Add police officers**; credentials auto-emailed  
- 🎯 Track **station-wise and officer-wise performance**  
- 🔍 Monitor **complaints, uploads, resolution rates**  
- 🔼 Promote / 🔽 Demote officers based on performance  
- 🧠 Enable **surveillance-based insights**  

---

## 🏅 Award System & Leaderboard

- Users earn **stars** when their uploaded lead helps solve a case  
- Each **pincode has its own leaderboard**  
- Encourages healthy civic engagement and public contribution  

---

## 🔐 Authentication & Security

- ✅ **JWT-based authentication**  
- 🎫 **Role-based route protection** using middleware  
- 👁️ Access layers protected for Citizens, Police, and Admins  
- ☁️ Media uploads securely stored on **Cloudinary**  
- 🆔 Aadhar verification layer adds citizen credibility  

---

## ⚙️ Tech Stack

| Layer        | Stack                                |
|--------------|---------------------------------------|
| Frontend     | React + Vite + Tailwind CSS           |
| Backend      | Node.js + Express                     |
| Database     | PostgreSQL                            |
| Media Upload | Cloudinary                            |
| Auth         | JWT, Role-based Middleware            |
| State/Data   | TanStack Query + Axios Interceptors   |

---

## 📁 Environment Configuration

### 📄 server/.env.example

```
DATABASE_URL=postgresql://username:password@host:port/database_name?sslmode=require
PORT=3000

JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

OTP_SECRET=your_random_otp_secret
```

---

### 📄 client/.env.example

```
VITE_API_BASE=http://localhost:3000/api

VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/your_cloud_name/auto/upload
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset

VITE_LOCATIONIQ_TOKEN=your_locationiq_api_key
```

---

## 🚀 Getting Started (Local Setup)

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/nyaysetu.git
cd nyaysetu

# 2. Backend Setup
cd server
cp .env.example .env        # Fill in your real secrets
npm install
npm run dev

# 3. Frontend Setup
cd ../client
cp .env.example .env        # Fill in your real keys
npm install
npm run dev
```

---

## 💡 Contributions

We welcome feature suggestions, bug reports, and community contributions. Help us build a more transparent and accountable justice system together.

---


