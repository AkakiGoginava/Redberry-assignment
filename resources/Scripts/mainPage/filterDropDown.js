import { state, months } from "../global.js";

const filterTab = document.querySelector(".filter-tab");
const dropDownMenu = document.querySelector(".filter-drop-down");

const resetFilterBtns = function (targetBtn = null) {
  if (!dropDownMenu.classList.contains("hidden"))
    dropDownMenu.classList.toggle("hidden");

  filterTab.querySelectorAll(".filter-btn").forEach((btn) => {
    if (btn === targetBtn) return;

    if (btn.classList.contains("active")) btn.classList.toggle("active");

    btn.querySelector("img").src = "resources/SVG/DownArrow.svg";
  });
};

const generateFilterMarkup = function (type) {
  let markup = ``;
  let dataArray = [];

  switch (type) {
    case "department":
      dataArray = state.departmentArray;
      break;
    case "priority":
      dataArray = state.priorityArray;
      break;
    case "employee":
      dataArray = state.employeeArray;
      break;
    default:
      console.error("Invalid filter type");
      return "";
  }

  dataArray.forEach((item) => {
    markup += `<label class="filter">
                <input type="checkbox" id="${item.id}" />
                <span></span>
                <label for="${item.id}">${item.name}</label>
              </label>`;
  });

  return markup;
};

filterTab.addEventListener("click", function (e) {
  const filterBtn = e.target.closest(".filter-btn");
  if (!filterBtn) return;

  resetFilterBtns(filterBtn);

  const markup = generateFilterMarkup(filterBtn.dataset.type);
  const icon = filterBtn.querySelector("img");

  filterBtn.classList.toggle("active");
  icon.src = icon.src.endsWith("DownArrowPurple.svg")
    ? "resources/SVG/DownArrow.svg"
    : "resources/SVG/DownArrowPurple.svg";

  dropDownMenu.querySelector(".filter-input").innerHTML = "";

  dropDownMenu
    .querySelector(".filter-input")
    .insertAdjacentHTML("beforeend", markup);

  if (filterBtn.classList.contains("active"))
    dropDownMenu.classList.remove("hidden");
  else dropDownMenu.classList.add("hidden");
});

window.addEventListener("click", function (e) {
  if (
    !e.target.closest(".filter-btn") &&
    !e.target.closest(".filter-drop-down")
  )
    resetFilterBtns();
});
