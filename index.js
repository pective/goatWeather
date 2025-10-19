const container = document.querySelector(".container");

async function processJson(object) {
	const obj = await object.json();

	console.info(obj);

	return {
		resolvedAddress: obj.resolvedAddress,
		temp: Math.round(obj.currentConditions.temp),
		condition: obj.currentConditions.conditions,
		desc: obj.description,
		currentDay: obj.days[0],
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

const locationSearch = document.querySelector("#locationSearch");

async function buildDom(responsePromise) {
	const response = await responsePromise;

	locationSearch.textContent = response.resolvedAddress;

	const resultHtml = `
			<div class="tempDisplay">
				<div class="condDisplay">
					<h4>${response.condition}</h4>
				</div>
		
			<h1>${response.temp}°C</h1>
			</div>

			<div class="boxClass insightsBox">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trophy</title><path d="M18 2C17.1 2 16 3 16 4H8C8 3 6.9 2 6 2H2V11C2 12 3 13 4 13H6.2C6.6 15 7.9 16.7 11 17V19.08C8 19.54 8 22 8 22H16C16 22 16 19.54 13 19.08V17C16.1 16.7 17.4 15 17.8 13H20C21 13 22 12 22 11V2H18M6 11H4V4H6V11M20 11H18V4H20V11Z" /></svg>
				<h4>Insights</h4>
				<p>${response.desc}</p>
			</div>

			<div class="boxClass hourlyBox">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>clock-time-four</title><path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12S17.5 2 12 2M16.3 15.2L11 12.3V7H12.5V11.4L17 13.9L16.3 15.2Z" /></svg>
				<h4>Hourly Forecast</h4>

				<div class="hourlyElementContainer">

			</div>
		`;

	container.innerHTML = resultHtml;

	async function buildHourly(response) {
		response.currentDay.hours.forEach((e) => {
			const hourlyElement = `
				<div class="hourlyElement">
					<div class="hourlyTemp">${Math.round(e.temp)}°</div>
					<div class="hourlyTime">${response.currentDay.hours.indexOf(e)}:00</div>
				</div>
			`;
			document.querySelector(".hourlyElementContainer").innerHTML +=
				hourlyElement;
		});
	}

	buildHourly(response);
}

locationSearch.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		buildDom(getWeather(locationSearch.value));
	}
});

//initial dom
buildDom(getWeather("Bangkok"));
