async function processJson(object) {
	const obj = await object.json();

	console.info(obj);

	return {
		temp: obj.currentConditions.temp,
		condition: obj.currentConditions.conditions,
		desc: obj.description,
	};
}

async function getWeather(location) {
	location.toLowerCase();

	try {
		const rawResponse = await fetch(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=TL4R53JS4KYP4FFWVK6FZNGKS`
		);
		const response = await processJson(rawResponse);
		console.log(response);
		return response;
	} catch (error) {
		console.error(error);
	}
}

const submit = document.querySelector("#searchBtn");

submit.addEventListener("click", () => {
	const location = document.querySelector("#locationSearch");

	async function buildDom() {
		const response = await getWeather(location.value);

		const condDisplay = document.querySelector(".condDisplay h4");
		condDisplay.textContent = `${response.condition}`;

		const tempDisplay = document.querySelector(".tempDisplay h1");
		tempDisplay.textContent = `${response.temp}°C`;
	}

	buildDom();
});
