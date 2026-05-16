const commonOptions = require("../config/common");

const generateResetPasswordEmail = ({ name, resetUrl }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:40px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.05);">

      <h2 style="color:#333;">Password Reset Request</h2>

      <p style="font-size:15px; color:#555;">
        Hi <b>${name}</b>,
      </p>

      <p style="font-size:15px; color:#555;">
        We received a request to reset your password. Click the button below to set a new password.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="${resetUrl}"
           style="background:#4f46e5; color:#fff; padding:12px 24px;
                  text-decoration:none; border-radius:6px; display:inline-block;">
          Reset Password
        </a>
      </div>

      <p style="font-size:13px; color:#777;">
        This link will expire in <b>15 minutes</b>. If you did not request this, you can safely ignore this email.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

      <p style="font-size:12px; color:#aaa; text-align:center;">
        © ${new Date().getFullYear()} ${commonOptions.company.name}. All rights reserved.
      </p>
    </div>
  </div>
  `;
};

module.exports = {
  generateResetPasswordEmail,
};