//Перечень всех событий.

export const AppEvents = {
    // Каталог и карточки
    catalogChanged: 'catalog:changed', // обновился список товаров
    previewChanged: 'preview:changed', // выбран товар для предпросмотра

    cardSelect: 'card:select', // клик по карточке каталога
    cardAction: 'preview:button-click', // клик по кнопке в карточке предпросмотра

    // Корзина
    cartOpen: 'cart:open', // клик по иконке корзины в шапке
    cartDelete: 'cart:delete', // удаление товара из корзины
    cartChanged: 'cart:changed', // изменилось содержимое корзины

    // Модель покупателя
    buyerChanged: 'buyer:changed', // изменились данные покупателя

    // Оформление заказа
    orderOpen: 'order:open', // клик «Оформить» в корзине
    orderChange: 'order:change', // изменились поля формы заказа (оплата или адрес)
    orderSubmit: 'order:submit', // отправлена первая форма
    contactsChange: 'contacts:change', // введены почта/телефон
    contactsSubmit: 'contacts:submit', // отправлена вторая форма

    // Результат
    orderSuccess: 'order:success', // заказ подтверждён сервером
    successClose: 'success:close', // клик «За новыми покупками!»

    // Модальное окно
    modalClose: 'modal:close', // закрытие модального окна (крестик или клик мимо)
} as const;
