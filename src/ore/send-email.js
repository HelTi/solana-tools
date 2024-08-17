import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// 加载.env文件中的配置（如果存在）
dotenv.config();
// 使用 .env 中的环境变量
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL

console.log('smtpUser--,smtpPassword', smtpUser, smtpPassword)

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT, // SMTP 端口
    secure: true, // 使用 SSL
    auth: {
        user: smtpUser,
        pass: smtpPassword
    }
});

function sendMailHandle(msg = '警告：', subject = 'ore 挖矿终止警告') {
    const mailOptions = {
        from: smtpUser,
        to: RECEIVER_EMAIL,
        subject: subject,
        text: msg
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('发送失败:', error);
        } else {
            console.log('邮件发送成功:', info.response);
        }
    });
}

export const sendMail = sendMailHandle