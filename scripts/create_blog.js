const createBlogElements = {
    imageDropArea: document.querySelector('.image-drop-area'),
    imageInputLink: document.querySelector('.choose-image-file-link'),
    authorInput: document.querySelector('.author-input'),
    titleInput: document.querySelector('.title-input'),
    descriptionInput: document.querySelector('.description-input'),
    dateInput: document.querySelector('.date-input'),
    categoryInput: document.querySelector('.category-input'),
    emailInput: document.querySelector('.email-input'),
    publishButton: document.querySelector('.publish-button'),
}

createBlogElements.authorInput.addEventListener('input', () => {validate()})

function countLetters(string) {

    let count = 0;

    for (let i = 0; i < string.length; i++) {
        if (/[a-zA-Z]/.test(string[i])){
            count ++;
        }
    }
    return count
}

function validate() {
    const authorInputValue = createBlogElements.authorInput.value.replace(/\s+/g, ' '); 
    if (countLetters(authorInputValue) < 4) {
        document.getElementsByClassName('.author-input-min-symbols')
    }
}