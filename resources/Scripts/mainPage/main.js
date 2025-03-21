import {
  state,
  months,
  priorities,
  departmentColors,
} from "../global/global.js";
import * as createEmployee from "../global/createEmployee.js";

const clearFilterBtn = document.querySelector(".clear-filter-btn");
const activeFilterContainer = document.querySelector(".filter-div-container");

if (!(performance.navigation.type === 1)) {
  sessionStorage.removeItem("filterData");
}

// Load Filter Data From Storage
export const filterData = sessionStorage.getItem("filterData")
  ? JSON.parse(sessionStorage.getItem("filterData"))
  : {
      departments: [],
      priorities: [],
      employees: [],
    };

// Generate Markup For Specific Task
const generateMarkup = function (task) {
  let description = task.description ?? "";

  // Format Text if Longer Than 100 Chars
  if (description.length > 100) {
    description = description.slice(0, 100) + "...";
  }

  // Split For Formatting
  const due_date = task.due_date.split("-");

  return `
    <div class="task-card" onclick="window.location.href='taskPage.html?id=${
      task.id
    }'">
      <div class="task-card-header">
          <div class="task-card-tags">
            <div class="priority priority-${priorities[task.priority.id - 1]}">
              <img src="${task.priority.icon}" />
              <p class="priority-${priorities[task.priority.id - 1]}">${
    task.priority.name
  }</p>
            </div>
            <p class="department department-${
              task.department.id
            }" style="background-color: ${
    departmentColors[task.department.id % 4]
  }">${task.department.name}</p>
          </div>
          <p class="task-date">${due_date[2].slice(0, 2)} ${
    months[due_date[1] - 1]
  }, ${due_date[0]}</p>
        </div>

        <div class="task-body">
          <h6 class="task-name">${task.name}</h6>
          <p class="task-desc">
            ${description}
          </p>
        </div>

        <div class="task-footer">
          <img
            class="task-mini-avatar"
            src="${task.employee.avatar}"
          />
          <div class="task-comment-count">
            <img src="resources/SVG/Comment.svg" />
            <span>${task.total_comments}</span>
          </div>
        </div>
    </div>`;
};

// Render Every List
export const renderLists = function () {
  // Empty Lists Before Filling
  document.querySelectorAll(".task-list").forEach((list) => {
    list.innerHTML = "";
  });

  // Assign List Location Based on Status
  state.taskArray.forEach((task) => {
    let locationClassName;
    switch (task.status.id) {
      case 1:
        locationClassName = ".list-pending";
        break;
      case 2:
        locationClassName = ".list-inprogress";
        break;
      case 3:
        locationClassName = ".list-testing";
        break;
      case 4:
        locationClassName = ".list-finished";
        break;
    }

    const taskCardHTML = generateMarkup(task);

    // Filter if Respective Filter Array is NOT Empty
    if (
      (filterData.departments.includes(task.department.id) ||
        filterData.departments.length === 0) &&
      (filterData.employees.includes(task.employee.id) ||
        filterData.employees.length === 0) &&
      (filterData.priorities.includes(task.priority.id) ||
        filterData.priorities.length === 0)
    )
      document
        .querySelector(locationClassName)
        .querySelector(".task-list")
        .insertAdjacentHTML("beforeend", taskCardHTML);
  });
};

// Render Active Filter Tab
export const renderActiveFilters = function () {
  let markup = ``;

  // Identify Filter Data Type And Id
  Object.values(filterData).forEach((dataSet, i) => {
    if (!dataSet) return;
    dataSet.forEach((dataId) => {
      let dataContainerName;
      let dataType;
      switch (i) {
        case 0:
          dataContainerName = "departmentArray";
          dataType = "departments";
          break;
        case 1:
          dataContainerName = "priorityArray";
          dataType = "priorities";
          break;
        case 2:
          dataContainerName = "employeeArray";
          dataType = "employees";
          break;
      }

      // Find Relevant Data to Access Its Name
      const data = state[dataContainerName].find((data) => data.id === dataId);

      // Generate Markup
      let { name } = data;
      if (data.surname) name = data.name + " " + data.surname;

      markup += `<div class="active-filter" data-type="${dataType}" data-id="${dataId}">
                  ${name}<img class="filter-x-btn" src="resources/SVG/x.svg" />
                </div>`;
    });
  });

  // Hide/Unhide Clear Filter Button
  if (markup) clearFilterBtn.classList.remove("hidden");
  else clearFilterBtn.classList.add("hidden");

  activeFilterContainer.innerHTML = "";
  activeFilterContainer.insertAdjacentHTML("afterbegin", markup);
};

// Event Listener For Individual Filter Option Removal
document.querySelector(".active-filter-tab").addEventListener("click", (e) => {
  const targetBtn = e.target.closest(".filter-x-btn");

  if (!targetBtn) return;

  const dataType = targetBtn.closest(".active-filter").dataset.type;
  const dataId = targetBtn.closest(".active-filter").dataset.id;

  const index = filterData[dataType].findIndex((data) => data.id === dataId);
  filterData[dataType].splice(index, 1);

  sessionStorage.setItem("filterData", JSON.stringify(filterData));
  renderLists();
  renderActiveFilters();
});

// Event Listener For Clear Filter Button
clearFilterBtn.addEventListener("click", () => {
  Object.keys(filterData).forEach((item) => {
    filterData[item] = "";
  });

  sessionStorage.setItem("filterData", JSON.stringify(filterData));
  renderActiveFilters();
  renderLists();
});

// Render Lists and Active Filters
renderLists();
renderActiveFilters();
