function initAudioPlayer() {
  const player = document.querySelector("[data-audio-player]");

  if (!player) {
    return;
  }

  const audio = player.querySelector(".audio-player__audio");
  const playButton = player.querySelector(".audio-player__play-button");
  const playIcon = player.querySelector(".audio-player__play-icon");
  const progress = player.querySelector(".audio-player__progress");
  const currentTimeElement = player.querySelector(
    ".audio-player__current-time",
  );
  const durationElement = player.querySelector(".audio-player__duration");
  const muteButton = player.querySelector(".audio-player__mute-button");
  const volume = player.querySelector(".audio-player__volume");

  if (
    !audio ||
    !playButton ||
    !playIcon ||
    !progress ||
    !currentTimeElement ||
    !durationElement ||
    !muteButton ||
    !volume
  ) {
    return;
  }

  let previousVolume = 1;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
      return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  }

  function updateRangeBackground(range, percentage) {
    range.style.setProperty("--range-progress", `${percentage}%`);
  }

  function updatePlayButton() {
    const isPaused = audio.paused;

    playIcon.textContent = isPaused ? "▶" : "❚❚";

    playButton.setAttribute(
      "aria-label",
      isPaused ? "Reproduzir áudio" : "Pausar áudio",
    );
  }

  function updateProgress() {
    if (!Number.isFinite(audio.duration) || audio.duration === 0) {
      progress.value = 0;
      updateRangeBackground(progress, 0);
      return;
    }

    const percentage = (audio.currentTime / audio.duration) * 100;

    progress.value = percentage;
    currentTimeElement.textContent = formatTime(audio.currentTime);

    progress.setAttribute(
      "aria-valuetext",
      `${formatTime(audio.currentTime)} de ${formatTime(audio.duration)}`,
    );

    updateRangeBackground(progress, percentage);
  }

  function updateDuration() {
    durationElement.textContent = formatTime(audio.duration);

    progress.setAttribute(
      "aria-valuetext",
      `${formatTime(audio.currentTime)} de ${formatTime(audio.duration)}`,
    );
  }

  function updateVolumeInterface() {
    const currentVolume = audio.muted ? 0 : audio.volume;
    const percentage = currentVolume * 100;

    volume.value = currentVolume;

    volume.setAttribute(
      "aria-valuetext",
      `${Math.round(percentage)}% de volume`,
    );

    updateRangeBackground(volume, percentage);

    const muteIcon = muteButton.querySelector("span");

    if (muteIcon) {
      if (currentVolume === 0) {
        muteIcon.textContent = "🔇";
      } else if (currentVolume < 0.5) {
        muteIcon.textContent = "🔉";
      } else {
        muteIcon.textContent = "🔊";
      }
    }

    muteButton.setAttribute(
      "aria-label",
      currentVolume === 0 ? "Ativar áudio" : "Silenciar áudio",
    );
  }

  async function togglePlayback() {
    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error("Não foi possível reproduzir o áudio:", error);
      }
    } else {
      audio.pause();
    }

    updatePlayButton();
  }

  playButton.addEventListener("click", togglePlayback);

  audio.addEventListener("play", updatePlayButton);
  audio.addEventListener("pause", updatePlayButton);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", () => {
    updateDuration();
    updateProgress();
  });

  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    updateProgress();
    updatePlayButton();
  });

  progress.addEventListener("input", () => {
    const percentage = Number(progress.value);

    updateRangeBackground(progress, percentage);

    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (percentage / 100) * audio.duration;
    }
  });

  volume.addEventListener("input", () => {
    const newVolume = Number(volume.value);

    audio.volume = newVolume;
    audio.muted = newVolume === 0;

    if (newVolume > 0) {
      previousVolume = newVolume;
    }

    updateVolumeInterface();
  });

  muteButton.addEventListener("click", () => {
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = previousVolume || 1;
    } else {
      previousVolume = audio.volume;
      audio.muted = true;
    }

    updateVolumeInterface();
  });

  progress.addEventListener("keydown", (event) => {
    if (!Number.isFinite(audio.duration)) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      audio.currentTime = Math.max(audio.currentTime - 5, 0);
    }

    updateProgress();
  });

  updatePlayButton();
  updateVolumeInterface();
}
