document.addEventListener('DOMContentLoaded', () => {
  let swiperInstance = null;
  let originalGalleryHTML = null; // To store the initial state of the gallery

  function initializeGalleryCarousel() {
    // Prevent re-initialization
    if (swiperInstance) return;

    const gallerySection = document.querySelector('.photo-gallery-section');
    if (!gallerySection) return;

    const galleryGrid = gallerySection.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    // Store the original HTML of the grid before transforming it
    if (!originalGalleryHTML) {
      originalGalleryHTML = galleryGrid.outerHTML;
    }

    // Add Swiper classes
    galleryGrid.classList.add('swiper-wrapper');
    Array.from(galleryGrid.children).forEach(item => {
      item.classList.add('swiper-slide');
    });

    // Create Swiper container and controls
    const swiperContainer = document.createElement('div');
    swiperContainer.className = 'swiper';
    const prevButton = document.createElement('div');
    prevButton.className = 'swiper-button-prev';
    const nextButton = document.createElement('div');
    nextButton.className = 'swiper-button-next';
    const pagination = document.createElement('div');
    pagination.className = 'swiper-pagination';

    // Assemble the structure
    gallerySection.appendChild(swiperContainer);
    swiperContainer.appendChild(galleryGrid);
    swiperContainer.appendChild(prevButton);
    swiperContainer.appendChild(nextButton);
    swiperContainer.appendChild(pagination);

    // Initialize Swiper
    swiperInstance = new Swiper('.swiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 10,
      centeredSlides: true,
      breakpoints: {
        768: { slidesPerView: 3, spaceBetween: 30 },
        480: { slidesPerView: 2, spaceBetween: 20 }
      },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
  }

  function destroyGalleryCarousel() {
    if (!swiperInstance) return;

    const gallerySection = document.querySelector('.photo-gallery-section');
    if (!gallerySection) return;

    // Destroy Swiper instance
    swiperInstance.destroy(true, true);
    swiperInstance = null;

    // Remove the Swiper container
    const swiperContainer = gallerySection.querySelector('.swiper');
    if (swiperContainer) {
      swiperContainer.remove();
    }

    // Remove any leftover grid to be safe
    const existingGrid = gallerySection.querySelector('.gallery-grid');
    if(existingGrid) {
        existingGrid.remove();
    }

    // Restore the original gallery HTML
    if (originalGalleryHTML) {
      gallerySection.insertAdjacentHTML('beforeend', originalGalleryHTML);
      // Re-initialize animations for the new elements
      if (window.setupFadeInAnimation) {
        window.setupFadeInAnimation();
      }
    }
  }

  // Use MutationObserver to watch for class changes on the body
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const body = document.body;
        const isCarouselActive = body.classList.contains('gallery-view-carousel');

        if (isCarouselActive && !swiperInstance) {
          console.log('Carousel view activated. Initializing Swiper.');
          initializeGalleryCarousel();
        } else if (!isCarouselActive && swiperInstance) {
          console.log('Carousel view deactivated. Destroying Swiper.');
          destroyGalleryCarousel();
        }
      }
    }
  });

  observer.observe(document.body, { attributes: true });

  // Initial check in case the class is already present on load
  if (document.body.classList.contains('gallery-view-carousel')) {
    initializeGalleryCarousel();
  }
});
