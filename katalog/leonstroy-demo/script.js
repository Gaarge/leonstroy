
const demoProduct = {
  image: 'assets/product-placeholder.svg',
  price: 'от 3 900 ₽/м²',
  desc: 'Тестовое описание товара для демонстрации структуры каталога. Здесь будет короткое описание материала, его назначения и преимуществ для клиента.',
  specs: ['140 × 24 мм', 'пустотелая', '3D-фактура', 'терраса / крыльцо'],
  colors: ['#4b2f24', '#7b5438', '#b08a63']
};

const catalog = {
  decking: {
    title: 'Террасная доска',
    text: 'Пустотелая и полнотелая доска для террас, крылец, зон бассейна и коммерческих объектов.',
    brands: ['Все', 'NextWood', 'Woodgrand', 'Terrapol', 'Latitudo'],
    products: [
      {
        brand: 'NextWood', label: 'хит для частных террас', stock: 'В наличии', title: 'Доска Classic 3D, венге', price: 'от 3 250 ₽/м²',
        desc: 'Практичная доска с древесной фактурой для террас у дома, беседок и зон отдыха.',
        specs: ['140 × 24 мм', 'пустотелая', '3D-фактура', 'частный объект'], colors: ['#4b2f24','#6a4632','#8b6a4c'], texture: '#6a4632'
      },
      {
        brand: 'Woodgrand', label: 'для высокой нагрузки', stock: 'Под заказ', title: 'Доска Premium полнотелая', price: 'от 4 900 ₽/м²',
        desc: 'Плотный профиль для коммерческих площадок, пирсов, кафе и зон с активной проходимостью.',
        specs: ['150 × 25 мм', 'полнотелая', 'тиснение', 'коммерция'], colors: ['#3a312c','#5d4a3f','#a67b5b'], texture: '#5d4a3f'
      },
      {
        brand: 'Terrapol', label: 'ко-экструзия', stock: 'В наличии', title: 'Доска Smart Shield, графит', price: 'от 4 150 ₽/м²',
        desc: 'Защитный внешний слой, устойчивый к загрязнениям и выцветанию. Хорошо подходит для бассейнов.',
        specs: ['145 × 23 мм', 'пустотелая', 'co-extrusion', 'бассейн'], colors: ['#2f3331','#6d6b62','#b4aa98'], texture: '#3f4542'
      },
      {
        brand: 'Latitudo', label: 'архитектурная серия', stock: 'В наличии', title: 'Доска Linea, тик', price: 'от 3 780 ₽/м²',
        desc: 'Спокойная линейная поверхность для современных фасадов, террас и входных групп.',
        specs: ['138 × 22 мм', 'пустотелая', 'вельвет', 'терраса'], colors: ['#7b5438','#c09367','#4d3a30'], texture: '#9d7351'
      }
    ]
  },
  fences: {
    title: 'Ограждения',
    text: 'Секции, стойки и перила из ДПК для террас, лестниц и входных групп.',
    brands: ['Все', 'NextWood', 'Woodgrand', 'Latitudo'],
    products: [
      { brand: 'NextWood', label: 'готовая система', stock: 'В наличии', title: 'Ограждение Terra Railing', price: 'от 8 400 ₽/п.м.', desc: 'Комплект стоек и поручня для террас и крылец. Можно собрать под размер объекта.', specs: ['стойка 90 мм', 'поручень ДПК', 'секционная', 'террасы'], colors: ['#3d3029','#73533c'], texture: '#4a3a31' },
      { brand: 'Woodgrand', label: 'усиленный профиль', stock: 'Под заказ', title: 'Ограждение Grand Rail', price: 'от 9 900 ₽/п.м.', desc: 'Более массивная система для больших террас и коммерческих площадок.', specs: ['стойка 120 мм', 'алюм. вставка', 'модульная', 'коммерция'], colors: ['#333333','#6c5846'], texture: '#5b5048' },
      { brand: 'Latitudo', label: 'минимализм', stock: 'В наличии', title: 'Перила Slim Deck', price: 'от 7 600 ₽/п.м.', desc: 'Лаконичная система под современные дома и аккуратные входные группы.', specs: ['тонкий поручень', 'скрытый крепёж', 'модульная', 'крыльцо'], colors: ['#4c443d','#b09473'], texture: '#8a735d' }
    ]
  },
  steps: {
    title: 'Ступени',
    text: 'Ступени и торцевые элементы для крылец, лестниц, входных групп и подиумов.',
    brands: ['Все', 'NextWood', 'Terrapol'],
    products: [
      { brand: 'NextWood', label: 'антискольжение', stock: 'В наличии', title: 'Ступень 3D Wood, орех', price: 'от 2 150 ₽/шт.', desc: 'Рельефная поверхность и закрытый торец для крыльца и уличных лестниц.', specs: ['320 × 24 мм', 'полнотелая', '3D-фактура', 'крыльцо'], colors: ['#5f3f2c','#7d5940'], texture: '#75533e' },
      { brand: 'Terrapol', label: 'для входных групп', stock: 'Под заказ', title: 'Ступень Shield, серый', price: 'от 2 480 ₽/шт.', desc: 'Практичный вариант для объектов с высокой влажностью и частой уборкой.', specs: ['345 × 23 мм', 'co-extrusion', 'матовая', 'вход'], colors: ['#4c504e','#8a8a80'], texture: '#73766f' }
    ]
  },
  boards: {
    title: 'Заборная доска',
    text: 'ДПК-доска для заборов, калиток, декоративных перегородок и приватных зон.',
    brands: ['Все', 'Woodgrand', 'Latitudo'],
    products: [
      { brand: 'Woodgrand', label: 'не требует покраски', stock: 'В наличии', title: 'Заборная доска Grand, венге', price: 'от 620 ₽/п.м.', desc: 'Ровный профиль для долговечных заборов без ежегодной обработки и покраски.', specs: ['120 × 12 мм', 'планка', 'матовая', 'забор'], colors: ['#392820','#68503d'], texture: '#4a352a' },
      { brand: 'Latitudo', label: 'декоративная серия', stock: 'В наличии', title: 'Планка Fence Line, тик', price: 'от 690 ₽/п.м.', desc: 'Подходит для горизонтальных заборов, экранов на террасах и декоративных вставок.', specs: ['130 × 15 мм', 'планка', 'вельвет', 'перегородки'], colors: ['#8d6645','#b28b64'], texture: '#9a7655' }
    ]
  },
  facade: {
    title: 'Фасадные системы',
    text: 'Фасадные профили из ДПК для отделки домов, коммерческих входных групп и декоративных зон.',
    brands: ['Все', 'Latitudo', 'Terrapol'],
    products: [
      { brand: 'Latitudo', label: 'архитектурный профиль', stock: 'Под заказ', title: 'Фасадная рейка Line, графит', price: 'от 2 900 ₽/м²', desc: 'Вертикальная или горизонтальная раскладка для современных фасадов и акцентных зон.', specs: ['рейка', 'скрытый крепёж', 'графит', 'фасад'], colors: ['#303433','#7a756b'], texture: '#3b403f' },
      { brand: 'Terrapol', label: 'стойкий слой', stock: 'В наличии', title: 'Фасад Shield, дуб дымчатый', price: 'от 3 350 ₽/м²', desc: 'Профиль с защитным покрытием для фасадов, которые должны долго сохранять внешний вид.', specs: ['панель', 'co-extrusion', 'матовая', 'дом'], colors: ['#6b6258','#b0a28f'], texture: '#74695e' }
    ]
  },
  accessories: {
    title: 'Комплектующие',
    text: 'Лаги, кляймеры, опоры, уголки, заглушки и расходники для монтажа террасных систем.',
    brands: ['Все', 'NextWood', 'Woodgrand', 'Terrapol'],
    products: [
      { brand: 'NextWood', label: 'для монтажа', stock: 'В наличии', title: 'Лага монтажная ДПК', price: 'от 280 ₽/п.м.', desc: 'Базовый элемент подсистемы для укладки террасной доски на подготовленное основание.', specs: ['40 × 30 мм', 'ДПК', 'под доску', 'терраса'], colors: ['#34302d'], texture: '#3c3733' },
      { brand: 'Woodgrand', label: 'скрытый крепёж', stock: 'В наличии', title: 'Кляймер стартовый и рядовой', price: 'от 12 ₽/шт.', desc: 'Крепёж для аккуратной укладки доски без видимых саморезов на поверхности.', specs: ['нержавейка', 'комплект', 'скрытый', 'монтаж'], colors: ['#b9b2a5','#77746d'], texture: '#9a958c' },
      { brand: 'Terrapol', label: 'регулировка высоты', stock: 'Под заказ', title: 'Регулируемая опора', price: 'от 190 ₽/шт.', desc: 'Опора для террас на кровлях, бетонных основаниях и сложных перепадах высоты.', specs: ['35–70 мм', 'пластик', 'регулируемая', 'основание'], colors: ['#1f1f1f'], texture: '#2a2a2a' }
    ]
  }
};

const categoryButtons = document.querySelectorAll('.category-btn');
const brandStrip = document.getElementById('brandStrip');
const productGrid = document.getElementById('productGrid');
const categoryTitle = document.getElementById('categoryTitle');
const categoryText = document.getElementById('categoryText');

let currentCategory = 'decking';
let currentBrand = 'Все';

function renderBrands() {
  const brands = catalog[currentCategory].brands;
  brandStrip.innerHTML = brands.map((brand) => {
    const count = brand === 'Все'
      ? catalog[currentCategory].products.length
      : catalog[currentCategory].products.filter((product) => product.brand === brand).length;
    return `<button class="brand-btn ${brand === currentBrand ? 'is-active' : ''}" data-brand="${brand}">${brand}<span>${count}</span></button>`;
  }).join('');

  document.querySelectorAll('.brand-btn').forEach((button) => {
    button.addEventListener('click', () => {
      currentBrand = button.dataset.brand;
      renderBrands();
      renderProducts();
    });
  });
}

function renderProducts() {
  const products = catalog[currentCategory].products.filter((product) => currentBrand === 'Все' || product.brand === currentBrand);
  productGrid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="product-visual">
        <img class="product-image" src="${demoProduct.image}" alt="Тестовое фото товара" loading="lazy">
        <div class="badges">
          <span class="badge">${product.label}</span>
          <span class="badge ${product.stock === 'В наличии' ? 'stock' : 'order'}">${product.stock}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="product-meta">
          <span class="product-brand">${product.brand}</span>
          <span>${demoProduct.price}</span>
        </div>
        <h3>${product.title}</h3>
        <p class="product-desc">${demoProduct.desc}</p>
        <div class="specs">
          ${demoProduct.specs.map((spec, index) => `<div class="spec"><small>${['Размер', 'Тип', 'Поверхность', 'Назначение'][index]}</small><strong>${spec}</strong></div>`).join('')}
        </div>
        <div class="colors">
          <span class="colors-label">Цвета:</span>
          ${demoProduct.colors.map((color) => `<span class="swatch" style="--swatch:${color}"></span>`).join('')}
        </div>
        <div class="card-actions">
          <a class="btn btn-primary" href="#request">Получить расчёт</a>
          <a class="btn btn-secondary" href="#request">Узнать наличие</a>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCategory() {
  categoryTitle.textContent = catalog[currentCategory].title;
  categoryText.textContent = catalog[currentCategory].text;
  currentBrand = 'Все';
  renderBrands();
  renderProducts();
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    categoryButtons.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    currentCategory = button.dataset.category;
    renderCategory();
  });
});

renderCategory();
