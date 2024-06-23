const SELECTED = "yaVybran";
const SELECTABLE = "vybirayemiy";

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
    document.addEventListener("click", (e) => {
      this.clickHandler(e);
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
    ).filter((el) => el.checkVisibility());
  }

  keyDownHandler(e) {
    if (e.key === "ArrowDown") {
      e.stopPropagation();
      e.preventDefault();
      this.selecteDirected("down");
    }

    if (e.key === "ArrowUp") {
      e.stopPropagation();
      e.preventDefault();
      this.selecteDirected("up");
    }

    if (e.key === "ArrowLeft") {
      e.stopPropagation();
      e.preventDefault();
      this.selecteDirected("left");
    }

    if (e.key === "ArrowRight") {
      e.stopPropagation();
      e.preventDefault();
      this.selecteDirected("right");
    }
  }

  clickHandler(e) {
    const closestSelectable = e.target.closest(`.${SELECTABLE}`);
    if (
      closestSelectable &&
      this.getAllSelectable().includes(closestSelectable)
    ) {
      if (!this.selected.el !== closestSelectable) {
        this.selectElement(closestSelectable);
      }
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
