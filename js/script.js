document.body.onload = function() {

    setTimeout(function() {
        let preloader = document.querySelector('.preloader')
        if(!preloader.classList.contains('done')) {
            preloader.classList.add('done')
        }
    }, 1000)

}

const testimonials = async () => {
    try {
      const response = await fetch("http://o-complex.com:1337/reviews");
      const data = await response.json();
  
      data.map(el => {
        const testimonialsRow = document.querySelector(".testimonials__row");
        const testimonialsPost = document.createElement("div");
        testimonialsPost.innerHTML = el.text;
        testimonialsPost.className = "testimonials__post";
        testimonialsRow.appendChild(testimonialsPost);
      });
    } catch (error) {
      console.error("Ошибка при получении отзывов:", error);
    }
  };
  
  testimonials();



// const maskRegex = /^\+7 \(\d{3}\) \d{3} \d{2}-\d{2}$/;
const cartFormBtn = document.querySelector('.cart__form-btn');

// Обработчик клика на кнопку "заказать"
cartFormBtn.addEventListener('click', (event) => {
  // Получаем значение инпута с номером телефона
  const phoneNumberInput = document.querySelector('.cart__form-input');
  const phoneNumberValue = phoneNumberInput.value;
  const phoneRegex = /^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}\s?(-)?\s?\d{2}\s?(-)?\s?\d{2}$/;

  // Проверяем соответствие значения номера телефона регулярному выражению
  if (!phoneRegex.test(phoneNumberValue)) {
    // В случае ошибки устанавливаем класс "error" для инпута
    phoneNumberInput.classList.add('error');
    
    // Предотвращаем отправку формы
    event.preventDefault();
  } else {
    // В случае успеха убираем класс "error" для инпута
    phoneNumberInput.classList.remove('error');
  }
});

  // Обработчик события ввода текста в поле
  const phoneInput = document.querySelector('.cart__form-input');
  phoneInput.addEventListener('input', () => {
    // Вызываем функцию проверки введенного значения
    validateInput(phoneInput);
  });



// =============================================================

  
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