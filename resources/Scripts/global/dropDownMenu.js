// Create Dropdown Menu Inside Container With id
export const initializeDropdownMenu = function (id) {
  const container = document.getElementById(id);

  const options = container.querySelector(".dropdown-options");
  const header = container.querySelector(".dropdown-header");
  const headerIcon = header.querySelector("img");
  const selectedOption = header.querySelector(".selected-option");

  // Close Dropdown Menu
  const closeDropDown = function () {
    options.style.display = "none";
    headerIcon.src = "resources/SVG/DownArrowSmall.svg";
    container.classList.remove("dropdown-menu-expanded");
  };

  // Clear Input Value and Display
  const clearInput = function () {
    if (selectedOption.querySelector("img"))
      selectedOption.querySelector("img").remove();

    selectedOption.textContent = "";
    container.querySelector(".selected-value").value = "";
  };

  // Generate Markup For Options
  const generateDepartmentsMarkup = function (dataset) {
    let markup = ``;
    const avatarIconClassName = "avatar-icon";

    dataset.forEach((data) => {
      const name = data.surname ? data.name + " " + data.surname : data.name;

      if (data.icon || data.avatar)
        markup += `<div class="dropdown-option dropdown-optional-style" data-value="${
          data.id
        }"><img class="option-icon ${data.avatar && avatarIconClassName}" src=${
          data.icon || data.avatar
        }>${name}</div>`;
      else
        markup += `<div class="dropdown-option dropdown-optional-style" data-value="${data.id}">${name}</div>`;
    });

    return markup;
  };

  // Initiate Default Value
  const initializeDefaultValue = function (dataSet, dataId) {
    let markup = ``;
    const avatarIconClassName = "avatar-icon";
    const data = dataSet.find((item) => item.id === dataId);

    const name = data.surname ? data.name + " " + data.surname : data.name;

    if (data.icon || data.avatar)
      markup += `<div class="dropdown-option dropdown-optional-style" data-value="${
        data.id
      }"><img class="option-icon ${data.avatar && avatarIconClassName}" src=${
        data.icon || data.avatar
      }>${name}</div>`;
    else
      markup += `<div class="dropdown-option dropdown-optional-style" data-value="${data.id}">${name}</div>`;

    const tempEl = document
      .createRange()
      .createContextualFragment(markup).firstElementChild;

    const selectedValue = tempEl.dataset.value;
    const optionIcon = tempEl.querySelector(".option-icon");

    selectedOption.textContent = tempEl.textContent;

    // Check if Option Comes With Icon
    if (optionIcon) {
      const iconCopy = optionIcon.cloneNode(true);
      selectedOption.prepend(iconCopy);
    }

    // Update Value
    container.querySelector(".selected-value").value = selectedValue;
  };

  // Render Options
  const renderOptions = function (dataset) {
    options.querySelectorAll(".dropdown-option").forEach((option) => {
      if (!option.classList.contains("custom-option")) option.remove();
    });
    // options.innerHTML = "";
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
    if (!e.target.closest(`#${id}`)) {
      closeDropDown();
    }
  });

  // Assign Event Listener to Options Menu
  // Select Input if Target is an Option Div
  options.addEventListener("click", function (e) {
    const targetOption = e.target.closest(".dropdown-option");
    if (!targetOption) return;

    clearInput();

    if (targetOption.classList.contains("custom-option")) {
      closeDropDown();
      return;
    }

    const selectedValue = targetOption.dataset.value;
    const optionIcon = targetOption.querySelector(".option-icon");

    selectedOption.textContent = targetOption.textContent;

    // Check if Option Comes With Icon
    if (optionIcon) {
      const iconCopy = optionIcon.cloneNode(true);
      selectedOption.prepend(iconCopy);
    }

    // Update Value
    container.querySelector(".selected-value").value = selectedValue;

    // Add Custom Event For Value Change
    container
      .querySelector(".selected-value")
      .dispatchEvent(new CustomEvent("valueChange", {}));

    closeDropDown();
  });

  return { clearInput, renderOptions, initializeDefaultValue };
};
