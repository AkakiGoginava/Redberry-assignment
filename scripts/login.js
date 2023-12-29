import { emailPattern } from './shared/shared.js';

const loginElements = {
  loginButton: document.querySelector('.login-button'),
  loginModalOverlayBackground: document.getElementById('login-overlay-background'),
  loginModalOverlay: document.getElementById('login-overlay'),
  loginExitButton: document.querySelector('.login-exit-button'),
  loginSubmitButton: document.querySelector('.login-input-button'),
  loginInput: document.getElementById('login-input'),
  loginErrorMessage: document.querySelector('.login-error-message'),
};

// local storage key name
export const loginStatusKeyName = 'loginStatus';

const toggleLoginButtonModal = ({ show }) => {
  const { loginModalOverlay, loginModalOverlayBackground } = loginElements;

  loginModalOverlayBackground.style.display = show ? 'block' : 'none';
  loginModalOverlay.style.display = show ? 'block' : 'none';
};

const toggleLoginInputError = ({ show }) => {
  const { loginInput, loginErrorMessage } = loginElements;

  if (show) {
    loginInput.classList.add('login-input-error');
    loginErrorMessage.classList.add('login-error-message-on');
    return;
  }

  loginInput.classList.remove('login-input-error');
  loginErrorMessage.classList.remove('login-error-message-on');
};

async function login() {
  const email = loginElements.loginInput.value?.trim() ?? null;

  if (!email || !emailPattern.test(email)) {
    return toggleLoginInputError({ show: true });
  }

  const response = await fetch('https://api.blog.redberryinternship.ge/api/login', {
    body: JSON.stringify({ email }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return toggleLoginInputError({ show: true });
  }

  const { loginSubmitButton } = loginElements;

  document.querySelector('.login-input-block').classList.add('login-input-block-off');
  document.querySelector('.login-success-block').classList.add('login-success-block-on');
  document.querySelector('.login-button').textContent = 'დაამატე ბლოგი';

  loginSubmitButton.textContent = 'კარგი';
  loginSubmitButton.addEventListener('click', () => toggleLoginButtonModal({ show: false }));

  // Save login status to loccal storage
  localStorage.setItem(loginStatusKeyName, 'true');
}

export function checkAuthAndChangeButton() {
  const isAuthenticated = JSON.parse(localStorage.getItem(loginStatusKeyName)) ?? false;

  // Check local storage for user state
  if (isAuthenticated) {
    document.querySelector('.login-button').textContent = 'დაამატე ბლოგი';
  }
}

(() => {
  // Add event listeners
  loginElements.loginButton.addEventListener('click', () => {

    const isAuthenticated = JSON.parse(localStorage.getItem(loginStatusKeyName)) ?? false;

    // Check local storage for user state
    if (isAuthenticated) {
      window.location.href = 'create_blog.html';
    } else {
      toggleLoginButtonModal({ show: true });
    }
  });

  loginElements.loginSubmitButton.addEventListener('click', () => login());
  loginElements.loginExitButton.addEventListener('click', () => {
    toggleLoginButtonModal({ show: false });
    toggleLoginInputError({ show: false });
    loginElements.loginInput.value = null;
  });
})();
