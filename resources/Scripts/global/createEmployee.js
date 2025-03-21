import {
  state,
  TOKEN,
  fetchData,
  server,
  resetLabel,
  validateLabel,
} from "./global.js";
import { initializeDropdownMenu } from "./dropDownMenu.js";

const openModalBtn = document.querySelector(".create-employee-btn");
const blur = document.querySelector(".background-blur");
const createEmployeeModal = document.querySelector(".create-employee-modal");
const exitBtns = document.querySelectorAll(".employee-modal-exit");
const submitBtn = document.querySelector(".submit-btn");
const departmentInput = createEmployeeModal.querySelector(".department-input");
const departmentInputContainer = document.getElementById("department-input");
const previewImg = document.getElementById("preview-image");
const clearImgBtn = document.querySelector(".clear-img-btn");
const AvatarPlaceholderText = document.getElementById("img-input-label");
const nameInput = [
  document.getElementById("name"),
  document.getElementById("surname"),
];

const avatarInputField = document.querySelector(".avatar-upload");
const avatarBorderPropertyRed =
  "url(\"data:image/svg+xml,%3csvg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%' height='100%' fill='none' rx='8' ry='8' stroke='%23FA4D4DFF' stroke-width='1' stroke-dasharray='5' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")";
const avatarBorderPropertyDefault =
  "url(\"data:image/svg+xml,%3csvg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%' height='100%' fill='none' rx='8' ry='8' stroke='%23CED4DAFF' stroke-width='1' stroke-dasharray='5' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")";

// Create Dropdown Menu For Department Input
const departmentInputMenu = initializeDropdownMenu("department-input");

// Remove Department Red Outline if Input is Provided
departmentInput.addEventListener("valueChange", () => {
  document.getElementById("department-input").classList.remove("invalid-input");
});

// Form Input State Object
const formCheck = {
  name: false,
  surname: false,
  avatar: false,
  department: false,
};

// Clear Uploaded Image
const clearImgInput = function () {
  // Reset to Placeholder Image and Text
  previewImg.src = "./resources/SVG/PreviewImg.svg";
  previewImg.classList.remove("preview-img");
  clearImgBtn.classList.add("hidden");
  AvatarPlaceholderText.classList.remove("hidden");

  // Reset Border
  avatarInputField.style.setProperty(
    "background-image",
    `${avatarBorderPropertyDefault}`
  );

  // Update Input State
  formCheck.avatar = false;
};

// Function For Closing and Resetting Form
export const closeModal = function () {
  // Hide Modal
  createEmployeeModal.classList.toggle("hidden");
  blur.classList.toggle("hidden");

  // Empty Text Input Fields
  createEmployeeModal.querySelectorAll("input").forEach((el) => {
    el.value = "";
  });

  // Clear Uploaded Image
  clearImgInput();

  // Reset Requirement Labels
  createEmployeeModal.querySelectorAll(".form-requirement").forEach((el) => {
    el.classList.remove("invalid-label");
    el.classList.remove("valid-label");
    el.querySelector("img").src = "./resources/SVG/CheckmarkGray.svg";
  });

  // Remove Outlines
  [...nameInput, departmentInputContainer].forEach((el) => {
    el.classList.remove("invalid-input");
  });

  // Clear Department Input and Reset Department Form State
  departmentInputMenu.clearInput();
  formCheck.department = false;
};

// Function For Validating Name and Surname Input
// Using 'id' Argument to Identify Input Type
const checkNameInput = function (val, id) {
  const minLabel = document.querySelector(`.min-symbol-${id}`);
  const minLabelCheck = minLabel.querySelector("img");

  const maxLabel = document.querySelector(`.max-symbol-${id}`);
  const maxLabelCheck = maxLabel.querySelector("img");

  const alphabetLabel = document.querySelector(`.alphabet-${id}`);
  const alphabetLabelCheck = alphabetLabel.querySelector("img");

  // Regex For English and Georgian Alphabet
  const english = /^[A-Za-z\s]+$/;
  const georgian = /^[\u10A0-\u10FF\s]+$/;

  let lengthCheck = false;
  let languageCheck = false;

  // Check for Valid Length
  if (val.length < 2) {
    lengthCheck = false;
    // Update Label
    validateLabel(false, minLabel, minLabelCheck);
    validateLabel(true, maxLabel, maxLabelCheck);
  } else if (val.length > 255) {
    lengthCheck = false;
    validateLabel(false, maxLabel, maxLabelCheck);
  } else {
    lengthCheck = true;
    validateLabel(true, minLabel, minLabelCheck);
    validateLabel(true, maxLabel, maxLabelCheck);
  }

  // Check for Valid Alphabet
  languageCheck = english.test(val) ^ georgian.test(val);
  validateLabel(languageCheck, alphabetLabel, alphabetLabelCheck);

  // Update Input State Respectively Based on id
  formCheck[id] = languageCheck && lengthCheck;

  // Update Input Outline
  if (!formCheck[id]) {
    document.getElementById(id).classList.add("invalid-input");
  } else {
    document.getElementById(id).classList.remove("invalid-input");
  }

  // Reset Input Outline and Labels if Empty
  if (val === "") {
    resetLabel(alphabetLabel, alphabetLabelCheck);
    resetLabel(maxLabel, maxLabelCheck);
    resetLabel(minLabel, minLabelCheck);

    document.getElementById(id).classList.remove("invalid-input");
  }
};

// Event Handler For Submit Button
const submitForm = async function () {
  let validInput = true;

  if (departmentInput.value !== "") formCheck.department = true;

  const formInputs = [
    ...nameInput,
    document.querySelector(".avatar-upload"),
    document.getElementById("department-input"),
  ];

  // Check Form State
  Object.values(formCheck).forEach((val, i) => {
    if (!val) {
      validInput = false;
      formInputs[i].classList.add("invalid-input");
    } else {
      formInputs[i].classList.remove("invalid-input");
    }
  });

  if (!formCheck.avatar) {
    avatarInputField.style.setProperty(
      "background-image",
      `${avatarBorderPropertyRed}`
    );
  }

  // Return if Any Input is Invalid
  if (!validInput) return false;

  const formData = new FormData();
  const avatarFile = document.querySelector('input[type="file"]').files[0];

  formData.append("name", nameInput[0].value);
  formData.append("surname", nameInput[1].value);
  formData.append("avatar", avatarFile);
  formData.append("department_id", departmentInput.value);

  // Send Employee Data
  await fetch(`${server}/employees`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })
    .then((response) => {
      // Close Modal if Employee is Created Successfully
      if (response.status === 201) closeModal();
    })
    .catch((error) => console.error("Error:", error));
};

openModalBtn.addEventListener("click", function () {
  closeModal();
});

// Close if Clicked Outside of Modal
window.addEventListener("click", function (e) {
  if (
    !createEmployeeModal.contains(e.target) &&
    !openModalBtn.contains(e.target) &&
    !createEmployeeModal.classList.contains("hidden") &&
    !e.target.classList.contains("custom-option")
  ) {
    closeModal();
  }
});

exitBtns.forEach((el) => {
  el.addEventListener("click", function () {
    closeModal();
  });
});

// Add Event Listeners to Name and Surname Inputs For Real-Time Validation
nameInput.forEach((el) => {
  el.addEventListener("input", function () {
    checkNameInput(el.value, el.id);
  });
});

// Event Listener For Image Input
document
  .getElementById("img-input")
  .addEventListener("change", function (event) {
    const avatarFile = event.target.files[0];
    // Render Preview Img
    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result;
      };
      reader.readAsDataURL(avatarFile);
    }

    // Remove Placeholders and Render Preview Image and Clear Button
    previewImg.classList.add("preview-img");
    clearImgBtn.classList.remove("hidden");
    AvatarPlaceholderText.classList.add("hidden");

    const avatarSizeLabel = document.querySelector(".avatar-size-requirement");
    const avatarSizeLabelCheck = avatarSizeLabel.querySelector("img");

    // Validate Size
    const sizeCheck = avatarFile && avatarFile.size / 1024 <= 600;
    validateLabel(sizeCheck, avatarSizeLabel, avatarSizeLabelCheck);

    const avatarTypeLabel = document.querySelector(".avatar-type-requirement");
    const avatarTypeLabelCheck = avatarTypeLabel.querySelector("img");

    // Validate File Type
    const typeCheck = avatarFile.type.startsWith("image/");
    validateLabel(typeCheck, avatarTypeLabel, avatarTypeLabelCheck);

    // Update Input State Based on Uploaded Image size
    formCheck.avatar = sizeCheck && typeCheck;

    if (!formCheck.avatar) {
      avatarInputField.style.setProperty(
        "background-image",
        `${avatarBorderPropertyRed}`
      );
    } else {
      avatarInputField.style.setProperty(
        "background-image",
        `${avatarBorderPropertyDefault}`
      );
    }
  });

// Reset Labels After Clearing Avatar Input
clearImgBtn.addEventListener("click", function () {
  const avatarSizeLabel = document.querySelector(".avatar-size-requirement");
  const avatarSizeLabelCheck = avatarSizeLabel.querySelector("img");

  resetLabel(avatarSizeLabel, avatarSizeLabelCheck);

  const avatarTypeLabel = document.querySelector(".avatar-type-requirement");
  const avatarTypeLabelCheck = avatarTypeLabel.querySelector("img");

  resetLabel(avatarTypeLabel, avatarTypeLabelCheck);

  clearImgInput();
});

// Render Department Options For Department Menu
departmentInputMenu.renderOptions(state.departmentArray);

// Event Listener For Submit Button
submitBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const valid = await submitForm();

  if (valid === false) return;
  // Update Employee Data After Creating New Employee
  state.employeeArray = await fetchData("employees");

  // Check if Submission Comes From Create Task Page Employee Options
  // to Automatically Enter New Employee Details Into Task Form
  if (document.querySelector(".custom-option")) {
    // Find Latest Added Employee
    const newEmployee = state.employeeArray.reduce((max, current) => {
      return current.id > max.id ? current : max;
    });

    // Render Department of The New Employee
    const departmentContainer = document.getElementById(
      "task-department-input"
    );

    departmentContainer.querySelector(".selected-option").textContent =
      newEmployee.department.name;
    departmentContainer.querySelector(".selected-value").value =
      newEmployee.department.id;

    // Initiate Value Change Event For Department Input
    departmentContainer
      .querySelector(".selected-value")
      .dispatchEvent(new CustomEvent("valueChange", {}));

    // Render New Employee as a Seleceted Option
    const employeeContainer = document.getElementById("task-employee-input");
    const selectedOption = employeeContainer.querySelector(".selected-option");

    const imgMarkup = `<img class='option-icon avatar-icon' src=${newEmployee.avatar}>`;

    const fullName = newEmployee.name + " " + newEmployee.surname;

    selectedOption.textContent = `${fullName}`;
    selectedOption.insertAdjacentHTML("afterbegin", imgMarkup);
    employeeContainer.querySelector(".selected-value").value = newEmployee.id;

    // Initiate Value Change Event For Employee Input
    employeeContainer
      .querySelector(".selected-value")
      .dispatchEvent(new CustomEvent("valueChange", {}));
  }
});
