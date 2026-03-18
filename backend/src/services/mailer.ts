import nodemailer from 'nodemailer';
import { qr } from './qr';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: false,
  auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendQrEmail = async (email: string, name: string, id:string, slug:string, token:string)=>{
  try{
    if(!email){
      throw new Error("cannot find participant mail");
      
    }
    const qrImage = await qr(id,slug,token);
    const message = await transporter.sendMail({
      from: `Valid8 ${process.env.EMAIL_USER}`,
    to:`${email}`,
    subject:`Your Event Check-in QR Code for ${slug}`,
    html:`<div style"text-align: center; font-family: sans-sarif;">
    <h1>Hello ${name}</h1>
    <h2>Show this QR code at check-in</h2>
    <img src="${qrImage}" width="250"/>`,
    });
    console.log(`Email send to ${email}: ${message.messageId}`);
    return{success: true};
  }catch(err){
    console.log(`mailer error`,err);
    return{ success:false,err};
  }
}; 