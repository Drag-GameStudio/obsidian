const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const BASE_URL = window.location.origin + "/menu/";

// переключение вкладок
loginTab.onclick = () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
};
registerTab.onclick = () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
}

// обработка логина
loginForm.onsubmit = (e) => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    fetch(BASE_URL + "login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": get_csrf_token()
        },
        body: JSON.stringify({ login: user, password: pass }),
    }).then(response => {
        if (response.ok) {
            window.location.href = window.location.origin + "/graph/"; // перенаправление на главную страницу
        }
        else {
            response.json().then(data => {
                showError(data.message)
            })
        }
    })
};

// обработка регистрации
registerForm.onsubmit = (e) => {
    e.preventDefault();
    const user = document.getElementById("regUser").value;
    const pass = document.getElementById("regPass").value;

    fetch(BASE_URL + "regist/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": get_csrf_token()
        },
        body: JSON.stringify({ login: user, password: pass }),
    }).then(response => {
        if (response.ok) {
            window.location.href = window.location.origin + "/graph/"; // перенаправление на главную страницу
        }
        else {
            response.json().then(data => {
                showError(data.message)
            })
        }
    })
};

function showError(message) {
    const container = document.getElementById('errorContainer');

    const errorBlock = document.createElement('div');
    errorBlock.className = 'error-message';
    errorBlock.textContent = message;

    container.appendChild(errorBlock);

    // Удаление с анимацией через 2 секунды
    setTimeout(() => {
        errorBlock.style.animation = 'slideOut 0.3s forwards';
        // Удалить элемент после завершения анимации
        errorBlock.addEventListener('animationend', () => {
            errorBlock.remove();
        });
    }, 2000);
}