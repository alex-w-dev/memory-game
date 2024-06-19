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
const totalpossibleImages = 54;
const maxScoreKey = "memory.maxScore";
const selector = new Selector();

function startAnimation() {
  animation = true;
}
function stopAnimation() {
  animation = false;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
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
      alert(`Поздравляем!\nУстановлен новый рекорд: ${score}!`);
    } else {
      alert(`Поздравляем!\nВаш счет: ${score}`);
    }
    location.reload();
  }, animationTime);
}

// Функция для создания карточек
function createCards() {
  const newStyle = document.createElement("style");
  newStyle.innerText = `.card .card-back { background-image: url('/img/flowers/${getRandomIntInclusive(
    0,
    5
  )}.jpeg'); }`;
  document.body.appendChild(newStyle);

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
      }.jpeg')`;
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
  selector.setSelectionContainer(main);
  selector.selectSomeone();
}

function setScore(_score) {
  score = Math.max(0, _score);
  scoreEl.innerHTML = `${score}`;
}
function setMaxScore(_maxScore) {
  maxScore = _maxScore;
  maxScoreEl.innerHTML = `${maxScore}`;
}

function onExitHandler() {
  if (confirm("Выйти из игры?")) {
    if (window.ysdk) {
      window.ysdk.dispatchEvent(ysdk.EVENTS.EXIT);
    } else {
      location.reload();
    }
  }
}

// Функция для переворачивания карточки
function flipCard() {
  selector.selectElement(this);
  if (this.classList.contains("flip")) {
    return;
  }

  startAnimation();
  setTimeout(stopAnimation, animationTime);

  this.classList.add("flip");

  const lastOpened = openCards[0];
  if (lastOpened) {
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
  if (e.key === "Backspace" || e.key === "Escape") {
    onExitHandler();
  }
  console.log(e.key, "e.key");
  if (e.key === "Enter") {
    const selectable = document.getElementsByClassName("selected")[0];
    if (selectable) {
      selectable.click();
    }
  }
});

YaGames.init().then((ysdk) => {
  console.log("Yandex SDK initialized");
  window.ysdk = ysdk;
  ysdk.onEvent(ysdk.EVENTS.HISTORY_BACK, () => {
    onExitHandler();
  });
});
