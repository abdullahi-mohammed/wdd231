// Set timestamp field value to current date/time when form loads
document.addEventListener("DOMContentLoaded", () => {
    const timestamp = document.getElementById("timestamp");
    if (timestamp) {
        timestamp.value = new Date().toISOString();
    }
    // Set last modified date in footer
    const lastModified = document.getElementById("lastModified");
    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
});

// Modal open/close logic for membership info
document.querySelectorAll('.info-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const modal = document.getElementById(this.dataset.modal);
        if (modal) {
            modal.style.display = 'block';
            modal.focus();
        }
    });
});
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', function () {
        const modal = document.getElementById(this.dataset.modal);
        if (modal) {
            modal.style.display = 'none';
        }
    });
});
window.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = "none";
        });
    }
});
window.onclick = function (event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};