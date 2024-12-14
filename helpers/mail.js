import nodemailer from "nodemailer"
import 'dotenv/config'

export const codeSend = async (toMail, code) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'Gazinyr19',
      pass: process.env.MAIL_PASS
    }
  })

  const mailOptions = {
    from: 'Gazinyr19@yandex.ru',
    to: toMail,
    subject: 'Hello World!',
    html: `
    <h1>Код для верификации</h1>
    <p>код: ${code}</p>
  `
  }

  await transporter.sendMail(mailOptions)
}