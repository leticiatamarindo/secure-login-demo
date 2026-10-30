"use strict";

const AUTH_SESSION_KEY = "secureLoginDemo.authenticated";
const loginForm = document.querySelector("#login-form");

function showLoginMessage(message, state) {
  const messageElement = document.querySelector("#login-message");
  if (!messageElement) return;

  // Use textContent rather than HTML parsing so user-controlled text cannot execute as markup.
  messageElement.textContent = message;
  messageElement.dataset.state = state;
}

if (loginForm) {
  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#password");

  usernameInput.addEventListener("input", () => {
    // Basic input sanitization removes markup delimiters and control characters.
    // This complements (but does not replace) safe output handling via textContent.
    usernameInput.value = usernameInput.value
      .replace(/[<>]/g, "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .slice(0, 80);
  });

  passwordInput.addEventListener("input", () => {
    // Preserve password characters; remove only control characters that have no place in a password.
    // Passwords are never inserted into the page as HTML or stored in sessionStorage.
    passwordInput.value = passwordInput.value.replace(/[\u0000-\u001F\u007F]/g, "");
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    let password = passwordInput.value;
    const strongPassword =
      password.length >= 12 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);

    if (!username) {
      showLoginMessage("Informe um usuário.", "error");
      passwordInput.value = "";
      password = "";
      return;
    }

    // Reject weak passwords to demonstrate safer credential requirements.
    // This is only a client-side simulation, not real authentication or password storage.
    if (!strongPassword) {
      showLoginMessage("Senha fraca. Use no mínimo 12 caracteres, com maiúscula, minúscula, número e símbolo.", "error");
      passwordInput.value = "";
      password = "";
      return;
    }

    // The sessionStorage flag is a demo-only gate and can be altered by the browser user.
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
    sessionStorage.setItem("username", username);
    passwordInput.value = "";
    password = "";
    window.location.assign("dashboard.html");
  });
}

if (window.location.pathname.endsWith("/dashboard.html") ||
    window.location.pathname === "dashboard.html") {
  // Broken Access Control mitigation for this prototype: reject dashboard visits
  // without the session flag. Client-side checks are not a substitute for server authorization.
  if (sessionStorage.getItem(AUTH_SESSION_KEY) !== "true") {
    window.location.replace("index.html");
  } else {
    document.body.style.visibility = "visible";
  }

  // Saudação dinâmica com proteção contra XSS
    const savedName = sessionStorage.getItem("username");
    const greetingElement = document.querySelector("#user-greeting");
    if (greetingElement && savedName) {
      greetingElement.textContent = `Olá, ${savedName}!`;
    }
  }

  const logoutButton = document.querySelector("#logout-button");
  logoutButton?.addEventListener("click", () => {
    // Remove the demo auth state and clear any sensitive form/runtime references we control.
    // JavaScript cannot guarantee physical memory erasure; real credentials must never be kept client-side.
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem("username");
    const passwordInput = document.querySelector("#password");
    if (passwordInput) passwordInput.value = "";

    window.location.replace("index.html");
  });

  // Lógica do Timer Pomodoro 
  let pomodoroInterval;
  let currentModeMinutes = 25; // Salva o tempo do modo atual para o reset
  let timeLeft = currentModeMinutes * 60; 
  let isRunning = false;

  const display = document.getElementById('pomodoro-display');
  const btnToggle = document.getElementById('pomodoro-toggle'); // Novo botão Iniciar/Pausar
  const btnResetAction = document.getElementById('pomodoro-reset-action'); // Novo botão Reset
  const btnResetMode = document.getElementById('pomodoro-reset');
  const btnShort = document.getElementById('pomodoro-short');
  const btnLong = document.getElementById('pomodoro-long');

  function updateDisplay() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Função para alterar a aparência do botão Iniciar/Pausar
  function updateToggleButton() {
      if (isRunning) {
          btnToggle.textContent = 'Pausar';
          btnToggle.className = 'btn-pause';
      } else {
          btnToggle.textContent = 'Iniciar';
          btnToggle.className = 'btn-start';
      }
  }

  function setTimer(minutes) {
      clearInterval(pomodoroInterval);
      isRunning = false;
      currentModeMinutes = minutes; // Salva o modo atual
      timeLeft = minutes * 60;
      updateDisplay();
      updateToggleButton();
  }

  // Lógica para alternar (Toggle) entre Iniciar e Pausar no mesmo botão
  btnToggle?.addEventListener('click', () => {
      if (isRunning) {
          // Se está rodando, pausa
          clearInterval(pomodoroInterval);
          isRunning = false;
          updateToggleButton();
      } else {
          // Se está pausado, inicia
          isRunning = true;
          updateToggleButton();
          
          pomodoroInterval = setInterval(() => {
              if (timeLeft > 0) {
                  timeLeft--;
                  updateDisplay();
              } else {
                  clearInterval(pomodoroInterval);
                  isRunning = false;
                  display.textContent = "00:00";
                  updateToggleButton();
                  alert('Tempo esgotado!');
              }
          }, 1000);
      }
  });

  // Ação de Resetar o cronômetro para o tempo do modo atual
  btnResetAction?.addEventListener('click', () => {
      setTimer(currentModeMinutes);
  });

  // Botões de modos de tempo
  btnResetMode?.addEventListener('click', () => setTimer(25));
  btnShort?.addEventListener('click', () => setTimer(5));
  btnLong?.addEventListener('click', () => setTimer(15));
