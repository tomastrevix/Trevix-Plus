// Elementos del reproductor
const videoPlayer = document.getElementById("videoPlayer");
const playerOverlay = document.getElementById("playerOverlay");
const playerScreen = document.getElementById("playerScreen");
const playerTitle = document.getElementById("playerTitle");

const playPauseButton = document.getElementById("playPauseButton");
const bottomPlayPause = document.getElementById("bottomPlayPause");
const playerProgress = document.getElementById("playerProgress");
const timeRemaining = document.getElementById("timeRemaining");

const fullscreenButton = document.getElementById("fullscreenButton");
const closePlayerButton = document.getElementById("closePlayer");

const muteButton = document.getElementById("muteButton");
const volumeControl = document.getElementById("volumeControl");

// Aviso de clasificación y contenido
const contentNotice = document.createElement("div");

contentNotice.className = "player-content-notice";
contentNotice.hidden = true;

playerScreen.appendChild(contentNotice);


// Convertir segundos a minutos y horas
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}


// Cambiar iconos de reproducir y pausa
function updatePlayButtons() {
  const isPlaying = !videoPlayer.paused && !videoPlayer.ended;

  const icon = isPlaying ? "pause" : "play_arrow";
  const label = isPlaying ? "Pausar" : "Reproducir";

  playPauseButton.querySelector(".material-symbols-rounded").textContent = icon;
  bottomPlayPause.querySelector(".material-symbols-rounded").textContent = icon;

  playPauseButton.setAttribute("aria-label", label);
  bottomPlayPause.setAttribute("aria-label", label);

  playPauseButton.title = label;
  bottomPlayPause.title = label;
}


// Actualizar barra y tiempo restante
function updateProgress() {
  const duration = videoPlayer.duration;
  const currentTime = videoPlayer.currentTime;

  if (!Number.isFinite(duration) || duration <= 0) {
    playerProgress.value = 0;
    timeRemaining.textContent = "-0:00";
    return;
  }

  const progress = (currentTime / duration) * 100;
  const remaining = Math.max(0, duration - currentTime);

  playerProgress.value = progress;
  timeRemaining.textContent = `-${formatTime(remaining)}`;
}


// Actualizar icono de volumen
function updateVolumeIcon() {
  const icon = videoPlayer.muted || videoPlayer.volume === 0
    ? "volume_off"
    : videoPlayer.volume < 0.5
      ? "volume_down"
      : "volume_up";

  muteButton.querySelector(".material-symbols-rounded").textContent = icon;

  const label = videoPlayer.muted ? "Activar sonido" : "Silenciar";

  muteButton.setAttribute("aria-label", label);
  muteButton.title = label;
}

// Mostrar aviso de clasificación
function showContentNotice(movie) {
  if (!movie || !movie.ageRating || !movie.contentNotice) {
    contentNotice.hidden = true;
    return;
  }

  contentNotice.textContent =
    `${movie.ageRating}: ${movie.contentNotice}`;

  contentNotice.hidden = false;

  contentNotice.classList.remove("content-notice-show");

  // Reiniciar la animación
  void contentNotice.offsetWidth;

  contentNotice.classList.add("content-notice-show");

  setTimeout(() => {
    contentNotice.classList.remove("content-notice-show");

    setTimeout(() => {
      contentNotice.hidden = true;
    }, 400);

  }, 4500);
}

// Reproducir o pausar
function togglePlayback() {
  if (videoPlayer.paused) {
    videoPlayer.play().catch((error) => {
      console.error("No se pudo reproducir el video:", error);
    });
  } else {
    videoPlayer.pause();
  }
}

// Adelantar o retroceder una cantidad de segundos
function seekBy(seconds) {
  if (!Number.isFinite(videoPlayer.duration)) return;

  const newTime = videoPlayer.currentTime + seconds;

  videoPlayer.currentTime = Math.max(
    0,
    Math.min(newTime, videoPlayer.duration)
  );

  updateProgress();
  showControls();
}

// Silenciar o activar sonido
function toggleMute() {
  videoPlayer.muted = !videoPlayer.muted;
  updateVolumeIcon();
}


// Abrir una película
function playMovie(movie) {
  if (!movie || !movie.video) {
    console.error("La película no tiene una ruta de video válida.");
    return;
  }

  videoPlayer.pause();

  videoPlayer.src = movie.video;
  videoPlayer.load();

  playerTitle.textContent = movie.title;
  playerOverlay.hidden = false;

  showContentNotice(movie);

  document.body.classList.add("player-open");

  playerProgress.value = 0;
  timeRemaining.textContent = "-0:00";

  videoPlayer.volume = Number(volumeControl.value);
  videoPlayer.muted = false;

  updateVolumeIcon();
  updatePlayButtons();

  videoPlayer.play().catch((error) => {
    console.warn("La reproducción automática fue bloqueada:", error);
  });
}


// Cerrar el reproductor y salir de la película
function closePlayer() {
  videoPlayer.pause();

  videoPlayer.removeAttribute("src");
  videoPlayer.load();

  playerOverlay.hidden = true;
  document.body.classList.remove("player-open");

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}


// Entrar o salir de pantalla completa
async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await playerScreen.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error("No se pudo cambiar la pantalla completa:", error);
  }
}


// Botones principales
playPauseButton.addEventListener("click", togglePlayback);
bottomPlayPause.addEventListener("click", togglePlayback);

fullscreenButton.addEventListener("click", toggleFullscreen);
closePlayerButton.addEventListener("click", closePlayer);

muteButton.addEventListener("click", toggleMute);

const rewindButton = document.getElementById("rewindButton");
const forwardButton = document.getElementById("forwardButton");


// Control de volumen
volumeControl.addEventListener("input", () => {
  videoPlayer.volume = Number(volumeControl.value);
  videoPlayer.muted = videoPlayer.volume === 0;

  updateVolumeIcon();
});

videoPlayer.addEventListener("volumechange", () => {
  volumeControl.value = videoPlayer.muted ? 0 : videoPlayer.volume;
  updateVolumeIcon();
});

rewindButton.addEventListener("click", () => {
  seekBy(-5);
});

forwardButton.addEventListener("click", () => {
  seekBy(5);
});

// Eventos del video
videoPlayer.addEventListener("play", updatePlayButtons);
videoPlayer.addEventListener("pause", updatePlayButtons);
videoPlayer.addEventListener("ended", updatePlayButtons);

videoPlayer.addEventListener("loadedmetadata", updateProgress);
videoPlayer.addEventListener("timeupdate", updateProgress);


// Mover la barra de progreso
playerProgress.addEventListener("input", () => {
  if (Number.isFinite(videoPlayer.duration) && videoPlayer.duration > 0) {
    const newTime =
      (Number(playerProgress.value) / 100) * videoPlayer.duration;

    videoPlayer.currentTime = newTime;
    updateProgress();
  }
});


// Atajos de teclado del reproductor
document.addEventListener("keydown", (event) => {
  if (playerOverlay.hidden) return;

  const target = event.target;
  const isTyping =
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable;

  if (isTyping) return;

  if (event.key === "Escape" && !document.fullscreenElement) {
    closePlayer();
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    togglePlayback();
    showControls();
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    seekBy(-5);
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    seekBy(5);
  }
});


// Cambiar icono al entrar o salir de pantalla completa
document.addEventListener("fullscreenchange", () => {
  const isFullscreen = Boolean(document.fullscreenElement);

  const icon = isFullscreen ? "fullscreen_exit" : "fullscreen";
  const label = isFullscreen
    ? "Salir de pantalla completa"
    : "Entrar en pantalla completa";

  fullscreenButton.querySelector(".material-symbols-rounded").textContent = icon;

  fullscreenButton.setAttribute("aria-label", label);
  fullscreenButton.title = label;
});


let controlsTimeout;

function showControls() {
  playerOverlay.classList.remove("controls-hidden");

  clearTimeout(controlsTimeout);

  if (!videoPlayer.paused) {
    controlsTimeout = setTimeout(() => {
      playerOverlay.classList.add("controls-hidden");
    }, 2500);
  }
}

function hideControls() {
  if (!videoPlayer.paused) {
    playerOverlay.classList.add("controls-hidden");
  }
}

// Mostrar controles al mover el mouse
playerOverlay.addEventListener("mousemove", showControls);

// Mostrar controles al tocar la pantalla
playerOverlay.addEventListener("touchstart", showControls);

// Mostrar controles al pausar
videoPlayer.addEventListener("pause", () => {
  clearTimeout(controlsTimeout);
  playerOverlay.classList.remove("controls-hidden");
});

// Ocultarlos nuevamente al reproducir
videoPlayer.addEventListener("play", showControls);