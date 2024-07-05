const nodemailer = require("nodemailer");


export const sendEmailNotification = (
  recipient: string,
  index: string,
  triggerPrice: string,
  type: string,
  currentPrice: string,
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: recipient,
    subject: `IndexPulse - Price alert for ${index}`,
    text: `The current price of ${index} is ${currentPrice} which is ${type} the trigger price of ${triggerPrice}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
