import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { config } from 'dotenv';
import { ITicket } from './types';

config();
const server = express();
const upload = multer();
const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use('/public', express.static(process.cwd() + '/public'));

server.get('/', (req: Request, res: Response) => {
  res.sendFile(process.cwd() + '/public/index.html');
});

server.post('/send', upload.none(), (req: Request, res: Response) => {
  const data: ITicket = req.body;
  const mail = {
    sender: data.name,
    to: process.env.EMAIL,
    subject: data.subject,
    html: `<h1>${data.name}</h1> <p> ${data.email} </p> \n<p style="font-size: 1.4rem">${data.message}</p>`,
  };
  mailer.sendMail(mail, (err, _) => {
    if (err) {
      res.status(500).send('Something went wrong. ❕');
    } else {
      res.status(201).redirect('/');
    }
  });
});

module.exports = server;
