import * as dropdown from "../dropDownMenu.js";

const openModalBtn = document.querySelector(".create-employee-btn");
const blur = document.querySelector(".background-blur");
const createEmployeeModal = document.querySelector(".create-employee-modal");
const exitBtns = document.querySelectorAll(".employee-modal-exit");
const nameInput = [
  document.querySelector("#name"),
  document.querySelector("#surname"),
];
const formCheck = {
  name: false,
  surname: false,
  avatar: false,
  department: false,
};

const clearImgInput = function () {
  document.getElementById("preview-image").src =
    "./resources/SVG/PreviewImg.svg";
  document.getElementById("preview-image").classList.remove("preview-img");
  document.querySelector(".clear-img-btn").classList.add("hidden");
  document.getElementById("img-input-label").classList.remove("hidden");

  formCheck.avatar = false;
};

const toggelModal = function () {
  createEmployeeModal.classList.toggle("hidden");
  blur.classList.toggle("hidden");

  createEmployeeModal.querySelectorAll("input").forEach((el) => {
    el.value = "";
  });

  clearImgInput();

  createEmployeeModal.querySelectorAll(".form-requirement").forEach((el) => {
    el.classList.remove("invalid-label");
    el.classList.remove("valid-label");
    el.querySelector("img").src = "./resources/SVG/CheckmarkGray.svg";
  });
};

const checkNameInput = function (val, id) {
  const minLabel = document.querySelector(`.min-symbol-${id}`);
  const minLabelCheck = minLabel.querySelector("img");

  const maxLabel = document.querySelector(`.max-symbol-${id}`);
  const maxLabelCheck = maxLabel.querySelector("img");

  const english = /^[A-Za-z\s]+$/;
  const georgian = /^[\u10A0-\u10FF\s]+$/;

  let lengthCheck = false;
  let languageCheck = false;

  if (val.length < 2) {
    lengthCheck = false;

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

  languageCheck = english.test(val) ^ georgian.test(val);
  formCheck[id] = languageCheck && lengthCheck;
};

openModalBtn.addEventListener("click", function () {
  toggelModal();
});

window.addEventListener("click", function (e) {
  if (
    !createEmployeeModal.contains(e.target) &&
    !openModalBtn.contains(e.target) &&
    !createEmployeeModal.classList.contains("hidden")
  ) {
    toggelModal();
  }
});

exitBtns.forEach((el) => {
  el.addEventListener("click", function () {
    toggelModal();
  });
});

nameInput.forEach((el) => {
  el.addEventListener("input", function () {
    checkNameInput(el.value, el.id);
  });
});

document
  .getElementById("img-input")
  .addEventListener("change", function (event) {
    const previewImg = document.getElementById("preview-image");
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    previewImg.classList.add("preview-img");
    document.querySelector(".clear-img-btn").classList.remove("hidden");
    document
      .querySelector(".avatar-upload")
      .querySelector("span")
      .classList.add("hidden");

    formCheck.avatar = file && file.size / 1024 <= 600;
  });

document.querySelector(".clear-img-btn").addEventListener("click", function () {
  clearImgInput();
});
