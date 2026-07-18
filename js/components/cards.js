function initExpandableCards() {
  const cardsContainer = document.querySelector("[data-expandable-cards]");

  if (!cardsContainer) {
    return;
  }

  const cards = [...cardsContainer.querySelectorAll(".expandable-card")];

  function updateCard(card, shouldOpen) {
    const button = card.querySelector(".expandable-card__button");
    const closedContent = card.querySelector(
      ".expandable-card__closed-content",
    );
    const openContent = card.querySelector(".expandable-card__open-content");

    if (!button || !closedContent || !openContent) {
      return;
    }

    card.classList.toggle("is-open", shouldOpen);

    closedContent.hidden = shouldOpen;
    openContent.hidden = !shouldOpen;

    button.textContent = shouldOpen ? "Fechar" : "Abrir";
    button.setAttribute("aria-expanded", String(shouldOpen));
  }

  cards.forEach((card) => {
    const button = card.querySelector(".expandable-card__button");

    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      const isCurrentlyOpen = card.classList.contains("is-open");

      cards.forEach((currentCard) => {
        updateCard(currentCard, false);
      });

      if (!isCurrentlyOpen) {
        updateCard(card, true);
      }
    });
  });
}
