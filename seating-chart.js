document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("seating-chart-modal");
  const img = document.getElementById("seating-chart-image");
  const modalImg = document.getElementById("modal-seating-chart-image");
  const closeBtn = document.querySelector(".seating-chart-close-btn");
  const controlsContainer = document.getElementById("table-jump-controls");
  const descriptionDisplay = document.getElementById("table-description-display");

  let tableData = {};

  // Fetch table descriptions from content.json
  fetch("content.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      if (data && data.table_descriptions) {
        tableData = data.table_descriptions;
      }
    })
    .catch(error => {
      console.error("Failed to fetch table descriptions:", error);
      // You could hide the controls if data loading fails
      controlsContainer.style.display = 'none';
    });

  // Create the table buttons
  function createJumpButtons() {
    controlsContainer.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
      const btn = document.createElement('button');
      btn.innerText = `Table ${i}`;
      btn.className = 'table-jump-btn';
      btn.dataset.tableKey = `table_${i}`;
      controlsContainer.appendChild(btn);
    }
  }

  // Handle button clicks to show descriptions
  function handleTableButtonClick(event) {
    const clickedBtn = event.target.closest('.table-jump-btn');
    if (!clickedBtn) return;

    // Manage active state for buttons
    controlsContainer.querySelectorAll('.table-jump-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    // Get and display the description
    const tableKey = clickedBtn.dataset.tableKey;
    const description = tableData[tableKey] || "こちらのテーブルの紹介文は準備中です。";

    descriptionDisplay.innerHTML = description;
    descriptionDisplay.style.display = 'block';

    // Restart animation
    descriptionDisplay.style.animation = 'none';
    descriptionDisplay.offsetHeight; // Trigger reflow
    descriptionDisplay.style.animation = null;
  }

  // Open the modal
  img.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;
    // Hide description and reset buttons on open
    descriptionDisplay.style.display = 'none';
    controlsContainer.querySelectorAll('.table-jump-btn').forEach(btn => btn.classList.remove('active'));
  };

  // Close the modal
  function closeModal() {
    modal.style.display = "none";
  }

  closeBtn.onclick = closeModal;
  modal.addEventListener('click', function(event) {
    // Close if clicking on the modal background, but not on the image or controls
    if (event.target === modal) {
      closeModal();
    }
  });

  // Initial setup
  createJumpButtons();
  controlsContainer.addEventListener('click', handleTableButtonClick);
});
