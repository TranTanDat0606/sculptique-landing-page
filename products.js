// Loading Navigate HTML Components
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-include]").forEach(async (el) => {
    const url = el.getAttribute("data-include");

    try {
      const res = await fetch(url);
      const html = await res.text();

      // Parse HTML safely
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Clear & append nodes (NO innerHTML)
      el.replaceChildren(...doc.body.childNodes);
    } catch (err) {
      console.error("Include error:", url, err);
    }
  });
});

// Action Button Watch Details
function toggleAccordion(index) {
  const content = document.getElementById(`content-${index}`);
  const icon = document.getElementById(`icon-${index}`);

  content.classList.toggle("hidden");
  icon.textContent = content.classList.contains("hidden") ? "+" : "×";
}

// As Seen In - Logo Track Animation
const logos = [
  { name: "VOGUE" },
  { name: "GRAZIA" },
  { name: "VOGUE" },
  { name: "Women'sHealth" },
  { name: "VOGUE" },
  { name: "GRAZIA" },
];

const track = document.getElementById("logo-track");

function renderLogos() {
  const items = [...logos, ...logos];

  track.innerHTML = items
    .map(
      (logo) => `
          <span class="logo">
            ${logo.name}
          </span>
        `
    )
    .join("");
}

renderLogos();
