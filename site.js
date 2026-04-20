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
const flightCanvas = document.getElementById("flight-layer-canvas");
const throttleReadout = document.getElementById("flight-throttle-readout");

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

if (flightCanvas) {
  const context = flightCanvas.getContext("2d");
  const spriteSheets = {
    idle: createSpriteSheet("output/ship_idle_sheet.png"),
    left: createSpriteSheet("output/ship_strafe_left_sheet.png"),
    right: createSpriteSheet("output/ship_strafe_right_sheet.png"),
  };
  const keys = new Set();
  const bullets = [];
  const stars = createStars(70, flightCanvas.width, flightCanvas.height);
  const ship = {
    x: flightCanvas.width / 2,
    y: flightCanvas.height - 132,
    velocityX: 0,
    velocityY: 0,
    throttle: 1,
    targetThrottle: 1,
    fireCooldown: 0,
  };
  let lastFrameAt = performance.now();

  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "KeyA", "KeyD", "KeyW", "KeyS"].includes(event.code)) {
      event.preventDefault();
    }
    keys.add(event.code);
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.code);
  });

  Promise.all(Object.values(spriteSheets).map((sheet) => sheet.ready)).then(() => {
    requestAnimationFrame(loop);
  });

  function loop(timestamp) {
    const deltaSeconds = Math.min(0.033, (timestamp - lastFrameAt) / 1000);
    lastFrameAt = timestamp;

    updateShip(deltaSeconds);
    updateBullets(deltaSeconds);
    updateStars(deltaSeconds);
    renderScene(timestamp);

    requestAnimationFrame(loop);
  }

  function updateShip(deltaSeconds) {
    const moveLeft = keys.has("ArrowLeft") || keys.has("KeyA");
    const moveRight = keys.has("ArrowRight") || keys.has("KeyD");
    const moveForward = keys.has("ArrowUp") || keys.has("KeyW");
    const moveBackward = keys.has("ArrowDown") || keys.has("KeyS");
    const horizontalIntent = Number(moveRight) - Number(moveLeft);
    const verticalIntent = Number(moveBackward) - Number(moveForward);

    const maxHorizontalSpeed = 250;
    ship.velocityX = horizontalIntent * maxHorizontalSpeed;
    ship.x += ship.velocityX * deltaSeconds;
    ship.x = Math.max(58, Math.min(flightCanvas.width - 58, ship.x));

    ship.velocityY = verticalIntent * 110;
    ship.y += ship.velocityY * deltaSeconds;
    ship.y = Math.max(168, Math.min(flightCanvas.height - 96, ship.y));

    ship.targetThrottle = 1;
    if (moveForward) {
      ship.targetThrottle = 1.5;
    } else if (moveBackward) {
      ship.targetThrottle = 0.55;
    }

    ship.throttle += (ship.targetThrottle - ship.throttle) * Math.min(1, deltaSeconds * 7.5);
    if (throttleReadout) {
      throttleReadout.textContent = `${Math.round(ship.throttle * 100)}%`;
    }

    ship.fireCooldown -= deltaSeconds;
    if (keys.has("Space") && ship.fireCooldown <= 0) {
      bullets.push(
        { x: ship.x - 14, y: ship.y - 42, speed: 460 },
        { x: ship.x + 14, y: ship.y - 42, speed: 460 }
      );
      ship.fireCooldown = 0.13;
    }
  }

  function updateBullets(deltaSeconds) {
    for (const bullet of bullets) {
      bullet.y -= bullet.speed * deltaSeconds;
    }
    for (let index = bullets.length - 1; index >= 0; index -= 1) {
      if (bullets[index].y < -24) {
        bullets.splice(index, 1);
      }
    }
  }

  function updateStars(deltaSeconds) {
    const starSpeed = 45 + ship.throttle * 70;
    for (const star of stars) {
      star.y += star.speed * starSpeed * deltaSeconds;
      if (star.y > flightCanvas.height + 4) {
        star.y = -4;
        star.x = Math.random() * flightCanvas.width;
      }
    }
  }

  function renderScene(timestamp) {
    context.clearRect(0, 0, flightCanvas.width, flightCanvas.height);
    context.fillStyle = "#000000";
    context.fillRect(0, 0, flightCanvas.width, flightCanvas.height);

    renderStars();
    renderBullets();
    renderShip(timestamp);
  }

  function renderStars() {
    for (const star of stars) {
      context.fillStyle = star.color;
      context.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
    }
  }

  function renderBullets() {
    for (const bullet of bullets) {
      context.fillStyle = "#f4f7ff";
      context.fillRect(Math.round(bullet.x) - 1, Math.round(bullet.y), 3, 14);
      context.fillStyle = "#7bd4ff";
      context.fillRect(Math.round(bullet.x), Math.round(bullet.y) - 4, 1, 5);
    }
  }

  function renderShip(timestamp) {
    const frameIndex = Math.floor(timestamp / 83) % 8;
    const sheet = ship.velocityX < -40 ? spriteSheets.left : ship.velocityX > 40 ? spriteSheets.right : spriteSheets.idle;
    const drawX = Math.round(ship.x - 64);
    const drawY = Math.round(ship.y - 64);

    renderBoosterGlow(drawX, drawY);
    context.drawImage(sheet.image, frameIndex * 128, 0, 128, 128, drawX, drawY, 128, 128);
  }

  function renderBoosterGlow(drawX, drawY) {
    const throttlePower = Math.max(0.35, ship.throttle);
    context.save();
    context.globalCompositeOperation = "lighter";
    paintBooster(drawX + 47, drawY + 94, 9, 32 * throttlePower, "rgba(255, 153, 45, 0.35)");
    paintBooster(drawX + 64, drawY + 92, 11, 38 * throttlePower, "rgba(255, 185, 72, 0.42)");
    paintBooster(drawX + 82, drawY + 94, 9, 32 * throttlePower, "rgba(255, 153, 45, 0.35)");
    context.restore();
  }

  function paintBooster(x, y, width, height, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x - width / 2, y);
    context.lineTo(x + width / 2, y);
    context.lineTo(x + width / 5, y + height);
    context.lineTo(x - width / 5, y + height);
    context.closePath();
    context.fill();
  }
}

function createSpriteSheet(path) {
  const image = new Image();
  const ready = new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });
  image.src = path;
  return { image, ready };
}

function createStars(count, width, height) {
  const stars = [];
  for (let index = 0; index < count; index += 1) {
    const size = Math.random() > 0.88 ? 2 : 1;
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      speed: 0.7 + Math.random() * 1.8,
      color: Math.random() > 0.84 ? "#d9f0ff" : "#ffffff",
    });
  }
  return stars;
}
