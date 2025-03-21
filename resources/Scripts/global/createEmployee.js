import { state, TOKEN } from "./global.js";
import { initializeDropdownMenu } from "./dropDownMenu.js";

const openModalBtn = document.querySelector(".create-employee-btn");
const blur = document.querySelector(".background-blur");
const createEmployeeModal = document.querySelector(".create-employee-modal");
const exitBtns = document.querySelectorAll(".employee-modal-exit");
const submitBtn = document.querySelector(".submit-btn");
const departmentInput = document.querySelector(".department-input");
const previewImg = document.getElementById("preview-image");
const clearImgBtn = document.querySelector(".clear-img-btn");
const AvatarPlaceholderText = document.getElementById("img-input-label");
const nameInput = [
  document.getElementById("name"),
  document.getElementById("surname"),
];

// Create Dropdown Menu For Department Input
const departmentInputMenu = initializeDropdownMenu("department-input");

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
    minLabel.classList.add("invalid-label");
    minLabel.classList.remove("valid-label");
    minLabelCheck.src = "./resources/SVG/CheckmarkRed.svg";
  } else if (val.length > 255) {
    lengthCheck = false;

    maxLabel.classList.add("invalid-label");
    maxLabel.classList.remove("valid-label");
    maxLabelCheck.src = "./resources/SVG/CheckmarkRed.svg";
  } else {
    lengthCheck = true;

    maxLabel.classList.remove("invalid-label");
    maxLabel.classList.add("valid-label");
    maxLabelCheck.src = "./resources/SVG/CheckmarkGreen.svg";

    minLabel.classList.remove("invalid-label");
    minLabel.classList.add("valid-label");
    minLabelCheck.src = "./resources/SVG/CheckmarkGreen.svg";
  }

  // Check for Valid Alphabet
  languageCheck = english.test(val) ^ georgian.test(val);

  if (languageCheck) {
    alphabetLabel.classList.remove(".invalid-label");
    alphabetLabel.classList.add("valid-label");
    alphabetLabelCheck.src = "./resources/SVG/CheckmarkGreen.svg";
  } else {
    alphabetLabel.classList.remove("valid-label");
    alphabetLabel.classList.add("invalid-label");
    alphabetLabelCheck.src = "./resources/SVG/CheckmarkRed.svg";
  }

  // Update Input State Respectively Based on id
  formCheck[id] = languageCheck && lengthCheck;

  if (!formCheck[id]) {
    document.getElementById(id).classList.add("invalid-input");
  } else {
    document.getElementById(id).classList.remove("invalid-input");
  }

  if (val === "") {
    alphabetLabel.classList.remove("invalid-label");
    alphabetLabel.classList.remove("valid-label");
    alphabetLabelCheck.src = "./resources/SVG/CheckmarkGray.svg";

    maxLabel.classList.remove("invalid-label");
    maxLabel.classList.remove("valid-label");
    maxLabelCheck.src = "./resources/SVG/CheckmarkGray.svg";

    minLabel.classList.remove("invalid-label");
    minLabel.classList.remove("valid-label");
    minLabelCheck.src = "./resources/SVG/CheckmarkGray.svg";

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

  // Return if Any Input is Invalid
  if (!validInput) return;

  const formData = new FormData();
  const avatarFile = document.querySelector('input[type="file"]').files[0];

  formData.append("name", nameInput[0].value);
  formData.append("surname", nameInput[1].value);
  formData.append("avatar", avatarFile);
  formData.append("department_id", departmentInput.value);

  // Send Employee Data
  await fetch("https://momentum.redberryinternship.ge/api/employees", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })
    .then((response) => {
      if (response.status === 201) closeModal();
    })
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
};

openModalBtn.addEventListener("click", function () {
  closeModal();
});

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
    const sizeCheck = avatarFile && avatarFile.size / 1024 <= 600;

    const avatarTypeLabel = document.querySelector(".avatar-type-requirement");
    const avatarTypeLabelCheck = avatarTypeLabel.querySelector("img");
    const typeCheck = avatarFile.type.startsWith("image/");

    if (sizeCheck) {
      avatarSizeLabel.classList.remove("invalid-label");
      avatarSizeLabel.classList.add("valid-label");
      avatarSizeLabelCheck.src = "./resources/SVG/CheckmarkGreen.svg";
    } else {
      avatarSizeLabel.classList.add("invalid-label");
      avatarSizeLabel.classList.remove("valid-label");
      avatarSizeLabelCheck.src = "./resources/SVG/CheckmarkRed.svg";
    }

    if (typeCheck) {
      avatarTypeLabel.classList.remove("invalid-label");
      avatarTypeLabel.classList.add("valid-label");
      avatarTypeLabelCheck.src = "./resources/SVG/CheckmarkGreen.svg";
    } else {
      avatarTypeLabel.classList.add("invalid-label");
      avatarTypeLabel.classList.remove("valid-label");
      avatarTypeLabelCheck.src = "./resources/SVG/CheckmarkRed.svg";
    }

    // Update Input State Based on Uploaded Image size
    formCheck.avatar = sizeCheck && typeCheck;
  });

clearImgBtn.addEventListener("click", function () {
  const avatarSizeLabel = document.querySelector(".avatar-size-requirement");
  const avatarSizeLabelCheck = avatarSizeLabel.querySelector("img");

  avatarSizeLabel.classList.remove("invalid-label");
  avatarSizeLabel.classList.remove("valid-label");
  avatarSizeLabelCheck.src = "./resources/SVG/CheckmarkGray.svg";

  const avatarTypeLabel = document.querySelector(".avatar-type-requirement");
  const avatarTypeLabelCheck = avatarTypeLabel.querySelector("img");

  avatarTypeLabel.classList.remove("invalid-label");
  avatarTypeLabel.classList.remove("valid-label");
  avatarTypeLabelCheck.src = "./resources/SVG/CheckmarkGray.svg";

  clearImgInput();
});

// Render Department Options For Department Menu
departmentInputMenu.renderOptions(state.departmentArray);

// Event Listener For Submit Button
submitBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  await submitForm();

  await fetch("https://momentum.redberryinternship.ge/api/employees", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      state.employeeArray = data;
    });

  // Check if Submission Comes From Create Task Page Employee Options
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

    departmentContainer
      .querySelector(".selected-value")
      .dispatchEvent(new CustomEvent("valueChange", {}));

    // Render New Employee as a Seleceted Option
    const container = document.getElementById("task-employee-input");
    const selectedOption = container.querySelector(".selected-option");

    const imgMarkup = `<img class='option-icon avatar-icon' src=${newEmployee.avatar}>`;

    const fullName = newEmployee.name + " " + newEmployee.surname;

    selectedOption.textContent = `${fullName}`;
    selectedOption.insertAdjacentHTML("afterbegin", imgMarkup);
    container.querySelector(".selected-value").value = newEmployee.id;

    container
      .querySelector(".selected-value")
      .dispatchEvent(new CustomEvent("valueChange", {}));
  }
});
