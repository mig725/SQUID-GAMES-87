// --- Variables globales ---
const ACCESS_CODE = "OCTO7";  // Cambia aquí el código de acceso real
const loginContainer = document.getElementById("loginContainer");
const loginBtn = document.getElementById("loginBtn");
const accessInput = document.getElementById("accessCode");
const loginError = document.getElementById("loginError");

const logoContainer = document.getElementById("logoContainer");
const fixedLogo = document.getElementById("fixedLogo");
const infoPopup = document.getElementById("infoPopup");
const camSelector = document.getElementById("camSelector");
const camViewer = document.getElementById("camViewer");
const fullImage = document.getElementById("fullImage");
const camText = document.getElementById("camText");

const investigations = document.getElementById("investigations");
const questionsContainer = document.getElementById("questionsContainer");

const letterPopup = document.getElementById("letterPopup");
const letterPopupText = document.getElementById("letterPopupText");

const errorPopup = document.getElementById("errorPopup");
const errorPopupText = document.getElementById("errorPopupText");

const mystery = document.getElementById("mystery");
const letterSlots = document.getElementById("letterSlots");
const slotNumbers = document.getElementById("slotNumbers");
const mysteryMsg = document.getElementById("mysteryMsg");

const finalPopup = document.getElementById("finalPopup");

const bgMusic = document.getElementById("bgMusic");

// Palabra a resolver en misterio y letras en orden
const mysteryWord = "OHLLNAM";

let lettersFound = [];
let questionsAnswered = {};

// --- Código acceso ---
function tryLogin() {
  const code = accessInput.value.trim();
  if (code === ACCESS_CODE) {
    loginError.textContent = "";
    loginContainer.style.display = "none";
    showLogoAnimation();
  } else {
    loginError.textContent = "Código incorrecto. Intenta de nuevo.";
  }
}

loginBtn.addEventListener("click", tryLogin);
accessInput.addEventListener("keydown", e => {
  if (e.key === "Enter") tryLogin();
});

// --- Animación logo inicial ---
function showLogoAnimation() {
  logoContainer.style.display = "flex";
  bgMusic.volume = 0.3;
  bgMusic.play();
  setTimeout(() => {
    logoContainer.style.display = "none";
    fixedLogo.style.display = "block";
    infoPopup.style.display = "flex";
    camSelector.style.display = "block";
    renderQuestions();
  }, 6000);
}

// --- Info popup ---
function closeInfo() {
  infoPopup.style.display = "none";
}

// --- Cámara ---
function showCam(imgSrc, desc) {
  fullImage.src = imgSrc;
  camText.textContent = desc;
  camViewer.style.display = "flex";
}

function closeCam() {
  camViewer.style.display = "none";
  fullImage.src = "";
  camText.textContent = "";
}

// --- Investigaciones / Preguntas ---
const questions = [
  {
    id: 1,
    text: "¿De dónde provenían los jugadores?",
    options: ["Clase baja", "Clase alta", "Clase media"],
    answer: "Clase baja",
    letter: "O"
  },
  {
    id: 2,
    text: "¿Cuántos jugadores normalmente participaban?",
    options: ["456", "100", "300"],
    answer: "456",
    letter: "H"
  },
  {
    id: 3,
    text: "¿Dónde dormían los jugadores?",
    options: ["Habitaciones de lujo", "Habitaciones con camas de madera barata", "En tiendas"],
    answer: "Habitaciones con camas de madera barata",
    letter: "L"
  },
  {
    id: 4,
    text: "¿Dónde dormían los guardias y almacenaban recursos?",
    options: ["Sala del Personal", "Patio Principal", "Baños"],
    answer: "Sala del Personal",
    letter: "L"
  },
  {
    id: 5,
    text: "¿Qué había en el patio principal?",
    options: ["Muñeca de arcilla movida manualmente", "Piscina", "Árboles"],
    answer: "Muñeca de arcilla movida manualmente",
    letter: "N"
  },
  {
    id: 6,
    text: "¿Para qué se usaba el pasillo a habitaciones?",
    options: ["Escape nocturno", "Almacén", "Sala de juegos"],
    answer: "Escape nocturno",
    letter: "A"
  },
  {
    id: 7,
    text: "¿Dónde intentaban escapar algunos jugadores?",
    options: ["Drenaje de baños", "Patio principal", "Habitaciones"],
    answer: "Drenaje de baños",
    letter: "M"
  }
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderQuestions() {
  questionsContainer.innerHTML = "";
  questions.forEach(q => {
    const div = document.createElement("div");
    div.classList.add("question");

    const p = document.createElement("p");
    p.textContent = q.text;
    div.appendChild(p);

    const options = shuffleArray([...q.options]);
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.disabled = questionsAnswered[q.id] === true;
      btn.addEventListener("click", () => checkAnswer(q, opt));
      div.appendChild(btn);
    });

    if (questionsAnswered[q.id]) {
      const checkmark = document.createElement("span");
      checkmark.textContent = " ✔";
      checkmark.classList.add("checkmark");
      p.appendChild(checkmark);
    }

    questionsContainer.appendChild(div);
  });
}

function checkAnswer(question, selected) {
  if (selected === question.answer) {
    if (!lettersFound.includes(question.letter)) {
      lettersFound.push(question.letter);
    }
    questionsAnswered[question.id] = true;
    letterPopupText.textContent = `¡Correcto! Conseguido letra: ${question.letter}`;
    letterPopup.style.display = "flex";
    renderQuestions();
  } else {
    errorPopupText.textContent = "Respuesta incorrecta, intenta otra vez.";
    errorPopup.style.display = "flex";
  }
}

function closeLetterPopup() {
  letterPopup.style.display = "none";
}

function closeErrorPopup() {
  errorPopup.style.display = "none";
}

function openInvestigations() {
  investigations.style.display = "flex";
  renderQuestions();
}

function closeInvestigations() {
  investigations.style.display = "none";
}

// --- Resuelve el misterio ---
function openMystery() {
  mystery.style.display = "flex";
  mysteryMsg.textContent = "";
  renderLetterSlots();
}

function closeMystery() {
  mystery.style.display = "none";
}

function renderLetterSlots() {
  letterSlots.innerHTML = "";
  slotNumbers.innerHTML = "";
  for (let i = 0; i < mysteryWord.length; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.classList.add("slotInput");
    input.dataset.index = i;
    if (lettersFound.includes(mysteryWord[i])) {
      input.value = mysteryWord[i];
      input.disabled = true;
    }
    letterSlots.appendChild(input);

    const spanNum = document.createElement("span");
    spanNum.textContent = i + 1;
    spanNum.classList.add("slotNumber");
    slotNumbers.appendChild(spanNum);
  }
}

function checkMystery() {
  const inputs = document.querySelectorAll("#letterSlots input");
  let userInput = "";
  inputs.forEach(input => {
    userInput += (input.value || " ").toUpperCase();
  });

  if (userInput.includes(" ")) {
    mysteryMsg.style.color = "#f44336";
    mysteryMsg.textContent = "Completa todas las letras para verificar.";
    return;
  }

  if (userInput === mysteryWord) {
    finalPopup.style.display = "flex";
    mystery.style.display = "none";
  } else {
    mysteryMsg.style.color = "#f44336";
    mysteryMsg.textContent = "No es correcto, intenta de nuevo.";
  }
}

function closeFinal() {
  finalPopup.style.display = "none";
}

// --- Música ---
let musicPlaying = true;

function toggleMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
  } else {
    bgMusic.play();
    musicPlaying = true;
  }
}

// --- Cargar página ---
window.onload = () => {
  sessionStorage.clear(); // borrar progreso al cargar
  loginContainer.style.display = "flex";
  logoContainer.style.display = "none";
  fixedLogo.style.display = "none";
  infoPopup.style.display = "none";
  camSelector.style.display = "none";
  camViewer.style.display = "none";
  investigations.style.display = "none";
  letterPopup.style.display = "none";
  errorPopup.style.display = "none";
  mystery.style.display = "none";
  finalPopup.style.display = "none";

  bgMusic.volume = 0.3;
  bgMusic.play();
  musicPlaying = true;
};
