import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import { config } from "dotenv";

config();
async function main() {
	const server = express();
	const upload = multer();
	const mailer = nodemailer.createTransport({
		host: "my.smtp.host",
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
			text: `${data.name} <${data.email}> \n${data.message}`,
		};
		mailer.sendMail(mail, (err, data) => {
			console.log(data);
			if (err) {
				console.log(err);
				res.status(500).send("Something went wrong.");
			} else {
				res.status(200).send("Email successfully sent to recipient!");
			}
		});
	});

	server.listen(4321, () => console.log("server running on port 4321 🚀"));
}

main();
