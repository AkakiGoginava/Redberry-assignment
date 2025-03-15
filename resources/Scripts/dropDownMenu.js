const options = document.getElementById("dropdown-options");
const header = document.querySelector(".dropdown-header");
const menu = document.querySelector(".dropdown-menu");
const headerIcon = header.querySelector("img");

const closeDropDown = function () {
  options.style.display = "none";
  headerIcon.src = "resources/SVG/DownArrowSmall.svg";
  menu.classList.remove("dropdown-menu-expanded");
};

export const clearInput = function () {
  header.querySelector("span").textContent = "";
  document.getElementById("selected-value").value = "";
};

// Header Event Listener to Expand Menu
header.addEventListener("click", function () {
  options.style.display = options.style.display === "block" ? "none" : "block";

  menu.classList.toggle("dropdown-menu-expanded");

  // Switch Header Icon
  headerIcon.src = headerIcon.src.endsWith("DownArrowSmall.svg")
    ? "resources/SVG/UpArrow.svg"
    : "resources/SVG/DownArrowSmall.svg";
});

// Close Menu if Clicked Outside
window.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown-menu")) {
    closeDropDown();
  }
});

// Assign Event Listener to Options Menu
// Select Input if Target is an Option Div
document
  .querySelector(".dropdown-options")
  .addEventListener("click", function (e) {
    const targetOption = e.target.closest(".dropdown-option");
    if (!targetOption) return;

    const selectedValue = targetOption.dataset.value;
    header.querySelector("span").textContent = targetOption.textContent;
    document.getElementById("selected-value").value = selectedValue;

    closeDropDown();
  });
