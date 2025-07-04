const otpMap = new Map();

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Set OTP with type (signup or reset)
const setOtp = ({email, otp, type}) => {
  if (otpMap.get(email)) otpMap.delete(email);
  try {
    otpMap.set(email, { 
      otp, 
      type, // store type for later verification
      expiresAt: Date.now() + 5 * 60 * 1000 // expires in 5 minutes
    });
    return { status: true, message: 'OTP set successfully' };
  } catch (error) {
    return { status: false, message: 'Error setting OTP' };
  }
};

// Verify OTP with type
const verifyOtp = ({email, otp, type}) => {
  const record = otpMap.get(email);
  if (!record) return { status: false, message: 'Send OTP first' };

  if (Date.now() > record.expiresAt) {
    otpMap.delete(email);
    return { status: false, message: 'OTP expired, try again' };
  }

  if (record.otp !== otp) {
    return { status: false, message: 'Incorrect OTP' };
  }

  if (record.type !== type) {
    return { status: false, message: `OTP type mismatch. Expected ${record.type}` };
  }

  otpMap.delete(email);
  return { status: true, message: 'OTP verified' };
};




const mailFormat = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP - Nyay Setu</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container { margin: 20px 10px !important; }
          .header { padding: 30px 20px !important; }
          .content { padding: 30px 20px !important; }
          .otp-code { font-size: 36px !important; letter-spacing: 4px !important; }
          .header-title { font-size: 28px !important; }
          .content-title { font-size: 24px !important; }
        }
        @media only screen and (max-width: 480px) {
          .otp-code { font-size: 32px !important; letter-spacing: 3px !important; }
        }
        @media only screen and (max-width: 360px) {
          .otp-code { font-size: 28px !important; letter-spacing: 2px !important; }
        }
      </style>
    </head>
    <body style="margin:0; padding:0; font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); min-height:100vh;">
      <div style="padding: 40px 20px;">
        <div class="container" style="max-width:600px; margin:0 auto; background:#fff; border-radius:20px; box-shadow:0 20px 40px rgba(0,0,0,0.1); overflow:hidden;">
          
          <div class="header" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); padding:40px 30px; text-align:center;">
            <div style="background:rgba(255,255,255,0.1); width:80px; height:80px; border-radius:50%; margin:0 auto 20px; display:flex; align-items:center; justify-content:center;">
              <div style="width:40px; height:40px; background:#fff; border-radius:8px; display:flex; align-items:center; justify-content:center;">
                <span style="color:#667eea; font-size:20px; font-weight:bold;">🔐</span>
              </div>
            </div>
            <h1 class="header-title" style="margin:0; font-size:32px; font-weight:700; color:#fff; text-shadow:0 2px 4px rgba(0,0,0,0.1);">Nyay Setu</h1>
            <p style="margin:8px 0 0; font-size:16px; color:rgba(255,255,255,0.9); font-weight:300;">Bridging Justice with Technology</p>
          </div>

          <div class="content" style="padding:50px 40px; text-align:center; background:#fff;">
            <div style="margin-bottom:30px;">
              <h2 class="content-title" style="color:#2d3748; font-size:28px; font-weight:600; margin:0 0 10px;">Verification Code</h2>
              <p style="font-size:16px; color:#718096; margin:0; line-height:1.5;">Enter this code to complete your authentication</p>
            </div>

            <div style="background:linear-gradient(135deg,#f7fafc 0%,#edf2f7 100%); border:2px dashed #cbd5e0; border-radius:16px; padding:30px 15px; margin:30px 0; position:relative;">
              <div style="position:absolute; top:-1px; left:50%; transform:translateX(-50%); background:#fff; padding:0 15px;">
                <span style="font-size:12px; color:#a0aec0; font-weight:500; text-transform:uppercase; letter-spacing:1px;">Your Code</span>
              </div>
              <div class="otp-code" style="font-size:48px; font-weight:800; color:#667eea; letter-spacing:8px; margin:10px 0; text-shadow:0 2px 4px rgba(102,126,234,0.1); font-family:'Courier New',monospace; word-break:keep-all; white-space:nowrap;">${otp}</div>
            </div>

            <div style="background:linear-gradient(135deg,#fed7d7 0%,#feb2b2 100%); border-left:4px solid #f56565; border-radius:8px; padding:20px; margin:30px 0; text-align:left;">
              <div style="display:flex; align-items:flex-start;">
                <span style="font-size:20px; margin-right:12px; flex-shrink:0;">⚠️</span>
                <div style="flex:1;">
                  <h4 style="margin:0 0 8px; color:#c53030; font-size:16px; font-weight:600;">Security Notice</h4>
                  <p style="margin:0; font-size:14px; color:#742a2a; line-height:1.4;">
                    This code expires in <strong>10 minutes</strong>. Never share your OTP with anyone. Nyay Setu will never ask for your OTP via phone or email.
                  </p>
                </div>
              </div>
            </div>

            <div style="margin:40px 0 20px;">
              <p style="font-size:14px; color:#718096; margin-bottom:20px;">Having trouble? Contact our support team</p>
              <a href="mailto:support@nyaysetu.com" style="display:inline-block; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; text-decoration:none; padding:12px 30px; border-radius:25px; font-weight:600; font-size:14px; box-shadow:0 4px 15px rgba(102,126,234,0.3);">Contact Support</a>
            </div>
          </div>

          <div style="background:linear-gradient(135deg,#f7fafc 0%,#edf2f7 100%); padding:30px 20px; text-align:center; border-top:1px solid #e2e8f0;">
            <div style="margin-bottom:15px;">
              <span style="display:inline-block; width:8px; height:8px; background:#cbd5e0; border-radius:50%; margin:0 4px;"></span>
              <span style="display:inline-block; width:8px; height:8px; background:#a0aec0; border-radius:50%; margin:0 4px;"></span>
              <span style="display:inline-block; width:8px; height:8px; background:#cbd5e0; border-radius:50%; margin:0 4px;"></span>
            </div>
            <p style="margin:0 0 8px; font-size:13px; color:#718096; font-weight:500;">&copy; ${new Date().getFullYear()} Nyay Setu. All rights reserved.</p>
            <p style="margin:0; font-size:12px; color:#a0aec0;">This is an automated message. Please do not reply to this email.</p>
            <div style="margin-top:15px; padding-top:15px; border-top:1px solid #e2e8f0;">
              <p style="margin:0; font-size:11px; color:#a0aec0; line-height:1.4;">
                If you didn't request this code, please ignore this email or contact our support team immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}







module.exports={mailFormat,setOtp,verifyOtp,generateOtp};