import { state } from "../global.js";
import { renderLists } from "./main.js";

const filterTab = document.querySelector(".filter-tab");
const dropDownMenu = document.querySelector(".filter-drop-down");
const confirmFilterBtn = document.querySelector(".confirm-filter-btn");

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
                <input class="filter-checkbox" type="checkbox" data-type="${type}" data-id="${item.id}" />
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

  document.querySelectorAll(".filter-checkbox").forEach((el) => {
    switch (el.dataset.type) {
      case "department":
        if (state.filter.departments.includes(parseInt(el.dataset.id)))
          el.checked = true;
        break;
      case "priority":
        if (state.filter.priorities.includes(parseInt(el.dataset.id)))
          el.checked = true;
        break;
      case "employee":
        if (state.filter.employees.includes(parseInt(el.dataset.id)))
          el.checked = true;
        break;
    }
  });

  if (filterBtn.classList.contains("active"))
    dropDownMenu.classList.remove("hidden");
  else dropDownMenu.classList.add("hidden");
});

window.addEventListener("click", function (e) {
  if (
    !e.target.closest(".filter-btn") &&
    !e.target.closest(".filter-drop-down")
  ) {
    resetFilterBtns();
  }
});

confirmFilterBtn.addEventListener("click", function () {
  const dataType = dropDownMenu.querySelector(".filter-checkbox").dataset.type;

  switch (dataType) {
    case "department":
      state.filter.departments = [];
      break;
    case "employee":
      state.filter.employees = [];
      break;
    case "priority":
      state.filter.priorities = [];
      break;
  }

  dropDownMenu.querySelectorAll(".filter-checkbox").forEach((el) => {
    if (el.checked) {
      switch (el.dataset.type) {
        case "department":
          state.filter.departments.push(parseInt(el.dataset.id));
          break;
        case "employee":
          state.filter.employees.push(parseInt(el.dataset.id));
          break;
        case "priority":
          state.filter.priorities.push(parseInt(el.dataset.id));
          break;
      }
    }
  });

  resetFilterBtns();
  renderLists();
});
