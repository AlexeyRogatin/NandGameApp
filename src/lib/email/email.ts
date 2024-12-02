import nodemailer from "nodemailer";
import { EmailError } from "./errors";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD
  }
});

const getData = async (component: React.ReactNode) => {
  const ReactDOMServer = (await import('react-dom/server')).default;
  const staticMarkup = ReactDOMServer.renderToStaticMarkup(component);
  return staticMarkup;
};

export async function sendEmail(to: string, subject: string, element: React.ReactNode) {
  const html = await getData(element);

  const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to,
      subject,
      html 
  };
  
  transporter.sendMail(mailOptions)
      .catch((e) => {
          throw new EmailError("Error when sending an email", e);
      });
}
