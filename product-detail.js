function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildGalleryMarkup(images, title, currentIndex) {
  const safeImages = images && images.length ? images : [];
  const slides = safeImages.map((image, index) => `
    <figure class="detail-slide ${index === currentIndex ? 'is-active' : ''}" data-slide aria-hidden="${index === currentIndex ? 'false' : 'true'}">
      <img src="${image}" alt="${escapeHtml(title)}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} />
    </figure>
  `).join('');

  const controls = safeImages.length > 1 ? `
    <button class="detail-gallery-arrow is-prev" type="button" data-gallery-prev aria-label="Предыдущее фото"></button>
    <button class="detail-gallery-arrow is-next" type="button" data-gallery-next aria-label="Следующее фото"></button>
    <div class="detail-gallery-count"><span data-gallery-current>${currentIndex + 1}</span> / ${safeImages.length}</div>
  ` : '';

  const thumbs = safeImages.length > 1 ? `
    <div class="detail-thumbs" data-thumbs>
      ${safeImages.map((image, index) => `
        <button class="detail-thumb ${index === currentIndex ? 'is-active' : ''}" type="button" data-thumb-index="${index}" aria-label="Показать фото ${index + 1}">
          <img src="${image}" alt="" loading="lazy" />
        </button>
      `).join('')}
    </div>
  ` : '';

  return `
    <div class="detail-gallery-stage">
      ${slides}
      ${controls}
    </div>
    ${thumbs}
  `;
}

const galleries = document.querySelectorAll('[data-gallery]');

galleries.forEach((gallery) => {
  const galleryStateNode = gallery.querySelector('[data-gallery-state]');
  const initialImages = Array.from(gallery.querySelectorAll('[data-slide] img'))
    .map((image) => image.getAttribute('src'))
    .filter(Boolean);
  const initialTitle = gallery.querySelector('[data-slide] img')?.getAttribute('alt') || document.title;
  const pageRoot = gallery.closest('.product-page') || document;
  const colorButtons = Array.from(pageRoot.querySelectorAll('[data-color-group-index]'));

  let galleryState = {
    title: initialTitle,
    fallbackImages: initialImages,
    colorGroups: [],
  };

  if (galleryStateNode?.textContent.trim()) {
    try {
      const parsed = JSON.parse(galleryStateNode.textContent);
      galleryState = {
        title: parsed.title || initialTitle,
        fallbackImages: Array.isArray(parsed.fallbackImages) && parsed.fallbackImages.length
          ? parsed.fallbackImages
          : initialImages,
        colorGroups: Array.isArray(parsed.colorGroups) ? parsed.colorGroups : [],
      };
    } catch (_error) {
      galleryState = {
        title: initialTitle,
        fallbackImages: initialImages,
        colorGroups: [],
      };
    }
  }

  if (!galleryState.fallbackImages.length && !galleryState.colorGroups.length) {
    return;
  }

  let currentGroupIndex = Math.max(
    colorButtons.findIndex((button) => button.classList.contains('is-active')),
    0,
  );
  let currentIndex = 0;

  function activeImages() {
    if (galleryState.colorGroups.length) {
      const groupImages = galleryState.colorGroups[currentGroupIndex]?.images;
      if (Array.isArray(groupImages) && groupImages.length) {
        return groupImages;
      }
    }

    return galleryState.fallbackImages;
  }

  function paintColorButtons() {
    colorButtons.forEach((button) => {
      const isActive = Number(button.dataset.colorGroupIndex || 0) === currentGroupIndex;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function render() {
    const images = activeImages();
    if (!images.length) {
      return;
    }

    currentIndex = Math.min(currentIndex, images.length - 1);
    gallery.innerHTML = buildGalleryMarkup(images, galleryState.title, currentIndex);

    const slides = Array.from(gallery.querySelectorAll('[data-slide]'));
    const thumbs = Array.from(gallery.querySelectorAll('[data-thumb-index]'));
    const currentCounter = gallery.querySelector('[data-gallery-current]');
    const prevButton = gallery.querySelector('[data-gallery-prev]');
    const nextButton = gallery.querySelector('[data-gallery-next]');

    function paintSlides() {
      slides.forEach((slide, index) => {
        const isActive = index === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });

      thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('is-active', index === currentIndex);
      });

      if (currentCounter) {
        currentCounter.textContent = String(currentIndex + 1);
      }
    }

    function setIndex(nextIndex) {
      currentIndex = (nextIndex + images.length) % images.length;
      paintSlides();
    }

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        setIndex(Number(thumb.dataset.thumbIndex || 0));
      });
    });

    prevButton?.addEventListener('click', () => {
      setIndex(currentIndex - 1);
    });

    nextButton?.addEventListener('click', () => {
      setIndex(currentIndex + 1);
    });

    paintSlides();
    paintColorButtons();
  }

  colorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentGroupIndex = Number(button.dataset.colorGroupIndex || 0);
      currentIndex = 0;
      render();
    });
  });

  render();
});
