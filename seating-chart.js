document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("seating-chart-modal");
  const img = document.getElementById("seating-chart-image");
  const modalImg = document.getElementById("modal-seating-chart-image");
  const closeBtn = document.querySelector(".seating-chart-close-btn");
  const controlsContainer = document.getElementById("table-jump-controls");

  let panzoomInstance = null;

  // --- Table Coordinates (Relative) ---
  // Top row: y=0.36, Bottom row: y=0.79
  // Columns: x = 0.125, 0.375, 0.625, 0.875
  const tableCoordinates = [
    { x: 0.125, y: 0.36 }, // Table 1
    { x: 0.375, y: 0.36 }, // Table 2
    { x: 0.625, y: 0.36 }, // Table 3
    { x: 0.875, y: 0.36 }, // Table 4
    { x: 0.125, y: 0.79 }, // Table 5
    { x: 0.375, y: 0.79 }, // Table 6
    { x: 0.625, y: 0.79 }, // Table 7
    { x: 0.875, y: 0.79 }, // Table 8
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
    if (!event.target.classList.contains('table-jump-btn')) return;
    if (!panzoomInstance) return;

    const tableIndex = parseInt(event.target.dataset.tableIndex, 10);
    const coords = tableCoordinates[tableIndex];
    const targetScale = 2; // Zoom level for tables

    // We need the image's original dimensions to calculate absolute coordinates
    const imageWidth = modalImg.naturalWidth;
    const imageHeight = modalImg.naturalHeight;

    if (!imageWidth || !imageHeight) {
        console.error("Image dimensions not available.");
        return;
    }

    const absX = coords.x * imageWidth;
    const absY = coords.y * imageHeight;

    // Get the viewport dimensions
    const viewportWidth = modal.clientWidth;
    const viewportHeight = modal.clientHeight;

    // Calculate the required top-left position to center the target point
    const newX = (viewportWidth / 2) - (absX * targetScale);
    const newY = (viewportHeight / 2) - (absY * targetScale);

    // First, zoom to the target scale
    panzoomInstance.zoomAbs(0, 0, targetScale); // Zoom without moving
    // Then, smoothly move to the calculated position
    panzoomInstance.smoothMoveTo(newX, newY);
  }


  // --- Event Listeners ---

  // Open modal when the main image is clicked
  img.onclick = function () {
    modal.style.display = "block";

    // Set src for modal image. Use a temporary blank image to avoid issues if the real src isn't loaded yet.
    modalImg.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    modalImg.src = this.src;

    // Wait for the image to load to get its dimensions
    modalImg.onload = () => {
        // Initialize panzoom only after the image is loaded
        if (panzoomInstance) {
          panzoomInstance.dispose();
        }
        panzoomInstance = panzoom(modalImg, {
          maxZoom: 4,
          minZoom: 0.5,
          autocenter: true,
          bounds: true,
          boundsPadding: 0.1,
        });
    };
  };

  // Close modal
  function closeModal() {
    modal.style.display = "none";
    if (panzoomInstance) {
      panzoomInstance.dispose();
      panzoomInstance = null;
    }
  }

  closeBtn.onclick = closeModal;

  // Close modal if clicking outside the image
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });


  // --- Initialize buttons and add listener to the container ---
  createJumpButtons();
  controlsContainer.addEventListener('click', handleTableJump);
});
