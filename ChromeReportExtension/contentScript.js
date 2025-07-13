// contentScript.js

console.log("Content Script Loaded");

const formBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSf2rcqv8d337Wqh6qE2gile9f254AKiIDjSkIVzJEFyDRjZoQ/viewform";
const entryField = "entry.1829093094";

// Filter function for image URLs that might cause Google 400 errors
function isValidImageUrl(url) {
  if (!url) return false;

  const lower = url.toLowerCase();

  // Exclude URLs with common preview or resize query parameters
  if (
    lower.includes("thumbnail") ||
    lower.includes("preview") ||
    lower.includes("=s") ||   // Google image resizing param like =s120
    lower.includes("=w") ||   // width param
    lower.includes("=h") ||   // height param
    lower.includes("=p")      // pixel param
  ) {
    console.log("Filtered out preview/thumbnail URL:", url);
    return false;
  }

  // Optionally exclude data URLs or others here if needed
  if (url.startsWith("data:")) {
    console.log("Filtered out data URL:", url);
    return false;
  }

  return true;
}

function createReportButton(img) {
  const btn = document.createElement("button");
  btn.textContent = "Report AI";
  btn.style.position = "absolute";
  btn.style.zIndex = 9999;
  btn.style.backgroundColor = "#f44336";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.padding = "4px 8px";
  btn.style.borderRadius = "4px";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "12px";
  btn.style.display = "none"; // hidden initially

  btn.onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const url = `${formBaseUrl}?usp=pp_url&${entryField}=${encodeURIComponent(img.src)}`;
    console.log("Opening report form with URL:", url);
    window.open(url, "ReportAIImagePopup", "width=600,height=800,resizable=yes,scrollbars=yes");
  };

  // Wrap image in container to position button properly
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.display = "inline-block";

  if (img.parentElement) {
    img.parentElement.insertBefore(container, img);
    container.appendChild(img);
    container.appendChild(btn);

    // Show button only on hover over container (image or button)
    container.addEventListener("mouseenter", () => {
      btn.style.display = "block";
    });
    container.addEventListener("mouseleave", () => {
      btn.style.display = "none";
    });

    // Position button bottom-left
    btn.style.top = (img.offsetHeight - 28) + "px";
    btn.style.left = "0px";
  }
}

function addReportButtonsToImages() {
  const imgs = document.querySelectorAll("img");
  imgs.forEach(img => {
    if (!img.dataset.reportButtonAdded && isValidImageUrl(img.src)) {
      createReportButton(img);
      img.dataset.reportButtonAdded = "true";
      console.log("Added Report AI button to image:", img.src);
    }
  });
}

// Run initially
addReportButtonsToImages();

// Observe dynamically added images
const observer = new MutationObserver(() => {
  addReportButtonsToImages();
});
observer.observe(document.body, { childList: true, subtree: true });
