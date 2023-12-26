const emailPattern = /^[a-zA-Z0-9._-]+@redberry.ge/; // Regex for email pattern
const loginInputButton = document.querySelector('.login-input-button');

// Storage for email input
let emailData = {
    email : null
};

// Function for login exit button event listener
function closeOverlay() {
    document.querySelector('.login-overlay-background')
        .classList.remove('login-overlay-background-on');
    document.querySelector('.login-overlay')
        .classList.remove('login-overlay-on');
}

function handleResponse(response) {
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
        
        // Save login status to loccal storage
        localStorage.setItem('loginStatus', 'true');
    } else {
        
        document.querySelector('.login-input')
        .classList.add('login-input-error');
        
        document.querySelector('.login-error-message')
        .classList.add('login-error-message-on');
    }
}

// Function for login input button event listener
function verifyEmail() {
    console.log(JSON.stringify(emailData));
    if (emailPattern.test(emailData.email)) {
        fetch('https://api.blog.redberryinternship.ge/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }, 
            body: JSON.stringify(emailData)})
            .then(response => {
                handleResponse(response);
               })
    } else {
        document.querySelector('.login-input')
            .classList.add('login-input-error');
        document.querySelector('.login-error-message')
            .classList.add('login-error-message-on');
    }
}

// Function for login input button event listener
function retrieveInput() {
    emailData.email = document.querySelector('.login-input').value
}

// Check local storage for login status
if (localStorage.getItem('loginStatus') === 'true') {
    document.querySelector('.login-button')
        .textContent = 'დაამატე ბლოგი';
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

// Add event listener to input button to retrieve input
loginInputButton.addEventListener('click', retrieveInput);
loginInputButton.addEventListener('click', verifyEmail);