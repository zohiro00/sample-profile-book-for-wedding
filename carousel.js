// グローバルスコープに関数を公開
window.setupGalleryView = setupGalleryView;

// Swiperインスタンスを保持する変数
let swiperInstance = null;

/**
 * ギャラリーの表示形式を設定するメイン関数
 * @param {string} viewType 'carousel' または 'list'
 */
function setupGalleryView(viewType) {
  const gallerySection = document.querySelector('.photo-gallery-section');
  if (!gallerySection) {
    console.error('Photo gallery section not found.');
    return;
  }

  if (viewType === 'carousel') {
    initializeGalleryCarousel(gallerySection);
  } else {
    destroyGalleryCarousel(gallerySection);
  }
}

/**
 * Swiperカルーセルを初期化する
 * @param {HTMLElement} gallerySection
 */
function initializeGalleryCarousel(gallerySection) {
  if (swiperInstance) {
    return; // すでに初期化済み
  }

  const galleryGrid = gallerySection.querySelector('.gallery-grid');
  if (!galleryGrid) {
    console.error('Gallery grid not found for initialization.');
    return;
  }

  // Swiperが必要とするHTML構造に変更
  galleryGrid.classList.add('swiper-wrapper');
  Array.from(galleryGrid.children).forEach(item => {
    item.classList.add('swiper-slide');
  });

  const swiperContainer = document.createElement('div');
  swiperContainer.className = 'swiper';

  const prevButton = document.createElement('div');
  prevButton.className = 'swiper-button-prev';

  const nextButton = document.createElement('div');
  nextButton.className = 'swiper-button-next';

  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';

  gallerySection.appendChild(swiperContainer);
  swiperContainer.appendChild(galleryGrid);
  swiperContainer.appendChild(prevButton);
  swiperContainer.appendChild(nextButton);
  swiperContainer.appendChild(pagination);

  try {
    swiperInstance = new Swiper('.swiper', {
      loop: false, // ループを一旦無効にして、センタリングの問題を切り分ける
      slidesPerView: 'auto', // スライドの幅を自動調整
      spaceBetween: 15,
      centeredSlides: true, // アクティブなスライドを中央に配置
      breakpoints: {
        768: { slidesPerView: 3, spaceBetween: 30 },
        480: { slidesPerView: 2, spaceBetween: 20 }
      },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
  } catch (e) {
    console.error('Failed to initialize Swiper:', e);
  }
}

/**
 * Swiperカルーセルを破棄し、グリッドレイアウトを動的に再生成する
 * @param {HTMLElement} gallerySection
 */
function destroyGalleryCarousel(gallerySection) {
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  // Swiperが追加した要素(.swiper)と、その中身(.gallery-grid)をすべて削除
  const swiperContainer = gallerySection.querySelector('.swiper');
  if (swiperContainer) {
    swiperContainer.remove();
  }
  // もし.swiperの外に.gallery-gridが残っていた場合も削除
  const existingGrid = gallerySection.querySelector('.gallery-grid');
  if (existingGrid) {
    existingGrid.remove();
  }

  // グリッドをプログラムで再生成する
  const newGrid = document.createElement('div');
  newGrid.className = 'gallery-grid';

  for (let i = 1; i <= 6; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in';

    const img = document.createElement('img');
    img.className = 'gallery-image';
    img.id = `gallery-image${i}`;
    img.alt = `Gallery Photo ${i}`; // アクセシビリティのためaltテキストを追加

    item.appendChild(img);
    newGrid.appendChild(item);
  }

  gallerySection.appendChild(newGrid);

  // 再生成した要素にコンテンツを適用する
  if (window.applyContentData && window.weddingContentData) {
    window.applyContentData(window.weddingContentData);
  } else {
    console.error('applyContentData or weddingContentData not available to restore grid view.');
  }

  // 新しく生成した要素にフェードインアニメーションを適用する
  if (window.setupFadeInAnimation) {
    window.setupFadeInAnimation();
  }
}
