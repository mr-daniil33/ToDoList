const state = {
  columns: [
    {
      id: "toDo",
      title: "To Do",
      cards: [
        {
          id: "card_1712345678901", // уникальный ID через Date.now()
          title: "Написать этот проект",
          description:
            "Вот сейчас пишу его. Сложный он конечно, но будем стараться, чего делать то блин емае.",
          priority: "high", // 'low' | 'medium' | 'high'
          tags: ["frontend", "figma", "algoritmes", "events"], // массив строк
          createdAt: 1712345678901,
        },
        {
          id: "card_1712124678901", // уникальный ID через Date.now()
          title: "Сходить за кофе",
          description: "Вкусный сырный латте, ммммм",
          priority: "medium", // 'low' | 'medium' | 'high'
          tags: ["coffee", "enjoyment"], // массив строк
          createdAt: 1712345678901,
        },
      ],
    },
    {
      id: "inProgress",
      title: "In Progress",
      cards: [
        {
          id: "card_1712345678231", // уникальный ID через Date.now()
          title: "Написать обработку событий",
          description: "Пора приступать за event.js",
          priority: "medium", // 'low' | 'medium' | 'high'
          tags: ["events", "clicks"], // массив строк
          createdAt: 1712345678901,
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      cards: [
        {
          id: "card_1712345672431", // уникальный ID через Date.now()
          title: "Реализовать перенос мышкой",
          description: "Drag and drop в деле",
          priority: "low", // 'low' | 'medium' | 'high'
          tags: ["drag", "drop", "frontend"], // массив строк
          createdAt: 1712345678901,
        },
      ],
    },
  ],
  filter: {
    priority: null,
    tag: null,
  },
  theme: "dark",
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
    tags: [],
    priority: "low",
    description: "",
    ...cardData,
    id: "card_" + now,
    createdAt: now,
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
      if (!movedCard) return;
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
