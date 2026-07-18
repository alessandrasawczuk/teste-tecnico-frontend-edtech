function initDiscursiveActivity() {
  const activity = document.querySelector("[data-discursive-activity]");

  if (!activity) {
    return;
  }

  if (!window.storage) {
    console.error("O utilitário de armazenamento não foi carregado.");
    return;
  }

  const storageKey = "edtech-discursive-activity";

  const textarea = activity.querySelector(".discursive-activity__textarea");
  const submitButton = activity.querySelector("[data-answer-submit]");
  const editButton = activity.querySelector("[data-answer-edit]");
  const feedback = activity.querySelector("[data-answer-feedback]");
  const feedbackCloseButton = activity.querySelector("[data-feedback-close]");
  const errorMessage = activity.querySelector("[data-answer-error]");
  const counter = activity.querySelector("[data-answer-counter]");

  if (
    !textarea ||
    !submitButton ||
    !editButton ||
    !feedback ||
    !feedbackCloseButton ||
    !errorMessage ||
    !counter
  ) {
    return;
  }

  const maxLength = Number(textarea.maxLength) || 1000;

  function getNormalizedAnswer() {
    return textarea.value.trim();
  }

  function updateCounter() {
    const currentLength = textarea.value.length;

    counter.textContent = `${currentLength}/${maxLength}`;
  }

  function hideError() {
    errorMessage.hidden = true;
    textarea.classList.remove("is-invalid");
    textarea.removeAttribute("aria-invalid");
  }

  function showError() {
    errorMessage.hidden = false;
    textarea.classList.add("is-invalid");
    textarea.setAttribute("aria-invalid", "true");
    textarea.focus();
  }

  function showFeedback() {
    feedback.hidden = false;
  }

  function hideFeedback() {
    feedback.hidden = true;
  }

  function setEditingState() {
    textarea.readOnly = false;

    submitButton.disabled = getNormalizedAnswer().length === 0;
    editButton.disabled = true;

    hideFeedback();
    hideError();

    textarea.focus();

    const textLength = textarea.value.length;
    textarea.setSelectionRange(textLength, textLength);
  }

  function setAnsweredState({ showConfirmation = true } = {}) {
    textarea.readOnly = true;

    submitButton.disabled = true;
    editButton.disabled = false;

    hideError();

    if (showConfirmation) {
      showFeedback();
    }
  }

  function saveAnswer() {
    const answer = getNormalizedAnswer();

    if (!answer) {
      showError();
      return;
    }

    textarea.value = answer;
    updateCounter();

    const savedSuccessfully = window.storage.set(storageKey, {
      answer,
      answeredAt: new Date().toISOString(),
    });

    if (!savedSuccessfully) {
      errorMessage.textContent =
        "Não foi possível salvar sua resposta. Tente novamente.";
      showError();
      return;
    }

    setAnsweredState();
  }

  function restoreAnswer() {
    const savedActivity = window.storage.get(storageKey);

    if (!savedActivity?.answer) {
      updateCounter();
      submitButton.disabled = true;
      editButton.disabled = true;
      hideFeedback();

      return;
    }

    textarea.value = savedActivity.answer;

    updateCounter();
    setAnsweredState();
  }

  textarea.addEventListener("input", () => {
    const hasAnswer = getNormalizedAnswer().length > 0;

    submitButton.disabled = !hasAnswer;

    updateCounter();
    hideError();
  });

  textarea.addEventListener("keydown", (event) => {
    const shouldSubmit =
      (event.ctrlKey || event.metaKey) && event.key === "Enter";

    if (!shouldSubmit || textarea.readOnly) {
      return;
    }

    event.preventDefault();
    saveAnswer();
  });

  submitButton.addEventListener("click", saveAnswer);

  editButton.addEventListener("click", setEditingState);

  feedbackCloseButton.addEventListener("click", () => {
    hideFeedback();
    editButton.focus();
  });

  restoreAnswer();
}
