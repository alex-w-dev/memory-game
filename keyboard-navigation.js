const SELECTED = "selected";
const SELECTABLE = "isSelectable";

class Selector {
  selectionContainer = document;
  selected = {
    x: 0,
    y: 0,
    el: null,
  };

  constructor() {
    document.addEventListener("keydown", (e) => {
      this.keyDownHandler(e);
    });
  }

  selectSomeone() {
    const allSelectable = this.getAllSelectable();
    if (allSelectable.length) {
      this.selectElement(allSelectable[0]);
    }
  }

  selectElement(el) {
    if (this.selected.el) {
      this.selected.el.classList.remove(SELECTED);
    }

    const rect = el.getBoundingClientRect();
    this.selected.el = el;
    this.selected.x = rect.x;
    this.selected.y = rect.y;
    this.selected.el.classList.add(SELECTED);
  }

  setSelectionContainer(el) {
    this.selectionContainer = el;
  }

  getAllSelectable() {
    return Array.from(
      this.selectionContainer.querySelectorAll(`.${SELECTABLE}`)
    );
  }

  keyDownHandler(e) {
    if (e.key === "ArrowDown") {
      this.selecteDirected("down");
    }

    if (e.key === "ArrowUp") {
      this.selecteDirected("up");
    }

    if (e.key === "ArrowLeft") {
      this.selecteDirected("left");
    }

    if (e.key === "ArrowRight") {
      this.selecteDirected("right");
    }
  }

  selecteDirected(direction) {
    const allSelectable = this.getAllSelectable().filter(
      (el) => el !== this.selected.el
    );
    const allBounds = allSelectable.map((el) => ({
      bound: el.getBoundingClientRect(),
      el: el,
    }));
    let x = this.selected.x;
    let y = this.selected.y;
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
        this.selectElement(nearestBound.el);
        return;
      }
    }
  }
}
window.Selector = Selector;
