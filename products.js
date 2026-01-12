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
  const accordion = document.getElementById(`accordion-${index}`);
  const content = document.getElementById(`content-${index}`);
  const icon = document.getElementById(`icon-${index}`);

  if (!content || !icon) return;

  if (accordion.classList.contains("border-gray-300")) {
    // đang gray → đổi sang green
    accordion.classList.remove("border-gray-300");
    accordion.classList.add("border-green-600");
  } else {
    // đang green → đổi sang gray
    accordion.classList.remove("border-green-600");
    accordion.classList.add("border-gray-300");
  }

  content.classList.toggle("hidden");

  const img = icon.querySelector("img");
  if (img) {
    img.style.transform = content.classList.contains("hidden") ? "rotate(0deg)" : "rotate(45deg)";
  }
}

// ===============================
// AS SEEN IN - LOGO TRACK
// ===============================
const logos = [
  "vogue.png",
  "grazia-Logo.png",
  "vogue.png",
  "WH_Logo.png",
  "vogue.png",
  "grazia-Logo.png",
  "vogue.png",
  "WH_Logo.png",
  "vogue.png",
  "grazia-Logo.png",
  "vogue.png",
  "WH_Logo.png",
  "vogue.png",
  "grazia-Logo.png",
  "vogue.png",
  "WH_Logo.png",
];

const track = document.querySelector(".logo-track");

logos.concat(logos).forEach((src) => {
  const img = document.createElement("img");
  img.src = `./assets/image/${src}`;
  img.alt = `brand-logo-${src}`;
  track.appendChild(img);
});

// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  await loadIncludes();
  renderLogos();
});
