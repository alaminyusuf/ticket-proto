import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import { config } from "dotenv";

config();
async function main() {
	const server = express();
	const upload = multer();
	const mailer = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASS,
		},
	});

	server.use(express.json());
	server.use(express.urlencoded({ extended: false }));
	server.use("/public", express.static(process.cwd() + "/public"));

	server.get("/", (req: Request, res: Response) => {
		res.sendFile(process.cwd() + "/public/index.html");
	});

	server.post("/send", upload.none(), (req: Request, res: Response) => {
		const data = req.body;
		const mail = {
			sender: `${data.name} <${data.email}>`,
			to: process.env.EMAIL,
			subject: data.subject,
			html: `<h1>${data.name}</h1> <p> ${data.email} </p> \n<p style="font-size: 1.4rem">${data.message}</p>`,
		};
		mailer.sendMail(mail, (err, data) => {
			if (err) {
				res.status(500).send("Something went wrong. ❕");
			} else {
				res.status(200).redirect("/");
			}
		});
	});

	server.listen(4321, () => console.log("server running on port 4321 🚀"));
}

main();
