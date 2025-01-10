import nodemailer from 'nodemailer'; // add dependency too => npm i --save-dev @types/nodemailer
import config from '../config';
/*
 * Turn on two step verification from your gmail
 * create a password from gmail>app passwords> create with app name (ywtb llto qxdm hodx)
 * set host and port
 * set `user` and `pass`
 * set the sender, receiver,  mail subject and body.
 */
export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.', // smtp host for gmail
    port: 587, // smtp port for gmail
    secure: config.NODE_ENV === 'production',
    auth: {
      //  `user` and `pass` values from <https://forwardemail.net>
      user: 'shuvrodevmondal337@gmail.com',
      pass: 'ywtb llto qxdm hodx',
    },
  });
  await transporter.sendMail({
    from: 'shuvrodevmondal337@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within ten mins!', // Subject line
    text: '', // plain text body
    html, // html body
  });
};
