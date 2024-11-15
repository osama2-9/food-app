import dotenv from 'dotenv';
import { client, sender } from './mailtrap.js';
dotenv.config();

export const sendVC = async (email, verificationCode, verificationCodeURL) => {
    try {
        const emailTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
                    body { font-family: 'Inter', sans-serif; }
                </style>
            </head>
            <body class="bg-gray-100 p-6">
                <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                    <h1 class="text-2xl font-semibold mb-4">Verify Your Email</h1>
                    <p class="mb-4">Thank you for registering! Please use the verification code below to confirm your email address:</p>
                    <div class="bg-blue-100 text-blue-600 font-bold text-lg text-center p-4 rounded mb-4">
                        ${verificationCode}
                    </div>
                    <p class="mb-4">If you didn't register, you can ignore this email.</p>
                    <p class="mb-4">To verify your email, click the link below:</p>
                    <a href="${verificationCodeURL}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Verify Email</a>
                    <p class="mt-6 text-sm text-gray-500">Thank you!</p>
                </div>
            </body>
            </html>
        `;

        const response = await client.send({
            from: sender,
            to: [{ email: email }],
            subject: "Please Verify Your Email",
            html: emailTemplate 
        });

        if (response) {
            console.log("Email sent", response);
        }
    } catch (error) {
        console.error(error);
    }
};
