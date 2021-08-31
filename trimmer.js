let active_redirs, file_sha;

async function get_data() {
	try {
		const response = await axios.get(
			"https://api.github.com/repos/tafakkur/short-url-netlify/contents/_redirects"
		);
		file_sha = response.data.sha;
		active_redirs = atob(response.data.content);
		return true;
	} catch (error) {
		throw error;
	}
}

async function add_redir() {
	let long_url = document.querySelector("#long_url"),
		short_code = document.querySelector("#short_code"),
		get_suff = document.querySelector("#get_stuff");
	long_url.disabled = true;
	short_code.disabled = true;
    get_suff.disabled = true;
	document.querySelector("#new_url").innerHTML = "Please wait while your request is processed.";

	await get_data();

	active_redirs = btoa(
		active_redirs + "/" + short_code.value + " " + long_url.value + " 301" + "\n"
	);

	await axios.get(
		"https://7hr0dawfs6.execute-api.us-east-2.amazonaws.com/default/netlify-url-shortner?val=" +
			escape(active_redirs) +
			"&sha=" +
			escape(file_sha)
	);

	setTimeout(() => {
		short_code.disabled = false;
		long_url.disabled = false;
        get_suff.disabled = false;

		document.querySelector("#new_url").innerHTML = `New short URL created: <br />
    <a href="https://make-short-url.netlify.app/${short_code.value}" target="_blank"
        >https://make-short-url.netlify.app/${short_code.value}</a
    >
    will now redirect to
    <a href="${long_url.value}" target="_blank"> ${long_url.value} </a>`;
	}, 10000);

	for (let i = 0; i < 10; i++) {
		setTimeout(() => {
			document.querySelector("#new_url").innerHTML = `The value will appear in ${10 - i} seconds`;
		}, 1000 * i);
	}
}
