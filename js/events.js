function initEvents() {
  const board = document.querySelector(".board");
  let isAddCardFormRendered = false;
  board.addEventListener("click", (event) => {
    const addCardButton = event.target.closest(".column__add-task-btn");
    const resetAddCardForm = event.target.closest(".card__button-reset");
    if (addCardButton) {
      if (!isAddCardFormRendered) {
        renderAddCardForm(event.target.closest(".column"));
        isAddCardFormRendered = true;
      }
    }
    if (resetAddCardForm) {
      resetAddCardForm.closest(".card").remove();
      isAddCardFormRendered = false;
    }
  });

  board.addEventListener("submit", (event) => {
    event.preventDefault();
    const addCardForm = event.target.closest(".card__add-form");
    if (addCardForm) {
      addCard(event.target.closest(".column").id, {
        title: addCardForm.title.value,
      });
      isAddCardFormRendered = false;
      render();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelector(".card__add-form").closest(".card").remove();
      isAddCardFormRendered = false;
    }
  });
}
