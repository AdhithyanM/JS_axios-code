const express = require("express");
const app = express();
const axios = require('axios');
const axiosInstance = axios.create({baseURL: "https://jsonplaceholder.typicode.com/"});

app.get("/async", async (req, res) => {
	try {
		const response = await axiosInstance({
			url: "users",
			method: "get",
		});
		res.status(200).json(response.data);
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

app.post("/async/post/", async (req, res) => {
	try {
		const response = await axiosInstance.post("posts", {
			title: "Foo",
			body: "bar",
			userID: 1
		});
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

app.listen(2400, () => {
	console.log("Server started at port 2400");
});