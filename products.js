// ===============================
// HTML INCLUDE (SUPPORT NESTED)
// ===============================
async function loadIncludes(root = document) {
  const includeElements = root.querySelectorAll("[data-include]");

  for (const el of includeElements) {
    const url = el.getAttribute("data-include");
    if (!url) continue;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}`);

      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Replace content safely
      el.replaceChildren(...doc.body.childNodes);
      el.removeAttribute("data-include");

      // 🔁 LOAD INCLUDE LỒNG NHAU
      await loadIncludes(el);
    } catch (err) {
      console.error("Include error:", url, err);
    }
  }
}

// ===============================
// ACCORDION (WATCH DETAILS)
// ===============================
function toggleAccordion(index) {
  const content = document.getElementById(`content-${index}`);
  const icon = document.getElementById(`icon-${index}`);

  if (!content || !icon) return;

  content.classList.toggle("hidden");
  icon.textContent = content.classList.contains("hidden") ? "+" : "×";
}

// ===============================
// AS SEEN IN - LOGO TRACK
// ===============================
const logos = [
  { name: "VOGUE" },
  { name: "GRAZIA" },
  { name: "VOGUE" },
  { name: "Women's Health" },
  { name: "VOGUE" },
  { name: "GRAZIA" },
];

function renderLogos() {
  const track = document.getElementById("logo-track");
  if (!track) return;

  const items = [...logos, ...logos]; // duplicate for infinite feel

  track.innerHTML = items
    .map(
      (logo) => `
        <span class="text-xl font-semibold tracking-wide opacity-70">
          ${logo.name}
        </span>
      `
    )
    .join("");
}

// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  await loadIncludes();
  renderLogos();
});
