// Paste this code in index.js of the Lambda Function
// Replace the following variables

const axios = require("axios");
let API_KEY = process.env.API_KEY;

exports.handler = async (event) => {
	const res = await add_new_url(event.queryStringParameters.val, event.queryStringParameters.sha);
	return {
		statusCode: 200,
		body: JSON.stringify({
			response: res,
		}),
	};
};

async function add_new_url(redir, sha) {
	let data = {
			content: redir,
			message: "added new redirect",
			sha: sha,
		},
		headers = { Authorization: "token " + API_KEY };
	try {
		let val = await axios.put(
			"https://api.github.com/repos/tafakkur/short-url-netlify/contents/_redirects",
			data,
			{
				headers,
			}
		);
		return JSON.stringify(val);
	} catch (error) {
		return error;
	}
}
