const createBlogElements = {
  imageDropArea: document.querySelector(".image-drop-area"),
  imageInputLink: document.querySelector(".choose-image-file-link"),
  imageInput: document.querySelector(".image-input"),
  imageVisualiser: document.querySelector(".image-visualiser"),
  imageVisualiserText: document.querySelector(".image-visualiser-text"),
  imageVisualiserExitIcon: document.querySelector(
    ".image-visualiser-exit-icon"
  ),

  // Form elements
  authorInput: document.querySelector(".author-input"),
  titleInput: document.querySelector(".title-input"),
  descriptionInput: document.querySelector(".description-input"),
  dateInput: document.querySelector(".date-input"),
  categoryInput: document.querySelector(".category-input"),
  emailInput: document.querySelector(".email-input"),
  publishButton: document.querySelector(".publish-button"),
};

createBlogElements.authorInput.addEventListener("input", () => {
  validate();
});

function countLetters(string) {
  let count = 0;

  for (let i = 0; i < string.length; i++) {
    if (/[a-zA-Z]/.test(string[i])) {
      count++;
    }
  }
  return count;
}

function validate() {
  const authorInputValue = createBlogElements.authorInput.value.replace(
    /\s+/g,
    " "
  );
  if (countLetters(authorInputValue) < 4) {
    document.getElementsByClassName(".author-input-min-symbols");
  }
}

function toggleImageDropOver({ isOpen }) {
  const { imageVisualiser, imageDropArea } = createBlogElements;

  imageVisualiser.style.display = isOpen ? "none" : "block";
  imageDropArea.style.display = isOpen ? "block" : "none";
}

function updateImageDropOverUI(file) {
  const { imageVisualiserText } = createBlogElements;

  toggleImageDropOver({ isOpen: false });
  imageVisualiserText.textContent = file.name;
}

(async () => {
  // const inputElement
  const {
    imageDropArea,
    imageInput,
    imageVisualiserExitIcon,
    authorInput,
    titleInput,
    descriptionInput,
    dateInput,
    categoryInput,
    emailInput,
    publishButton,
  } = createBlogElements;

  imageDropArea.addEventListener("click", () => {
    imageInput.click();
  });

  imageDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    imageDropArea.style.border = "1px dashed green";
  });
  imageDropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    imageDropArea.style.border = "1px dashed #85858d";
  });
  imageDropArea.addEventListener("dragend", (e) => {
    e.preventDefault();
    imageDropArea.style.border = "1px dashed #85858d";
  });
  imageDropArea.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];

      if (!file.type.startsWith("image/")) {
        e.stopPropagation();
        alert("No image");
        return;
      }

      imageInput.files = file;
      updateImageDropOverUI(file);
    }

    imageDropArea.style.border = "1px dashed #85858d";
  });
  imageInput.addEventListener("change", (e) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        e.stopPropagation();
        alert("No image");
        return;
      }

      updateImageDropOverUI(file);
    }
  });
  imageVisualiserExitIcon
    .addEventListener("click", () => {
      toggleImageDropOver({ isOpen: true });
      imageInput.files = null;
    })

    [
      // Form validation
      (authorInput,
      titleInput,
      descriptionInput,
      dateInput,
      categoryInput,
      emailInput)
    ].forEach((e) => {});
})();
