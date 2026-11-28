import './scss/styles.scss';

// Типы
import { IProduct, IOrder, TPayment, TFormChange, TBuyerErrors } from './types';

// Модели
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

// Вью
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardCart } from './components/View/CardCartView';
import { CartView } from './components/View/CartView';
import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';


import { ApiService } from './components/Api/ApiService';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL, settings } from './utils/constants';
import { AppEvents } from './utils/events';
import { ensureElement } from './utils/utils';

// Брокер событий — один на всё приложение
const events = new EventEmitter();

// Модели
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// Вью главной страницы
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(events, ensureElement<HTMLElement>('.modal'));

// Шаблоны
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cartCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
  return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
}

// Вью корзины и форм
const cartView = new CartView(events, cloneTemplate(cartTemplate));
const orderFormView = new OrderForm(events, cloneTemplate(orderTemplate) as HTMLFormElement);
const contactsFormView = new ContactsForm(events, cloneTemplate(contactsTemplate) as HTMLFormElement);


let modalContent: 'preview' | 'cart' | 'order' | 'contacts' | 'success' | null = null;


let orderTouched = false;
let contactsTouched = false;

function getPreviewButtonState(product: IProduct) {
    const inCart = cart.has(product.id);
    return {
        buttonText: inCart
            ? settings.removeLabel
            : product.price === null
                ? settings.unavailableLabel
                : settings.addButtonText,
        buttonDisabled: product.price === null,
    };
}

function stepErrors(errors: TBuyerErrors, keys: (keyof TBuyerErrors)[]): TBuyerErrors {
    const result: TBuyerErrors = {};
    for (const key of keys) {
        result[key] = errors[key];
    }
    return result;
}

function formState(errors: TBuyerErrors, touched: boolean) {
    const list = Object.values(errors).filter(Boolean);
    return {
        valid: list.length === 0,
        errors: touched ? list.join(settings.errorSeparator) : '',
    };
}

// Состояние первой формы: оплата и адрес
function orderFormState() {
    return formState(stepErrors(buyer.validate(), ['payment', 'address']), orderTouched);
}

// Состояние второй формы: почта и телефон
function contactsFormState() {
    return formState(stepErrors(buyer.validate(), ['email', 'phone']), contactsTouched);
}

// Каталог
events.on(AppEvents.catalogChanged, () => {
    const items = catalog.getProducts().map((product) => {
        const card = new CardCatalog(events, cloneTemplate(catalogTemplate));
        return card.render({ ...product });
    });
    gallery.catalog = items;
});

events.on<{ id: string }>(AppEvents.cardSelect, ({ id }) => {
    const product = catalog.getProductById(id);
    if (product) {
        catalog.setSelectedProduct(product);
    }
});

events.on(AppEvents.previewChanged, () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;

    const card = new CardPreview(events, cloneTemplate(previewTemplate));
    modal.content = card.render({
        ...product,
        ...getPreviewButtonState(product),
    });
    modal.open();
    modalContent = 'preview';
});

// Клик по кнопке предпросмотра: добавляем или удаляем товар
events.on(AppEvents.cardAction, () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;

    modalContent = null;

    if (cart.has(product.id)) {
        cart.remove(product.id);
    } else {
        cart.add(product);
    }

    modal.close();
});

// Корзина
events.on(AppEvents.cartChanged, () => {
    header.counter = cart.getCount();

    const cards = cart.getItems().map((product, index) => {
        const card = new CardCart(events, cloneTemplate(cartCardTemplate));
        return card.render({ ...product, index: index + 1 });
    });

    cartView.items = cards;
    cartView.total = cart.getTotal();
    cartView.buttonDisabled = cart.getCount() === 0;

    if (modalContent === 'cart') {
        modal.content = cartView.render({});
    }
});

events.on(AppEvents.cartOpen, () => {
    modal.content = cartView.render({});
    modal.open();
    modalContent = 'cart';
});

events.on<{ id: string }>(AppEvents.cartDelete, ({ id }) => {
    cart.remove(id);
});

// Оформление заказа

// Кнопка Оформить в корзине открываем первую форму
events.on(AppEvents.orderOpen, () => {
    orderTouched = false;
    contactsTouched = false;

    const data = buyer.getData();
    modal.content = orderFormView.render({
        payment: data.payment,
        address: data.address,
        ...orderFormState(),
    });
    modal.open();
    modalContent = 'order';
});

events.on<TFormChange>(AppEvents.orderChange, (data) => {
    orderTouched = true;
    buyer.setData(data);
});

events.on<TFormChange>(AppEvents.contactsChange, (data) => {
    contactsTouched = true;
    buyer.setData(data);
});

events.on(AppEvents.buyerChanged, () => {
    const data = buyer.getData();

    if (modalContent === 'order') {
        modal.content = orderFormView.render({
            payment: data.payment,
            address: data.address,
            ...orderFormState(),
        });
    } else if (modalContent === 'contacts') {
        modal.content = contactsFormView.render({
            email: data.email,
            phone: data.phone,
            ...contactsFormState(),
        });
    }
});

events.on(AppEvents.orderSubmit, () => {
    if (!orderFormState().valid) return;

    contactsTouched = false;

    const data = buyer.getData();
    modal.content = contactsFormView.render({
        email: data.email,
        phone: data.phone,
        ...contactsFormState(),
    });
    modalContent = 'contacts';
});

events.on(AppEvents.contactsSubmit, () => {
    if (!contactsFormState().valid) return;

    const data = buyer.getData();
    const order: IOrder = {
        payment: data.payment as TPayment,
        email: data.email,
        phone: data.phone,
        address: data.address,
        total: cart.getTotal(),
        items: cart.getItems().map((product) => product.id),
    };

    apiService
        .sendOrder(order)
        .then((result) => {
            const success = new Success(events, cloneTemplate(successTemplate));
            modal.content = success.render({ total: result.total });
            modalContent = 'success';
            cart.clear();
            buyer.clear();
        })
        .catch((error) => {
            console.error('Не удалось оформить заказ', error);
        });
});

events.on(AppEvents.successClose, () => {
    modal.close();
    modalContent = null;
});

// Модалка
events.on(AppEvents.modalClose, () => {
    modal.close();
    modalContent = null;
});

// Сервер
const api = new Api(API_URL);
const apiService = new ApiService(api);

apiService
    .getProducts()
    .then((data) => {
        catalog.setProducts(data.items);
    })
    .catch((error) => {
        console.error('Не удалось загрузить каталог с сервера', error);
    });
