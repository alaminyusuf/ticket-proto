const form = document.getElementById("contact-form");

const formEvent = form.addEventListener("submit", (event) => {
	event.preventDefault();
	let mail = new FormData(form);
	console.log(mail);
	sendMail(mail);
});

const sendMail = (mail) => {
	console.log("sent");
	fetch("http://localhost:3000/send", {
		method: "post",
		body: mail,
	}).then((response) => {
		return response.json();
	});
};
