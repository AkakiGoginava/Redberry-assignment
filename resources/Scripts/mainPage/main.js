import { state, months, priorities } from "../global/global.js";
import * as createEmployee from "../global/createEmployee.js";

// Generate Markup For Specific Task
const generateMarkup = function (task) {
  let { description } = task;

  // Format Text if Longer Than 100 Chars
  if (description.length > 100) {
    description = description.slice(0, 100) + "...";
  }

  // Split For Formatting
  const due_date = task.due_date.split("-");

  return `
    <div class="task-card">
      <div class="task-card-header">
          <div class="task-card-tags">
            <div class="priority priority-${task.priority.name.toLowerCase()}">
              <img src="${task.priority.icon}" />
              <p class="priority-${task.priority.name.toLowerCase()}">${
    priorities[task.priority.id - 1]
  }</p>
            </div>
            <p class="department department-${task.department.id}">${
    task.department.name
  }</p>
          </div>
          <p class="task-date">${due_date[2]} ${months[due_date[1] - 1]}, ${
    due_date[0]
  }</p>
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
    const { filter } = state;

    if (
      (filter.departments.includes(task.department.id) ||
        filter.departments.length === 0) &&
      (filter.employees.includes(task.employee.id) ||
        filter.employees.length === 0) &&
      (filter.priorities.includes(-(task.priority.id - 4)) ||
        filter.priorities.length === 0)
    )
      document
        .querySelector(locationClassName)
        .querySelector(".task-list")
        .insertAdjacentHTML("beforeend", taskCardHTML);
  });
};

// Render Lists After Loading Main Page
renderLists();
