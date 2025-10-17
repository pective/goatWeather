const container = document.querySelector(".container");

async function processJson(object) {
	const obj = await object.json();

	console.info(obj);

	return {
		temp: Math.round(obj.currentConditions.temp),
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

		return {
			temp: 0,
			condition: "None",
			desc: "Error: Check console",
		};
	}
}

const submit = document.querySelector("#searchBtn");

async function buildDom(responsePromise) {
	const response = await responsePromise;

	const resultHtml = `
			<div class="tempDisplay">
				<div class="condDisplay">
					<h4>${response.condition}</h4>
				</div>
		
			<h1>${response.temp}°C</h1>
			</div>

			<div class="boxClass insightsBox">
				<h4>Insights</h4>
				<p>${response.desc}</p>
			</div>

			<div class="boxClass hourlyBox">
				<h4>Hourly Forecast</h4>

				
			</div>
		`;

	container.innerHTML = resultHtml;
}

submit.addEventListener("click", () => {
	const location = document.querySelector("#locationSearch");

	buildDom(getWeather(location.value));
});

//initial dom
buildDom(getWeather("Bangkok"));
