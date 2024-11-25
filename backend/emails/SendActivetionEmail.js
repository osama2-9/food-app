import { client, sender } from "./mailtrap.js";

export const sendActivationUrl = async (email, url) => {
  const emailBody = `
  <div class="font-sans text-center text-gray-600" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
    <h2 class="text-3xl font-semibold text-purple-600 mb-4">Account Reactivation Request</h2>
    <p class="text-lg text-gray-800 mb-6">
      We've received your request to reactivate your account. To proceed, click the button below:
    </p>
    <a href="${url}" class="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold text-lg inline-block mb-6 hover:bg-purple-700 transition-all duration-300">
      Reactivate Your Account
    </a>
    <p class="text-sm text-gray-600">
      If you did not request this, please ignore this message.
    </p>
  </div>
    `;
  try {
    const response = await client.send({
      from: sender,
      to: [{ email }],
      subject: "Reactivate Your Account",
      html: emailBody,
    });

    console.log("Password reset email sent:", response);
  } catch (error) {
    console.log(error);
  }
};
