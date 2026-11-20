import './scss/styles.scss';

import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';


// 1) Каталог
const catalog = new Catalog(); //Создание экземпляра
catalog.setProducts(apiProducts.items);// Заполняем каталог тестовыми данными
console.log('Массив товаров из каталога: ', catalog.getProducts());

const allProducts = catalog.getProducts(); // получение всех товаров
console.log('Все товары из католога получены (количество:', allProducts.length, ')');


const firstProduct = allProducts[0];
const foundProduct = catalog.getProductById(firstProduct.id); // поиск товара по ID
console.log('Поиск по ID из каталога:', firstProduct.id, '→', foundProduct);


catalog.setSelectedProduct(firstProduct);
const selected = catalog.getSelectedProduct(); // выбранный товар
console.log('Товар для просмотра после выбора из каталога:', selected);


const secondProduct = allProducts[1];
catalog.setSelectedProduct(secondProduct);
const newSelected = catalog.getSelectedProduct(); // Смена выбранного товара
console.log('Выбран новый товар из каталога (ID:', newSelected?.id, '):', newSelected);

// 2) Корзина
const cart = new Cart() //Создание экземпляра

const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];

// Добавляем товары
cart.addItem(product1);
cart.addItem(product2);
cart.addItem(product2); // Не должен добавиться повторно
console.log('Товары добавлены в корзину:', cart.getItems());


console.log('Количество товаров в корзине:', cart.getCount()); // Проверяем количество
console.log('Сумма товаров в корзине:', cart.getTotal()); // Проверяем сумму

// Проверяем наличие товара
console.log('Товар (по ID) в корзине:', cart.hasItem(product1.id));

// Удаляем товар и проверяем
cart.removeItem(product1.id);
console.log('Товары после удаления одного товара из корзины:', cart.getItems());
console.log('Количество товаров после удаления товара из корзины:', cart.getCount());


cart.clear(); // Очищаем корзину
console.log('После очистки в корзине пусто:', cart.getItems()); 

// 3) Покупатель
const buyer = new Buyer() //Создание экземпляра

// Ошибка если форма не заполнена
console.log('Покупателю нужно заполнить пустую форму', buyer.validate());


buyer.setData({ email: 'mew@mew.com', phone: '+79119119119' });
console.log('Покупателем установлены email и телефон', buyer.getData());

const errors = buyer.validate();
console.log('Покупатель ввел не все данные:', errors);

buyer.setData({ payment: 'card', address: 'г. Санкт-Петербург, ул. Благодатная, д. 16' });
console.log('Добавлены payment и address покупателя', buyer.getData());

const noErrors = buyer.validate();
console.log('Валидация после заполнения всех полей покупателем:', noErrors);

buyer.clear();
console.log('После очистки данные покупателя', buyer.getData());