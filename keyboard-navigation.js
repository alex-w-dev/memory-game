const selected = (window.selected = {
  x: 0,
  y: 0,
  el: null,
});
const SELECTED = "selected";
const SELECTABLE = "selectable";

function selectSomeone() {
  const allSelectable = getAllSelectable();
  if (allSelectable.length) {
    selectElement(allSelectable[0]);
  }
}

function selectElement(el) {
  if (selected.el) {
    selected.el.classList.remove(SELECTED);
  }

  const rect = el.getBoundingClientRect();
  selected.el = el;
  selected.x = rect.x;
  selected.y = rect.y;
  selected.el.classList.add(SELECTED);
}

function getAllSelectable() {
  return Array.from(document.querySelectorAll(`.${SELECTABLE}`));
}

function keyDownHandler(e) {
  if (e.key === "ArrowDown") {
    selecteDirected("down");
  }

  if (e.key === "ArrowUp") {
    selecteDirected("up");
  }

  if (e.key === "ArrowLeft") {
    selecteDirected("left");
  }

  if (e.key === "ArrowRight") {
    selecteDirected("right");
  }
}

function selecteDirected(direction) {
  const allSelectable = getAllSelectable().filter((el) => el !== selected.el);
  const allBounds = allSelectable.map((el) => ({
    bound: el.getBoundingClientRect(),
    el: el,
  }));
  let x = selected.x;
  let y = selected.y;
  let directionBounds = [];

  console.log(direction, "direction");

  if (direction === "down") {
    directionBounds = allBounds.filter((bound) => bound.bound.y > y);
  }

  if (direction === "up") {
    directionBounds = allBounds.filter((bound) => bound.bound.y < y);
  }

  if (direction === "left") {
    directionBounds = allBounds.filter((bound) => bound.bound.x < x);
  }

  if (direction === "right") {
    directionBounds = allBounds.filter((bound) => bound.bound.x > x);
  }

  if (directionBounds.length) {
    const nearestBound = directionBounds.sort(
      (bound1, bound2) =>
        Math.abs(bound1.bound.x - x) +
        Math.abs(bound1.bound.y - y) -
        (Math.abs(bound2.bound.x - x) + Math.abs(bound2.bound.y - y))
    )[0];

    if (nearestBound) {
      selectElement(nearestBound.el);
      return;
    }
  }
}

document.addEventListener("keydown", keyDownHandler);
setTimeout(selectSomeone, 100);
