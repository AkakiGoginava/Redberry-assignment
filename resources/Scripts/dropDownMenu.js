document
  .querySelector(".dropdown-header")
  .addEventListener("click", function () {
    const options = document.getElementById("dropdown-options");
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
    document.getElementById("dropdown-options").style.display = "none";

    document
      .querySelector(".dropdown-menu")
      .classList.remove("dropdown-menu-expanded");

    document.querySelector(".dropdown-header").querySelector("img").src =
      "resources/SVG/DownArrowSmall.svg";
  }
});

document.querySelectorAll(".dropdown-option").forEach((option) => {
  option.addEventListener("click", function () {
    const selectedValue = this.dataset.value;
    document.querySelector(".dropdown-header span").textContent =
      this.textContent;
    document.getElementById("selected-value").value = selectedValue;

    document.getElementById("dropdown-options").style.display = "none";

    document
      .querySelector(".dropdown-menu")
      .classList.remove("dropdown-menu-expanded");

    document.querySelector(".dropdown-header").querySelector("img").src =
      "resources/SVG/DownArrowSmall.svg";
  });
});
