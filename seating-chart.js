document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("seating-chart-modal");
  const img = document.getElementById("seating-chart-image");
  const modalImg = document.getElementById("modal-seating-chart-image");
  const modalCloseBtn = document.querySelector(".seating-chart-close-btn");
  const controlsContainer = document.getElementById("table-jump-controls");
  const descriptionDisplay = document.getElementById("table-description-display");
  const descriptionText = document.getElementById("description-text-content");
  const descriptionCloseBtn = document.querySelector(".description-close-btn");

  let tableData = {};

  fetch("content.json")
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      if (data && data.table_descriptions) {
        tableData = data.table_descriptions;
      }
    })
    .catch(error => {
      console.error("Failed to fetch table descriptions:", error);
      controlsContainer.style.display = 'none';
    });

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

  function handleTableButtonClick(event) {
    const clickedBtn = event.target.closest('.table-jump-btn');
    if (!clickedBtn) return;

    controlsContainer.querySelectorAll('.table-jump-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    const tableKey = clickedBtn.dataset.tableKey;
    const description = tableData[tableKey] || "こちらのテーブルの紹介文は準備中です。";

    descriptionText.innerHTML = description;
    descriptionDisplay.style.display = 'block';

    descriptionDisplay.style.animation = 'none';
    descriptionDisplay.offsetHeight;
    descriptionDisplay.style.animation = null;
  }

  function hideDescription() {
    descriptionDisplay.style.display = 'none';
    controlsContainer.querySelectorAll('.table-jump-btn').forEach(btn => btn.classList.remove('active'));
  }

  img.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;
    hideDescription();
  };

  function closeModal() {
    modal.style.display = "none";
  }

  modalCloseBtn.onclick = closeModal;

  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  descriptionCloseBtn.onclick = function(event) {
      event.stopPropagation();
      hideDescription();
  };

  controlsContainer.addEventListener('click', handleTableButtonClick);

  createJumpButtons();
});
