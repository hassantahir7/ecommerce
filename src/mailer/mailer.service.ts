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

  async sendEmailForOrderConfirmation(
    recepient: string,
    subject: string,
    email_body: string,
  ): Promise<any> {
    const transporter = this.getTransporter();
    const mailOptions = this.getMailOptionsForOrder(recepient, subject, email_body);

    transporter.sendMail(mailOptions, (error: { message: any }) => {
      if (error) {
        console.log('Error in sending mail(mailer service)', error.message);
      } else {
        console.log('Email Sent');
      }
    });
  }


  getMailOptionsForOrder(recepient: string, subject: string, email_body: string) {
    const mailOptions = {
      from: `"Arabic Latina" <${process.env.APP_EMAIL}>`, // Pretty sender name
      to: recepient,
      subject: subject,
      html: email_body
    };

    return mailOptions;
  }


  async sendNewsletter(
    recepient: string,
    subject: string,
  ): Promise<any> {
    const transporter = this.getTransporter();
    const mailOptions = this.getMailOptionsNewsletter(recepient, subject,);

    transporter.sendMail(mailOptions, (error: { message: any }) => {
      if (error) {
        console.log('Error in sending mail(mailer service)', error.message);
      } else {
        console.log('Email Sent');
      }
    });
  }

  getMailOptionsNewsletter(recepient: string, subject: string) {
    console.log(recepient);
    const mailOptions = {
      from: `"Dr Wafa Clinic" <${process.env.APP_EMAIL}>`, // Pretty sender name
      to: recepient,
      subject: subject,
      html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Arabica Latina Account Has Been Created</title>
    <link href="https://res.cloudinary.com/drascgtap/image/upload/v1742559043/BookingEngine/kf73varpuifvoedtsbdc.png
" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Manrope', sans-serif; background-color: #f5ebe0; color: #8b4513; text-align: center;">
    <div style="width: 100%; margin: 0; padding: 0;">
        <div style="max-width: 500px; margin: 0 auto; padding: 0;">
            <div style="padding: 15px 0;">
                <img src="https://res.cloudinary.com/drascgtap/image/upload/v1742559043/BookingEngine/kf73varpuifvoedtsbdc.png" alt="Arabica Latina" style="width: 150px; height: auto;" />
            </div>
            <div style="padding: 0;">
                <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 30px; font-family: serif;">
                    Your Arabica Latina Account Has Been Created
                </h1>
                <div style="margin: 0; padding: 0; display: block; line-height: 0;">
                    <img src="https://res.cloudinary.com/drascgtap/image/upload/v1742559539/BookingEngine/n0hyygqxxtx8a5ncmrpc.png" alt="Model with Scarf" style="width: 100%; height: auto; display: block;" />
                </div>
            </div>
        </div>
        <div style="width: 100%; background-color: white; padding: 0; margin: 0; display: block;">
            <div style="max-width: 500px; margin: 0 auto; padding: 0;">
                <div style="padding-top: 30px;">
                    <h2 style="font-size: 20px; font-weight: bold; margin: 0 0 15px 0;">
                        Get 10% OFF on your first purchase
                    </h2>
                    <p style="font-size: 16px; margin: 0 0 20px 0;">Code: Arabica10OFF</p>
                    <div style="margin-bottom: 30px;">
                        <a href="https://www.arabiclatina.com/" style="background-color: #8b4513; color: white; padding: 12px 30px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">
                            SHOP NOW
                        </a>
                    </div>
                </div>
                <div style="border-top: 1px solid #d3b8a0; margin: 0 15px;"></div>
                <div style="margin: 30px 0;">
                    <a href="https://www.arabiclatina.com/" style="border: 1px solid #8b4513; color: #8b4513; padding: 10px 25px; text-decoration: none; font-size: 14px; display: inline-block;">
                        CONTACT US
                    </a>
                </div>
                <div style="margin: 30px 0; display: flex; justify-content: center; gap: 15px;">
    <a href="#" style="color: #8b4513; font-size: 20px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px;">
    </a>
    <a href="#" style="color: #8b4513; font-size: 20px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" style="width: 24px; height: 24px;">
    </a>
    <a href="#" style="color: #8b4513; font-size: 20px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 24px; height: 24px;">
    </a>
    <a href="#" style="color: #8b4513; font-size: 20px; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 24px; height: 24px;">
    </a>
</div>

                <div style="margin: 0; padding: 20px 0; font-size: 12px;">
                    <a href="#" style="color: #8b4513; text-decoration: none; margin: 0 8px;">Privacy Policy</a> |
                    <a href="#" style="color: #8b4513; text-decoration: none; margin: 0 8px;">Contact Us</a> |
                    <a href="https://www.arabiclatina.com/" style="color: #8b4513; text-decoration: none; margin: 0 8px;">View in Browser</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`,
    };

    return mailOptions;
  }

  async sendEmailForInquiries(
    recepient: string,
    subject: string,
    email_body: string,
  ): Promise<any> {
    const transporter = this.getTransporter();
    const mailOptions = this.getMailOptionsForInquiries(recepient, subject, email_body);

    

    transporter.sendMail(mailOptions, (error: { message: any }) => {
      if (error) {
        console.log('Error in sending mail(mailer service)', error.message);
      } else {
        console.log('Email Sent');
      }
    });
  }


  getMailOptionsForInquiries(recepient: string, subject: string, email_body: string) {
    const mailOptions = {
      from: `"Arabic Latina" <${process.env.APP_EMAIL}>`, // Pretty sender name
      to: recepient,
      subject: subject,
      html: email_body
    };

    return mailOptions;
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
