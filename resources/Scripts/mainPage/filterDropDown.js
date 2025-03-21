import { state } from "../global/global.js";
import { renderActiveFilters, renderLists, filterData } from "./main.js";

const filterTab = document.querySelector(".filter-tab");
const dropDownMenu = document.querySelector(".filter-drop-down");
const confirmFilterBtn = document.querySelector(".confirm-filter-btn");

// Reset Filter Button Styles and Close Dropdown Menu
// Optional 'targetBtn' Argument to Avoid Double Reaction on 'targetBtn' if Target is Filter Button
const resetFilterBtns = function (targetBtn = null) {
  // Close Dropdown Menu
  if (!dropDownMenu.classList.contains("hidden"))
    dropDownMenu.classList.toggle("hidden");

  // Check if Target is Filter Button
  filterTab.querySelectorAll(".filter-btn").forEach((btn) => {
    if (btn === targetBtn) return;

    // Deactivate Buttons
    if (btn.classList.contains("active")) btn.classList.toggle("active");
    btn.querySelector("img").src = "resources/SVG/DownArrow.svg";
  });
};

// Generate Markup For Filter Options
// 'type' Argument Determines The Type of Options to Generate
const generateFilterMarkup = function (type) {
  let markup = ``;
  let dataArray = [];

  // Determine Which Data Options to Render
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

  // Create Markup For Filter Options
  dataArray.forEach((item) => {
    if (type !== "employee")
      markup += `<div class="filter">
                  <label>
                  <input class="filter-checkbox" type="checkbox" 
                    data-type="${type}" 
                    data-id="${item.id}" 
                  />
                  <span class="checkbox" 
                    style='${
                      type === "department" ? "border-color:#212529 " : ""
                    }'>
                  </span>
                  </label>
                  <div class="option-name">
                  <label for="${item.id}">${item.name}</label>
                  </div>
                </div>
                `;
    // Markup With Avatar and Surname For Employees
    else
      markup += `<div class="filter">
                  <label class="filter">
                  <input class="filter-checkbox" type="checkbox" data-type="${type}" data-id="${item.id}" />
                  <span class="checkbox"></span>
                  </label>
                  <div class="option-name">
                  <label for="${item.id}"><img src=${item.avatar}> ${item.name} ${item.surname}</label>
                  </div>
                </div>
                  `;
  });

  return markup;
};

// Event Listener For Filter Tab
filterTab.addEventListener("click", function (e) {
  const filterBtn = e.target.closest(".filter-btn");
  // Check if Target is Filter Button
  if (!filterBtn) return;
  // Reset Menu
  resetFilterBtns(filterBtn);

  const markup = generateFilterMarkup(filterBtn.dataset.type);
  const icon = filterBtn.querySelector("img");

  // Activate Target Button
  filterBtn.classList.toggle("active");
  icon.src = icon.src.endsWith("DownArrowPurple.svg")
    ? "resources/SVG/DownArrow.svg"
    : "resources/SVG/DownArrowPurple.svg";
  // Reset Filter Options Menu
  dropDownMenu.querySelector(".filter-input").innerHTML = "";

  // Render Filter Options HTML
  dropDownMenu
    .querySelector(".filter-input")
    .insertAdjacentHTML("beforeend", markup);

  // Single Select if Filtering Employees
  if (filterBtn.dataset.type === "employee") {
    const checkBoxes = filterTab.querySelectorAll(".filter-checkbox");

    // Uncheck Every Other Employee Option
    checkBoxes.forEach((checkBox) => {
      checkBox.addEventListener("change", () => {
        checkBoxes.forEach((check) => {
          if (checkBox !== check) {
            check.checked = false;
          }
        });
      });
    });
  }

  // Check Checkbox if Respective Option is Present in Filter Array
  document.querySelectorAll(".filter-checkbox").forEach((el) => {
    switch (el.dataset.type) {
      case "department":
        if (filterData.departments.includes(parseInt(el.dataset.id)))
          el.checked = true;
        break;
      case "priority":
        if (filterData.priorities.includes(parseInt(el.dataset.id)))
          el.checked = true;
        break;
      case "employee":
        if (filterData.employees.includes(parseInt(el.dataset.id)))
          el.checked = true;
        break;
    }
  });

  // Toggle Menu Based on Target Button State
  if (filterBtn.classList.contains("active"))
    dropDownMenu.classList.remove("hidden");
  else dropDownMenu.classList.add("hidden");
});

// Event Listener For Closing Filter Dropdown Menu if Clicked Outside
window.addEventListener("click", function (e) {
  if (
    // Check if Clicked Outside of Menu
    !e.target.closest(".filter-btn") &&
    !e.target.closest(".filter-drop-down")
  ) {
    // Close Menu
    resetFilterBtns();
  }
});

// Event Listener For Submit Filter Button
confirmFilterBtn.addEventListener("click", function () {
  const dataType = dropDownMenu.querySelector(".filter-checkbox").dataset.type;

  // Check Which Data Type to Filter
  switch (dataType) {
    case "department":
      filterData.departments = [];
      break;
    case "employee":
      filterData.employees = [];
      break;
    case "priority":
      filterData.priorities = [];
      break;
  }

  // Add Ids to Global Filter Array Based on Checked Checkboxes
  // Based on Retrieved Data Type and Id From Checkbox Datasets
  dropDownMenu.querySelectorAll(".filter-checkbox").forEach((el) => {
    if (el.checked) {
      switch (el.dataset.type) {
        case "department":
          filterData.departments.push(parseInt(el.dataset.id));
          break;
        case "employee":
          filterData.employees.push(parseInt(el.dataset.id));
          break;
        case "priority":
          filterData.priorities.push(parseInt(el.dataset.id));
          break;
      }
    }
  });

  sessionStorage.setItem("filterData", JSON.stringify(filterData));
  // Close Filter Menu and Re-render Lists
  resetFilterBtns();
  renderLists();
  renderActiveFilters();
});
