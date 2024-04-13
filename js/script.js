let currentPage = 1;
const pageSize = 20;
let isLoading = false;

// Функция для загрузки товаров по заданной странице
const loadProducts = async (page) => {
  try {
    const response = await fetch(
      `http://o-complex.com:1337/products?page=${page}&page_size=${pageSize}`
    );
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    throw error;
  }
};

// Функция для отображения товаров на странице
const renderProducts = (products) => {
  const cardsContainer = document.querySelector(".cards__row");

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('cards__product');
    card.innerHTML = `
      <img class="cards__product-logo" src="${product.image_url}" alt="логотип товара">
      <h2 class="cards__product-title">${product.title}</h2>
      <p class="cards__product-text">${product.description}</p>
      <p class="cards__product-price">Цена: ${product.price}₽</p>
      <button class="cards__product-btn">Купить</button>
    `;
    cardsContainer.appendChild(card);
  });
};

// Функция для обработки события прокрутки страницы
const handleScroll = async () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);

  if (windowHeight + scrollTop >= documentHeight && !isLoading) {
    isLoading = true;
    currentPage++;
    try {
      const products = await loadProducts(currentPage);
      renderProducts(products);
      isLoading = false;
    } catch (error) {
      isLoading = false;
    }
  }
};

// Обработчик события прокрутки страницы
window.addEventListener("scroll", handleScroll);

// Загрузка и отображение первой страницы товаров при загрузке страницы
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const products = await loadProducts(currentPage);
    renderProducts(products);
  } catch (error) {
    console.error('Ошибка при загрузке первой страницы товаров:', error);
  }
});