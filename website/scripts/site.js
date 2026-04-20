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
const weaponFamilySelect = document.getElementById("flight-weapon-family");
const weaponPhaseSelect = document.getElementById("flight-weapon-phase");
const flightFrameCache = new Map();
let flightLoadError = null;
let flightProcessingMode = "pixel";
const FLIGHT_ASSET_VERSION = "20260420-compat2";

// Final locked ship tuning approved in-browser. If this ever changes, it should be
// a deliberate design decision instead of an accidental tweak to loose numbers.
const FINAL_SHIP_TUNING = Object.freeze({
  maxHorizontalSpeed: 250,
  maxVerticalSpeed: 110,
  strafeThreshold: 40,
  throttleResponse: 7.5,
  throttle: Object.freeze({
    idle: 0.5,
    forward: 1,
    reverse: 0.1,
  }),
  starfield: Object.freeze({
    baseSpeed: 45,
    throttleSpeed: 70,
  }),
  flameRatios: Object.freeze({
    idle: 0.5,
    forward: 1,
    reverse: 0.1,
  }),
  flickerPattern: Object.freeze([0, 1, 2, 1, 0, 1, 2, 1]),
  mainBoosters: Object.freeze({
    sideWidth: 9,
    centerWidth: 11,
    sideHeight: 32,
    centerHeight: 38,
    leftX: 47,
    centerX: 64,
    rightX: 82,
    sideY: 94,
    centerY: 92,
    forwardSideColor: "rgba(255, 153, 45, 0.35)",
    forwardCenterColor: "rgba(255, 185, 72, 0.42)",
    reverseSideColor: "rgba(74, 154, 255, 0.35)",
    reverseCenterColor: "rgba(92, 184, 255, 0.42)",
  }),
  reverseBoosters: Object.freeze({
    leftX: 45,
    rightX: 84,
    nozzleY: 50,
    glowY: 51,
    glowWidth: 7,
    outerWidth: 5,
    innerWidth: 3,
    glowLength: 16,
    outerLength: 12,
    innerLength: 8,
    glowColor: "rgba(58, 138, 255, 0.28)",
    outerColor: "rgba(74, 154, 255, 0.64)",
    innerColor: "rgba(214, 244, 255, 0.94)",
    nozzleGlowColor: "rgba(120, 188, 255, 0.9)",
    nozzleGlowOffsetX: -2,
    nozzleGlowOffsetY: -2,
    nozzleGlowWidth: 5,
    nozzleGlowHeight: 4,
  }),
  strafeBoosters: Object.freeze({
    leftSideNozzleX: 43,
    rightSideNozzleX: 86,
    nozzleY: 52,
    outerWidth: 6,
    innerWidth: 4,
    outerLength: 12,
    innerLength: 7,
    lagDistance: 4,
    lagResponse: 10,
    outerColor: "rgba(74, 154, 255, 0.56)",
    innerColor: "rgba(214, 244, 255, 0.9)",
    nozzleGlowColor: "rgba(120, 188, 255, 0.78)",
    nozzleGlowOffset: -2,
    nozzleGlowSize: 4,
  }),
});

const PULSE_PHASE_VISUALS = Object.freeze({
  outerGlowColor: "rgba(255, 124, 44, 0.16)",
  trailGlowColor: "rgba(255, 168, 62, 0.22)",
  shellShadowColor: "#9f3f15",
  shellColor: "#ffc448",
  collarColor: "#ffd86f",
  coreColor: "#fff2b2",
  noseColor: "#fff8de",
  trailColor: "#ff8b2f",
  trailCoreColor: "#fff3bf",
  muzzleGlowColor: "rgba(255, 168, 74, 0.24)",
  muzzleFlareColor: "#ffb24d",
  muzzleCoreColor: "#fff6d2",
  muzzleSparkColor: "#ff7b2f",
  muzzleDuration: 0.055,
});

const FLIGHT_AUDIO_TUNING = Object.freeze({
  attack: 0.004,
  decay: 0.11,
  baseGain: 0.042,
  basePitch: 980,
  tailPitch: 420,
});

const BOOSTER_AUDIO_TUNING = Object.freeze({
  engageAttack: 0.02,
  releaseAttack: 0.012,
  outputGain: 4.096,
  noiseBufferDuration: 0.5,
  compressor: Object.freeze({
    threshold: -26,
    knee: 18,
    ratio: 3,
    attack: 0.003,
    release: 0.12,
  }),
  modes: Object.freeze({
    forward: Object.freeze({
      pan: 0,
      rumbleType: "triangle",
      whineType: "sine",
      engageDuration: 0.3,
      releaseDuration: 0.19,
      engageRumbleStart: 72,
      engageRumbleEnd: 118,
      releaseRumbleStart: 110,
      releaseRumbleEnd: 58,
      engageWhineStart: 180,
      engageWhineEnd: 320,
      releaseWhineStart: 260,
      releaseWhineEnd: 120,
      engageBodyStart: 240,
      engageBodyEnd: 1320,
      releaseBodyStart: 1180,
      releaseBodyEnd: 220,
      engagePresenceStart: 900,
      engagePresenceEnd: 3200,
      releasePresenceStart: 2200,
      releasePresenceEnd: 650,
      bodyNoiseGain: 0.0135,
      presenceNoiseGain: 0.0056,
      rumbleGain: 0.0034,
      whineGain: 0.0018,
      playbackRateEngage: 1.02,
      playbackRateRelease: 0.92,
    }),
    reverse: Object.freeze({
      pan: 0,
      rumbleType: "sine",
      whineType: "triangle",
      engageDuration: 0.24,
      releaseDuration: 0.17,
      engageRumbleStart: 58,
      engageRumbleEnd: 88,
      releaseRumbleStart: 86,
      releaseRumbleEnd: 48,
      engageWhineStart: 132,
      engageWhineEnd: 220,
      releaseWhineStart: 188,
      releaseWhineEnd: 96,
      engageBodyStart: 180,
      engageBodyEnd: 760,
      releaseBodyStart: 680,
      releaseBodyEnd: 160,
      engagePresenceStart: 700,
      engagePresenceEnd: 1900,
      releasePresenceStart: 1500,
      releasePresenceEnd: 480,
      bodyNoiseGain: 0.0105,
      presenceNoiseGain: 0.0038,
      rumbleGain: 0.003,
      whineGain: 0.0015,
      playbackRateEngage: 0.96,
      playbackRateRelease: 0.88,
    }),
    left: Object.freeze({
      pan: -0.28,
      rumbleType: "triangle",
      whineType: "sine",
      engageDuration: 0.18,
      releaseDuration: 0.13,
      engageRumbleStart: 64,
      engageRumbleEnd: 98,
      releaseRumbleStart: 92,
      releaseRumbleEnd: 52,
      engageWhineStart: 150,
      engageWhineEnd: 250,
      releaseWhineStart: 220,
      releaseWhineEnd: 104,
      engageBodyStart: 210,
      engageBodyEnd: 920,
      releaseBodyStart: 820,
      releaseBodyEnd: 180,
      engagePresenceStart: 820,
      engagePresenceEnd: 2200,
      releasePresenceStart: 1700,
      releasePresenceEnd: 520,
      bodyNoiseGain: 0.0094,
      presenceNoiseGain: 0.0042,
      rumbleGain: 0.0028,
      whineGain: 0.0014,
      playbackRateEngage: 0.98,
      playbackRateRelease: 0.9,
    }),
    right: Object.freeze({
      pan: 0.28,
      rumbleType: "triangle",
      whineType: "sine",
      engageDuration: 0.18,
      releaseDuration: 0.13,
      engageRumbleStart: 66,
      engageRumbleEnd: 102,
      releaseRumbleStart: 94,
      releaseRumbleEnd: 54,
      engageWhineStart: 156,
      engageWhineEnd: 258,
      releaseWhineStart: 228,
      releaseWhineEnd: 108,
      engageBodyStart: 220,
      engageBodyEnd: 960,
      releaseBodyStart: 860,
      releaseBodyEnd: 190,
      engagePresenceStart: 860,
      engagePresenceEnd: 2280,
      releasePresenceStart: 1760,
      releasePresenceEnd: 560,
      bodyNoiseGain: 0.0094,
      presenceNoiseGain: 0.0042,
      rumbleGain: 0.0028,
      whineGain: 0.0014,
      playbackRateEngage: 0.99,
      playbackRateRelease: 0.91,
    }),
  }),
});

const FINAL_WEAPON_TUNING = Object.freeze({
  pulse: Object.freeze({
    activePhase: 2,
    phases: Object.freeze({
      1: Object.freeze({
        label: "Pulse Phase 1",
        cooldown: 0.13,
        shots: Object.freeze([
          Object.freeze({ offsetX: -14, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: 14, offsetY: -42, speed: 460 }),
        ]),
        visuals: PULSE_PHASE_VISUALS,
      }),
      2: Object.freeze({
        label: "Pulse Phase 2",
        cooldown: 0.13,
        shots: Object.freeze([
          Object.freeze({ offsetX: -24, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: -10, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: 10, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: 24, offsetY: -42, speed: 460 }),
        ]),
        visuals: PULSE_PHASE_VISUALS,
      }),
      3: Object.freeze({
        label: "Pulse Phase 3",
        cooldown: 0.13,
        shots: Object.freeze([
          Object.freeze({ offsetX: -38, offsetY: -42, speed: 460, angleDeg: -25 }),
          Object.freeze({ offsetX: -24, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: -10, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: 10, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: 24, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: 38, offsetY: -42, speed: 460, angleDeg: 25 }),
        ]),
        visuals: PULSE_PHASE_VISUALS,
      }),
      4: Object.freeze({
        label: "Pulse Phase 4",
        cooldown: 0.13,
        shots: Object.freeze([
          Object.freeze({ offsetX: -38, offsetY: -42, speed: 460, angleDeg: -25 }),
          Object.freeze({ offsetX: -24, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: -10, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: 10, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: 24, offsetY: -42, speed: 460 }),
          Object.freeze({ offsetX: 38, offsetY: -42, speed: 460, angleDeg: 25 }),
          Object.freeze({ offsetX: -38, offsetY: 34, speed: 460, angleDeg: -155 }),
          Object.freeze({ offsetX: -24, offsetY: 34, speed: 460, angleDeg: 180 }),
          Object.freeze({ offsetX: -10, offsetY: 34, speed: 460, angleDeg: 180 }),
          Object.freeze({ offsetX: 10, offsetY: 34, speed: 460, angleDeg: 180 }),
          Object.freeze({ offsetX: 24, offsetY: 34, speed: 460, angleDeg: 180 }),
          Object.freeze({ offsetX: 38, offsetY: 34, speed: 460, angleDeg: 155 }),
        ]),
        visuals: PULSE_PHASE_VISUALS,
      }),
    }),
  }),
});

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
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const spriteSheets = {
    idle: createSpriteSheet(`assets/generated/ship_idle_sheet.png?v=${FLIGHT_ASSET_VERSION}`),
    left: createSpriteSheet(`assets/generated/ship_strafe_left_sheet.png?v=${FLIGHT_ASSET_VERSION}`),
    right: createSpriteSheet(`assets/generated/ship_strafe_right_sheet.png?v=${FLIGHT_ASSET_VERSION}`),
  };
  const flameRects = [
    { x0: 42, y0: 80, x1: 56, y1: 127 },
    { x0: 58, y0: 78, x1: 74, y1: 127 },
    { x0: 76, y0: 80, x1: 90, y1: 127 },
  ];
  const keys = new Set();
  const bullets = [];
  const cannonFlashes = [];
  const stars = createStars(70, flightCanvas.width, flightCanvas.height);
  let flightAudioContext = null;
  let flightNoiseBuffer = null;
  let shotSoundSeed = 0;
  const ship = {
    x: flightCanvas.width / 2,
    y: flightCanvas.height - 132,
    velocityX: 0,
    velocityY: 0,
    throttle: FINAL_SHIP_TUNING.throttle.idle,
    targetThrottle: FINAL_SHIP_TUNING.throttle.idle,
    thrustMode: "idle",
    weaponFamily: "pulse",
    weaponPhase: FINAL_WEAPON_TUNING.pulse.activePhase,
    leftBoosterLag: 0,
    rightBoosterLag: 0,
    fireCooldown: 0,
    audioThrustMode: "idle",
    audioStrafeMode: "idle",
  };
  let lastFrameAt = performance.now();

  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "KeyA", "KeyD", "KeyW", "KeyS"].includes(event.code)) {
      event.preventDefault();
    }
    unlockFlightAudio();
    keys.add(event.code);
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.code);
  });

  flightCanvas.addEventListener("pointerdown", unlockFlightAudio, { passive: true });

  setupWeaponSelectors();
  Promise.all(Object.values(spriteSheets).map((sheet) => sheet.ready)).then(() => {
    requestAnimationFrame(loop);
  }).catch((error) => {
    flightLoadError = error;
    console.error("Flight layer failed to load sprite sheets.", error);
    renderFlightLoadError();
  });

  function loop(timestamp) {
    const deltaSeconds = Math.min(0.033, (timestamp - lastFrameAt) / 1000);
    lastFrameAt = timestamp;

    updateCannonFlashes(deltaSeconds);
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

    const maxHorizontalSpeed = FINAL_SHIP_TUNING.maxHorizontalSpeed;
    ship.velocityX = horizontalIntent * maxHorizontalSpeed;
    ship.x += ship.velocityX * deltaSeconds;
    ship.x = Math.max(58, Math.min(flightCanvas.width - 58, ship.x));

    ship.velocityY = verticalIntent * FINAL_SHIP_TUNING.maxVerticalSpeed;
    ship.y += ship.velocityY * deltaSeconds;
    ship.y = Math.max(168, Math.min(flightCanvas.height - 96, ship.y));

    const strafeLagStep = Math.min(1, deltaSeconds * FINAL_SHIP_TUNING.strafeBoosters.lagResponse);
    const leftLagTarget = moveRight ? FINAL_SHIP_TUNING.strafeBoosters.lagDistance : 0;
    const rightLagTarget = moveLeft ? FINAL_SHIP_TUNING.strafeBoosters.lagDistance : 0;
    ship.leftBoosterLag += (leftLagTarget - ship.leftBoosterLag) * strafeLagStep;
    ship.rightBoosterLag += (rightLagTarget - ship.rightBoosterLag) * strafeLagStep;

    ship.targetThrottle = FINAL_SHIP_TUNING.throttle.idle;
    ship.thrustMode = "idle";
    if (moveForward) {
      ship.targetThrottle = FINAL_SHIP_TUNING.throttle.forward;
      ship.thrustMode = "forward";
    } else if (moveBackward) {
      ship.targetThrottle = FINAL_SHIP_TUNING.throttle.reverse;
      ship.thrustMode = "reverse";
    }

    ship.throttle +=
      (ship.targetThrottle - ship.throttle) *
      Math.min(1, deltaSeconds * FINAL_SHIP_TUNING.throttleResponse);
    if (throttleReadout) {
      throttleReadout.textContent = `${Math.round(ship.throttle * 100)}%`;
    }

    const nextStrafeMode = moveLeft && !moveRight
      ? "left"
      : moveRight && !moveLeft
        ? "right"
        : "idle";
    syncBoosterAudioState("thrust", ship.thrustMode);
    syncBoosterAudioState("strafe", nextStrafeMode);

    const phaseConfig = getWeaponPhaseConfig(ship.weaponFamily, ship.weaponPhase);
    ship.fireCooldown -= deltaSeconds;
    if (keys.has("Space") && ship.fireCooldown <= 0) {
      fireWeaponPhase(ship.weaponFamily, ship.weaponPhase, phaseConfig);
      playPulseShotSound(phaseConfig);
      ship.fireCooldown = phaseConfig.cooldown;
    }
  }

  function updateBullets(deltaSeconds) {
    for (const bullet of bullets) {
      bullet.x += bullet.velocityX * deltaSeconds;
      bullet.y += bullet.velocityY * deltaSeconds;
    }
    for (let index = bullets.length - 1; index >= 0; index -= 1) {
      if (
        bullets[index].y < -24 ||
        bullets[index].y > flightCanvas.height + 24 ||
        bullets[index].x < -24 ||
        bullets[index].x > flightCanvas.width + 24
      ) {
        bullets.splice(index, 1);
      }
    }
  }

  function updateCannonFlashes(deltaSeconds) {
    for (const flash of cannonFlashes) {
      flash.life -= deltaSeconds;
    }
    for (let index = cannonFlashes.length - 1; index >= 0; index -= 1) {
      if (cannonFlashes[index].life <= 0) {
        cannonFlashes.splice(index, 1);
      }
    }
  }

  function updateStars(deltaSeconds) {
    const starSpeed =
      FINAL_SHIP_TUNING.starfield.baseSpeed +
      ship.throttle * FINAL_SHIP_TUNING.starfield.throttleSpeed;
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
      renderPulseBullet(bullet);
    }
  }

  function renderShip(timestamp) {
    const frameIndex = Math.floor(timestamp / 83) % 8;
    const sheetKey =
      ship.velocityX < -FINAL_SHIP_TUNING.strafeThreshold
        ? "left"
        : ship.velocityX > FINAL_SHIP_TUNING.strafeThreshold
          ? "right"
          : "idle";
    const drawX = Math.round(ship.x - 64);
    const drawY = Math.round(ship.y - 64);
    const processedFrame = getProcessedFlightFrame(sheetKey, frameIndex, ship.thrustMode);

    renderBoosterGlow(drawX, drawY);
    context.drawImage(processedFrame, drawX, drawY, 128, 128);
    renderCannonFlashes(drawX, drawY);
    if (ship.thrustMode === "reverse") {
      renderReverseBoosters(drawX, drawY, frameIndex);
    } else if (ship.velocityX < -FINAL_SHIP_TUNING.strafeThreshold) {
      renderStrafeBooster(drawX, drawY, frameIndex, "left");
    } else if (ship.velocityX > FINAL_SHIP_TUNING.strafeThreshold) {
      renderStrafeBooster(drawX, drawY, frameIndex, "right");
    }
  }

  function renderBoosterGlow(drawX, drawY) {
    const throttlePower = ship.throttle;
    const { mainBoosters } = FINAL_SHIP_TUNING;
    const centerColor = ship.thrustMode === "reverse"
      ? mainBoosters.reverseCenterColor
      : mainBoosters.forwardCenterColor;
    const sideColor = ship.thrustMode === "reverse"
      ? mainBoosters.reverseSideColor
      : mainBoosters.forwardSideColor;
    context.save();
    context.globalCompositeOperation = "lighter";
    paintBooster(
      drawX + mainBoosters.leftX,
      drawY + mainBoosters.sideY,
      mainBoosters.sideWidth,
      mainBoosters.sideHeight * throttlePower,
      sideColor
    );
    paintBooster(
      drawX + mainBoosters.centerX,
      drawY + mainBoosters.centerY,
      mainBoosters.centerWidth,
      mainBoosters.centerHeight * throttlePower,
      centerColor
    );
    paintBooster(
      drawX + mainBoosters.rightX,
      drawY + mainBoosters.sideY,
      mainBoosters.sideWidth,
      mainBoosters.sideHeight * throttlePower,
      sideColor
    );
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

  function renderReverseBoosters(drawX, drawY, frameIndex) {
    const { reverseBoosters, flickerPattern } = FINAL_SHIP_TUNING;
    const flicker = flickerPattern[frameIndex];
    const glowLength = reverseBoosters.glowLength + flicker;
    const outerLength = reverseBoosters.outerLength + flicker;
    const innerLength = reverseBoosters.innerLength + Math.min(2, flicker);
    context.save();
    context.globalCompositeOperation = "lighter";
    paintReverseBooster(
      drawX + reverseBoosters.leftX,
      drawY + reverseBoosters.glowY,
      reverseBoosters.glowWidth,
      glowLength,
      reverseBoosters.glowColor
    );
    paintReverseBooster(
      drawX + reverseBoosters.rightX,
      drawY + reverseBoosters.glowY,
      reverseBoosters.glowWidth,
      glowLength,
      reverseBoosters.glowColor
    );
    paintReverseBooster(
      drawX + reverseBoosters.leftX,
      drawY + reverseBoosters.nozzleY,
      reverseBoosters.outerWidth,
      outerLength,
      reverseBoosters.outerColor
    );
    paintReverseBooster(
      drawX + reverseBoosters.rightX,
      drawY + reverseBoosters.nozzleY,
      reverseBoosters.outerWidth,
      outerLength,
      reverseBoosters.outerColor
    );
    paintReverseBooster(
      drawX + reverseBoosters.leftX,
      drawY + reverseBoosters.nozzleY,
      reverseBoosters.innerWidth,
      innerLength,
      reverseBoosters.innerColor
    );
    paintReverseBooster(
      drawX + reverseBoosters.rightX,
      drawY + reverseBoosters.nozzleY,
      reverseBoosters.innerWidth,
      innerLength,
      reverseBoosters.innerColor
    );
    context.fillStyle = reverseBoosters.nozzleGlowColor;
    context.fillRect(
      drawX + reverseBoosters.leftX + reverseBoosters.nozzleGlowOffsetX,
      drawY + reverseBoosters.nozzleY + reverseBoosters.nozzleGlowOffsetY,
      reverseBoosters.nozzleGlowWidth,
      reverseBoosters.nozzleGlowHeight
    );
    context.fillRect(
      drawX + reverseBoosters.rightX + reverseBoosters.nozzleGlowOffsetX,
      drawY + reverseBoosters.nozzleY + reverseBoosters.nozzleGlowOffsetY,
      reverseBoosters.nozzleGlowWidth,
      reverseBoosters.nozzleGlowHeight
    );
    context.restore();
  }

  function renderStrafeBooster(drawX, drawY, frameIndex, direction) {
    const { strafeBoosters, flickerPattern } = FINAL_SHIP_TUNING;
    const flicker = flickerPattern[frameIndex];
    const outerLength = strafeBoosters.outerLength + flicker;
    const innerLength = strafeBoosters.innerLength + Math.min(2, flicker);
    const nozzleX =
      direction === "left"
        ? drawX + strafeBoosters.rightSideNozzleX + ship.rightBoosterLag
        : drawX + strafeBoosters.leftSideNozzleX - ship.leftBoosterLag;
    const nozzleY = drawY + strafeBoosters.nozzleY;
    const exhaustDirection = direction === "left" ? 1 : -1;

    context.save();
    context.globalCompositeOperation = "lighter";
    paintLateralBooster(
      nozzleX,
      nozzleY,
      strafeBoosters.outerWidth,
      outerLength,
      exhaustDirection,
      strafeBoosters.outerColor
    );
    paintLateralBooster(
      nozzleX,
      nozzleY,
      strafeBoosters.innerWidth,
      innerLength,
      exhaustDirection,
      strafeBoosters.innerColor
    );
    context.fillStyle = strafeBoosters.nozzleGlowColor;
    context.fillRect(
      nozzleX + strafeBoosters.nozzleGlowOffset,
      nozzleY + strafeBoosters.nozzleGlowOffset,
      strafeBoosters.nozzleGlowSize,
      strafeBoosters.nozzleGlowSize
    );
    context.restore();
  }

  function paintReverseBooster(x, y, width, length, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x - width / 2, y);
    context.lineTo(x + width / 2, y);
    context.lineTo(x + width / 5, y - length);
    context.lineTo(x - width / 5, y - length);
    context.closePath();
    context.fill();
  }

  function paintLateralBooster(x, y, width, length, direction, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x, y - width / 2);
    context.lineTo(x, y + width / 2);
    context.lineTo(x + direction * length, y + width / 5);
    context.lineTo(x + direction * length, y - width / 5);
    context.closePath();
    context.fill();
  }

  function getWeaponPhaseConfig(family, phase) {
    return FINAL_WEAPON_TUNING[family].phases[phase];
  }

  function unlockFlightAudio() {
    if (!AudioContextClass) {
      return;
    }
    if (!flightAudioContext) {
      flightAudioContext = new AudioContextClass();
      flightNoiseBuffer = createFlightNoiseBuffer(flightAudioContext);
    }
    if (flightAudioContext.state === "suspended") {
      flightAudioContext.resume().catch(() => {});
    }
  }

  function createFlightNoiseBuffer(audioContext) {
    const frameCount = Math.floor(audioContext.sampleRate * BOOSTER_AUDIO_TUNING.noiseBufferDuration);
    const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate);
    const channel = buffer.getChannelData(0);
    let smooth = 0;
    let rumble = 0;
    for (let index = 0; index < frameCount; index += 1) {
      const white = Math.random() * 2 - 1;
      smooth = smooth * 0.76 + white * 0.24;
      rumble = rumble * 0.985 + white * 0.015;
      const sample = white * 0.52 + smooth * 0.33 + rumble * 0.9;
      channel[index] = Math.max(-1, Math.min(1, sample));
    }
    return buffer;
  }

  function playPulseShotSound(phaseConfig) {
    unlockFlightAudio();
    if (!flightAudioContext || flightAudioContext.state !== "running") {
      return;
    }

    const now = flightAudioContext.currentTime;
    const spreadFactor = Math.max(0, phaseConfig.shots.length - 2);
    const pitchJitter = (shotSoundSeed % 3) * 16;
    shotSoundSeed += 1;

    const bodyOscillator = flightAudioContext.createOscillator();
    bodyOscillator.type = "square";
    bodyOscillator.frequency.setValueAtTime(
      FLIGHT_AUDIO_TUNING.basePitch - spreadFactor * 42 + pitchJitter,
      now,
    );
    bodyOscillator.frequency.exponentialRampToValueAtTime(
      260 + pitchJitter,
      now + FLIGHT_AUDIO_TUNING.decay,
    );

    const tailOscillator = flightAudioContext.createOscillator();
    tailOscillator.type = "triangle";
    tailOscillator.frequency.setValueAtTime(
      FLIGHT_AUDIO_TUNING.tailPitch + pitchJitter * 0.6,
      now,
    );
    tailOscillator.frequency.exponentialRampToValueAtTime(
      120 + spreadFactor * 10,
      now + FLIGHT_AUDIO_TUNING.decay,
    );

    const filter = flightAudioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2800, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + FLIGHT_AUDIO_TUNING.decay);

    const gainNode = flightAudioContext.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(
      FLIGHT_AUDIO_TUNING.baseGain + spreadFactor * 0.006,
      now + FLIGHT_AUDIO_TUNING.attack,
    );
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + FLIGHT_AUDIO_TUNING.decay);

    bodyOscillator.connect(filter);
    tailOscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(flightAudioContext.destination);

    bodyOscillator.start(now);
    tailOscillator.start(now);
    bodyOscillator.stop(now + FLIGHT_AUDIO_TUNING.decay);
    tailOscillator.stop(now + FLIGHT_AUDIO_TUNING.decay);

    tailOscillator.addEventListener("ended", () => {
      bodyOscillator.disconnect();
      tailOscillator.disconnect();
      filter.disconnect();
      gainNode.disconnect();
    }, { once: true });
  }

  function syncBoosterAudioState(channel, nextMode) {
    const stateKey = channel === "thrust" ? "audioThrustMode" : "audioStrafeMode";
    const previousMode = ship[stateKey];
    if (previousMode === nextMode) {
      return;
    }
    if (previousMode !== "idle") {
      playBoosterShiftSound(previousMode, "release");
    }
    if (nextMode !== "idle") {
      playBoosterShiftSound(nextMode, "engage");
    }
    ship[stateKey] = nextMode;
  }

  function playBoosterShiftSound(mode, action) {
    unlockFlightAudio();
    if (!flightAudioContext || flightAudioContext.state !== "running" || !flightNoiseBuffer) {
      return;
    }

    const profile = BOOSTER_AUDIO_TUNING.modes[mode];
    if (!profile) {
      return;
    }

    const now = flightAudioContext.currentTime;
    const isEngage = action === "engage";
    const duration = isEngage ? profile.engageDuration : profile.releaseDuration;
    const attack = isEngage ? BOOSTER_AUDIO_TUNING.engageAttack : BOOSTER_AUDIO_TUNING.releaseAttack;
    const startRumble = isEngage ? profile.engageRumbleStart : profile.releaseRumbleStart;
    const endRumble = isEngage ? profile.engageRumbleEnd : profile.releaseRumbleEnd;
    const startWhine = isEngage ? profile.engageWhineStart : profile.releaseWhineStart;
    const endWhine = isEngage ? profile.engageWhineEnd : profile.releaseWhineEnd;
    const startBody = isEngage ? profile.engageBodyStart : profile.releaseBodyStart;
    const endBody = isEngage ? profile.engageBodyEnd : profile.releaseBodyEnd;
    const startPresence = isEngage ? profile.engagePresenceStart : profile.releasePresenceStart;
    const endPresence = isEngage ? profile.engagePresenceEnd : profile.releasePresenceEnd;

    const rumbleOscillator = flightAudioContext.createOscillator();
    rumbleOscillator.type = profile.rumbleType;
    rumbleOscillator.frequency.setValueAtTime(startRumble, now);
    rumbleOscillator.frequency.exponentialRampToValueAtTime(endRumble, now + duration);

    const whineOscillator = flightAudioContext.createOscillator();
    whineOscillator.type = profile.whineType;
    whineOscillator.frequency.setValueAtTime(startWhine, now);
    whineOscillator.frequency.exponentialRampToValueAtTime(endWhine, now + duration);

    const rumbleFilter = flightAudioContext.createBiquadFilter();
    rumbleFilter.type = "lowpass";
    rumbleFilter.frequency.setValueAtTime(Math.max(160, startBody * 1.4), now);
    rumbleFilter.frequency.exponentialRampToValueAtTime(Math.max(120, endBody * 1.25), now + duration);
    rumbleFilter.Q.value = 0.45;

    const whineFilter = flightAudioContext.createBiquadFilter();
    whineFilter.type = "bandpass";
    whineFilter.frequency.setValueAtTime(Math.max(240, startPresence * 0.75), now);
    whineFilter.frequency.exponentialRampToValueAtTime(Math.max(180, endPresence * 0.7), now + duration);
    whineFilter.Q.value = 0.9;

    const rumbleGain = flightAudioContext.createGain();
    rumbleGain.gain.value = profile.rumbleGain;

    const whineGain = flightAudioContext.createGain();
    whineGain.gain.value = profile.whineGain;

    const noiseSource = flightAudioContext.createBufferSource();
    noiseSource.buffer = flightNoiseBuffer;
    noiseSource.playbackRate.setValueAtTime(
      isEngage ? profile.playbackRateEngage : profile.playbackRateRelease,
      now,
    );

    const bodyNoiseFilter = flightAudioContext.createBiquadFilter();
    bodyNoiseFilter.type = "lowpass";
    bodyNoiseFilter.frequency.setValueAtTime(startBody, now);
    bodyNoiseFilter.frequency.exponentialRampToValueAtTime(endBody, now + duration);
    bodyNoiseFilter.Q.value = 0.7;

    const presenceNoiseFilter = flightAudioContext.createBiquadFilter();
    presenceNoiseFilter.type = "bandpass";
    presenceNoiseFilter.frequency.setValueAtTime(startPresence, now);
    presenceNoiseFilter.frequency.exponentialRampToValueAtTime(endPresence, now + duration);
    presenceNoiseFilter.Q.value = 1.15;

    const bodyNoiseGain = flightAudioContext.createGain();
    bodyNoiseGain.gain.value = profile.bodyNoiseGain;

    const presenceNoiseGain = flightAudioContext.createGain();
    presenceNoiseGain.gain.value = profile.presenceNoiseGain;

    const masterGain = flightAudioContext.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(BOOSTER_AUDIO_TUNING.outputGain, now + attack);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const compressor = flightAudioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(BOOSTER_AUDIO_TUNING.compressor.threshold, now);
    compressor.knee.setValueAtTime(BOOSTER_AUDIO_TUNING.compressor.knee, now);
    compressor.ratio.setValueAtTime(BOOSTER_AUDIO_TUNING.compressor.ratio, now);
    compressor.attack.setValueAtTime(BOOSTER_AUDIO_TUNING.compressor.attack, now);
    compressor.release.setValueAtTime(BOOSTER_AUDIO_TUNING.compressor.release, now);

    let destination = compressor;
    let panNode = null;
    if (typeof flightAudioContext.createStereoPanner === "function") {
      panNode = flightAudioContext.createStereoPanner();
      panNode.pan.value = profile.pan;
      compressor.connect(panNode);
      destination = panNode;
    }

    rumbleOscillator.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(masterGain);

    whineOscillator.connect(whineFilter);
    whineFilter.connect(whineGain);
    whineGain.connect(masterGain);

    noiseSource.connect(bodyNoiseFilter);
    noiseSource.connect(presenceNoiseFilter);
    bodyNoiseFilter.connect(bodyNoiseGain);
    presenceNoiseFilter.connect(presenceNoiseGain);
    bodyNoiseGain.connect(masterGain);
    presenceNoiseGain.connect(masterGain);

    masterGain.connect(compressor);
    destination.connect(flightAudioContext.destination);

    rumbleOscillator.start(now);
    whineOscillator.start(now);
    noiseSource.start(now);
    rumbleOscillator.stop(now + duration);
    whineOscillator.stop(now + duration);
    noiseSource.stop(now + duration);

    noiseSource.addEventListener("ended", () => {
      rumbleOscillator.disconnect();
      whineOscillator.disconnect();
      noiseSource.disconnect();
      rumbleFilter.disconnect();
      rumbleGain.disconnect();
      whineFilter.disconnect();
      whineGain.disconnect();
      bodyNoiseFilter.disconnect();
      presenceNoiseFilter.disconnect();
      bodyNoiseGain.disconnect();
      presenceNoiseGain.disconnect();
      masterGain.disconnect();
      compressor.disconnect();
      if (panNode) {
        panNode.disconnect();
      }
    }, { once: true });
  }

  function fireWeaponPhase(family, phase, phaseConfig) {
    for (const [shotIndex, shot] of phaseConfig.shots.entries()) {
      const angleRadians = ((shot.angleDeg ?? 0) * Math.PI) / 180;
      bullets.push({
        family,
        phase,
        variant: shotIndex % 2,
        x: ship.x + shot.offsetX,
        y: ship.y + shot.offsetY,
        speed: shot.speed,
        angleRadians,
        velocityX: Math.sin(angleRadians) * shot.speed,
        velocityY: -Math.cos(angleRadians) * shot.speed,
      });
      cannonFlashes.push({
        family,
        phase,
        life: phaseConfig.visuals.muzzleDuration,
        offsetX: shot.offsetX,
        offsetY: shot.offsetY,
        angleRadians,
        variant: shotIndex % 2,
      });
    }
  }

  function renderCannonFlashes(drawX, drawY) {
    for (const flash of cannonFlashes) {
      const visuals = getWeaponPhaseConfig(flash.family, flash.phase).visuals;
      const intensity = Math.max(0, flash.life / visuals.muzzleDuration);
      const x = Math.round(drawX + 64 + flash.offsetX);
      const y = Math.round(drawY + 64 + flash.offsetY - 1);
      const rotation = flash.angleRadians ?? 0;
      const trailHeight = intensity > 0.58 ? 2 + flash.variant : 1 + flash.variant;

      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.7 + intensity * 0.25;
      context.fillStyle = visuals.muzzleGlowColor;
      context.fillRect(-3, -5, 7, 6);

      context.fillStyle = visuals.muzzleSparkColor;
      context.fillRect(0, -5, 1, 2);
      context.fillRect(-2, -1, 1, 1);
      context.fillRect(2, -1, 1, 1);

      context.fillStyle = visuals.muzzleFlareColor;
      context.fillRect(-1, -4, 3, 1);
      context.fillRect(-2, -3, 5, 1);
      context.fillRect(-1, -2, 3, 1);
      context.fillRect(-1, -1, 3, trailHeight);

      context.fillStyle = visuals.muzzleCoreColor;
      context.fillRect(0, -4, 1, 4 + flash.variant);
      context.restore();
    }
  }

  function renderPulseBullet(bullet) {
    const visuals = getWeaponPhaseConfig(bullet.family, bullet.phase).visuals;
    const x = Math.round(bullet.x);
    const y = Math.round(bullet.y);
    const rotation = bullet.angleRadians ?? 0;
    const trailFlicker = (Math.floor((bullet.y + bullet.variant * 5) / 7) & 1) === 0 ? 0 : 1;
    const drawRow = (offsetY, width, color) => {
      context.fillStyle = color;
      context.fillRect(-Math.floor(width / 2), offsetY, width, 1);
    };

    context.save();
    context.translate(x, y);
    context.rotate(rotation);

    // Paint a fixed pixel silhouette so the pulse reads like a tiny bomb instead of a flat beam.
    context.fillStyle = visuals.outerGlowColor;
    context.fillRect(-3, -8, 7, 8);
    context.fillRect(-2, -1, 5, 5 + trailFlicker);

    context.fillStyle = visuals.trailGlowColor;
    context.fillRect(-2, 0, 5, 3 + trailFlicker);

    drawRow(-7, 1, visuals.shellShadowColor);
    drawRow(-6, 3, visuals.shellShadowColor);
    drawRow(-5, 5, visuals.shellShadowColor);
    drawRow(-4, 3, visuals.shellShadowColor);
    drawRow(-3, 3, visuals.shellShadowColor);
    drawRow(-2, 3, visuals.shellShadowColor);
    drawRow(-1, 1, visuals.shellShadowColor);

    drawRow(-8, 1, visuals.noseColor);
    drawRow(-7, 1, visuals.coreColor);
    drawRow(-6, 3, visuals.collarColor);
    drawRow(-5, 3, visuals.shellColor);
    drawRow(-4, 3, visuals.shellColor);
    drawRow(-3, 3, visuals.shellColor);

    context.fillStyle = visuals.coreColor;
    context.fillRect(0, -7, 1, 6);

    context.fillStyle = visuals.trailColor;
    context.fillRect(-1, -1, 3, 2 + trailFlicker);
    context.fillRect(0, 1, 1, 2 + trailFlicker);

    context.fillStyle = visuals.trailCoreColor;
    context.fillRect(0, -1, 1, 2 + trailFlicker);
    context.restore();
  }

  function setupWeaponSelectors() {
    if (!weaponFamilySelect || !weaponPhaseSelect) {
      return;
    }

    weaponFamilySelect.innerHTML = "";
    for (const family of Object.keys(FINAL_WEAPON_TUNING)) {
      const option = document.createElement("option");
      option.value = family;
      option.textContent = toTitleCase(family);
      weaponFamilySelect.append(option);
    }

    weaponFamilySelect.value = ship.weaponFamily;
    syncPhaseSelector();

    weaponFamilySelect.addEventListener("change", () => {
      ship.weaponFamily = weaponFamilySelect.value;
      ship.weaponPhase = FINAL_WEAPON_TUNING[ship.weaponFamily].activePhase;
      ship.fireCooldown = 0;
      syncPhaseSelector();
    });

    weaponPhaseSelect.addEventListener("change", () => {
      ship.weaponPhase = Number(weaponPhaseSelect.value);
      ship.fireCooldown = 0;
    });
  }

  function syncPhaseSelector() {
    weaponPhaseSelect.innerHTML = "";
    const phases = FINAL_WEAPON_TUNING[ship.weaponFamily].phases;
    for (const phase of Object.keys(phases)) {
      const option = document.createElement("option");
      option.value = phase;
      option.textContent = phases[phase].label;
      weaponPhaseSelect.append(option);
    }
    weaponPhaseSelect.value = String(ship.weaponPhase);
  }

  function renderFlightLoadError() {
    context.clearRect(0, 0, flightCanvas.width, flightCanvas.height);
    context.fillStyle = "#000000";
    context.fillRect(0, 0, flightCanvas.width, flightCanvas.height);
    context.fillStyle = "#e8eef9";
    context.font = "18px Oxanium, sans-serif";
    context.textAlign = "center";
    context.fillText("Flight layer asset load failed", flightCanvas.width / 2, flightCanvas.height / 2 - 10);
    context.fillStyle = "#8fa4c3";
    context.font = "12px Space Grotesk, sans-serif";
    context.fillText("Check website/assets/generated sprite sheets.", flightCanvas.width / 2, flightCanvas.height / 2 + 18);
  }

  function getProcessedFlightFrame(sheetKey, frameIndex, thrustMode) {
    const cacheKey = `${sheetKey}:${frameIndex}:${thrustMode}:${flightProcessingMode}`;
    if (flightFrameCache.has(cacheKey)) {
      return flightFrameCache.get(cacheKey);
    }

    if (flightProcessingMode === "mask") {
      return createMaskedFlightFrame(sheetKey, frameIndex, thrustMode, cacheKey);
    }

    const offscreen = document.createElement("canvas");
    offscreen.width = 128;
    offscreen.height = 128;
    const offscreenContext = offscreen.getContext("2d", { willReadFrequently: true });
    offscreenContext.drawImage(spriteSheets[sheetKey].image, frameIndex * 128, 0, 128, 128, 0, 0, 128, 128);
    try {
      const imageData = offscreenContext.getImageData(0, 0, 128, 128);
      const thrustRatio =
        thrustMode === "forward"
          ? FINAL_SHIP_TUNING.flameRatios.forward
          : thrustMode === "reverse"
            ? FINAL_SHIP_TUNING.flameRatios.reverse
            : FINAL_SHIP_TUNING.flameRatios.idle;

      for (const rect of flameRects) {
        const visibleBottom = rect.y0 + Math.round((rect.y1 - rect.y0) * thrustRatio);
        for (let y = rect.y0; y <= rect.y1; y += 1) {
          for (let x = rect.x0; x <= rect.x1; x += 1) {
            const pixelIndex = (y * 128 + x) * 4;
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            const a = imageData.data[pixelIndex + 3];

            if (!isFlamePixel(r, g, b, a)) {
              continue;
            }

            if (y > visibleBottom) {
              imageData.data[pixelIndex + 3] = 0;
              continue;
            }

            if (thrustMode === "reverse") {
              const [nr, ng, nb] = toReverseThrusterBlue(r, g, b);
              imageData.data[pixelIndex] = nr;
              imageData.data[pixelIndex + 1] = ng;
              imageData.data[pixelIndex + 2] = nb;
            }
          }
        }
      }

      offscreenContext.putImageData(imageData, 0, 0);
      flightFrameCache.set(cacheKey, offscreen);
      return offscreen;
    } catch (error) {
      flightProcessingMode = "mask";
      flightFrameCache.clear();
      console.warn("Flight layer switched to compatibility masking mode.", error);
      return createMaskedFlightFrame(sheetKey, frameIndex, thrustMode, `${sheetKey}:${frameIndex}:${thrustMode}:mask`);
    }
  }

  function createMaskedFlightFrame(sheetKey, frameIndex, thrustMode, cacheKey) {
    const offscreen = document.createElement("canvas");
    offscreen.width = 128;
    offscreen.height = 128;
    const offscreenContext = offscreen.getContext("2d");
    offscreenContext.drawImage(spriteSheets[sheetKey].image, frameIndex * 128, 0, 128, 128, 0, 0, 128, 128);

    const thrustRatio =
      thrustMode === "forward"
        ? FINAL_SHIP_TUNING.flameRatios.forward
        : thrustMode === "reverse"
          ? FINAL_SHIP_TUNING.flameRatios.reverse
          : FINAL_SHIP_TUNING.flameRatios.idle;

    if (thrustMode !== "forward") {
      offscreenContext.save();
      offscreenContext.globalCompositeOperation = "destination-out";
      for (const rect of flameRects) {
        const visibleBottom = rect.y0 + Math.round((rect.y1 - rect.y0) * thrustRatio);
        offscreenContext.fillRect(
          rect.x0 - 1,
          visibleBottom,
          rect.x1 - rect.x0 + 3,
          rect.y1 - visibleBottom + 2
        );
      }
      offscreenContext.restore();
    }

    if (thrustMode === "reverse") {
      const boosters = FINAL_SHIP_TUNING.mainBoosters;
      paintBoosterShape(
        offscreenContext,
        boosters.leftX,
        boosters.sideY,
        boosters.sideWidth,
        Math.max(3, boosters.sideHeight * FINAL_SHIP_TUNING.throttle.reverse),
        boosters.reverseSideColor
      );
      paintBoosterShape(
        offscreenContext,
        boosters.centerX,
        boosters.centerY,
        boosters.centerWidth,
        Math.max(4, boosters.centerHeight * FINAL_SHIP_TUNING.throttle.reverse),
        boosters.reverseCenterColor
      );
      paintBoosterShape(
        offscreenContext,
        boosters.rightX,
        boosters.sideY,
        boosters.sideWidth,
        Math.max(3, boosters.sideHeight * FINAL_SHIP_TUNING.throttle.reverse),
        boosters.reverseSideColor
      );
    }

    flightFrameCache.set(cacheKey, offscreen);
    return offscreen;
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

function toTitleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function paintBoosterShape(targetContext, x, y, width, height, color) {
  targetContext.fillStyle = color;
  targetContext.beginPath();
  targetContext.moveTo(x - width / 2, y);
  targetContext.lineTo(x + width / 2, y);
  targetContext.lineTo(x + width / 5, y + height);
  targetContext.lineTo(x - width / 5, y + height);
  targetContext.closePath();
  targetContext.fill();
}

function isFlamePixel(r, g, b, a) {
  if (a === 0 || r < 45) {
    return false;
  }
  return (r >= g && g >= b) || (r >= 110 && g >= 50 && b <= 120);
}

function toReverseThrusterBlue(r, g, b) {
  const brightness = (r + g + b) / 3;
  if (brightness >= 215) {
    return [206, 242, 255];
  }
  if (brightness >= 165) {
    return [132, 204, 255];
  }
  if (brightness >= 110) {
    return [74, 152, 255];
  }
  return [36, 96, 220];
}
