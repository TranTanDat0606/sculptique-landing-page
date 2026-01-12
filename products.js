import { logos, formulaData, questionData } from "./mocks/index.js";

// HTML INCLUDE (SUPPORT NESTED)
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

      if (url.includes("formula.html")) {
        renderFormula();
      }
    } catch (err) {
      console.error("Include error:", url, err);
    }
  }

  renderFormula();
}

// DOM READY
document.addEventListener("DOMContentLoaded", async () => {
  await loadIncludes();
  renderLogos();
  renderFormula();
  renderQuestion();
});

// ACCORDION (WATCH DETAILS)
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

// LOGO TRACK RENDERING
function renderLogos() {
  const track = document.querySelector(".logo-track");

  Array.from({ length: 30 })
    .flatMap(() => logos)
    .forEach((src) => {
      const img = document.createElement("img");
      img.src = `./assets/image/${src}`;
      img.alt = `brand-logo-${src}`;
      track.appendChild(img);
    });
}

// FORMULA ACCORDION SETUP
function setupFormulaAccordion() {
  const items = document.querySelectorAll(".product-lymph-ingredient");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // nếu trước đó chưa mở → mở nó
      if (!isOpen) {
        item.classList.add("is-open");
      } else {
        item.classList.remove("is-open");
      }
    });
  });
}

// FORMULA RENDERING
function renderFormula() {
  const renderBox = document.getElementById("formula-render");

  if (!renderBox) {
    console.warn("formula-render not found yet");
    return;
  }

  renderBox.innerHTML = formulaData
    .map(
      (item) => `
    <div class="product-lymph-ingredient p-6 border-[1.5px] bg-white">

      <p class="product_lymph-ingr-subtitle flex items-center justify-center gap-2">
        <span>
          <img  width="16" src="${item.subtitleIcon}" />
        </span>
        <span class="text-[#0c7c00]">${item.subtitle}</span>
      </p>

      <div class="product_lymph-ingr-thumb max-h-[120px] mx-auto my-3">
        <img class="h-20 mx-auto" loading="lazy" src="${item.image}" />
      </div>

      <div class="product_lymph-ingr-more-info flex justify-between items-center">
        <h5 class="font-semibold font-['Trirong']">${item.title}</h5>
        <img class="max-w-6 arrow" src="${item.arrowIcon}" />
      </div>

      <div class="product_lymph-ingr-content pt-3 leading-[18.2px] text-sm">
        <p>${item.description}</p>
        <p>[Study: ${item.study}]</p>
      </div>
    </div>
  `
    )
    .join("");

  setupFormulaAccordion();
}

// QUESTION ACCORDION SETUP
function setupQuestionAccordion() {
  const items = document.querySelectorAll(".product_faq-item");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // nếu trước đó chưa mở → mở nó
      if (!isOpen) {
        item.classList.add("is-open");
      } else {
        item.classList.remove("is-open");
      }
    });
  });
}

// QUESTION RENDERING
function renderQuestion() {
  const renderQuestion = document.getElementById("product_faq_container");

  if (!renderQuestion) {
    console.warn("render-Question not found yet");
    return;
  }

  renderQuestion.innerHTML = questionData
    .map(
      (item) => `
      <div class="product_faq-item px-6 py-5 border-b border-[white]">
        <div class="product_faq-question flex items-center justify-between">
          <div class="product_faq_item text-lg/[23.4px]">${item.question}</div>
          <img class="max-w-6 arrow" src="${item.arrowIcon}" />
        </div>
        <div class="product_fag-desc">
          <p class="pt-4">${item.answer}</p>
           ${item.subAnswer ? `<p class="mt-3">${item.subAnswer}</p>` : ""}
        </div>
      </div>
  `
    )
    .join("");

  setupQuestionAccordion();
}
