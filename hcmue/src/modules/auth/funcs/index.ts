import * as nodemailer from 'nodemailer';

export const sendEmail = async () => {
  const transporter = nodemailer.createTransport({
    host: 'gmail',
    port: 465,
    ignoreTLS: true,
    secure: true,
    auth: {
      user: 'hopthusinhvien@hcmue.edu.vn',
      pass: 'hotroSV@20222',
    },
  });

  //   await transporter.sendEmail({
  //     from: 'Dev',
  //     to: 'lekhphuong@gmail.com',
  //     subject: 'Test mail service',
  //     text: 'Test email',
  //   });

  //   const transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //       user: 'hopthusinhvien@hcmue.edu.vn',
  //       pass: 'generated password'
  //     }
  //   });

  const mailOptions = {
    from: 'hopthusinhvien@hcmue.edu.vn',
    to: 'lekhphuong@gmail.com',
    subject: 'Subject',
    text: 'Email content',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      // do something useful
    }
  });
};
