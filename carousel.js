document.addEventListener('DOMContentLoaded', () => {
  // We need to wait for the main script to apply the design class.
  // A MutationObserver is the most robust way to do this.

  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const body = document.body;
        if (body.classList.contains('design-stylish-mono')) {
          // The target design is active, initialize the carousel.
          console.log('Stylish mono design detected, initializing carousel.');
          initializeGalleryCarousel();
          // We can disconnect the observer now that we've done our job.
          observer.disconnect();
          break; // Exit the loop
        }
      }
    }
  });

  // Start observing the body for attribute changes.
  observer.observe(document.body, { attributes: true });
});

function initializeGalleryCarousel() {
  const gallerySection = document.querySelector('.photo-gallery-section');
  if (!gallerySection) {
    console.error('Gallery section not found.');
    return;
  }

  const galleryGrid = gallerySection.querySelector('.gallery-grid');
  if (!galleryGrid) {
    console.error('Gallery grid not found.');
    return;
  }

  // 1. Restructure the HTML for Swiper
  const galleryItems = Array.from(galleryGrid.children);
  galleryGrid.className = 'swiper-wrapper'; // The grid becomes the wrapper

  // Wrap each item in a swiper-slide
  galleryItems.forEach(item => {
    item.className = 'swiper-slide';
  });

  // Create the main swiper container and navigation elements
  const swiperContainer = document.createElement('div');
  swiperContainer.className = 'swiper';

  const prevButton = document.createElement('div');
  prevButton.className = 'swiper-button-prev';

  const nextButton = document.createElement('div');
  nextButton.className = 'swiper-button-next';

  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';

  // Assemble the new structure
  swiperContainer.appendChild(galleryGrid); // Move the wrapper inside the container
  swiperContainer.appendChild(prevButton);
  swiperContainer.appendChild(nextButton);
  swiperContainer.appendChild(pagination);

  // Replace the old grid container with the new swiper container
  gallerySection.appendChild(swiperContainer);

  // 2. Initialize Swiper
  try {
    new Swiper('.swiper', {
      // Options
      loop: true,
      slidesPerView: 1,
      spaceBetween: 10,

      // Responsive breakpoints
      breakpoints: {
        // when window width is >= 768px
        768: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 2,
          spaceBetween: 20
        }
      },

      // Pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
    console.log('Swiper initialized successfully.');
  } catch (e) {
    console.error('Failed to initialize Swiper:', e);
  }
}
