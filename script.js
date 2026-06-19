const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.getElementById('mainMenu');
const menuGroups = document.querySelectorAll('.menu-group');
const searchForms = document.querySelectorAll('.site-search');
const calculator = document.getElementById('deckCalc');
const calcTotal = document.getElementById('calcTotal');
const calcSummary = document.getElementById('calcSummary');
const calcBreakdown = document.getElementById('calcBreakdown');
const calcFormula = document.getElementById('calcFormula');
const desktopMenuMedia = window.matchMedia('(min-width: 1121px)');

function setHeaderState() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 12);
}

function setGroupOpen(group, isOpen) {
  if (!group) return;
  group.classList.toggle('is-open', isOpen);
  const toggle = group.querySelector('.submenu-toggle');
  if (toggle) {
    toggle.setAttribute('aria-expanded', String(isOpen));
  }
}

function closeMenu() {
  if (!mainMenu || !menuToggle) return;
  mainMenu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuGroups.forEach((group) => setGroupOpen(group, false));
}

function closeDesktopSubmenus(exceptGroup) {
  menuGroups.forEach((group) => {
    if (group !== exceptGroup) {
      setGroupOpen(group, false);
    }
  });
}

if (menuToggle && mainMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainMenu.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainMenu.addEventListener('click', (event) => {
    if (event.target.closest('.submenu-toggle')) return;
    if (event.target.closest('a')) {
      closeMenu();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

menuGroups.forEach((group) => {
  let closeTimer = 0;

  const openSubmenu = () => {
    if (!desktopMenuMedia.matches) return;
    window.clearTimeout(closeTimer);
    closeDesktopSubmenus(group);
    setGroupOpen(group, true);
  };

  const scheduleClose = () => {
    if (!desktopMenuMedia.matches) return;
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      setGroupOpen(group, false);
    }, 140);
  };

  group.addEventListener('pointerenter', openSubmenu);
  group.addEventListener('pointerleave', scheduleClose);
  group.addEventListener('focusin', openSubmenu);
  group.addEventListener('focusout', (event) => {
    if (!group.contains(event.relatedTarget)) {
      scheduleClose();
    }
  });
});

document.querySelectorAll('.submenu-toggle').forEach((toggle) => {
  toggle.addEventListener('click', (event) => {
    if (desktopMenuMedia.matches) return;
    event.preventDefault();
    event.stopPropagation();

    const group = toggle.closest('.menu-group');
    if (!group) return;

    const willOpen = !group.classList.contains('is-open');
    closeDesktopSubmenus(group);
    setGroupOpen(group, willOpen);
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.menu-group')) {
    closeDesktopSubmenus();
  }

  if (
    !desktopMenuMedia.matches
    && mainMenu
    && mainMenu.classList.contains('is-open')
    && !event.target.closest('.main-menu')
    && !event.target.closest('.menu-toggle')
  ) {
    closeMenu();
  }
});

desktopMenuMedia.addEventListener('change', () => {
  closeDesktopSubmenus();
  closeMenu();
});

searchForms.forEach((searchForm) => {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = String(new FormData(searchForm).get('q') || '').trim();
    const baseCatalogUrl = searchForm.getAttribute('data-search-target') || 'catalog.html';
    const targetUrl = value
      ? `${baseCatalogUrl}?search=${encodeURIComponent(value)}`
      : baseCatalogUrl;

    window.location.href = targetUrl;
  });
});

function calculateDeck() {
  const length = Math.max(1, Number(document.getElementById('lengthInput')?.value) || 1);
  const width = Math.max(1, Number(document.getElementById('widthInput')?.value) || 1);
  const area = length * width;
  const materialTiers = [
    { name: 'Бюджет', rate: 3800 },
    { name: 'Стандарт', rate: 4900 },
    { name: 'Премиум', rate: 7500 }
  ];

  if (calcTotal) {
    calcTotal.textContent = `${area.toFixed(1).replace('.', ',')} м²`;
  }

  if (calcSummary) {
    calcSummary.textContent = 'Калькулятор показывает ориентировочную стоимость материала по площади в трех вариантах. Более точный расчет по выбранной коллекции можно получить у менеджера.';
  }

  if (calcBreakdown) {
    calcBreakdown.innerHTML = materialTiers.map((tier) => {
      const total = Math.round(area * tier.rate);
      return `
        <li>
          <span>${tier.name}</span>
          <strong>${total.toLocaleString('ru-RU')} ₽</strong>
          <small>${tier.rate.toLocaleString('ru-RU')} ₽ за м² материала</small>
        </li>
      `;
    }).join('');
  }

  if (calcFormula) {
    calcFormula.innerHTML = `
      <p><strong>Площадь:</strong> ${length.toFixed(1).replace('.', ',')} м × ${width.toFixed(1).replace('.', ',')} м = ${area.toFixed(1).replace('.', ',')} м².</p>
      <p><strong>В стоимость входят только материалы:</strong> доборные элементы, комплектующие, доставка и монтаж в этот быстрый расчет не включены.</p>
      <p><strong>Монтаж:</strong> ориентир по работам - от 2000 ₽ за м². Более точный расчет можно получить у менеджера.</p>
    `;
  }
}

if (calculator) {
  calculator.addEventListener('input', calculateDeck);
  calculator.addEventListener('change', calculateDeck);
  calculator.addEventListener('submit', (event) => event.preventDefault());
  calculateDeck();
}

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach((other) => {
      if (other !== item) {
        other.open = false;
      }
    });
  });
});
