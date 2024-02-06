const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.subscribe = async function (email, value, *****) {
  // Function to send a subscription message to the user and to aquamob's subscription address.
  try {
    // Create a transporter to for nodemailer per the documentation.
    const transporter = nodemailer.createTransport({
      host: "*****",
      port: 465,
      secure: true,
      auth: {
        user: "*****",
        pass: process.env.PASS_USER_SUBSCRIBE,
      },
    });

    // Create the email and subject.
    let html, subject;
    if (value) {
      html = `
    <h1>Welcome to Email Notifications</h1>
    <h3>from Aquamob NOLA</h3>
    <p>Your email address has been saved as: ${email}</p> 
`;
      subject = "You have successfully subscribed!";
    } else {
      html = `
    <h1>Welcome to Email Notifications</h1>
    <h3>for Aquamob NOLA</h3>
    <p>To verify your email address: ${email},<br />please <a href="*****">CLICK HERE</a></p>
    <p>If you did not make this request, we apologize for the mistake; please ignore this email.</p>
    `;
      subject = "Please Confirm Your Subscription Request";
    }

    // Send the email using the transporter created earlier.
    let info = await transporter.sendMail({
      from: `'"Subscription Notification" <*****>'`,
      to: `${email}`,
      bcc: `*****`,
      subject,
      html,
    });

    // Once the email is sent, log to the console so it will be in the site logs.
    console.log("Message sent: " + info.messageId);
  } catch (err) {
    console.log(err);
  }
};

module.exports.info = async function (body) {
  // Function to send a user message to aquamob's info address.
  try {
    const transporter = nodemailer.createTransport({
      host: "*****",
      port: 465,
      secure: true,
      auth: {
        user: "*****",
        pass: process.env.PASS_USER_INFO,
      },
    });

    const html = `
    <h1>New Message Received</h1>
    <h3>from: ${body.fullName}</h3>
    <p>email: ${body.email}</p>  
    <p>message: ${body.message}</p>
`;

    let info = await transporter.sendMail({
      from: `'"Message Notification" <*****>'`,
      to: "*****",
      subject: "New Message from User",
      html: html,
    });

    console.log("Message sent: " + info.messageId);
  } catch (err) {
    console.log(err);
  }
};
