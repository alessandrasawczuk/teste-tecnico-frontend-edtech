function initAccordion() {
  const accordions = document.querySelectorAll("[data-accordion]");

  if (accordions.length === 0) {
    return;
  }

  accordions.forEach((accordion) => {
    const items = [...accordion.querySelectorAll(".accordion__item")];

    function getElements(item) {
      return {
        button: item.querySelector(".accordion__button"),
        content: item.querySelector(".accordion__content"),
      };
    }

    function openItem(item) {
      const { button, content } = getElements(item);

      if (!button || !content) {
        return;
      }

      item.classList.add("is-open");

      button.setAttribute("aria-expanded", "true");

      content.hidden = false;
      content.classList.remove("is-closing");
    }

    function closeItem(item, animate = true) {
      const { button, content } = getElements(item);

      if (!button || !content) {
        return;
      }

      item.classList.remove("is-open");

      button.setAttribute("aria-expanded", "false");

      if (!animate) {
        content.hidden = true;
        content.classList.remove("is-closing");
        return;
      }

      content.classList.add("is-closing");

      const handleTransitionEnd = (event) => {
        if (
          event.target !== content ||
          event.propertyName !== "grid-template-rows"
        ) {
          return;
        }

        content.hidden = true;
        content.classList.remove("is-closing");

        content.removeEventListener("transitionend", handleTransitionEnd);
      };

      content.addEventListener("transitionend", handleTransitionEnd);
    }

    function closeOtherItems(currentItem) {
      items.forEach((item) => {
        if (item !== currentItem && item.classList.contains("is-open")) {
          closeItem(item);
        }
      });
    }

    items.forEach((item) => {
      const { button, content } = getElements(item);

      if (!button || !content) {
        return;
      }

      const startsOpen = item.classList.contains("is-open");

      button.setAttribute("aria-expanded", String(startsOpen));
      content.hidden = !startsOpen;

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        if (isOpen) {
          closeItem(item);
          return;
        }

        closeOtherItems(item);
        openItem(item);
      });
    });

    accordion.addEventListener("keydown", (event) => {
      const buttons = items
        .map((item) => item.querySelector(".accordion__button"))
        .filter(Boolean);

      const currentIndex = buttons.indexOf(document.activeElement);

      if (currentIndex === -1) {
        return;
      }

      let nextIndex = currentIndex;

      switch (event.key) {
        case "ArrowDown":
          nextIndex = (currentIndex + 1) % buttons.length;
          break;

        case "ArrowUp":
          nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
          break;

        case "Home":
          nextIndex = 0;
          break;

        case "End":
          nextIndex = buttons.length - 1;
          break;

        default:
          return;
      }

      event.preventDefault();
      buttons[nextIndex].focus();
    });
  });
}
