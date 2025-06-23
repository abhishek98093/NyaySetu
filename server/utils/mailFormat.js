const policeWelcome = (EMAIL, PASSWORD) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Nyay Setu</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0f7ff; margin: 0; padding: 20px; color: #333;">
  <div style="max-width: 600px; background: linear-gradient(to bottom, #ffffff, #f8fbff); margin: 20px auto; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0, 80, 150, 0.1); border-top: 5px solid #1a73e8;">
    <div style="text-align: center; margin-bottom: 25px;">
      <div style="background-color: #1a73e8; color: white; padding: 15px; border-radius: 10px; display: inline-block;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Nyay Setu</h1>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Justice Bridge Platform</p>
      </div>
    </div>

    <h2 style="color: #1a73e8; font-size: 22px; text-align: center; margin: 20px 0 10px;">Welcome Aboard, Officer!</h2>
    
    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
      Dear Officer,<br><br>
      We're thrilled to welcome you to <strong style="color: #1a73e8;">Nyay Setu</strong> — the citizen-first crime reporting platform that's transforming community safety. Your account has been successfully created!
    </p>

    <div style="background: linear-gradient(to right, #f0f7ff, #e3f2fd); padding: 20px; border-radius: 8px; border-left: 4px solid #1a73e8; margin-bottom: 25px;">
      <h3 style="color: #1a73e8; margin-top: 0; font-size: 18px;">Your Login Credentials:</h3>
      <p style="margin: 15px 0 10px;"><strong style="color: #0d47a1;">Username (Email):</strong> <span style="background-color: #e3f2fd; padding: 3px 8px; border-radius: 4px; font-family: monospace;">${EMAIL}</span></p>
      <p style="margin: 10px 0;"><strong style="color: #0d47a1;">Temporary Password:</strong> <span style="background-color: #e3f2fd; padding: 3px 8px; border-radius: 4px; font-family: monospace;">${PASSWORD}</span></p>
    </div>

    <div style="background-color: #fff8e1; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
      <p style="margin: 0; color: #5d4037; font-size: 15px;">
        <strong>Important:</strong> You'll be prompted to change your password on first login. For security reasons, please do this immediately and keep your credentials confidential.
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://nyay-setu.gov/login" style="background: linear-gradient(to right, #1a73e8, #0d47a1); color: white; padding: 14px 35px; text-decoration: none; border-radius: 30px; font-weight: 600; display: inline-block; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16); transition: all 0.3s;">Access Your Dashboard Now</a>
    </div>

    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
      With Nyay Setu, you're now equipped with powerful tools to:<br>
      <span style="color: #1a73e8;">✓</span> Receive real-time crime reports<br>
      <span style="color: #1a73e8;">✓</span> Streamline case management<br>
      <span style="color: #1a73e8;">✓</span> Enhance community engagement<br>
      <span style="color: #1a73e8;">✓</span> Access critical analytics
    </p>

    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
      <p style="font-size: 12px; color: #757575; margin-bottom: 5px;">Need help? Contact our support team at support@nyay-setu.gov</p>
      <p style="font-size: 11px; color: #9e9e9e; margin: 5px 0;">© 2025 Nyay Setu. All rights reserved.</p>
      <p style="font-size: 11px; color: #9e9e9e; margin: 5px 0;">Delhi Police Headquarters, New Delhi, India</p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = { policeWelcome };
