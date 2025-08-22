document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("seating-chart-modal");
  const img = document.getElementById("seating-chart-image");
  const modalImg = document.getElementById("modal-seating-chart-image");
  const closeBtn = document.querySelector(".seating-chart-close-btn");
  const controlsContainer = document.getElementById("table-jump-controls");
  const pin = document.getElementById("seating-chart-pin");

  let panzoomInstance = null;
  let targetPinCoords = null; // Store {x, y} of the target table in image pixels

  const tableCoordinates = [
    { x: 0.125, y: 0.36 }, { x: 0.375, y: 0.36 }, { x: 0.625, y: 0.36 }, { x: 0.875, y: 0.36 },
    { x: 0.125, y: 0.79 }, { x: 0.375, y: 0.79 }, { x: 0.625, y: 0.79 }, { x: 0.875, y: 0.79 },
  ];

  function setButtonsDisabled(disabled) {
    controlsContainer.querySelectorAll('.table-jump-btn').forEach(btn => {
        btn.disabled = disabled;
    });
  }

  function createJumpButtons() {
    controlsContainer.innerHTML = '';
    for (let i = 0; i < tableCoordinates.length; i++) {
      const btn = document.createElement('button');
      btn.innerText = `Table ${i + 1}`;
      btn.className = 'table-jump-btn';
      btn.dataset.tableIndex = i;
      controlsContainer.appendChild(btn);
    }
  }

  function updatePinPosition() {
    if (!panzoomInstance || !targetPinCoords) {
      pin.style.display = 'none';
      return;
    }
    const transform = panzoomInstance.getTransform();
    pin.style.left = `${transform.x + targetPinCoords.x * transform.scale}px`;
    pin.style.top = `${transform.y + targetPinCoords.y * transform.scale}px`;
    pin.style.transform = `rotate(-45deg) scale(${transform.scale})`;
    pin.style.transformOrigin = `50% 100%`;
  }

  function handleTableJump(event) {
    const clickedBtn = event.target.closest('.table-jump-btn');
    if (!clickedBtn || !panzoomInstance) return;

    controlsContainer.querySelectorAll('.table-jump-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    const tableIndex = parseInt(clickedBtn.dataset.tableIndex, 10);
    const coords = tableCoordinates[tableIndex];
    const targetScale = 2.5;

    const imageWidth = modalImg.naturalWidth;
    const imageHeight = modalImg.naturalHeight;

    if (!imageWidth || !imageHeight) return;

    targetPinCoords = {
      x: coords.x * imageWidth,
      y: coords.y * imageHeight
    };

    pin.style.display = 'block';
    pin.style.animation = 'none';
    pin.offsetHeight; // Trigger reflow
    pin.style.animation = null;

    const viewportWidth = modal.clientWidth;
    const viewportHeight = modal.clientHeight;
    const newX = (viewportWidth / 2) - (targetPinCoords.x * targetScale);
    const newY = (viewportHeight / 2) - (targetPinCoords.y * targetScale);

    panzoomInstance.smoothZoom(viewportWidth / 2, viewportHeight / 2, targetScale);
    panzoomInstance.smoothMoveTo(newX, newY);
  }

  function initializePanzoom() {
    // This function can be called multiple times, so we clean up first.
    if (panzoomInstance) {
        panzoomInstance.dispose();
    }

    panzoomInstance = panzoom(modalImg, {
      maxZoom: 5,
      minZoom: 0.5,
      autocenter: true,
      bounds: true,
      boundsPadding: 0.05,
    });

    panzoomInstance.on('transform', updatePinPosition);

    // Enable buttons now that panzoom is ready
    setButtonsDisabled(false);
  }

  img.onclick = function () {
    modal.style.display = "block";
    setButtonsDisabled(true); // Disable buttons until panzoom is ready

    // Define onload handler
    const onImgLoad = () => {
        // Ensure this doesn't run again if called manually
        modalImg.onload = null;
        initializePanzoom();
    };
    modalImg.onload = onImgLoad;

    // Set src to trigger loading
    modalImg.src = this.src;

    // If image is cached, onload might not fire.
    if (modalImg.complete) {
      onImgLoad();
    }
  };

  function closeModal() {
    modal.style.display = "none";
    targetPinCoords = null;
    if (pin) pin.style.display = 'none';

    if (panzoomInstance) {
      panzoomInstance.dispose();
      panzoomInstance = null;
    }
    controlsContainer.querySelectorAll('.table-jump-btn').forEach(btn => btn.classList.remove('active'));
    setButtonsDisabled(true); // Reset for next open
  }

  closeBtn.onclick = closeModal;
  modal.addEventListener('click', function(event) {
    if (event.target === modal) closeModal();
  });

  createJumpButtons();
  setButtonsDisabled(true); // Initially disabled
  controlsContainer.addEventListener('click', handleTableJump);
});
