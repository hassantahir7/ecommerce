import { Injectable } from '@nestjs/common';
require('dotenv').config();
const nodemailer = require('nodemailer');

@Injectable()
export class MailerService {
  async sendEmail(
    recepient: string,
    subject: string,
    email_body: string,
  ): Promise<any> {
    const transporter = this.getTransporter();
    const mailOptions = this.getMailOptions(recepient, subject, email_body);

    transporter.sendMail(mailOptions, (error: { message: any }) => {
      if (error) {
        console.log('Error in sending mail(mailer service)', error.message);
      } else {
        console.log('Email Sent');
      }
    });
  }

  getTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use secure connection
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });
  }

  getMailOptions(recepient: string, subject: string, email_body: string) {
    const mailOptions = {
      from: `"Arabic Latina" <${process.env.APP_EMAIL}>`, // Pretty sender name
      to: recepient,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              background-color: #FBC02D;
              color: #ffffff;
              text-align: center;
              padding: 20px;
            }
            .email-body {
              padding: 20px;
              color: #333333;
              text-align: center;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              color: #FBC02D;
              margin: 20px 0;
            }
            .email-footer {
              text-align: center;
              font-size: 14px;
              color: #666666;
              padding: 20px;
              border-top: 1px solid #dddddd;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              color: #ffffff;
              background-color: #FBC02D;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin-top: 20px;
            }
            .button:hover {
              background-color: #e5a100;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Arabic Latina</h1>
            </div>
            <div class="email-body">
              $
                    <p>This is a one-time verification code.</p>
                    <p class="otp">Your OTP: <span>${email_body}</span></p>
                    <p style="margin-top: 20px;">Thank you for choosing Arabic Latina.!</p>
            </div>
            <div class="email-footer">
              &copy; ${new Date().getFullYear()} Arabic Latina. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    return mailOptions;
  }
}
