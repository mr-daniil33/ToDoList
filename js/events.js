function initEvents() {
  const board = document.querySelector(".board");
  let isAddCardFormRendered = false;
  board.addEventListener("click", (event) => {
    const addCardButton = event.target.closest(".column__add-task-btn");
    const resetAddCardForm = event.target.closest(".card__button-reset");
    const card = event.target.closest(".card");
    const deleteCardButton = event.target.closest(".card__deleteBtn");
    if (deleteCardButton) {
      deleteCard(event.target.closest(".card").dataset.cardId);
      render();
    }
    if (card && !card.querySelector(".card__add-form")) {
      const columnId = card.dataset.columnId;
      const cardId = card.dataset.cardId;
      renderModal(cardId, columnId);
    }
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
    if (addCardForm && addCardForm.title.value) {
      addCard(event.target.closest(".column").id, {
        title: addCardForm.title.value,
      });
      isAddCardFormRendered = false;
      render();
    }
  });

  document.addEventListener("keydown", (event) => {
    const addCardForm = document.querySelector(".card__add-form");
    const modal = document.querySelector("dialog");
    if (event.key === "Escape") {
      if (addCardForm) {
        addCardForm.closest(".card").remove();
        isAddCardFormRendered = false;
      }
      if (modal) {
        modal.remove();
      }
    }
  });

  document.addEventListener("click", (event) => {
    const closeModalButton = event.target.closest(".modal__closeBtn");
    const changeThemeButton = event.target.closest(".header__theme-btn");
    if (changeThemeButton) {
      state.theme === "dark" ? (state.theme = "light") : (state.theme = "dark");
      renderTheme();
    }
    if (closeModalButton) {
      document.querySelector("dialog")?.remove();
    }
  });
}
