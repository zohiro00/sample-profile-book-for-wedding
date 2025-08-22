document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("seating-chart-modal");
  const img = document.getElementById("seating-chart-image");
  const modalImg = document.getElementById("modal-seating-chart-image");
  const closeBtn = document.querySelector(".seating-chart-close-btn");
  const controlsContainer = document.getElementById("table-jump-controls");

  let panzoomInstance = null;

  // --- Table Coordinates (Relative) ---
  const tableCoordinates = [
    { x: 0.125, y: 0.36 }, { x: 0.375, y: 0.36 }, { x: 0.625, y: 0.36 }, { x: 0.875, y: 0.36 },
    { x: 0.125, y: 0.79 }, { x: 0.375, y: 0.79 }, { x: 0.625, y: 0.79 }, { x: 0.875, y: 0.79 },
  ];

  // --- Function to create jump buttons ---
  function createJumpButtons() {
    controlsContainer.innerHTML = ''; // Clear existing buttons
    for (let i = 0; i < tableCoordinates.length; i++) {
      const btn = document.createElement('button');
      btn.innerText = `Table ${i + 1}`;
      btn.className = 'table-jump-btn';
      btn.dataset.tableIndex = i;
      controlsContainer.appendChild(btn);
    }
  }

  // --- Function to handle jump logic ---
  function handleTableJump(event) {
    const clickedBtn = event.target.closest('.table-jump-btn');
    if (!clickedBtn) return;
    if (!panzoomInstance) return;

    // --- Active Button UI ---
    // Remove active class from all buttons
    const allBtns = controlsContainer.querySelectorAll('.table-jump-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));
    // Add active class to the clicked one
    clickedBtn.classList.add('active');

    // --- Pan & Zoom Logic ---
    const tableIndex = parseInt(clickedBtn.dataset.tableIndex, 10);
    const coords = tableCoordinates[tableIndex];
    const targetScale = 2.5; // Increased zoom for better feedback

    const imageWidth = modalImg.naturalWidth;
    const imageHeight = modalImg.naturalHeight;

    if (!imageWidth || !imageHeight) {
      console.error("Image dimensions not available.");
      return;
    }

    const absX = coords.x * imageWidth;
    const absY = coords.y * imageHeight;

    const viewportWidth = modal.clientWidth;
    const viewportHeight = modal.clientHeight;

    const newX = (viewportWidth / 2) - (absX * targetScale);
    const newY = (viewportHeight / 2) - (absY * targetScale);

    panzoomInstance.smoothZoom(viewportWidth / 2, viewportHeight / 2, targetScale);
    panzoomInstance.smoothMoveTo(newX, newY);
  }

  // --- Event Listeners ---
  img.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;

    modalImg.onload = () => {
      if (panzoomInstance) panzoomInstance.dispose();
      panzoomInstance = panzoom(modalImg, {
        maxZoom: 5, // Increased max zoom
        minZoom: 0.5,
        autocenter: true,
        bounds: true,
        boundsPadding: 0.05,
      });
    };
  };

  function closeModal() {
    modal.style.display = "none";
    if (panzoomInstance) {
      panzoomInstance.dispose();
      panzoomInstance = null;
    }
    // Remove active class from all buttons when closing
    const allBtns = controlsContainer.querySelectorAll('.table-jump-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));
  }

  closeBtn.onclick = closeModal;

  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // --- Initialization ---
  createJumpButtons();
  controlsContainer.addEventListener('click', handleTableJump);
});
