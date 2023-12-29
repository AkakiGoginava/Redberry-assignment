import { fetchBlogCategories, uploadBlog } from './shared/api.js';
import { emailPattern } from './shared/shared.js';

const alphabetRegex = new RegExp(/^[ა-ჰ ]+$/);
const errorTextColor = '#ea1919';
const successTextColor = '#14D81C';
const localStorageFormKey = 'formSavedFields'

const createBlogElements = {
  returnButton: document.querySelector('.return-button'),

  imageDropArea: document.querySelector('.image-drop-area'),
  imageInputLink: document.querySelector('.choose-image-file-link'),
  imageInput: document.querySelector('.image-input'),
  imageVisualiser: document.querySelector('.image-visualiser'),
  imageVisualiserText: document.querySelector('.image-visualiser-text'),
  imageVisualiserExitIcon: document.querySelector('.image-visualiser-exit-icon'),

  // Form elements
  authorInput: document.querySelector('.author-input'),
  titleInput: document.querySelector('.title-input'),
  descriptionInput: document.querySelector('.description-input'),
  dateInput: document.querySelector('.date-input'),
  categoryInput: document.querySelector('.category-input'),
  emailInput: document.querySelector('.email-input'),
  publishButton: document.querySelector('.publish-button'),
};

function toggleImageDropOver({ isOpen }) {
  const { imageVisualiser, imageDropArea } = createBlogElements;

  imageVisualiser.style.display = isOpen ? 'none' : 'block';
  imageDropArea.style.display = isOpen ? 'block' : 'none';
}

function getCatChildNodes() {
  return document.querySelector('.category-input-value-container').childNodes;
}

function updateImageDropOverUI(file) {
  const { imageVisualiserText } = createBlogElements;

  toggleImageDropOver({ isOpen: false });
  imageVisualiserText.textContent = file.name;
}

function addBadgeInsideCategoryDropdown({ id, title, textColor, backgroundColor }) {
  // add in form div
  const tempParentDiv = document.createElement('div');
  tempParentDiv.innerHTML = `
     <span data-id="${id}" class="category-input-badge-inside">
       ${title}
     </span>
   `;

  tempParentDiv.firstElementChild.style.color = textColor;
  tempParentDiv.firstElementChild.style.backgroundColor = backgroundColor;

  document.querySelector('.category-input-dropdown').prepend(tempParentDiv.firstElementChild);
}

function addBadgeOutsideCategoryDropdown({ id, title, textColor, backgroundColor }) {
  // add in form div
  const tempParentDiv = document.createElement('div');
  tempParentDiv.innerHTML = `
     <span data-id="${id}" class="category-input-badge-outside category-input-value-badge">
       ${title}

       <svg class="category-input-remove" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M5.17188 10.8284L10.8287 5.17151" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
         <path d="M10.8287 10.8285L5.17188 5.17163" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>
     </span>
   `;

  tempParentDiv.firstElementChild.style.color = textColor;
  tempParentDiv.firstElementChild.style.backgroundColor = backgroundColor;

  document
    .querySelector('.category-input-value-container')
    .prepend(tempParentDiv.firstElementChild);
}

function registerClickEventsOnOuterCategoryBadges(id) {
  const element = document.querySelector(`[data-id="${id}"].category-input-badge-outside`);

  element.addEventListener('click', e => {
    e.stopPropagation();

    addBadgeInsideCategoryDropdown({
      id,
      title: element.textContent,
      backgroundColor: element.style.backgroundColor,
      textColor: element.style.color
    });

    element.parentNode.removeChild(element);

    if (!getCatChildNodes().length) {
      document.querySelector('.category-input-value-container').style.display = 'none';
      document.querySelector('.category-input-placeholder').style.display = 'block';
    }

    createBlogElements.categoryInput.classList.add(
      getCatChildNodes().length ? 'standard-input-success' : 'standard-input-error'
    );
    createBlogElements.categoryInput.classList.remove(
      getCatChildNodes().length ? 'standard-input-error' : 'standard-input-success'
    );

    // save form
    const form = JSON.parse(localStorage.getItem(localStorageFormKey));
    form.category = {
      value: Array.from(getCatChildNodes()).map(e => e.getAttribute('data-id')),
      isValidated: Boolean(getCatChildNodes().length)
    }
    localStorage.setItem(localStorageFormKey, JSON.stringify(form));
    checkFormForLocalStorage()
  });
}

function registerClickEventOnInsideCategoryBadges(callback) {
  document.querySelectorAll('.category-input-badge-inside').forEach(element => {
    element.addEventListener('click', e => {
      const id = element.getAttribute('data-id');

      element.parentNode.removeChild(element);
      document.querySelector('.category-input-value-container').style.display = 'flex';
      document.querySelector('.category-input-placeholder').style.display = 'none';

      addBadgeOutsideCategoryDropdown({
        id,
        title: element.textContent,
        textColor: element.style.color,
        backgroundColor: element.style.backgroundColor
      })

      if (callback) {
        callback(id)
      }

      // show red or green border
      createBlogElements.categoryInput.classList.add(
        getCatChildNodes().length ? 'standard-input-success' : 'standard-input-error'
      );
      createBlogElements.categoryInput.classList.remove(
        getCatChildNodes().length ? 'standard-input-error' : 'standard-input-success'
      );

      // save form
      const form = JSON.parse(localStorage.getItem(localStorageFormKey));
      form.category = {
        value: Array.from(getCatChildNodes()).map(e => e.getAttribute('data-id')),
        isValidated: Boolean(getCatChildNodes().length)
      }
      localStorage.setItem(localStorageFormKey, JSON.stringify(form));
      checkFormForLocalStorage()
    });
  });
}

async function renderCategoryMultiSelect() {
  const { categoryInput } = createBlogElements;

  const categories = await fetchBlogCategories();

  for (const category of categories.data) {
    addBadgeInsideCategoryDropdown({
      id: category.id,
      title: category.title,
      textColor: category.text_color,
      backgroundColor: category.background_color
    });
  }

  categoryInput.addEventListener('click', e => {
    const display = document.querySelector('.category-input-dropdown').style.display;
    document.querySelector('.category-input-dropdown').style.display =
      display === 'block' ? 'none' : 'block';
  });

  registerClickEventOnInsideCategoryBadges((id) => {
    registerClickEventsOnOuterCategoryBadges(id);
  })
}

function checkFormForLocalStorage() {
  const form = JSON.parse(localStorage.getItem(localStorageFormKey));

  let everyOneValidated =
    form?.author?.isValidated &&
    form?.date?.isValidated &&
    form?.description?.isValidated &&
    form?.title?.isValidated &&
    form?.category?.isValidated &&
    form?.photo?.isValidated;

  if (form?.email) {
    everyOneValidated = everyOneValidated && form?.email?.isValidated;
  }

  document.querySelector('.publish-button').style.backgroundColor = everyOneValidated ? '#4721DD' : '#e4e3eb'
}

(async () => {
  // const inputElement
  const { imageDropArea, imageInput, imageVisualiserExitIcon } = createBlogElements;

  imageDropArea.addEventListener('click', () => {
    imageInput.click();
  });
  imageVisualiserExitIcon.addEventListener('click', () => {
    toggleImageDropOver({ isOpen: true });
    imageInput.files = null;
  });
  imageDropArea.addEventListener('dragover', e => {
    e.preventDefault();
    imageDropArea.style.border = '1px dashed green';
  });
  imageDropArea.addEventListener('dragleave', e => {
    e.preventDefault();
    imageDropArea.style.border = '1px dashed #85858d';
  });
  imageDropArea.addEventListener('dragend', e => {
    e.preventDefault();
    imageDropArea.style.border = '1px dashed #85858d';
  });
  imageDropArea.addEventListener('drop', e => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];

      if (!file.type.startsWith('image/')) {
        e.stopPropagation();
        alert('No image');
        return;
      }

      imageInput.files = e.dataTransfer.files;
      updateImageDropOverUI(file);
    }

    imageDropArea.style.border = '1px dashed #85858d';

    // save form
    const form = JSON.parse(localStorage.getItem(localStorageFormKey));
    form.photo = {
      value: 'we cannot have this value',
      isValidated: true
    }
    localStorage.setItem(localStorageFormKey, JSON.stringify(form));
    checkFormForLocalStorage()
  });
  imageInput.addEventListener('change', e => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        e.stopPropagation();
        alert('No image');
        return;
      }

      updateImageDropOverUI(file);
    }

    // save form
    const form = JSON.parse(localStorage.getItem(localStorageFormKey));
    form.photo = {
      value: 'we cannot have this value',
      isValidated: true
    }
    localStorage.setItem(localStorageFormKey, JSON.stringify(form));
    checkFormForLocalStorage()
  });

  const form = JSON.parse(localStorage.getItem(localStorageFormKey))

  if (!form) {
    localStorage.setItem(localStorageFormKey, JSON.stringify({}));
  }
  else {
    if (form?.photo) {
      delete form.photo
      localStorage.setItem(localStorageFormKey, JSON.stringify(form));
    };

    const {
      authorInput,
      titleInput,
      descriptionInput,
      dateInput,
      emailInput,
    } = createBlogElements;


    authorInput.value = form?.author?.value ?? null;
    titleInput.value = form?.title?.value ?? null;
    descriptionInput.value = form?.description?.value ?? null;
    dateInput.value = form?.date?.value ?? null;
    emailInput.value = form?.email?.value ?? null;

    if (form?.category?.value?.length) {
      const categories = (await fetchBlogCategories()).data;
      const values = form.category.value;

      const data = categories.filter(e => values.includes(e.id.toString()))

      document.querySelector('.category-input-value-container').style.display = 'flex';
      document.querySelector('.category-input-placeholder').style.display = 'none';

      for (const category of data) {

        addBadgeOutsideCategoryDropdown({
          id: category.id,
          title: category.title,
          textColor: category.text_color,
          backgroundColor: category.background_color
        })
      }
    }
  }

  await renderCategoryMultiSelect();

  initFormValidations();

  function togglePopup({ isOpen }) {
    document.getElementById('popup-overlay-background').style.display = isOpen ? 'block' : 'none'
    document.getElementById('popup-overlay').style.display = isOpen ? 'block' : 'none'
  }

  document.querySelector('.popup-exit-button').addEventListener('click', () => {
    togglePopup({ isOpen: false })
  })

  document.querySelector('.popup-input-button').addEventListener('click', () => {
    document.location.href = "/";
  })

  createBlogElements.publishButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const form = JSON.parse(localStorage.getItem(localStorageFormKey))
    const data = new FormData()

    // Check if the image file is selected
    const imageFile = createBlogElements.imageInput.files[0];
    if (!imageFile) {
      alert('Please select an image file.');
      return;
    }

    data.append('title', form.title.value);
    data.append('description', form.description.value);
    data.append('image', imageFile);
    data.append('author', form.author.value);
    data.append('publish_date', form.date.value);
    data.append('categories', JSON.stringify(form.category.value));

    if (form?.email?.value) {
      data.append('email', form.email.value);
    }

    const response = await uploadBlog(data);

    if (response.ok) {
      // reset form
      localStorage.setItem(localStorageFormKey, JSON.stringify({}));

      // open popup
      togglePopup({ isOpen: true })
    }
  })

  createBlogElements.returnButton.addEventListener('click', () => {
    window.history.back();
  })
})();

function initFormValidations() {
  const {
    authorInput,
    titleInput,
    descriptionInput,
    dateInput,
    emailInput,
  } = createBlogElements;

  authorInput.addEventListener('input', e => {
    const value = e.target.value?.trim() ?? null;

    const validation = {
      required: false,
      onlyGeorgianLetters: false,
      minFourSymbol: false,
      minTwoWord: false,
    };

    // required
    validation.required = Boolean(value);

    // only georgian letters
    validation.onlyGeorgianLetters = alphabetRegex.test(value);

    // min 4 symbol
    validation.minFourSymbol = value.length >= 4;

    // min 2 word
    validation.minTwoWord = value.split(' ').length >= 2;

    const isEveryValidationSuccess =
      validation.required &&
      validation.onlyGeorgianLetters & validation.minFourSymbol & validation.minTwoWord;

    document.querySelector('.author-input-georgian-letters').style.color =
      validation.onlyGeorgianLetters ? successTextColor : errorTextColor;
    document.querySelector('.author-input-min-symbols').style.color = validation.minFourSymbol
      ? successTextColor
      : errorTextColor;
    document.querySelector('.author-input-min-words').style.color = validation.minTwoWord
      ? successTextColor
      : errorTextColor;

    authorInput.classList.add(
      isEveryValidationSuccess ? 'standard-input-success' : 'standard-input-error'
    );
    authorInput.classList.remove(
      isEveryValidationSuccess ? 'standard-input-error' : 'standard-input-success'
    );

    // save form
    const form = JSON.parse(localStorage.getItem(localStorageFormKey));
    form.author = {
      value,
      isValidated: Boolean(isEveryValidationSuccess)
    }
    localStorage.setItem(localStorageFormKey, JSON.stringify(form));
    checkFormForLocalStorage()
  });

  titleInput.addEventListener('input', e => {
    const value = e.target.value?.trim() ?? null;

    const validation = {
      required: false,
      minTwoSymbol: false,
    };

    // required
    validation.required = Boolean(value);

    // min 2 symbol
    validation.minTwoSymbol = value.length >= 2;

    const isEveryValidationSuccess = validation.required && validation.minTwoSymbol;

    document.querySelector('.input-title-requirement').style.color = validation.minTwoSymbol
      ? successTextColor
      : errorTextColor;

    titleInput.classList.add(
      isEveryValidationSuccess ? 'standard-input-success' : 'standard-input-error'
    );
    titleInput.classList.remove(
      isEveryValidationSuccess ? 'standard-input-error' : 'standard-input-success'
    );

    // save form
    const form = JSON.parse(localStorage.getItem(localStorageFormKey));
    form.title = {
      value,
      isValidated: Boolean(isEveryValidationSuccess)
    }
    localStorage.setItem(localStorageFormKey, JSON.stringify(form));
    checkFormForLocalStorage()
  });

  descriptionInput.addEventListener('input', e => {
    const value = e.target.value?.trim() ?? null;

    const validation = {
      required: false,
      minTwoSymbol: false,
    };

    // required
    validation.required = Boolean(value);

    // min 2 symbol
    validation.minTwoSymbol = value.length >= 2;

    const isEveryValidationSuccess = validation.required && validation.minTwoSymbol;

    document.querySelector('.description-input-requirement').style.color = validation.minTwoSymbol
      ? successTextColor
      : errorTextColor;

    descriptionInput.classList.add(
      isEveryValidationSuccess ? 'standard-input-success' : 'standard-input-error'
    );
    descriptionInput.classList.remove(
      isEveryValidationSuccess ? 'standard-input-error' : 'standard-input-success'
    );

    // save form
    const form = JSON.parse(localStorage.getItem(localStorageFormKey));
    form.description = {
      value,
      isValidated: Boolean(isEveryValidationSuccess)
    }
    localStorage.setItem(localStorageFormKey, JSON.stringify(form));
    checkFormForLocalStorage()
  });

  dateInput.addEventListener('keyup', e => {
    const required = Boolean(e.target.value?.trim() ?? null);

    dateInput.classList.add(required ? 'standard-input-success' : 'standard-input-error');
    dateInput.classList.remove(required ? 'standard-input-error' : 'standard-input-success');

    // save form
    const form = JSON.parse(localStorage.getItem(localStorageFormKey));
    form.date = {
      value: e.target.value?.trim() ?? null,
      isValidated: Boolean(required)
    }
    localStorage.setItem(localStorageFormKey, JSON.stringify(form));
    checkFormForLocalStorage()
  });

  emailInput.addEventListener('input', e => {
    const value = e.target.value?.trim() ?? null;

    const required = Boolean(value);
    const isMailCorrect = emailPattern.test(value);

    const isEveryValidationSuccess = required && isMailCorrect;

    if (required) {
      document.querySelector('.form-input-error').style.display = isMailCorrect ? 'none' : 'flex';
    }

    if (value) {
      emailInput.classList.add(
        isEveryValidationSuccess ? 'standard-input-success' : 'standard-input-error'
      );
      emailInput.classList.remove(
        isEveryValidationSuccess ? 'standard-input-error' : 'standard-input-success'
      );
    }

    // save form
    const form = JSON.parse(localStorage.getItem(localStorageFormKey));
    form.email = {
      value,
      isValidated: value === '' ? true : Boolean(isMailCorrect)
    }
    localStorage.setItem(localStorageFormKey, JSON.stringify(form));
    checkFormForLocalStorage()
  });
}
