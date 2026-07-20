function initSlider() {
  const track = document.querySelector("#slider-track");
  const slides = [...document.querySelectorAll(".slider__slide")];
  const previousButton = document.querySelector("#slider-previous");
  const nextButton = document.querySelector("#slider-next");
  const indicatorsContainer = document.querySelector("#slider-indicators");

  if (
    !track ||
    slides.length === 0 ||
    !previousButton ||
    !nextButton ||
    !indicatorsContainer
  ) {
    return;
  }

  let currentSlide = 0;

  const indicators = slides.map((_, index) => {
    const indicator = document.createElement("button");

    indicator.type = "button";
    indicator.className = "slider__indicator";
    indicator.setAttribute("aria-label", `Exibir imagem ${index + 1}`);

    indicator.addEventListener("click", () => {
      currentSlide = index;
      updateSlider();
    });

    indicatorsContainer.appendChild(indicator);

    return indicator;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && currentSlide > 0) {
      currentSlide--;
      updateSlider();
    }

    if (event.key === "ArrowRight" && currentSlide < slides.length - 1) {
      currentSlide++;
      updateSlider();
    }
  });

  function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    indicators.forEach((indicator, index) => {
      const isCurrent = index === currentSlide;

      indicator.classList.toggle("is-active", isCurrent);

      if (isCurrent) {
        indicator.setAttribute("aria-current", "true");
      } else {
        indicator.removeAttribute("aria-current");
      }
    });

    previousButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slides.length - 1;
  }

  previousButton.addEventListener("click", () => {
    if (currentSlide === 0) {
      return;
    }

    currentSlide -= 1;
    updateSlider();
  });

  nextButton.addEventListener("click", () => {
    if (currentSlide === slides.length - 1) {
      return;
    }

    currentSlide += 1;
    updateSlider();
  });

  updateSlider();
}
