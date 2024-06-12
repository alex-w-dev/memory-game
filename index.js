// Массив для хранения карточек
let cards = [];
let openCards = []; // Массив для отслеживания открытых карточек
let moves = 0; // Счетчик ходов
let pairs = 0; // Счетчик пар
let animation = false;
let score = 0;
let maxScore = 0;

const initialScore = 50;
const pairScore = 5;
const failScore = 1;
const animationTime = 1000;
const totalCards = 18;
const totalpossibleImages = 26;
const maxScoreKey = "memory.maxScore";

function startAnimation() {
  animation = true;
}
function stopAnimation() {
  animation = false;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function resetGame() {
  cards = [];
  openCards = []; // Массив для отслеживания открытых карточек
  moves = 0; // Счетчик ходов
  pairs = 0; // Счетчик пар
  animation = false;
  setScore(initialScore);
  setMaxScore(localStorage.getItem(maxScoreKey) || 0);
  memoryGame.innerHTML = "";
}

function endGame() {
  setTimeout(() => {
    if (maxScore < score) {
      localStorage.setItem(maxScoreKey, score);
    }
    alert("Поздравляем! Выли игру!");
    location.reload();
  }, animationTime);
}

// Функция для создания карточек
function createCards() {
  const imageIndexes = new Array(totalpossibleImages)
    .fill(null)
    .map((one, i) => i);
  shuffle(imageIndexes);
  for (let i = 0; i < totalCards; i++) {
    for (let j = 0; j < 2; j++) {
      const card = document.createElement("div");
      card.className = "card selectable";
      card.dataset.id = i;
      card.addEventListener("click", flipCard);
      cards.push(card);

      const cardFace = document.createElement("div");
      cardFace.className = "card-face card-content";
      cardFace.style.backgroundImage = `url('/img/rand/${
        imageIndexes[i % totalpossibleImages]
      }.png')`;
      card.appendChild(cardFace);

      const cardBack = document.createElement("div");
      cardBack.className = "card-back card-content";
      card.appendChild(cardBack);
    }
  }

  shuffle(cards);
  cards.forEach((card) => memoryGame.appendChild(card));
  const template = new Array(Math.ceil(Math.sqrt(cards.length)))
    .fill("auto")
    .join(" ");
  memoryGame.style.gridTemplateColumns = template;
  memoryGame.style.gridTemplateRows = template;
}

function setScore(_score) {
  score = Math.max(0, _score);
  scoreEl.innerHTML = `${score}`;
}
function setMaxScore(_maxScore) {
  maxScore = _maxScore;
  maxScoreEl.innerHTML = `${maxScore}`;
}

// Функция для переворачивания карточки
function flipCard() {
  if (this.classList.contains("flip")) {
    return;
  }

  startAnimation();
  setTimeout(stopAnimation, animationTime);

  this.classList.add("flip");

  const lastOpened = openCards[0];
  if (lastOpened) {
    console.log(1, "1");
    if (lastOpened.dataset.id === this.dataset.id) {
      pairs++;
      openCards = [];
      setScore(score + pairScore);

      if (pairs === totalCards) {
        endGame();
      }
    } else {
      setTimeout(() => {
        lastOpened.classList.remove("flip");
        this.classList.remove("flip");
      }, animationTime);

      setScore(score - failScore);
      openCards = [];
    }
  } else {
    openCards[0] = this;
  }
}

// Инициализация игры
document.addEventListener("DOMContentLoaded", () => {
  resetGame();
  createCards();
});

document.addEventListener("keydown", function (e) {
  console.log(e.key, "e.key");
  if (e.key === " ") {
    console.log(111, "111");
    const selectable = document.getElementsByClassName("selected")[0];
    if (selectable) {
      selectable.click();
    }
  }
});
