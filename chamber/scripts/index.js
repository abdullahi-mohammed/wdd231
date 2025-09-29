// Replace with your OpenWeatherMap API key
const apiKey = 'db83116b371d6e93f2925274897a15dd';
// Ilorin, Nigeria coordinates
const lat = 8.4966;
const lon = 4.5421;

// Helper to fetch weather data
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

// Update current weather section
function updateCurrentWeather(data) {
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

// Format UNIX time to local time
function formatTime(unix, tzOffset) {
    const date = new Date((unix + tzOffset) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Update 3-day forecast section
function updateForecast(data) {
    // Get forecast for next 3 days at 12:00
    const forecastDiv = document.querySelector('section > div:nth-child(3)');
    if (!forecastDiv) return;

    // Group by date
    const days = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'long' });
        if (!days[day] && date.getHours() === 12) {
            days[day] = {
                temp: Math.round(item.main.temp),
                desc: item.weather[0].description
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

// Run on page load
fetchWeather();

// Footer last modified and year
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("lastModified").textContent = document.lastModified;
    const year = new Date().getFullYear();
    const footerDivs = document.querySelectorAll("footer div");
    if (footerDivs.length > 2) {
        footerDivs[2].innerHTML = footerDivs[2].innerHTML.replace(
            /\d{4} airport area chamber of commerce/,
            `${year} airport area chamber of commerce`
        );
    }
});

// Spotlight logic
async function loadSpotlights() {
    try {
        const response = await fetch('./members.json');
        if (!response.ok) throw new Error('Could not fetch members');
        const members = await response.json();

        // Filter for gold (3) and silver (2) members
        const spotlightMembers = members.filter(m => m.membership === 2 || m.membership === 3);

        // Shuffle and pick 2 or 3
        const shuffled = spotlightMembers.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3);

        // Render spotlights
        const spotlightDiv = document.createElement('section');
        spotlightDiv.className = 'spotlights';
        spotlightDiv.innerHTML = `<h2>Member Spotlights</h2>
            <div class="spotlight-cards">
                ${selected.map(member => `
                    <div class="spotlight-card">
                        <img src="${member.image}" alt="${member.name} logo">
                        <h3>${member.name}</h3>
                        <p><strong>Phone:</strong> <a href="tel:${member.phone}">${member.phone}</a></p>
                        <p><strong>Address:</strong> ${member.address}</p>
                        <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                        <p><strong>Membership:</strong> ${member.membership === 3 ? 'Gold' : 'Silver'}</p>
                    </div>
                `).join('')}
            </div>`;

        // Insert before the members directory
        const main = document.querySelector('main');
        const viewToggle = document.querySelector('.view-toggle');
        main.insertBefore(spotlightDiv, viewToggle);
    } catch (err) {
        console.error('Spotlight error:', err);
    }
}

loadSpotlights();