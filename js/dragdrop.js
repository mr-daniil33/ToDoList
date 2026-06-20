function initDragDrop() {
  const board = document.querySelector(".board");
  board.addEventListener("dragstart", (event) => {
    const card = event.target.closest(".card");
    if (!card) return;
    event.dataTransfer.setData("application/card", card.dataset.cardId);
    event.dataTransfer.setData("application/column", card.dataset.columnId);
    card.classList.add("card--dragging");
  });

  board.addEventListener("dragover", (event) => {
    const column = event.target.closest(".column");
    if (!column) return;
    event.preventDefault();
    column.classList.add("column--drag-over");
  });

  board.addEventListener("dragend", (event) => {
    const card = event.target.closest(".card");
    if (!card) return;
    card.classList.remove("card--dragging");
  });

  board.addEventListener("drop", (event) => {
    const column = event.target.closest(".column");
    if (!column) return;
    const cards = column.querySelectorAll(".card");
    let toIndex = 0;
    for (let card of cards) {
      if (
        card.getBoundingClientRect().top +
          card.getBoundingClientRect().height / 2 <
        event.clientY
      ) {
        toIndex++;
      }
    }
    moveCard(
      event.dataTransfer.getData("application/card"),
      event.dataTransfer.getData("application/column"),
      column.id,
      toIndex,
    );
    isAddCardFormRendered = false;
    render();
  });

  board.addEventListener("dragleave", (event) => {
    const column = event.target.closest(".column");
    if (!column) return;
    if (column.contains(event.relatedTarget)) return;
    column.classList.remove("column--drag-over");
  });
}
