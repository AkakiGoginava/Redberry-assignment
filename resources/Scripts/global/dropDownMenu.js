// Create Dropdown Menu Inside Container With id
export const initializeDropdownMenu = function (id) {
  const container = document.getElementById(id);

  const options = container.querySelector(".dropdown-options");
  const header = container.querySelector(".dropdown-header");
  const headerIcon = header.querySelector("img");

  const closeDropDown = function () {
    options.style.display = "none";
    headerIcon.src = "resources/SVG/DownArrowSmall.svg";
    container.classList.remove("dropdown-menu-expanded");
  };

  const clearInput = function () {
    header.querySelector("span").textContent = "";
    container.querySelector(".selected-value").value = "";
  };

  // Generate Markup For Options
  const generateDepartmentsMarkup = function (dataset) {
    let markup = ``;

    dataset.forEach((data) => {
      markup += `<div class="dropdown-option" data-value="${data.id}">${data.name}</div>`;
    });

    return markup;
  };

  // Render Options
  const renderOptions = function (dataset) {
    options.insertAdjacentHTML("beforeend", generateDepartmentsMarkup(dataset));
  };

  // Header Event Listener to Expand Menu
  header.addEventListener("click", function () {
    options.style.display =
      options.style.display === "block" ? "none" : "block";

    container.classList.toggle("dropdown-menu-expanded");

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
  options.addEventListener("click", function (e) {
    const targetOption = e.target.closest(".dropdown-option");
    if (!targetOption) return;

    const selectedValue = targetOption.dataset.value;
    header.querySelector("span").textContent = targetOption.textContent;
    container.querySelector(".selected-value").value = selectedValue;

    closeDropDown();
  });

  return { clearInput, renderOptions };
};

// const options = document.getElementById("dropdown-options");
// const header = document.querySelector(".dropdown-header");
// const menu = document.querySelector(".dropdown-menu");
// const headerIcon = header.querySelector("img");

// const closeDropDown = function () {
//   options.style.display = "none";
//   headerIcon.src = "resources/SVG/DownArrowSmall.svg";
//   menu.classList.remove("dropdown-menu-expanded");
// };

// export const clearInput = function () {
//   header.querySelector("span").textContent = "";
//   document.getElementById("selected-value").value = "";
// };

// // Generate Markup For Options
// const generateDepartmentsMarkup = function (dataset) {
//   let markup = ``;

//   dataset.forEach((data) => {
//     markup += `<div class="dropdown-option" data-value="${data.id}">${data.name}</div>`;
//   });

//   return markup;
// };

// // Render Options
// export const renderOptions = function (dataset) {
//   options.insertAdjacentHTML("beforeend", generateDepartmentsMarkup(dataset));
// };

// // Header Event Listener to Expand Menu
// header.addEventListener("click", function () {
//   options.style.display = options.style.display === "block" ? "none" : "block";

//   menu.classList.toggle("dropdown-menu-expanded");

//   // Switch Header Icon
//   headerIcon.src = headerIcon.src.endsWith("DownArrowSmall.svg")
//     ? "resources/SVG/UpArrow.svg"
//     : "resources/SVG/DownArrowSmall.svg";
// });

// // Close Menu if Clicked Outside
// window.addEventListener("click", function (e) {
//   if (!e.target.closest(".dropdown-menu")) {
//     closeDropDown();
//   }
// });

// // Assign Event Listener to Options Menu
// // Select Input if Target is an Option Div
// document
//   .querySelector(".dropdown-options")
//   .addEventListener("click", function (e) {
//     const targetOption = e.target.closest(".dropdown-option");
//     if (!targetOption) return;

//     const selectedValue = targetOption.dataset.value;
//     header.querySelector("span").textContent = targetOption.textContent;
//     document.getElementById("selected-value").value = selectedValue;

//     closeDropDown();
//   });
