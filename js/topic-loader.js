// js/topic-loader.js
document.addEventListener("DOMContentLoaded", () => {
  initTopicPage().catch(err => {
    console.error("Initialization error:", err);
    const el = document.getElementById("pset-list");
    if (el) el.innerHTML = '<p>Could not load problem sets.</p>';
  });
});

async function initTopicPage() {
  const topic = getTopicFromPath();
  if (!topic) {
    throw new Error("Could not determine topic from URL.");
  }

  // Build URL to JSON relative to current page location.
  // Example result: "../data/calculus-of-variations/psets.json"
  const jsonUrl = `../data/${topic}/psets.json`;

  // Useful debug: show the URL we try to fetch
  console.log("Loading psets from:", jsonUrl);

  // If you're opening files with file:// you may get blocked — check console.
  const response = await fetch(jsonUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${jsonUrl}: ${response.status} ${response.statusText}`);
  }

  let psets;
  try {
    psets = await response.json();
  } catch (err) {
    throw new Error(`Failed to parse JSON from ${jsonUrl}: ${err.message}`);
  }

  if (!Array.isArray(psets)) {
    throw new Error("psets.json must be an array of objects.");
  }

  renderPsets(psets, topic);
}

function renderPsets(psets, topic) {
  const container = document.getElementById("pset-list");
  if (!container) {
    console.warn("No #pset-list element found.");
    return;
  }

  container.innerHTML = ""; // clear

  psets.forEach(pset => {
    const item = document.createElement("div");
    item.className = "item";

    // If you store PDFs inside a `files/` folder:
    const pdfHref = `../data/${topic}/files/${pset.file}`;

    item.innerHTML = `
      <h3>${escapeHtml(pset.title)}</h3>
      <p>${escapeHtml(pset.description || "")}</p>
      <a href="${pdfHref}" target="_blank" rel="noopener noreferrer">Open</a>
    `;

    container.appendChild(item);
  });
}

// derive 'calculus-of-variations' from e.g. /exercises/calculus-of-variations.html
function getTopicFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  return last.replace(".html", "");
}

// small helper to avoid XSS if you ever use user-provided data
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
