const state = {
  columns: [
    {
      id: "toDo",
      title: "To Do",
      cards: [],
    },
    {
      id: "inProgress",
      title: "In Progress",
      cards: [],
    },
    {
      id: "done",
      title: "Done",
      cards: [],
    },
  ],
  filter: {
    priority: null,
    tag: null,
  },
  theme: "light",
  modal: {
    isOpen: false,
    cardId: null,
    columnId: null,
  },
};

function loadState() {
  const savedState = localStorage.getItem("state");
  if (savedState) {
    Object.assign(state, JSON.parse(savedState));
  }
}

function saveState() {
  localStorage.setItem("state", JSON.stringify(state));
}

function addCard(columnId, cardData) {
  const now = Date.now();
  const newCard = {
    id: "card_" + now,
    createdAt: now,
    ...cardData,
  };
  for (let column of state.columns) {
    if (column.id === columnId) {
      column.cards.push(newCard);
    }
  }
  saveState();
}

function updateCard(cardId, newData) {
  for (let column of state.columns) {
    for (let card of column.cards) {
      if (card.id === cardId) {
        Object.assign(card, newData);
        saveState();
        return;
      }
    }
  }
}

function deleteCard(cardId) {
  for (let column of state.columns) {
    column.cards = column.cards.filter((card) => card.id !== cardId);
  }
  saveState();
}

function moveCard(cardId, fromColumnId, toColumnId, toIndex) {
  let movedCard = null;
  for (let column of state.columns) {
    if (column.id === fromColumnId) {
      movedCard = column.cards.find((card) => card.id === cardId);
      column.cards = column.cards.filter((card) => card.id !== cardId);
    }
  }
  for (let column of state.columns) {
    if (column.id === toColumnId) {
      column.cards.splice(toIndex, 0, movedCard);
    }
  }
  saveState();
}

function getFilteredState() {
  return state.columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => {
      return (
        (state.filter.priority
          ? card.priority === state.filter.priority
          : true) &&
        (state.filter.tag ? card.tags.includes(state.filter.tag) : true)
      );
    }),
  }));
}
