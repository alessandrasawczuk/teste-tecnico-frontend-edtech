function initObjectiveActivity() {
  const activity = document.querySelector("[data-objective-activity]");

  if (!activity) {
    return;
  }

  if (!window.storage) {
    console.error("O utilitário de armazenamento não foi carregado.");
    return;
  }

  const storageKey = "edtech-objective-activity";
  const correctAnswer = "b";

  const options = [...activity.querySelectorAll(".objective-option__input")];

  const submitButton = activity.querySelector("[data-objective-submit]");
  const editButton = activity.querySelector("[data-objective-edit]");
  const feedback = activity.querySelector("[data-objective-feedback]");
  const feedbackTitle = activity.querySelector(
    "[data-objective-feedback-title]",
  );
  const feedbackMessage = activity.querySelector(
    "[data-objective-feedback-message]",
  );
  const feedbackCloseButton = activity.querySelector(
    "[data-objective-feedback-close]",
  );

  if (
    options.length === 0 ||
    !submitButton ||
    !editButton ||
    !feedback ||
    !feedbackTitle ||
    !feedbackMessage ||
    !feedbackCloseButton
  ) {
    return;
  }

  function getSelectedOption() {
    return options.find((option) => option.checked) || null;
  }

  function updateSelectedStyles() {
    options.forEach((option) => {
      const label = option.closest(".objective-option");

      if (!label) {
        return;
      }

      label.classList.toggle("is-selected", option.checked);
    });
  }

  function setOptionsDisabled(shouldDisable) {
    options.forEach((option) => {
      const label = option.closest(".objective-option");

      option.disabled = shouldDisable;
      label?.classList.toggle("is-disabled", shouldDisable);
    });
  }

  function hideFeedback() {
    feedback.hidden = true;
    feedback.classList.remove("is-success", "is-error");
  }

  function showFeedback(isCorrect) {
    feedback.hidden = false;
    feedback.classList.toggle("is-success", isCorrect);
    feedback.classList.toggle("is-error", !isCorrect);

    if (isCorrect) {
      feedbackTitle.textContent = "É isso aí!";
      feedbackMessage.textContent =
        "Parabéns! Você selecionou a alternativa correta.";
    } else {
      feedbackTitle.textContent = "Tente novamente!";
      feedbackMessage.textContent =
        "A alternativa selecionada não está correta. Clique em Alterar e tente novamente.";
    }
  }

  function setEditingState() {
    setOptionsDisabled(false);

    submitButton.disabled = !getSelectedOption();
    editButton.disabled = true;

    hideFeedback();

    const selectedOption = getSelectedOption();

    if (selectedOption) {
      selectedOption.focus();
    } else {
      options[0].focus();
    }
  }

  function setAnsweredState(answer, isCorrect, showMessage = true) {
    const selectedOption = options.find((option) => option.value === answer);

    if (selectedOption) {
      selectedOption.checked = true;
    }

    updateSelectedStyles();
    setOptionsDisabled(true);

    submitButton.disabled = true;
    editButton.disabled = false;

    if (showMessage) {
      showFeedback(isCorrect);
    } else {
      hideFeedback();
    }
  }

  function saveAnswer() {
    const selectedOption = getSelectedOption();

    if (!selectedOption) {
      submitButton.disabled = true;
      return;
    }

    const answer = selectedOption.value;
    const isCorrect = answer === correctAnswer;

    const savedSuccessfully = window.storage.set(storageKey, {
      answer,
      isCorrect,
      answeredAt: new Date().toISOString(),
    });

    if (!savedSuccessfully) {
      console.error("Não foi possível salvar a atividade objetiva.");
      return;
    }

    setAnsweredState(answer, isCorrect);
  }

  function restoreAnswer() {
    const savedActivity = window.storage.get(storageKey);

    if (!savedActivity?.answer) {
      submitButton.disabled = true;
      editButton.disabled = true;
      hideFeedback();
      updateSelectedStyles();

      return;
    }

    setAnsweredState(savedActivity.answer, Boolean(savedActivity.isCorrect));
  }

  options.forEach((option) => {
    option.addEventListener("change", () => {
      submitButton.disabled = false;

      updateSelectedStyles();
      hideFeedback();
    });
  });

  submitButton.addEventListener("click", saveAnswer);

  editButton.addEventListener("click", setEditingState);

  feedbackCloseButton.addEventListener("click", () => {
    hideFeedback();
    editButton.focus();
  });

  restoreAnswer();
}
