const options = document.getElementById("dropdown-options");

const closeDropDown = function () {
  options.style.display = "none";
  document.querySelector(".dropdown-header").querySelector("img").src =
    "resources/SVG/DownArrowSmall.svg";
  document
    .querySelector(".dropdown-menu")
    .classList.remove("dropdown-menu-expanded");
};

export const clearInput = function () {
  document.querySelector(".dropdown-header span").textContent = "";
  document.getElementById("selected-value").value = "";
};

document
  .querySelector(".dropdown-header")
  .addEventListener("click", function () {
    options.style.display =
      options.style.display === "block" ? "none" : "block";

    document
      .querySelector(".dropdown-menu")
      .classList.toggle("dropdown-menu-expanded");

    document.querySelector(".dropdown-header").querySelector("img").src =
      document
        .querySelector(".dropdown-header")
        .querySelector("img")
        .src.endsWith("DownArrowSmall.svg")
        ? "resources/SVG/UpArrow.svg"
        : "resources/SVG/DownArrowSmall.svg";
  });

window.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown-menu")) {
    closeDropDown();
  }
});

document
  .querySelector(".dropdown-options")
  .addEventListener("click", function (e) {
    const targetOption = e.target.closest(".dropdown-option");
    if (!targetOption) return;

    const selectedValue = targetOption.dataset.value;
    document.querySelector(".dropdown-header span").textContent =
      targetOption.textContent;
    document.getElementById("selected-value").value = selectedValue;

    closeDropDown();
  });
