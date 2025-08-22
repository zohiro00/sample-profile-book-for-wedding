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
    const pinWidth = pin.offsetWidth;
    const pinHeight = pin.offsetHeight;

    const screenX = transform.x + targetPinCoords.x * transform.scale;
    const screenY = transform.y + targetPinCoords.y * transform.scale;

    pin.style.left = `${screenX - (pinWidth / 2)}px`;
    pin.style.top = `${screenY - pinHeight}px`;

    pin.style.transform = `rotate(-45deg) scale(${transform.scale})`;
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
    if (panzoomInstance) panzoomInstance.dispose();

    panzoomInstance = panzoom(modalImg, {
      maxZoom: 5,
      minZoom: 0.5,
      autocenter: true,
      bounds: true,
      boundsPadding: 0.05,
    });

    panzoomInstance.on('transform', updatePinPosition);
    panzoomInstance.on('panend', updatePinPosition);
    panzoomInstance.on('zoomend', updatePinPosition);
  }

  img.onclick = function () {
    modal.style.display = "block";

    // Set the onload event handler *before* setting the src
    modalImg.onload = initializePanzoom;

    // Set the src to trigger loading
    modalImg.src = this.src;

    // If the image is already in the browser cache, the load event might not fire.
    // This check ensures the handler is called regardless.
    if (modalImg.complete) {
      initializePanzoom();
    }
  };

  function closeModal() {
    modal.style.display = "none";
    targetPinCoords = null; // Reset pin target
    updatePinPosition(); // This will hide the pin

    if (panzoomInstance) {
      panzoomInstance.dispose();
      panzoomInstance = null;
    }
    controlsContainer.querySelectorAll('.table-jump-btn').forEach(btn => btn.classList.remove('active'));
  }

  closeBtn.onclick = closeModal;
  modal.addEventListener('click', function(event) {
    if (event.target === modal) closeModal();
  });

  createJumpButtons();
  controlsContainer.addEventListener('click', handleTableJump);
});
