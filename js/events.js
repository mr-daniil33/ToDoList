function initEvents() {
  const board = document.querySelector(".board");
  const headerFiltres = document.querySelector(".header__filtres");
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
    const columnId = event.target.closest(".column")?.id;
    if (addCardForm && addCardForm.title.value) {
      addCard(event.target.closest(".column").id, {
        title: addCardForm.title.value,
      });
      isAddCardFormRendered = false;
      render();
      document
        .getElementById(columnId)
        ?.querySelector(".card:last-child")
        .classList.add("card--animate");
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
    const addTagButton = event.target.closest(".modal__add-tag-button");
    const modal = event.target.closest("dialog");

    if (changeThemeButton) {
      state.theme === "dark" ? (state.theme = "light") : (state.theme = "dark");
      renderTheme();
    }

    if (!modal) return;

    const modalForm = modal.querySelector("form");
    const column = state.columns.find(
      (column) => column.id === modal.dataset.columnId,
    );
    const card = column?.cards.find((card) => card.id === modal.dataset.cardId);

    if (addTagButton) {
      event.preventDefault();
      if (
        !card ||
        !modalForm.querySelector("#tagInput").value.trim() ||
        card.tags.includes(modalForm.querySelector("#tagInput").value.trim())
      )
        return;
      updateCard(modal.dataset.cardId, {
        tags: [...card.tags, modalForm.querySelector("#tagInput").value],
      });
      render();
    }

    if (modal && event.target === modal) {
      modal?.remove();
    }

    if (closeModalButton) {
      modal?.remove();
    }
  });

  document.addEventListener("input", (event) => {
    const modalForm = document.querySelector(".modal__form > form");
    const modal = document.querySelector("dialog");
    if (modalForm) {
      updateCard(modal.dataset.cardId, {
        title: modalForm.querySelector("#nameInput").value,
        description: modalForm.querySelector("#descriptionTextArea").value,
      });
      render();
    }
  });

  document.addEventListener("change", (event) => {
    const modalForm = document.querySelector(".modal__form > form");
    const modal = document.querySelector("dialog");
    if (modalForm) {
      updateCard(modal.dataset.cardId, {
        priority: modalForm.querySelector("#prioritySelect").value,
      });
      render();
    }
  });

  headerFiltres.addEventListener("click", (event) => {
    const priority = event.target.closest(".header__priority-btn");
    const tag = event.target.closest(".header__tag");
    if (tag) {
      if (state.filter.tag === tag.textContent) {
        state.filter.tag = null;
        saveState();
        render();
      } else {
        state.filter.tag = tag.textContent;
        saveState();
        render();
      }
    }
    if (priority) {
      const priorityButtons = document.querySelectorAll(
        ".header__priority-btn",
      );
      for (let button of priorityButtons) {
        button.classList.remove("header__priority-btn--active");
      }
      const priorityValue =
        priority.textContent[0].toLowerCase() + priority.textContent.slice(1);
      if (state.filter.priority === priorityValue) {
        state.filter.priority = null;
        saveState();
        render();
      } else {
        state.filter.priority = priorityValue;
        priority.classList.add("header__priority-btn--active");
        saveState();
        render();
      }
    }
  });

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
    console.log(event.dataTransfer.getData("application/card"));
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
