import {
  state,
  TOKEN,
  server,
  resetLabel,
  validateLabel,
  fetchData,
} from "../global/global.js";
import * as createEmployee from "../global/createEmployee.js";
import { initializeDropdownMenu } from "../global/dropDownMenu.js";

const taskSubmitBtn = document.querySelector(".submit-task-btn");
const taskNameInput = document.querySelector(".task-name-input");
const taskDescInput = document.querySelector(".task-desc-input");
const taskStatusInput = document.querySelector(".task-status-input");
const taskPriorityInput = document.querySelector(".task-priority-input");
const taskDepartmentInput = document.querySelector(".task-department-input");
const taskEmployeeInput = document.querySelector(".task-employee-input");
const taskDateInput = document.getElementById("realDateInput");
const taskDateDisplay = document.getElementById("customDateInput");

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

// Format The Tomorrow Date as DD/MM/YYYY For The Date Input
const year = tomorrow.getFullYear();
const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
const day = String(tomorrow.getDate()).padStart(2, "0");

const formattedDate = `${year}-${month}-${day}`;
taskDateInput.value = formattedDate;
taskDateDisplay.value = `${day}/${month}/${year}`;

let taskFormData = sessionStorage.getItem("taskFormData")
  ? JSON.parse(sessionStorage.getItem("taskFormData"))
  : {
      status: 1,
      priority: 2,
      department: "",
      employee: "",
      dueDate: formattedDate,
      taskFormState: {
        name: false,
        desc: true,
        status: true,
        priority: true,
        department: false,
        employee: false,
        dueDate: true,
      },
    };

// Task Form Input State Object
const { taskFormState } = taskFormData;

const validateNameInput = function () {
  const minLabel = document.querySelector(".task-name-min");
  const maxLabel = document.querySelector(".task-name-max");

  let minLengthCheck = taskNameInput.value.length > 3;
  let maxLengthCheck = taskNameInput.value.length < 255;

  validateLabel(minLengthCheck, minLabel);
  validateLabel(maxLengthCheck, maxLabel);

  // Update Input State
  taskFormState.name = minLengthCheck && maxLengthCheck;

  // Update Input Field Outline
  if (taskFormState.name) {
    taskNameInput.classList.remove("invalid-input");
  } else {
    taskNameInput.classList.add("invalid-input");
  }

  if (taskNameInput.value === "") {
    taskNameInput.classList.remove("invalid-input");

    resetLabel(minLabel);
    resetLabel(maxLabel);
  }
};

const validateDescInput = function () {
  const minLabel = document.querySelector(".task-desc-min");
  const maxLabel = document.querySelector(".task-desc-max");

  let minLengthCheck =
    taskDescInput.value.split(/\s+/).filter((word) => word.length > 0).length >
    4;
  let maxLengthCheck = taskDescInput.value.length < 255;

  validateLabel(minLengthCheck, minLabel);
  validateLabel(maxLengthCheck, maxLabel);

  // Update Input State
  taskFormState.desc = minLengthCheck && maxLengthCheck;

  if (taskDescInput.value === "") {
    resetLabel(minLabel);
    resetLabel(maxLabel);

    taskFormState.desc = true;
  }

  // Update Input Outline
  if (taskFormState.desc) {
    taskDescInput.classList.remove("invalid-input");
  } else {
    taskDescInput.classList.add("invalid-input");
  }
};

// Validate Correct Format
const isValidFormat = function (dateString) {
  const regex = /^(0[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[0-2])[-/.]\d{4}$/;
  const label = document.querySelector(".date-format-requirement");
  const formatCheck = regex.test(dateString);

  validateLabel(formatCheck, label);

  return formatCheck;
};

// Validate Correct Date
const isValidDate = function (dateString) {
  let day, month, year;

  if (dateString.includes("/")) {
    [day, month, year] = dateString.split("/").map(Number);
  } else if (dateString.includes("-")) {
    [day, month, year] = dateString.split("-").map(Number);
  } else if (dateString.includes(".")) {
    [day, month, year] = dateString.split(".").map(Number);
  } else {
    return false;
  }

  const inputDate = new Date(year, month - 1, day);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const label = document.querySelector(".date-time-requirement");
  const dateCheck = inputDate >= currentDate;

  validateLabel(dateCheck, label);

  return dateCheck;
};

// Validate Date Input
const validateDateInput = function (dateString) {
  const dateIcon = document.querySelector(".date-icon");
  const validFormat = isValidFormat(dateString);
  const validDate = isValidDate(dateString);

  if (validDate && validFormat) {
    taskFormState.dueDate = true;

    dateIcon.src = "resources/SVG/CalendarGreen.svg";

    taskDateDisplay.classList.remove("invalid-input");
    taskDateDisplay.classList.add("valid-input");
  } else {
    taskFormState.dueDate = false;

    dateIcon.src = "resources/SVG/CalendarRed.svg";

    taskDateDisplay.classList.remove("valid-input");
    taskDateDisplay.classList.add("invalid-input");
  }
};

// Load Date Value if it isn't Default Date
if (taskFormData.dueDate !== `${year}-${month}-${day}`) {
  let date = taskFormData.dueDate.split("-");

  if (taskFormData.dueDate.includes("/")) {
    date = taskFormData.dueDate.split("/").map(Number);
  } else if (taskFormData.dueDate.includes("-")) {
    date = taskFormData.dueDate.split("-").map(Number);
  } else if (taskFormData.dueDate.includes(".")) {
    date = taskFormData.dueDate.split(".").map(Number);
  }

  // Load if Valid Date Format is Stored
  if (
    date[1] !== undefined &&
    date[2] !== undefined &&
    isValidFormat(
      `${String(date[2]).padStart(2, "0")}-${String(date[1]).padStart(
        2,
        "0"
      )}-${date[0]}`
    )
  ) {
    taskDateInput.value = taskFormData.dueDate;

    taskDateDisplay.value = `${String(date[2]).padStart(2, "0")}/${String(
      date[1]
    ).padStart(2, "0")}/${date[0]}`;
    validateDateInput(taskDateDisplay.value);
  } else {
    // Load Default Date
    taskDateInput.value = `${year}-${month}-${day}`;
    taskDateDisplay.value = `${day}/${month}/${year}`;

    taskFormState.dueDate = true;

    taskFormData.dueDate = `${year}-${month}-${day}`;
    sessionStorage.setItem("taskFormData", JSON.stringify(taskFormData));

    const timeLabel = document.querySelector(".date-time-requirement");
    const dateLabel = document.querySelector(".date-format-requirement");

    resetLabel(timeLabel);
    resetLabel(dateLabel);
  }
}

validateNameInput();
validateDescInput();

// Initialize and Render Priority Dropdown Menu
const priorityDropdownMenu = initializeDropdownMenu("task-priority-input");
priorityDropdownMenu.renderOptions(state.priorityArray);

priorityDropdownMenu.initializeDefaultValue(
  state.priorityArray,
  parseInt(taskFormData.priority)
);

// Initialize and Render status Dropdown Menu
const statusDropdownMenu = initializeDropdownMenu("task-status-input");
statusDropdownMenu.renderOptions(state.statusArray);

statusDropdownMenu.initializeDefaultValue(
  state.statusArray,
  parseInt(taskFormData.status)
);

// Initialize and Render Department Dropdown Menu
const departmentDropdownMenu = initializeDropdownMenu("task-department-input");
departmentDropdownMenu.renderOptions(state.departmentArray);

// Load Department Value From Storage if Present
if (taskFormData.department) {
  departmentDropdownMenu.initializeDefaultValue(
    state.departmentArray,
    parseInt(taskFormData.department)
  );
}

// Initialize Employee Dropdown Menu
const employeeDropdownMenu = initializeDropdownMenu("task-employee-input");

// Validate Employee Input on Value Change
taskEmployeeInput
  .querySelector(".selected-value")
  .addEventListener("valueChange", () => {
    if (taskEmployeeInput.querySelector(".selected-value").value) {
      taskEmployeeInput.classList.remove("invalid-input");
      taskFormState.employee = true;
    }

    // Store Employee Input
    taskFormData.employee =
      taskEmployeeInput.querySelector(".selected-value").value;
    sessionStorage.setItem("taskFormData", JSON.stringify(taskFormData));
  });

// Unhide Employee Input if Department is Stored in Storage
if (taskFormData.department) {
  // Reveal Employee Input Block
  document
    .querySelector(".task-employee-input-block")
    .classList.remove("hidden");

  // Render Employee Options Based on Chosen Department Id
  employeeDropdownMenu.renderOptions(
    state.employeeArray.filter((employee) => {
      return employee.department.id == taskFormData.department;
    })
  );

  // Load Employee Input From Storage
  if (taskFormData.employee) {
    employeeDropdownMenu.initializeDefaultValue(
      state.employeeArray,
      parseInt(taskFormData.employee)
    );
  }
}

// Event Listener For Department and Employee Input Change
taskDepartmentInput
  .querySelector(".selected-value")
  .addEventListener("valueChange", () => {
    taskDepartmentInput.classList.remove("invalid-input");
    taskFormState.department = true;

    employeeDropdownMenu.clearInput();
    const departmentId =
      taskDepartmentInput.querySelector(".selected-value").value;

    // Store Current Value in SessionStorage
    taskFormData.department = departmentId;
    sessionStorage.setItem("taskFormData", JSON.stringify(taskFormData));

    // Reveal Employee Input Block
    document
      .querySelector(".task-employee-input-block")
      .classList.remove("hidden");

    // Render Employee Options Based on Chosen Department Id
    employeeDropdownMenu.renderOptions(
      state.employeeArray.filter((employee) => {
        return employee.department.id == departmentId;
      })
    );
  });

// Event Listener For Status Input Change
taskStatusInput
  .querySelector(".selected-value")
  .addEventListener("valueChange", () => {
    // Store Current Value in SessionStorage
    taskFormData.status =
      taskStatusInput.querySelector(".selected-value").value;
    sessionStorage.setItem("taskFormData", JSON.stringify(taskFormData));
  });

// Event Listener For Priority Input Change
taskPriorityInput
  .querySelector(".selected-value")
  .addEventListener("valueChange", () => {
    // Store Current Value in SessionStorage
    taskFormData.priority =
      taskPriorityInput.querySelector(".selected-value").value;
    sessionStorage.setItem("taskFormData", JSON.stringify(taskFormData));
  });

// Event Listener For Name Input Checking
taskNameInput.addEventListener("input", function () {
  validateNameInput();
});

// Event Listener For Description Input Checking
taskDescInput.addEventListener("input", function () {
  validateDescInput();
});

// Event Listener For Custom Date Input Date Picker Display
document.getElementById("dateIcon").addEventListener("click", function () {
  taskDateInput.showPicker();
});

// Event Listener For Custom Date Input Value Update From Date Picker
taskDateInput.addEventListener("change", function () {
  let dateInput = this.value.split("-");
  taskDateDisplay.value = `${String(dateInput[2]).padStart(2, "0")}/${String(
    dateInput[1]
  ).padStart(2, "0")}/${dateInput[0]}`;
  taskDateDisplay.dispatchEvent(new CustomEvent("dateChange", {}));

  // Store Date Input
  taskFormData.dueDate = this.value;
  sessionStorage.setItem("taskFormData", JSON.stringify(taskFormData));
});

// Event Listener For Custom Date Input Value Update From Input Field
taskDateDisplay.addEventListener("change", function () {
  let day, month, year;

  if (this.value.includes("/")) {
    [day, month, year] = this.value.split("/").map(Number);
  } else if (this.value.includes("-")) {
    [day, month, year] = this.value.split("-").map(Number);
  } else if (this.value.includes(".")) {
    [day, month, year] = this.value.split(".").map(Number);
  }

  taskDateInput.value = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  // Store Date Input
  taskFormData.dueDate = `${year}/${String(month).padStart(2, "0")}/${String(
    day
  ).padStart(2, "0")}`;
  sessionStorage.setItem("taskFormData", JSON.stringify(taskFormData));
});

// Event Listener to Validate Date Input
taskDateDisplay.addEventListener("input", function () {
  validateDateInput(this.value);
  let day, month, year;

  if (this.value.includes("/")) {
    [day, month, year] = this.value.split("/").map(Number);
  } else if (this.value.includes("-")) {
    [day, month, year] = this.value.split("-").map(Number);
  } else if (this.value.includes(".")) {
    [day, month, year] = this.value.split(".").map(Number);
  }

  const formattedData = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;

  taskDateInput.value = formattedData;

  taskFormData.dueDate = formattedData;
  sessionStorage.setItem("taskFormData", JSON.stringify(taskFormData));
});

// Event Listener For Propgammatic Date Value Change
taskDateDisplay.addEventListener("dateChange", function () {
  validateDateInput(this.value);
});

// Close Employee Dropdown Menu After Adding New Employee From Menu
document.querySelector(".custom-option").addEventListener("click", function () {
  createEmployee.closeModal();
});

// Validate Form Input For Submission
const validateFormInputs = function () {
  const inputs = [
    taskNameInput,
    taskDescInput,
    taskStatusInput,
    taskPriorityInput,
    taskDepartmentInput,
    taskEmployeeInput,
    taskDateInput,
  ];

  let isValid = true;

  // Add Red Outline For Invalid/Missing Inputs
  Object.values(taskFormState).forEach((state, i) => {
    if (!state) {
      inputs[i].classList.add("invalid-input");
      isValid = false;
    }
  });

  return isValid;
};

// Event Listener For Form Submission
taskSubmitBtn.addEventListener("click", async function () {
  if (validateFormInputs()) {
    const taskData = new FormData();

    taskData.append("name", taskNameInput.value);
    taskData.append("description", taskDescInput.value);
    taskData.append("due_date", taskDateInput.value);
    taskData.append(
      "status_id",
      taskStatusInput.querySelector(".selected-value").value
    );
    taskData.append(
      "employee_id",
      taskEmployeeInput.querySelector(".selected-value").value
    );
    taskData.append(
      "priority_id",
      taskPriorityInput.querySelector(".selected-value").value
    );

    // Send Task Data
    try {
      const response = await fetch(`${server}/tasks`, {
        method: "POST",
        body: taskData,
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (response.status === 201) {
        // Update Tasks
        state.taskArray = await fetchData("tasks");

        // Empty Inputs and redirect
        taskNameInput.value = "";
        taskDescInput.value = "";
        sessionStorage.removeItem("taskFormData");

        window.location.href = "index.html";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
});
