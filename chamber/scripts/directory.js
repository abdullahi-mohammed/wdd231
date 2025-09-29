async function loadMembers() {
    try {
        const response = await fetch('./members.json');
        if (!response.ok) throw new Error('Failed to fetch members');
        const members = await response.json();

        renderMembers(members, "grid"); // default view

        // Toggle buttons
        const gridbutton = document.querySelector("#grid");
        const listbutton = document.querySelector("#list");
        const article = document.querySelector("#members");

        gridbutton.addEventListener("click", () => {
            renderMembers(members, "grid");
            gridbutton.classList.add("active");
            listbutton.classList.remove("active");
        });

        listbutton.addEventListener("click", () => {
            renderMembers(members, "list");
            listbutton.classList.add("active");
            gridbutton.classList.remove("active");
        });

    } catch (error) {
        console.error(error);
    }
}

function renderMembers(members, view) {
    const article = document.querySelector("#members");
    article.innerHTML = "";
    article.className = view; // set grid or list class

    members.forEach(member => {
        const div = document.createElement('div');
        div.className = 'member-card';
        div.innerHTML = `
            <h2>${member.name}</h2>
            <p>${member.description}</p>
            <div>
                <img src="${member.image}" alt="${member.name} logo" width="80">
                <p><span>Email:</span> <a href="mailto:${member.contact}">${member.contact}</a></p>
                <p><span>Phone:</span> <a href="tel:${member.phone}">${member.phone}</a></p>
                <p><span>Address:</span> ${member.address}</p>
                <p><span>Website:</span> <a href="${member.website}" target="_blank">${member.website}</a></p>
                <p><span>Membership:</span> ${["Member", "Silver", "Gold"][member.membership - 1]}</p>
            </div>
        `;
        article.appendChild(div);
    });
}

// Weather API integration
const apiKey = 'db83116b371d6e93f2925274897a15dd'; // <-- Replace with your OpenWeatherMap API key
const lat = 8.4966;
const lon = 4.5421;

async function fetchWeather() {
    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    try {
        // Fetch current weather
        const currentRes = await fetch(urlCurrent);
        const currentData = await currentRes.json();

        // Fetch forecast
        const forecastRes = await fetch(urlForecast);
        const forecastData = await forecastRes.json();

        updateCurrentWeather(currentData);
        updateForecast(forecastData);

    } catch (err) {
        console.error('Weather fetch error:', err);
    }
}

function updateCurrentWeather(data) {
    // Select the weather div in your HTML
    const weatherDiv = document.querySelector('section > div:nth-child(2) > div');
    if (!weatherDiv) return;

    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDiv.innerHTML = `
        <img src="${iconUrl}" alt="${data.weather[0].description}">
        <div>
            <p>${Math.round(data.main.temp)}&deg;F</p>
            <p>${data.weather[0].description}</p>
            <p>High: ${Math.round(data.main.temp_max)}&deg;F</p>
            <p>Low: ${Math.round(data.main.temp_min)}&deg;F</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Sunrise: ${formatTime(data.sys.sunrise, data.timezone)}</p>
            <p>Sunset: ${formatTime(data.sys.sunset, data.timezone)}</p>
        </div>
    `;
}

function formatTime(unix, tzOffset) {
    const date = new Date((unix + tzOffset) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateForecast(data) {
    // Select the forecast div in your HTML
    const forecastDiv = document.querySelector('section > div:nth-child(3)');
    if (!forecastDiv) return;

    // Group forecast by day, pick the forecast closest to 12:00 for each day
    const days = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'long' });
        // Only pick one forecast per day, closest to 12:00
        if (!days[day] || Math.abs(date.getHours() - 12) < Math.abs(days[day].hour - 12)) {
            days[day] = {
                temp: Math.round(item.main.temp),
                desc: item.weather[0].description,
                hour: date.getHours()
            };
        }
    });

    // Get today and next two days
    const labels = Object.keys(days).slice(0, 3);
    forecastDiv.innerHTML = `<h3>Weather Forecast</h3>` +
        labels.map(day =>
            `<p><strong>${day}:</strong> ${days[day]?.temp ?? '-'}&deg;F, ${days[day]?.desc ?? ''}</p>`
        ).join('');
}

// Set current year and last modified in the footer
document.addEventListener("DOMContentLoaded", () => {
    const year = new Date().getFullYear();
    // Find the element to insert the year (you can add an id if needed)
    const footerDivs = document.querySelectorAll("footer div");
    // Insert year in the third footer div (adjust if your structure changes)
    if (footerDivs.length > 2) {
        footerDivs[2].innerHTML = footerDivs[2].innerHTML.replace(
            /(\d{4}) airport area chamber of commerce/,
            `${year} airport area chamber of commerce`
        );
        // Set last modified date
        const lastModifiedSpan = document.getElementById("lastModified");
        if (lastModifiedSpan) {
            lastModifiedSpan.textContent = document.lastModified;
        }
    }
});

loadMembers();
// Call weather fetch on page load
fetchWeather();