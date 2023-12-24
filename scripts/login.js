function closeOverlay() {
    document.querySelector('.login-overlay-background')
        .classList.remove('login-overlay-background-on');
    document.querySelector('.login-overlay')
        .classList.remove('login-overlay-on');
}

// Storage for email input
let emailData = {
    email : null
};

function retrieveInput() {
    emailData.email = document.querySelector('.login-input').value
}

let emailPattern = /^[a-zA-Z0-9._-]+@redberry.ge/;

function verifyEmail() {
    if (emailPattern.test(emailData.email)) {
        fetch('https://api.blog.redberryinternship.ge/api/login', {
            method: 'POST', 
            body: JSON.stringify(emailData)})
            .then(response => {
                // Check response
                if(response.ok) {
                    document.querySelector('.login-input-block')
                        .classList.add('login-input-block-off');
                    document.querySelector('.login-success-block')
                        .classList.add('login-success-block-on');
                    document.querySelector('.login-button')
                        .textContent = 'დაამატე ბლოგი';
                    loginInputButton.textContent = 'კარგი';
                    loginInputButton.removeEventListener('click', retrieveInput)
                    loginInputButton.removeEventListener('click', verifyEmail)
                    loginInputButton.addEventListener('click', closeOverlay)
                } else {
                    document.querySelector('.login-input')
                        .classList.add('login-input-error');
                }})
    } else {
        document.querySelector('.login-input')
            .classList.add('login-input-error');
        document.querySelector('.login-error-message')
            .classList.add('login-error-message-on');
    }
}

// Add event listener to login button
document.querySelector('.login-button').addEventListener('click', () => {
    document.querySelector('.login-overlay-background')
        .classList.add('login-overlay-background-on');
    document.querySelector('.login-overlay')
        .classList.add('login-overlay-on');
});

// Add event listener to login exit button
document.querySelector('.login-exit-button').addEventListener('click', closeOverlay);

const loginInputButton = document.querySelector('.login-input-button');


// Add event listener to input button to retrieve input
loginInputButton.addEventListener('click', retrieveInput);
loginInputButton.addEventListener('click', verifyEmail);


