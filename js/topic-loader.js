document.addEventListener("DOMContentLoaded", () => {
    const topic = window.location.pathname
        .split("/")
        .pop()
        .replace(".html", "");  

    // maps e.g. "calculus-of-variations" → folder name
    const url = `../data/${topic}/psets.json`;

    fetch(url)
        .then(response => response.json())
        .then(data => renderPsets(data))
        .catch(err => {
            document.getElementById("pset-list").innerHTML =
                "<p>Could not load problem sets.</p>";
        });
});

function renderPsets(psets) {
    const container = document.getElementById("pset-list");

    psets.forEach(pset => {
        const item = document.createElement("div");
        item.className = "item";

        item.innerHTML = `
            <h3>${pset.title}</h3>
            <p>${pset.description}</p>
            <a href="../data/${getTopic()}/${pset.file}" target="_blank">Open</a>
        `;

        container.appendChild(item);
    });
}

function getTopic() {
    return window.location.pathname.split("/").pop().replace(".html", "");
}
