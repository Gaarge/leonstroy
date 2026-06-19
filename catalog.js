const demoProduct = {
  image: 'assets/site/decking-closeup.jpeg',
  price: 'Цена по запросу',
  desc: 'Подберем материал, длины профиля и комплектующие под ваш объект.',
  specs: [
    { label: 'Подбор', value: 'по задаче' },
    { label: 'Расчет', value: 'по объему' },
    { label: 'Доставка', value: 'по городу' },
    { label: 'Монтаж', value: 'по запросу' }
  ]
};

const categoryMeta = {
  decking: {
    title: 'Террасная доска',
    text: 'Серии террасной доски для частных террас, бассейнов, веранд и коммерческих площадок.',
    note: 'Подбираем серию, длину доски, комплектующие и расчет под конкретный объект.'
  },
  fences: {
    title: 'Ограждения',
    text: 'Системы ограждений из ДПК для террас, лестниц, входных групп и веранд.',
    note: 'Поможем собрать комплект секции с учетом высоты, пролета и типа основания.'
  },
  steps: {
    title: 'Ступени',
    text: 'Ступени и стартовые элементы для крыльца, лестниц и входных групп.',
    note: 'Подберем профиль, комплектующие и расчет по размерам лестницы.'
  },
  boards: {
    title: 'Заборная доска',
    text: 'Профили для секций заборов, экранов, калиток и декоративных перегородок.',
    note: 'Сориентируем по типу профиля, цвету и количеству материала под каркас.'
  },
  facade: {
    title: 'Фасадные системы',
    text: 'Фасадные доски, панели и доборные профили для отделки и декоративных акцентов.',
    note: 'Считаем материал по раскладке, углам, примыканиям и подсистеме.'
  },
  accessories: {
    title: 'Комплектующие',
    text: 'Лаги, кляймеры, уголки, заглушки и монтажные элементы для всей системы.',
    note: 'Комплектующие лучше считать вместе с основным материалом, чтобы ничего не упустить.'
  }
};

const categoryButtons = document.querySelectorAll('.category-btn');
const brandStrip = document.getElementById('brandStrip');
const productGrid = document.getElementById('productGrid');
const catalogMain = document.querySelector('.catalog-main');
const categoryTitle = document.getElementById('categoryTitle');
const categoryText = document.getElementById('categoryText');
const toolbarNote = document.getElementById('toolbarNote');
const siteSearchInputs = document.querySelectorAll('.site-search input[name="q"]');
const mobileCatalogMedia = window.matchMedia('(max-width: 760px)');
const preferredBrand = new URLSearchParams(window.location.search).get('brand')
  || document.body?.dataset.defaultBrand
  || '';
const sitePathPrefix = window.location.pathname.includes('/brands/') ? '../' : '';

let catalog = {};
let currentCategory = 'decking';
let currentBrand = preferredBrand || 'Все';
let searchQuery = new URLSearchParams(window.location.search).get('search')
  || new URLSearchParams(window.location.search).get('q')
  || '';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalize(value) {
  return String(value || '').toLowerCase().replaceAll('ё', 'е');
}

function unique(values) {
  return [...new Set(values)];
}

function resolveSitePath(path) {
  if (!path) return path;
  if (/^(https?:|mailto:|tel:|#|\/)/.test(path) || path.startsWith('../') || path.startsWith('./')) {
    return path;
  }

  return `${sitePathPrefix}${path}`;
}

function pluralizeProducts(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return `${count} позиция`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} позиции`;
  return `${count} позиций`;
}

function colorToCss(colorName) {
  const color = normalize(colorName);

  if (color.includes('бел')) return '#f5efe6';
  if (color.includes('серое дерево')) return '#90877d';
  if (color.includes('сер')) return '#7d7a74';
  if (color.includes('чер')) return '#1f1f1f';
  if (color.includes('венге')) return '#4d3326';
  if (color.includes('темно-кор') || color.includes('тёмно-кор')) return '#5b3926';
  if (color.includes('светло-кор') || color.includes('песоч')) return '#b98a5d';
  if (color.includes('корич') || color.includes('коф') || color.includes('кедр')) return '#7b5438';
  if (color.includes('дуб')) return '#8c6844';
  return '#a17c53';
}

function setSearchInputValue(value) {
  siteSearchInputs.forEach((input) => {
    input.value = value;
  });
}

function getCategoryFromHash() {
  const hash = window.location.hash.replace('#', '');
  return catalog[hash] ? hash : null;
}

function updateCatalogUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('search');
  url.searchParams.delete('q');
  url.hash = currentCategory === 'decking' ? '' : `#${currentCategory}`;
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function hydrateCatalog(rawProducts) {
  const preparedCatalog = Object.fromEntries(
    Object.entries(categoryMeta).map(([key, meta]) => [key, { ...meta, brands: ['Все'], products: [] }])
  );

  rawProducts.forEach((product) => {
    if (!preparedCatalog[product.categoryKey]) return;
    preparedCatalog[product.categoryKey].products.push(product);
  });

  Object.values(preparedCatalog).forEach((category) => {
    category.brands = ['Все', ...unique(category.products.map((product) => product.brand))];
  });

  return preparedCatalog;
}

function getAllProducts() {
  return Object.entries(catalog).flatMap(([categoryKey, category]) => (
    category.products.map((product) => ({
      ...product,
      categoryKey,
      categoryTitle: category.title,
      categoryText: category.text,
      categoryNote: category.note
    }))
  ));
}

function updateCategoryCounters() {
  categoryButtons.forEach((button) => {
    const categoryKey = button.dataset.category;
    const counter = button.querySelector('small');
    const count = catalog[categoryKey]?.products.length || 0;

    if (counter) {
      counter.textContent = pluralizeProducts(count);
    }
  });
}

function buildSpecs(specs) {
  const items = specs && specs.length ? specs : demoProduct.specs;
  return items.slice(0, 4).map((spec) => `
    <div class="spec">
      <small>${escapeHtml(spec.label)}</small>
      <strong>${escapeHtml(spec.value)}</strong>
    </div>
  `).join('');
}

function buildStaticColors(colors, swatches = []) {
  if (swatches && swatches.length) {
    return swatches.slice(0, 6).map((swatch) => `
      <span
        class="swatch ${swatch.image ? 'has-image' : ''}"
        style="--swatch:${colorToCss(swatch.name)};${swatch.image ? `--swatch-image:url('${resolveSitePath(swatch.image)}')` : ''}"
        title="${escapeHtml(swatch.name)}"
        aria-label="${escapeHtml(swatch.name)}"
      ></span>
    `).join('');
  }

  if (!colors || !colors.length) {
    return '<span class="colors-empty">Цвет подбирается по системе</span>';
  }

  return colors.slice(0, 6).map((color) => `
    <span class="swatch" style="--swatch:${colorToCss(color)}" title="${escapeHtml(color)}" aria-label="${escapeHtml(color)}"></span>
  `).join('');
}

function getCardImages(product, colorGroupIndex = 0) {
  if (product.colorGroups && product.colorGroups.length) {
    const activeGroup = product.colorGroups[colorGroupIndex] || product.colorGroups[0];

    if (activeGroup?.cardImages?.length) {
      return activeGroup.cardImages;
    }

    return activeGroup?.images?.length
      ? activeGroup.images
      : product.colorGroups[0].images;
  }

  if (product.cardImages && product.cardImages.length) {
    return product.cardImages;
  }

  if (product.images && product.images.length) {
    return product.images;
  }

  return [demoProduct.image];
}

function buildCarouselMarkup(images, title) {
  const safeImages = images && images.length ? images : [demoProduct.image];

  const slides = safeImages.map((image, index) => `
    <div class="product-slide ${index === 0 ? 'is-active' : ''}" data-slide aria-hidden="${index === 0 ? 'false' : 'true'}">
      <img class="product-image" src="${resolveSitePath(image)}" alt="${escapeHtml(title)}" loading="${index === 0 ? 'eager' : 'lazy'}">
    </div>
  `).join('');

  const controls = safeImages.length > 1 ? `
    <button class="carousel-nav is-prev" type="button" data-carousel-prev aria-label="Предыдущее фото"></button>
    <button class="carousel-nav is-next" type="button" data-carousel-next aria-label="Следующее фото"></button>
    <div class="carousel-count"><span data-carousel-current>1</span> / ${safeImages.length}</div>
  ` : '';

  return `${slides}${controls}`;
}

function buildCarousel(product) {
  return `
    <div class="product-carousel" data-card-carousel>
      ${buildCarouselMarkup(getCardImages(product), product.rawTitle || product.title)}
    </div>
  `;
}

function buildColorSelectors(product) {
  if (product.colorGroups && product.colorGroups.length) {
    return product.colorGroups.map((group, index) => `
      <button
        class="swatch swatch-btn ${group.swatchImage ? 'has-image' : ''} ${index === 0 ? 'is-active' : ''}"
        type="button"
        data-color-group-index="${index}"
        style="--swatch:${group.css || colorToCss(group.name)};${group.swatchImage ? `--swatch-image:url('${resolveSitePath(group.swatchImage)}')` : ''}"
        title="${escapeHtml(group.name)}"
        aria-label="${escapeHtml(group.name)}"
      ></button>
    `).join('');
  }

  return buildStaticColors(product.colors, product.swatches || []);
}

function buildCard(product) {
  const requestText = encodeURIComponent(`Здравствуйте! Хочу получить расчет по товару ${product.brand}: ${product.rawTitle}`);
  const detailUrl = resolveSitePath(product.detailUrl);
  const sourceLink = product.sourceUrl
    ? `<a class="catalog-source-link" href="${escapeHtml(product.sourceUrl)}" target="_blank" rel="noopener noreferrer">Оригинал на ${escapeHtml(product.brand)}</a>`
    : '';

  return `
    <article class="product-card" data-product-slug="${product.slug}" data-detail-url="${detailUrl}" tabindex="0" role="link" aria-label="${escapeHtml(product.rawTitle || product.title)}">
      <div class="product-visual">
        ${buildCarousel(product)}
        <div class="badges">
          <span class="badge">${escapeHtml(product.label)}</span>
          <span class="badge order">${escapeHtml(product.stock)}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="product-meta">
          <span class="product-brand">${escapeHtml(product.brand)}</span>
          <span>${escapeHtml(product.price || demoProduct.price)}</span>
        </div>
        <h3><a class="product-title-link" href="${detailUrl}">${escapeHtml(product.title)}</a></h3>
        <p class="product-desc">${escapeHtml(product.shortDescription || demoProduct.desc)}</p>
        <div class="specs">${buildSpecs(product.specs)}</div>
        <div class="colors">
          <span class="colors-label">Цвета:</span>
          ${buildColorSelectors(product)}
        </div>
        <div class="card-actions">
          <a class="btn btn-primary" href="https://wa.me/79340509292?text=${requestText}" target="_blank" rel="noopener">Получить расчёт</a>
          <a class="btn btn-secondary" href="${detailUrl}">Подробнее</a>
        </div>
        ${sourceLink}
      </div>
    </article>
  `;
}

function renderBrands() {
  const brands = catalog[currentCategory].brands;

  brandStrip.innerHTML = brands.map((brand) => {
    const count = brand === 'Все'
      ? catalog[currentCategory].products.length
      : catalog[currentCategory].products.filter((product) => product.brand === brand).length;

    return `<button class="brand-btn ${brand === currentBrand ? 'is-active' : ''}" data-brand="${escapeHtml(brand)}" type="button">${escapeHtml(brand)}<span>${count}</span></button>`;
  }).join('');

  document.querySelectorAll('.brand-btn').forEach((button) => {
    button.addEventListener('click', () => {
      currentBrand = button.dataset.brand;
      renderBrands();
      renderProducts();
    });
  });
}

function renderProductCards(products) {
  productGrid.innerHTML = products.map((product) => buildCard(product)).join('');
  initCardCarousels();
}

function renderProducts() {
  const products = catalog[currentCategory].products.filter((product) => (
    currentBrand === 'Все' || product.brand === currentBrand
  ));

  renderProductCards(products);
}

function renderSearchResults(query) {
  const normalizedQuery = normalize(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const products = getAllProducts().filter((product) => {
    if (preferredBrand && product.brand !== preferredBrand) {
      return false;
    }

    const haystack = normalize([
      product.categoryTitle,
      product.categoryText,
      product.brand,
      product.title,
      product.rawTitle,
      product.label,
      product.stock,
      product.price,
      product.shortDescription,
      product.fullDescription,
      product.specs.map((spec) => `${spec.label} ${spec.value}`).join(' '),
      product.colors.join(' ')
    ].join(' '));

    return queryTokens.every((token) => haystack.includes(token));
  });

  categoryButtons.forEach((button) => button.classList.remove('is-active'));
  brandStrip.innerHTML = `<a class="brand-btn is-active" href="${resolveSitePath('catalog.html')}">Показать весь каталог<span>${products.length}</span></a>`;
  categoryTitle.textContent = `Результаты поиска: ${query}`;
  categoryText.textContent = products.length
    ? `Найдено ${pluralizeProducts(products.length)}.`
    : 'По вашему запросу товары не найдены.';
  toolbarNote.textContent = 'Поиск работает по названию товара, бренду, категории, описанию, цветам и характеристикам.';

  if (!products.length) {
    productGrid.innerHTML = `
      <article class="product-card">
          <div class="product-visual">
            <div class="product-slide is-active">
            <img class="product-image" src="${resolveSitePath(demoProduct.image)}" alt="Результаты поиска" loading="lazy">
          </div>
        </div>
        <div class="card-body">
          <div class="product-meta">
            <span class="product-brand">Каталог</span>
            <span>${escapeHtml(demoProduct.price)}</span>
          </div>
          <h3>Ничего не найдено</h3>
          <p class="product-desc">Попробуйте другой запрос или откройте весь каталог.</p>
          <div class="card-actions">
            <a class="btn btn-primary" href="${resolveSitePath('catalog.html')}">Весь каталог</a>
            <a class="btn btn-secondary" href="https://wa.me/79340509292" target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </div>
      </article>
    `;
    return;
  }

  renderProductCards(products);
}

function renderCategory(updateUrl = false) {
  const activeCategory = catalog[currentCategory];
  categoryTitle.textContent = activeCategory.title;
  categoryText.textContent = activeCategory.text;
  toolbarNote.textContent = activeCategory.note;
  currentBrand = preferredBrand && activeCategory.brands.includes(preferredBrand)
    ? preferredBrand
    : 'Все';

  categoryButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.category === currentCategory);
  });

  renderBrands();
  renderProducts();

  if (updateUrl) {
    updateCatalogUrl();
  }
}

function showEmptyState() {
  categoryTitle.textContent = 'Каталог временно недоступен';
  categoryText.textContent = 'Не удалось загрузить подготовленные данные товаров.';
  toolbarNote.textContent = 'Проверьте, что рядом с сайтом подключен файл assets/data/catalog-products.js.';
  brandStrip.innerHTML = '<a class="brand-btn is-active" href="catalog.html">Обновить страницу<span>1</span></a>';
  productGrid.innerHTML = `
    <article class="product-card">
      <div class="product-visual">
        <div class="product-slide is-active">
          <img class="product-image" src="${resolveSitePath(demoProduct.image)}" alt="Каталог недоступен" loading="lazy">
        </div>
      </div>
      <div class="card-body">
        <div class="product-meta">
          <span class="product-brand">Каталог</span>
          <span>${escapeHtml(demoProduct.price)}</span>
        </div>
        <h3>Нет данных каталога</h3>
        <p class="product-desc">Подготовленный файл с товарами не найден или не подключен к странице.</p>
      </div>
    </article>
  `;
}

function initCardCarousels() {
  const productIndex = new Map(getAllProducts().map((product) => [product.slug, product]));

  productGrid.querySelectorAll('.product-card').forEach((card) => {
    if (card.dataset.initialized === 'true') return;

    const product = productIndex.get(card.dataset.productSlug);
    const carousel = card.querySelector('[data-card-carousel]');
    const swatchButtons = Array.from(card.querySelectorAll('[data-color-group-index]'));

    if (!product || !carousel) return;

    let currentGroupIndex = 0;
    let currentSlideIndex = 0;

    function activeImages() {
      return getCardImages(product, currentGroupIndex);
    }

    function updateSwatchState() {
      swatchButtons.forEach((button) => {
        button.classList.toggle('is-active', Number(button.dataset.colorGroupIndex) === currentGroupIndex);
      });
    }

    function renderCarousel() {
      const images = activeImages();
      carousel.innerHTML = buildCarouselMarkup(images, product.rawTitle || product.title);

      const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
      const currentCounter = carousel.querySelector('[data-carousel-current]');
      const prevButton = carousel.querySelector('[data-carousel-prev]');
      const nextButton = carousel.querySelector('[data-carousel-next]');

      function paint() {
        slides.forEach((slide, index) => {
          const isActive = index === currentSlideIndex;
          slide.classList.toggle('is-active', isActive);
          slide.setAttribute('aria-hidden', String(!isActive));
        });

        if (currentCounter) {
          currentCounter.textContent = String(currentSlideIndex + 1);
        }
      }

      function setIndex(nextIndex) {
        currentSlideIndex = (nextIndex + slides.length) % slides.length;
        paint();
      }

      prevButton?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIndex(currentSlideIndex - 1);
      });

      nextButton?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIndex(currentSlideIndex + 1);
      });

      paint();
      updateSwatchState();
    }

    swatchButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        currentGroupIndex = Number(button.dataset.colorGroupIndex || 0);
        currentSlideIndex = 0;
        renderCarousel();
      });
    });

    card.addEventListener('click', (event) => {
      const interactiveTarget = event.target.closest('a, button, input, textarea, select, label');
      if (interactiveTarget) return;
      window.location.href = card.dataset.detailUrl;
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const interactiveTarget = event.target.closest('a, button, input, textarea, select, label');
      if (interactiveTarget) return;
      event.preventDefault();
      window.location.href = card.dataset.detailUrl;
    });

    renderCarousel();
    card.dataset.initialized = 'true';
  });
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    searchQuery = '';
    setSearchInputValue('');
    currentCategory = button.dataset.category;
    renderCategory(true);
    if (mobileCatalogMedia.matches && catalogMain) {
      catalogMain.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

window.addEventListener('hashchange', () => {
  if (searchQuery.trim()) return;
  const categoryFromHash = getCategoryFromHash();
  if (!categoryFromHash) return;
  currentCategory = categoryFromHash;
  renderCategory();
});

const rawProducts = Array.isArray(window.LEONSTROY_CATALOG_PRODUCTS)
  ? window.LEONSTROY_CATALOG_PRODUCTS
  : [];

if (!rawProducts.length) {
  showEmptyState();
} else {
  catalog = hydrateCatalog(rawProducts);
  updateCategoryCounters();

  const initialCategory = getCategoryFromHash();
  if (initialCategory) {
    currentCategory = initialCategory;
  }

  if (searchQuery.trim()) {
    setSearchInputValue(searchQuery.trim());
    renderSearchResults(searchQuery.trim());
  } else {
    renderCategory();
  }
}
