import { client, sender } from "./mailtrap.js";

const sendResetPasswordLink = async (email, url) => {
  try {
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #6B46C1; text-align: center;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #333; text-align: center;">
              We received a request to reset your password. To reset your password, please click the button below.
            </p>
            <p style="text-align: center; margin-top: 20px;">
              <a href="${url}" style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #6B46C1;
                color: #ffffff;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 4px;
                text-align: center;
                transition: background-color 0.3s ease;
              ">
                Reset Password
              </a>
            </p>
            <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
              If you did not request a password reset, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    const response = await client.send({
      from: sender,
      to: [{ email }],
      subject: "Password Reset Request",
      html: emailBody,
    });

    console.log("Password reset email sent:", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

export default sendResetPasswordLink;
