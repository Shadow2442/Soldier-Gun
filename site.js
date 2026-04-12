const toggles = document.querySelectorAll(".gallery-toggle");
const panels = document.querySelectorAll(".gallery-panel");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const previewButtons = document.querySelectorAll(".preview-button");
const stopButtons = document.querySelectorAll(".stop-button");
const previewPlayer = new Audio();
let activePreviewButton = null;
let activeStopButton = null;

for (const toggle of toggles) {
  toggle.addEventListener("click", () => {
    const target = toggle.dataset.gallery;

    toggles.forEach((button) => {
      button.classList.toggle("is-active", button === toggle);
    });

    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === target);
    });
  });
}

for (const item of galleryItems) {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    const caption = item.querySelector("figcaption");
    if (!image || !lightbox) {
      return;
    }
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption ? caption.textContent : "";
    lightbox.hidden = false;
  });
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) {
    closeLightbox();
  }
});

function resetPreviewState() {
  if (activePreviewButton) {
    activePreviewButton.classList.remove("is-playing");
  }
  if (activeStopButton) {
    activeStopButton.disabled = true;
  }
  activePreviewButton = null;
  activeStopButton = null;
}

previewPlayer.addEventListener("ended", resetPreviewState);

for (const playButton of previewButtons) {
  playButton.addEventListener("click", () => {
    const stopButton = playButton.nextElementSibling;
    const previewPath = playButton.dataset.preview;
    if (!previewPath) {
      return;
    }

    if (activePreviewButton === playButton) {
      previewPlayer.pause();
      previewPlayer.currentTime = 0;
      resetPreviewState();
      return;
    }

    previewPlayer.pause();
    previewPlayer.currentTime = 0;
    resetPreviewState();

    previewPlayer.src = previewPath;
    previewPlayer.play();
    activePreviewButton = playButton;
    activeStopButton = stopButton;
    playButton.classList.add("is-playing");
    if (stopButton) {
      stopButton.disabled = false;
    }
  });
}

for (const stopButton of stopButtons) {
  stopButton.addEventListener("click", () => {
    previewPlayer.pause();
    previewPlayer.currentTime = 0;
    resetPreviewState();
  });
}
