// Set up Clock

let today = new Date();
const dateDisplay = document.getElementById("date");
const timeDisplay = document.getElementById("time");

dateDisplay.textContent = getFormattedDate(today);

function getFormattedDate(dateobj, format = "en-GB") {
  return dateobj.toLocaleDateString(
    format, // locale
    {
      // options
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

timeDisplay.textContent = getFormattedTime(today);
function getFormattedTime(
  dateobj,
  format = "en-GB",
  options = { hour: "2-digit", minute: "2-digit", second: "2-digit" }
) {
  return dateobj.toLocaleTimeString(
    format, // locale
    options
  );
}

function tick() {
  const time = new Date();
  timeDisplay.textContent = getFormattedTime(time);
  if (time.getDate() !== today.getDate()) {
    today = time;
    dateDisplay.textContent = getFormattedDate(today);
  }
}

tick();
setInterval(tick, 1000);

// Weather

const weatherMount = document.getElementById("weather-mount");
weatherMount.innerHTML = `
<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;

const city_name = "London, UK";
const API_key = "38156ee648f17645a3ed8ccbf2306d5d";

// create the URL
const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}&units=metric`;

try {
  const response = await fetch(weatherEndpoint);
  if (!response.ok) throw response;

  const data = await response.json();

  renderWeather(data);
} catch (err) {
  console.log("🚀 ~ file: main.js ~ line 22 ~ err", err);
  weatherMount.textContent = err.message; // 'Error: Server request failed'
  weatherMount.innerHTML = `<div class="alert alert-info" role="alert">
    ${err.message}
  </div>`;
}

function renderWeather(data) {
  console.log("🚀 ~ file: main.js ~ line 35 ~ renderWeather ~ data", data);

  const {
    name,
    main: { temp },
    wind: { speed, deg },
  } = data;

  weatherMount.innerHTML = `
<div class="card text-center text-bg-light mb-3 border-dark" style="width: 40rem; height: 47rem">
<img src="images/London-Skyline.jpg" class="card-img-top" alt="London-Skyline" style="height: 25rem;">
  <div class="card-body">
    <h2 class="card-header">${name}</h2>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Temperature: ${temp}&deg;C</li>
    <li class="list-group-item">Wind Speed: ${speed}km per hour</li>
    <li class="list-group-item">Wind Direction: ${deg}&deg</li>
  </ul>
</div>
`;
}

// Film

const avatarMount = document.getElementById("film-mount");

avatarMount.innerHTML = `
<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;

// create the URL
const avatarEndpoint = `https://api.sampleapis.com/avatar/info`;

try {
  const response = await fetch(avatarEndpoint);
  if (!response.ok) throw response;

  const data = await response.json();

  renderAvatar(data);
} catch (err) {
  console.log("🚀 ~ file: main.js ~ line 196 ~ err", err);
  avatarMount.textContent = err.message; // 'Error: Server request failed'
  avatarMount.innerHTML = `<div class="alert alert-info" role="alert">
    ${err.message}
  </div>`;
}

function renderAvatar(data) {
  console.log("🚀 ~ file: main.js ~ line 204 ~ renderAvatar ~ data", data);

  const {
    0: { synopsis, yearsAired, genres },
  } = data;

  avatarMount.innerHTML = `
  <div class="card text-center text-bg-light mb-3 border-dark" style="width: 40rem; height: 47rem;">
  <img src="images/Film.jpg" class="card-img-top" alt="Film" style=" height: 25rem;">
    <div class="card-body">
      <h2 class="card-header">Avatar</h2>
      <p class="card-text">${synopsis}</p>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Shown between: ${yearsAired}</li>
  </div>
  `;
}

// News

const newsDisplay = document.getElementById("news-mount");

function showSpinner(area) {
  area.innerHTML = `<div class="text-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;
}

function showError(area, message) {
  area.innerHTML = `<p>${message}</p>`;
}

const newsAPIURL = new URL("https://gnews.io/api/v4/");

const topHeadlinesEndpointURL = new URL(
  newsAPIURL.toString() + "top-headlines"
);
// console.log("topHeadlinesEndpointURL", topHeadlinesEndpointURL.toString());

const searchEndpointURL = new URL(newsAPIURL.toString() + "search");
// console.log("searchURL", searchURL.toString());

const API_KEY = "6b1cdd1969073a29640db7f813d88724";
const newsAPIURLParams = new URLSearchParams();
newsAPIURLParams.set("lang", "en");
newsAPIURLParams.set("token", API_KEY);
// console.log("newsAPIURLParams", newsAPIURLParams.toString());

async function loadNews(area = newsDisplay, renderNews = () => {}) {
  showSpinner(area);
  try {
    const response = await fetch(
      `${topHeadlinesEndpointURL.toString()}?${newsAPIURLParams.toString()}`
    );
    if (!response.ok) throw response;
    const data = await response.json();
    // console.log("news data", data);
    renderNews(data.articles);
  } catch (err) {
    showError(area, err.statusText || err.message);
  }
}

const renderNews = (articles = [], area = newsDisplay) => {
  const list = document.createElement("ul");
  list.className = "list-group";

  for (const { image, title, url } of articles) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.innerHTML = `
      <img src="${image}" alt="" width="100" class="story-avatar" />
      <a href="${url}" target="_blank"><span class="visually-hidden">Opens in new tab</span> ${title}</a>
    `;

    list.append(listItem);
  }

  area.replaceChildren(list);
};

loadNews(newsDisplay, renderNews);

// load every 4 hours
const loadInterval = 1000 * 60 * 60 * 4;

setInterval(() => {
  loadDynamicWeather(weatherDisplay, renderWeather);
  loadNews(newsDisplay, renderNews);
}, loadInterval);
