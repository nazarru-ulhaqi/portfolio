// js/notes-loader.js
document.addEventListener("DOMContentLoaded", () => {
  initNotesPage().catch(err => {
    console.error("Notes init error:", err);
    const el = document.getElementById("note-list");
    if (el) el.innerHTML = '<p>Could not load notes.</p>';
  });
});

async function initNotesPage() {
  const topic = getTopicFromPath();
  if (!topic) throw new Error("Could not determine topic from URL.");

  const jsonUrl = `../data/${topic}/notes.json`;
  console.log("Loading notes from:", jsonUrl);

  const response = await fetch(jsonUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${jsonUrl}: ${response.status} ${response.statusText}`);
  }

  let notes;
  try {
    notes = await response.json();
  } catch (err) {
    throw new Error(`Failed to parse JSON from ${jsonUrl}: ${err.message}`);
  }

  if (!Array.isArray(notes)) throw new Error("notes.json must be an array.");
  renderNotes(notes, topic);
}

function renderNotes(notes, topic) {
  const container = document.getElementById("note-list");
  if (!container) return;
  container.innerHTML = "";

  notes.forEach(n => {
    const item = document.createElement("div");
    item.className = "item";

    // PDF path inside files/
    const href = `../data/${topic}/files/${n.file}`;

    // optional badge for type (note/solution)
    const badge = n.type ? `<span class="tag" style="margin-left:8px">${escapeHtml(n.type)}</span>` : "";

    item.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:0.75rem">
        <h3 style="margin:0">${escapeHtml(n.title)}</h3>
        ${badge}
      </div>
      <p>${escapeHtml(n.description || "")}</p>
      <a href="${href}" target="_blank" rel="noopener noreferrer">Open</a>
    `;

    container.appendChild(item);
  });
}

function getTopicFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  return last.replace(".html", "");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
