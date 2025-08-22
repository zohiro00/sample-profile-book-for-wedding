document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("seating-chart-modal");
  const img = document.getElementById("seating-chart-image");
  const modalImg = document.getElementById("modal-seating-chart-image");
  const closeBtn = document.querySelector(".seating-chart-close-btn");
  const controlsContainer = document.getElementById("table-jump-controls");
  const pin = document.getElementById("seating-chart-pin");

  let panzoomInstance = null;

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

  function handleTableJump(event) {
    const clickedBtn = event.target.closest('.table-jump-btn');
    if (!clickedBtn || !panzoomInstance) return;

    const allBtns = controlsContainer.querySelectorAll('.table-jump-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    const tableIndex = parseInt(clickedBtn.dataset.tableIndex, 10);
    const coords = tableCoordinates[tableIndex];
    const targetScale = 2.5;

    const imageWidth = modalImg.naturalWidth;
    const imageHeight = modalImg.naturalHeight;

    if (!imageWidth || !imageHeight) return;

    const absX = coords.x * imageWidth;
    const absY = coords.y * imageHeight;

    // --- Pin Logic ---
    // Position the pin relative to the image itself.
    // We adjust for the pin's own dimensions to center its point on the coordinates.
    const pinWidth = pin.offsetWidth;
    const pinHeight = pin.offsetHeight;
    pin.style.left = `${absX}px`;
    pin.style.top = `${absY}px`;
    pin.style.display = 'block';

    // Force reflow to restart the animation
    pin.style.animation = 'none';
    pin.offsetHeight; /* trigger reflow */
    pin.style.animation = null;


    // --- Pan & Zoom Logic ---
    const viewportWidth = modal.clientWidth;
    const viewportHeight = modal.clientHeight;
    const newX = (viewportWidth / 2) - (absX * targetScale);
    const newY = (viewportHeight / 2) - (absY * targetScale);

    panzoomInstance.smoothZoom(viewportWidth / 2, viewportHeight / 2, targetScale);
    panzoomInstance.smoothMoveTo(newX, newY);
  }

  img.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;

    modalImg.onload = () => {
      if (panzoomInstance) panzoomInstance.dispose();
      // The pin is a child of the panzoom element's parent.
      // We need to make sure panzoom is initialized on the image, not the container.
      panzoomInstance = panzoom(modalImg, {
        maxZoom: 5,
        minZoom: 0.5,
        autocenter: true,
        bounds: true,
        boundsPadding: 0.05,
        // Make the panzoom element the image's direct container
        // Panzoom wraps the element, so we need to put the pin inside the wrapper.
        // The simplest way is to have the pin outside and calculate its position,
        // but sticking it to the image is better. Let's adjust HTML/CSS if needed.
        // The current HTML has the pin as a sibling of the image, inside the modal-content.
        // Let's verify panzoom's behavior. It wraps the target element in a 'panzoom-element'.
        // The pin should be inside that wrapper. The easiest way is to re-parent it.
        const panzoomWrapper = modalImg.parentElement;
        panzoomWrapper.style.position = 'relative'; // Ensure the wrapper is a positioning context
        panzoomWrapper.appendChild(pin);
      });
    };
  };

  function closeModal() {
    modal.style.display = "none";
    pin.style.display = 'none'; // Hide the pin
    if (panzoomInstance) {
      panzoomInstance.dispose();
      panzoomInstance = null;
    }
    const allBtns = controlsContainer.querySelectorAll('.table-jump-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));
  }

  closeBtn.onclick = closeModal;

  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  createJumpButtons();
  controlsContainer.addEventListener('click', handleTableJump);
});
