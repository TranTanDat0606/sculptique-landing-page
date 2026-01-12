import { logos, formulaData, questionData, realStoriesData } from "./mocks/index.js";

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
  renderStories();
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

// Real Stories SETUP
function setupStoriesAccordion() {
  const items = document.querySelectorAll(".product_ugc-video");

  items.forEach((item) => {
    const video = item.querySelector("video");

    item.addEventListener("click", () => {
      const isPlay = item.classList.contains("is-play");

      // Pause tất cả video khác (optional nhưng rất nên)
      document.querySelectorAll(".product_ugc-video").forEach((el) => {
        if (el !== item) {
          el.classList.remove("is-play");
          const v = el.querySelector("video");
          v.pause();
          v.currentTime = 0;
        }
      });

      if (!isPlay) {
        item.classList.add("is-play");
        video.play();
      } else {
        item.classList.remove("is-play");
        video.pause();
      }
    });
  });
}

// Real Stories RENDERING
function renderStories() {
  const renderStories = document.getElementById("real_stories-content");

  if (!renderStories) {
    console.warn("render real stories not found yet");
    return;
  }

  renderStories.innerHTML = realStoriesData
    .map(
      (item) => `
    <div class="product_ugc-video p-2 rounded-lg w-full min-h-[523px] rounded-sm relative">
      <img class="play-icon absolute top-[50%] left-[50%] w-[32px]" src="${item.playIcon}"/>
      <video class="w-full min-h-[523px] rounded-sm object-cover" playsinline ">
        <source src="${item.sourceVideo}" type="video/mp4" />
      </video>
    </div>
  `
    )
    .join("");

  setupStoriesAccordion();
  initRealStoriesCarousel();
}

// Real Stories Actions Next/Prev
function initRealStoriesCarousel() {
  const items = Array.from(document.querySelectorAll(".product_ugc-video"));
  const dots = Array.from(document.querySelectorAll(".slick-dots li"));
  const prevBtn = document.getElementById("product_carousel-prev");
  const nextBtn = document.getElementById("product_carousel-next");

  const visibleCount = 4;
  let currentIndex = 0;

  function renderVisibleItems() {
    items.forEach((item, index) => {
      item.style.display = index >= currentIndex && index < currentIndex + visibleCount ? "block" : "none";
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("slick-active", i === currentIndex);
    });
  }

  // DOT CLICK
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;

      if (currentIndex > items.length - visibleCount) {
        currentIndex = items.length - visibleCount;
      }

      renderVisibleItems();
    });
  });

  // NEXT / PREV
  nextBtn.addEventListener("click", () => {
    if (currentIndex < items.length - visibleCount) {
      currentIndex++;
      renderVisibleItems();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderVisibleItems();
    }
  });

  renderVisibleItems();
}
