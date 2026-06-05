function renderColumns() {
  const columns = getFilteredState();
  const board = document.querySelector(".board");
  board.innerHTML = "";
  for (let column of columns) {
    board.append(renderColumn(column));
  }
}

function renderColumn(column) {
  const newColumn = document.createElement("section");
  newColumn.classList.add("board__column");
  newColumn.classList.add("column");
  newColumn.id = column.id;
  const columnHeader = document.createElement("div");
  columnHeader.classList.add("column__header");
  const columnTitle = document.createElement("div");
  columnTitle.classList.add("column__title");
  const columnIndicator = document.createElement("span");
  columnIndicator.classList.add("column__indicator");
  columnIndicator.classList.add(`column__indicator--${column.id}`);
  const title = document.createElement("h2");
  title.textContent = column.title;
  const columnCounter = document.createElement("span");
  columnCounter.classList.add("column__counter");
  columnCounter.textContent = column.cards.length;
  const columnTasks = document.createElement("div");
  columnTasks.classList.add("column__tasks");
  const addBtn = document.createElement("button");
  addBtn.classList.add("column__add-task-btn");
  addBtn.textContent = "+ Добавить карточку";
  columnTitle.append(columnIndicator);
  columnTitle.append(title);
  columnHeader.append(columnTitle);
  columnHeader.append(columnCounter);
  for (card of column.cards) {
    columnTasks.append(renderCard(card, column.id));
  }
  newColumn.append(columnHeader);
  newColumn.append(columnTasks);
  newColumn.append(addBtn);
  return newColumn;
}

function getHashOfString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xfffffff;
  }
  return hash;
}

function renderCard(card, columnId) {
  const TAG_COLORS = [
    { bg: "#dbeafe", text: "#1d4ed8" },
    { bg: "#fce7f3", text: "#be185d" },
    { bg: "#ede9fe", text: "#6d28d9" },
    { bg: "#ccfbf1", text: "#0f766e" },
    { bg: "#fef9c3", text: "#a16207" },
    { bg: "#ffedd5", text: "#c2410c" },
    { bg: "#dcfce7", text: "#15803d" },
  ];
  const newCard = document.createElement("div");
  newCard.classList.add("column__card");
  newCard.classList.add("card");
  newCard.classList.add(`card--${card.priority}`);
  const cardTitle = document.createElement("div");
  const title = document.createElement("h2");
  cardTitle.classList.add("card__title");
  title.textContent = card.title;
  cardTitle.append(title);
  const cardTags = document.createElement("div");
  cardTags.classList.add("card__tags");
  if (card.tags.length) {
    for (tag of card.tags) {
      const cardTag = document.createElement("span");
      cardTag.classList.add("card__tag");
      cardTag.textContent = tag;
      let tagColorIndex = getHashOfString(tag) % TAG_COLORS.length;
      cardTag.style.backgroundColor = TAG_COLORS[tagColorIndex].bg;
      cardTag.style.color = TAG_COLORS[tagColorIndex].text;
      cardTags.append(cardTag);
    }
  }
  const cardPriority = document.createElement("div");
  const cardBadge = document.createElement("span");
  cardBadge.classList.add("card__badge");
  cardBadge.classList.add(`card__badge--${card.priority}`);
  cardBadge.textContent = card.priority;
  cardPriority.append(cardBadge);
  cardPriority.classList.add("card__priority");
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("card__deleteBtn");
  deleteBtn.textContent = "X";
  cardPriority.append(deleteBtn);
  newCard.append(cardTitle);
  newCard.append(cardTags);
  newCard.append(cardPriority);
  newCard.dataset.cardId = card.id;
  newCard.dataset.columnId = columnId;
  return newCard;
}

function renderModal(cardId, columnId) {
  document.querySelector("dialog")?.remove();
  const column = state.columns.find((column) => column.id === columnId);
  if (!column) return;
  const card = column.cards.find((card) => card.id === cardId);
  if (!card) return;
  const body = document.querySelector("body");
  const modal = document.createElement("dialog");
  const modalContent = document.createElement("div");
  const modalTitle = document.createElement("div");
  const title = document.createElement("h2");
  const closeBtn = document.createElement("button");
  const modalForm = document.createElement("div");
  const form = document.createElement("form");
  const nameInput = document.createElement("input");
  const nameLabel = document.createElement("label");
  const descriptionTextArea = document.createElement("textarea");
  const descriptionLabel = document.createElement("label");
  const prioritySelect = document.createElement("select");
  const priorityLabel = document.createElement("label");
  const lowOption = document.createElement("option");
  const mediumOption = document.createElement("option");
  const highOption = document.createElement("option");
  lowOption.value = "low";
  mediumOption.value = "medium";
  highOption.value = "high";
  lowOption.textContent = "Low";
  mediumOption.textContent = "Medium";
  highOption.textContent = "High";
  prioritySelect.id = "prioritySelect";
  priorityLabel.htmlFor = prioritySelect.id;
  prioritySelect.append(lowOption, mediumOption, highOption);
  prioritySelect.value = card.priority;
  priorityLabel.textContent = "Приоритет";
  nameInput.id = "nameInput";
  nameLabel.htmlFor = nameInput.id;
  nameLabel.textContent = "Название";
  nameInput.value = card.title;
  form.append(nameLabel);
  form.append(nameInput);
  descriptionTextArea.id = "descriptionTextArea";
  descriptionLabel.htmlFor = descriptionTextArea.id;
  descriptionLabel.textContent = "Описание";
  descriptionTextArea.value = card.description;
  form.append(descriptionLabel);
  form.append(descriptionTextArea);
  form.append(priorityLabel);
  form.append(prioritySelect);
  modalForm.classList.add("modal__form");
  modalForm.append(form);
  closeBtn.classList.add("modal__closeBtn");
  closeBtn.textContent = "X";
  title.textContent = "Редактировать карточку";
  modalTitle.classList.add("modal__title");
  modalTitle.append(title);
  modalTitle.append(closeBtn);
  modalContent.classList.add("modal__content");
  modalContent.append(modalTitle);
  modalContent.append(modalForm);
  modal.append(modalContent);
  body.append(modal);
  modal.showModal();
}

function renderFilterPanel() {
  let allTags = new Set(
    state.columns
      .flatMap((column) => column.cards)
      .flatMap((card) => card.tags),
  );
  const headerTags = document.querySelector(".header__tags");
  headerTags.innerHTML = "";
  for (let tag of allTags) {
    const headerTag = document.createElement("div");
    const tagDelete = document.createElement("button");
    headerTag.textContent = tag;
    headerTag.classList.add("header__tag");
    tagDelete.classList.add("header__tag-remove");
    tagDelete.textContent = "X";
    headerTag.append(tagDelete);
    headerTags.append(headerTag);
  }
}

function renderTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  saveState();
}

function renderAddCardForm(columnEl) {
  const card = document.createElement("div");
  card.classList.add("column__card");
  card.classList.add("card");
  const addCardForm = document.createElement("form");
  const cardTitleInput = document.createElement("input");
  const cardButtons = document.createElement("div");
  const submitBtn = document.createElement("button");
  const cancelBtn = document.createElement("button");
  cardTitleInput.placeholder = "Название карточки...";
  cardTitleInput.name = "title";
  submitBtn.textContent = "Добавить";
  cancelBtn.textContent = "Отмена";
  addCardForm.classList.add("card__add-form");
  cardButtons.classList.add("card__buttons");
  submitBtn.classList.add("card__button-submit");
  cancelBtn.classList.add("card__button-reset");
  cancelBtn.type = "button";
  cardButtons.append(submitBtn);
  cardButtons.append(cancelBtn);
  addCardForm.append(cardTitleInput);
  addCardForm.append(cardButtons);
  card.append(addCardForm);
  columnEl.insertBefore(card, columnEl.lastElementChild);
}

function render() {
  renderColumns();
  renderTheme();
  renderFilterPanel();
}
