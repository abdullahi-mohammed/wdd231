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
                <img src="./images/${member.image}" alt="${member.name} logo" width="80">
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

loadMembers();