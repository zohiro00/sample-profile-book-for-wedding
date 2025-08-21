// グローバルスコープに関数を公開
window.setupGalleryView = setupGalleryView;

// Swiperインスタンスを保持する変数
let swiperInstance = null;
// DOMの元の状態を保存する変数
let originalGalleryHTML = null;

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

  // 元のHTMLを初回のみ保存
  if (!originalGalleryHTML) {
    const galleryGrid = gallerySection.querySelector('.gallery-grid');
    if (galleryGrid) {
      originalGalleryHTML = galleryGrid.outerHTML;
    }
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
  // すでにカルーセルが存在する場合は何もしない
  if (swiperInstance) {
    console.log('Carousel already initialized.');
    return;
  }

  const galleryGrid = gallerySection.querySelector('.gallery-grid');
  if (!galleryGrid) {
    console.error('Gallery grid not found for initialization.');
    return;
  }

  // 元のHTMLを保存（まだ保存されていない場合）
  if (!originalGalleryHTML) {
    originalGalleryHTML = galleryGrid.outerHTML;
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

  // 新しい構造を組み立て
  gallerySection.appendChild(swiperContainer);
  swiperContainer.appendChild(galleryGrid); // galleryGridをswiperContainerに移動
  swiperContainer.appendChild(prevButton);
  swiperContainer.appendChild(nextButton);
  swiperContainer.appendChild(pagination);

  // Swiperを初期化
  try {
    swiperInstance = new Swiper('.swiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 10,
      breakpoints: {
        768: { slidesPerView: 3, spaceBetween: 30 },
        480: { slidesPerView: 2, spaceBetween: 20 }
      },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
    console.log('Swiper initialized successfully.');
  } catch (e) {
    console.error('Failed to initialize Swiper:', e);
  }
}

/**
 * Swiperカルーセルを破棄し、元のグリッドレイアウトに戻す
 * @param {HTMLElement} gallerySection
 */
function destroyGalleryCarousel(gallerySection) {
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
    console.log('Swiper instance destroyed.');
  }

  // Swiperが追加した要素を削除
  const swiperContainer = gallerySection.querySelector('.swiper');
  if (swiperContainer) {
    swiperContainer.remove();
  }

  // 元のHTMLで復元
  if (originalGalleryHTML) {
    // 既存のgallery-gridがあれば削除してから追加
    const existingGrid = gallerySection.querySelector('.gallery-grid');
    if(existingGrid) {
      existingGrid.remove();
    }
    gallerySection.insertAdjacentHTML('beforeend', originalGalleryHTML);
  } else {
    console.error('Original gallery HTML not found, cannot restore.');
  }
}
