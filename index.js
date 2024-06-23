// Массив для хранения карточек
let openCards = []; // Массив для отслеживания открытых карточек
let moves = 0; // Счетчик ходов
let pairs = 0; // Счетчик пар
let animation = false;
let score = 0;
let maxScore = 0;
let totalPairs = 18; // 2 / 8 / 18 / 32 / 50 / 72
let exitDialogOpened = false;
let endGameDialogOpened = false;
let isMainMenu = true;

const initialScore = 50;
const pairScore = 5;
const failScore = 1;
const animationTime = 1000;
const totalpossibleImages = 54;
const maxScoreKey = "memory.maxScore";
const selector = new Selector();
const maximumCardsCount = 64; // 32 difficult * 2
const allCardElems = new Array(maximumCardsCount).fill(null).map(() => {
  const card = document.createElement("div");
  card.className = "bCard vybirayemiy";
  memoryGame.appendChild(card);
  const cardFace = document.createElement("div");
  cardFace.className = "bCard-face bCard-content";
  cardFace.style.backgroundImage = `url('./img/rand/0.jpeg')`;
  card.appendChild(cardFace);

  const cardBack = document.createElement("div");
  cardBack.className = "bCard-back bCard-content";
  card.appendChild(cardBack);
  return card;
});
const cardToId = new Map();

const diffiults = [
  { pairs: 2, src: "./img/diff/0.jpeg", title: "Пупсик" },
  { pairs: 8, src: "./img/diff/2.jpeg", title: "Новичок" },
  { pairs: 18, src: "./img/diff/1.jpeg", title: "Специалист" },
  { pairs: 32, src: "./img/diff/4.jpeg", title: "Эксперт" },
];

function getCardElems(count) {
  return allCardElems.slice(0, count).map((el) => {
    el.style.display = "flex";
    return el;
  });
}

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
  allCardElems.forEach((el) => {
    el.style.display = "none";
    el.classList.remove("flip");
  });
  openCards = []; // Массив для отслеживания открытых карточек
  moves = 0; // Счетчик ходов
  pairs = 0; // Счетчик пар
  animation = false;
  setScore(initialScore);
  setMaxScore(localStorage.getItem(maxScoreKey) || 0);
}

function renderDifficult() {
  const difficult = diffiults.find((d) => d.pairs === totalPairs);
  difficultTitle.innerText = difficult.title;
  difficultImage.src = difficult.src;
}

function setTotalPairs(pairs) {
  totalPairs = pairs;
  renderDifficult();
}

function increaseDifficult() {
  const nextDifficult = diffiults.find((d) => d.pairs > totalPairs);
  if (nextDifficult) {
    setTotalPairs(nextDifficult.pairs);
  }
}
function decreaseDifficult() {
  const previousDifficult = diffiults.findLast((d) => d.pairs < totalPairs);
  if (previousDifficult) {
    setTotalPairs(previousDifficult.pairs);
  }
}

function startNewGame() {
  bMain.style.display = "grid";
  menu.style.display = "none";
  isMainMenu = false;
  resetGame();
  createCards();
  selector.setSelectionContainer(bMain);
  selector.selectSomeone();
}

function backToMainMenuHandler() {
  bMain.style.display = "none";
  menu.style.display = "flex";
  isMainMenu = true;
  renderDifficult();
  selector.setSelectionContainer(menu);
  selector.selectElement(mainMenuPlayBtn);
}

function endGame() {
  setTimeout(() => {
    if (maxScore < score) {
      localStorage.setItem(maxScoreKey, score);
      openEndGameDialog(`Вы заработали ${score} очков, это новый рекорд!`);
    } else {
      openEndGameDialog(`Вы заработали ${score} очков!`);
    }
  }, animationTime);
}

// Функция для создания карточек
function createCards() {
  const newStyle = document.createElement("style");
  newStyle.innerText = `.bCard .bCard-back { background-image: url('./img/flowers/${getRandomIntInclusive(
    0,
    5
  )}.jpeg'); }`;
  document.body.appendChild(newStyle);

  const cards = getCardElems(totalPairs * 2);
  shuffle(cards);
  const imageIndexes = new Array(totalpossibleImages)
    .fill(null)
    .map((one, i) => i);
  shuffle(imageIndexes);
  for (let i = 0; i < totalPairs; i++) {
    for (let j = 0; j < 2; j++) {
      const bCard = cards[i * 2 + j];
      cardToId.set(bCard, i);

      const cardFace = bCard.querySelector(".bCard-face");
      cardFace.style.backgroundImage = `url('./img/rand/${
        imageIndexes[i % totalpossibleImages]
      }.jpeg')`;
    }
  }

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

function onBackHandler() {
  if (isMainMenu) {
    if (exitDialogOpened) {
      closeExitDialog();
    } else {
      openExitDialog();
    }
  } else {
    if (endGameDialogOpened) {
      closeEndGameDialog();
    } else {
      backToMainMenuHandler();
    }
  }
}

function openExitDialog() {
  exitWindow.style.display = "block";
  exitDialogOpened = true;
  selector.setSelectionContainer(exitWindow);
  selector.selectSomeone();
}
function closeExitDialog() {
  exitWindow.style.display = "none";
  exitDialogOpened = false;

  if (isMainMenu) {
    backToMainMenuHandler();
  } else {
    selector.setSelectionContainer(bMain);
    selector.selectSomeone();
  }
}

function openEndGameDialog(text) {
  endGameDialogOpened = true;
  endResultText.innerHTML = text;
  endResult.style.display = "block";
  selector.setSelectionContainer(endResult);
  selector.selectSomeone();
}
function closeEndGameDialog() {
  endGameDialogOpened = false;
  startNewGame();
  endResult.style.display = "none";
}

function exitGame() {
  if (window.ysdk) {
    try {
      window.ysdk.dispatchEvent(ysdk.EVENTS.EXIT);
    } catch (e) {
      console.error(e);
      location.reload();
    }
  } else {
    location.reload();
  }
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
    if (cardToId.get(lastOpened) === cardToId.get(this)) {
      pairs++;
      openCards = [];
      setScore(score + pairScore);

      if (pairs === totalPairs) {
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

function addClickEventListener(el, cb) {
  function cbAdapter(e) {
    selector.clickHandler(e);
    cb.call(this, e);
    e.stopPropagation();
    e.preventDefault();
  }

  if (isTV()) {
    el.addEventListener("ownClick", cbAdapter);
  } else {
    el.addEventListener("click", cbAdapter);
  }
}
function dispatchClickEvent(el) {
  if (isTV()) {
    el.dispatchEvent(new Event("ownClick", { target: el }));
  } else {
    el.click();
  }
}

// Инициализация игры
document.addEventListener("DOMContentLoaded", () => {
  backToMainMenuHandler();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Backspace" || e.key === "Escape") {
    onBackHandler();
  }
  if (e.key === "Enter") {
    const selected = document.getElementsByClassName("yaVybran")[0];
    if (selected) {
      dispatchClickEvent(selected);
    }
    if (isTV()) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
});

YaGames.init().then((ysdk) => {
  window.ysdk = ysdk;

  ysdk.onEvent(ysdk.EVENTS.HISTORY_BACK, () => {
    onBackHandler();
  });

  if (isTV()) {
    exitConteiner.style.display = "none";
  }
  initClickEvents();
});

function isTV() {
  return window.ysdk && window.ysdk.deviceInfo.type === "tv";
}

function initClickEvents() {
  allCardElems.forEach((el) => {
    addClickEventListener(el, flipCard);
  });
  addClickEventListener(mainMenuPlayBtn, startNewGame);
  addClickEventListener(degreaseDifficultBtn, decreaseDifficult);
  addClickEventListener(increaseDifficultBtn, increaseDifficult);
  addClickEventListener(exitConteiner, backToMainMenuHandler);
  addClickEventListener(exitGameButtonNo, closeExitDialog);
  addClickEventListener(exitGameButtonYes, exitGame);
  addClickEventListener(closeEndGameDialogBtn, closeEndGameDialog);
}
